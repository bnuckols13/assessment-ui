import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ScoringResults, Gender, FormLength, ViewMode, StoredReport, ComparisonData } from './lib/types';
import { scoreFromString } from './lib/scoring-bridge';
import { analyzeValidity, overallValiditySeverity } from './lib/validity-rules';
import { buildComparisonData } from './lib/clinical-utils';
import { DataEntry } from './components/DataEntry/DataEntry';
import { ClinicalBrief } from './components/ClinicalBrief/ClinicalBrief';
import { DetailView } from './components/DetailView/DetailView';
import { SessionView } from './components/SessionView/SessionView';

export default function App() {
  const [results, setResults] = useState<ScoringResults | null>(null);
  const [clientName, setClientName] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('entry');
  const [validityOverride, setValidityOverride] = useState(false);
  const [baseline, setBaseline] = useState<{ results: ScoringResults; name: string; timestamp: string } | null>(null);

  const validityGated = useMemo(() => {
    if (!results || validityOverride) return false;
    const rules = analyzeValidity(results);
    return overallValiditySeverity(rules) === 'invalid';
  }, [results, validityOverride]);

  const comparisonData: ComparisonData | null = useMemo(() => {
    if (!results || !baseline) return null;
    return buildComparisonData(results, baseline.results, baseline.name, baseline.timestamp);
  }, [results, baseline]);

  const handleScore = useCallback((answerString: string, gender: Gender, formLength: FormLength, name?: string) => {
    const scored = scoreFromString(answerString, gender, formLength);
    setResults(scored);
    setClientName(name);
    setValidityOverride(false);
    setView('brief');
  }, []);

  const handleSetBaseline = useCallback((report: StoredReport) => {
    const scored = scoreFromString(
      report.answerString,
      report.client.gender,
      report.client.formLength,
    );
    setBaseline({
      results: scored,
      name: report.client.clientName || 'Previous',
      timestamp: report.timestamp,
    });
  }, []);

  const handleBack = useCallback(() => {
    setResults(null);
    setClientName(undefined);
    setValidityOverride(false);
    setBaseline(null);
    setView('entry');
  }, []);

  // Keyboard shortcuts: D toggles brief/detail, S toggles session
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'd' || e.key === 'D') {
        if (view === 'brief' || view === 'session') setView('detail');
        else if (view === 'detail') setView('brief');
      }
      if (e.key === 's' || e.key === 'S') {
        if (view === 'brief' || view === 'detail') setView('session');
        else if (view === 'session') setView('brief');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  if (view === 'entry' || !results) {
    return (
      <DataEntry
        onScore={handleScore}
        onSetBaseline={results ? handleSetBaseline : undefined}
        hasCurrentResults={!!results}
      />
    );
  }

  return (
    <div>
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
              marginRight: '1rem', fontWeight: 500,
            }}
          >
            &larr; New
          </button>
          <h1>Clinician Dashboard</h1>
          {clientName && <span className="client-meta">{clientName}</span>}
          <span className="client-meta" style={{ marginLeft: '0.5rem' }}>
            {results.config.gender} · {results.config.formLength} · {new Date(results.timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className="view-toggle">
          <button className={view === 'brief' ? 'active' : ''} onClick={() => setView('brief')}>
            Brief
          </button>
          <button className={view === 'detail' ? 'active' : ''} onClick={() => setView('detail')}>
            Detail
          </button>
          <button className={view === 'session' ? 'active' : ''} onClick={() => setView('session')}>
            Session
          </button>
        </div>
      </header>

      {view === 'brief' && (
        <ClinicalBrief
          results={results}
          clientName={clientName}
          validityGated={validityGated}
          onValidityOverride={() => setValidityOverride(true)}
          comparisonData={comparisonData}
        />
      )}
      {view === 'detail' && (
        <DetailView
          results={results}
          validityGated={validityGated}
          onValidityOverride={() => setValidityOverride(true)}
          comparisonData={comparisonData}
        />
      )}
      {view === 'session' && (
        <SessionView results={results} clientName={clientName} />
      )}
    </div>
  );
}
