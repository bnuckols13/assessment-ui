import { useState } from 'react';
import type { ScoringResults } from '../../lib/types';
import { getElevatedScales, getSafetyLevel } from '../../lib/clinical-utils';
import { SESSION_THEMES } from '../../data/session-themes';

interface SessionViewProps {
  results: ScoringResults;
  clientName?: string;
}

export function SessionView({ results, clientName }: SessionViewProps) {
  const [showContext, setShowContext] = useState(false);

  const elevatedCodes = new Set(
    getElevatedScales(results.clinicalScales, 65).map(s => s.code)
  );

  const endorsedGroups = new Set(
    results.criticalItems
      .filter(g => g.endorsed.length > 0)
      .map(g => g.name)
  );

  const activeThemes = SESSION_THEMES.filter(theme =>
    theme.clinicalScales.some(code => elevatedCodes.has(code)) ||
    theme.criticalGroups.some(group => endorsedGroups.has(group))
  );

  const safety = getSafetyLevel(results);
  const showSafety = safety.level !== 'none';

  return (
    <div className="session-layout">
      <div className="session-header">
        <h2 className="session-title">
          {clientName ? `${clientName}'s Reflection` : 'Session Reflection'}
        </h2>
        <p className="session-subtitle">
          Areas identified for discussion based on assessment responses
        </p>
        <button
          className="session-context-toggle"
          onClick={() => setShowContext(!showContext)}
        >
          {showContext ? 'Hide Clinical Context' : 'Show Clinical Context'}
        </button>
      </div>

      {showSafety && (
        <div className="session-safety-card">
          <div className="session-safety-icon">⚑</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Safety Note</div>
            <div>
              This individual endorsed items related to thoughts of self-harm or suicide.
              Please address safety and support resources as part of this conversation.
            </div>
            {showContext && (
              <div className="session-clinical-note" style={{ marginTop: '0.5rem', opacity: 0.85, fontSize: '0.82rem' }}>
                Safety level: {safety.level}. {safety.description}.
              </div>
            )}
          </div>
        </div>
      )}

      {activeThemes.length === 0 ? (
        <div className="session-empty">
          <p>Your responses were generally within expected ranges.</p>
          <p>Your provider can address any specific concerns you may have.</p>
        </div>
      ) : (
        <div className="session-themes">
          {activeThemes.map(theme => (
            <div key={theme.id} className="session-theme-card">
              <h3 className="session-theme-title">{theme.title}</h3>
              <p className="session-theme-prompt">{theme.prompt}</p>
              {showContext && (
                <div className="session-clinical-note">
                  {theme.clinicalContext}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
