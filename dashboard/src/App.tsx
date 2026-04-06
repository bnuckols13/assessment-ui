import { useState, useEffect, useCallback } from 'react';
import type { ScoringResults, Gender, FormLength, ViewMode } from './lib/types';
import { scoreFromString } from './lib/scoring-bridge';
import { DataEntry } from './components/DataEntry/DataEntry';
import { ClinicalBrief } from './components/ClinicalBrief/ClinicalBrief';
import { DetailView } from './components/DetailView/DetailView';

export default function App() {
  const [results, setResults] = useState<ScoringResults | null>(null);
  const [clientName, setClientName] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('entry');

  const handleScore = useCallback((answerString: string, gender: Gender, formLength: FormLength, name?: string) => {
    const scored = scoreFromString(answerString, gender, formLength);
    setResults(scored);
    setClientName(name);
    setView('brief');
  }, []);

  const handleBack = useCallback(() => {
    setResults(null);
    setClientName(undefined);
    setView('entry');
  }, []);

  // Keyboard shortcut: D toggles views
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'd' || e.key === 'D') {
        if (view === 'brief') setView('detail');
        else if (view === 'detail') setView('brief');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  if (view === 'entry' || !results) {
    return <DataEntry onScore={handleScore} />;
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
        </div>
      </header>

      {view === 'brief' && <ClinicalBrief results={results} clientName={clientName} />}
      {view === 'detail' && <DetailView results={results} />}
    </div>
  );
}
