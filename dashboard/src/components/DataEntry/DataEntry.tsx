import { useState, useEffect } from 'react';
import type { Gender, FormLength, StoredReport } from '../../lib/types';
import { loadStoredReports } from '../../lib/scoring-bridge';

interface DataEntryProps {
  onScore: (answerString: string, gender: Gender, formLength: FormLength, clientName?: string) => void;
}

export function DataEntry({ onScore }: DataEntryProps) {
  const [answerString, setAnswerString] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [formLength, setFormLength] = useState<FormLength | ''>('');
  const [storedReports, setStoredReports] = useState<StoredReport[]>([]);

  useEffect(() => {
    setStoredReports(loadStoredReports());
  }, []);

  const validLength = answerString.length === 370 || answerString.length === 567;
  const canScore = answerString.length > 0 && gender !== '' && formLength !== '' && validLength;

  // Auto-detect form length from string length
  useEffect(() => {
    if (answerString.length === 370) setFormLength('short');
    else if (answerString.length === 567) setFormLength('long');
  }, [answerString]);

  function handleScore() {
    if (canScore) {
      onScore(answerString, gender as Gender, formLength as FormLength);
    }
  }

  function handleLoadReport(report: StoredReport) {
    onScore(
      report.answerString,
      report.client.gender,
      report.client.formLength,
      report.client.clientName,
    );
  }

  return (
    <div className="entry-screen">
      <div className="entry-container">
        <div className="entry-card">
          <h2>Clinician Dashboard</h2>
          <p className="subtitle">Paste an answer string from the email report to generate a full interpretive analysis.</p>

          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
            Answer String
          </label>
          <textarea
            className="entry-textarea"
            placeholder="Paste T/F/? string here (370 or 567 characters)..."
            value={answerString}
            onChange={e => setAnswerString(e.target.value.replace(/[^TF?]/gi, '').toUpperCase())}
          />
          {answerString.length > 0 && (
            <div style={{ fontSize: '0.78rem', color: validLength ? 'var(--true-color)' : 'var(--false-color)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
              {answerString.length} characters {validLength ? '(valid)' : '(need 370 or 567)'}
            </div>
          )}

          <div className="entry-row">
            <select className="entry-select" value={gender} onChange={e => setGender(e.target.value as Gender)}>
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select className="entry-select" value={formLength} onChange={e => setFormLength(e.target.value as FormLength)}>
              <option value="">Form length...</option>
              <option value="short">Brief (370)</option>
              <option value="long">Standard (567)</option>
            </select>
          </div>

          <button className="entry-btn" disabled={!canScore} onClick={handleScore}>
            Score & Interpret
          </button>
        </div>

        {storedReports.length > 0 && (
          <div className="entry-card">
            <div className="stored-reports">
              <h3>Recent Assessments (from localStorage)</h3>
              {storedReports.map(report => (
                <div
                  key={report.id}
                  className="stored-report-item"
                  onClick={() => handleLoadReport(report)}
                >
                  <span className="stored-report-name">{report.client.clientName || 'Anonymous'}</span>
                  <span className="stored-report-meta">
                    {new Date(report.timestamp).toLocaleDateString()} · {report.client.gender} · {report.client.formLength}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
