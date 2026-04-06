import type { ScoringResults } from '../../lib/types';
import { getTwoPointCode, getTwoPointCodeLabel } from '../../lib/clinical-utils';

interface CodeTypePanelProps {
  results: ScoringResults;
  compact?: boolean;
}

export function CodeTypePanel({ results, compact = false }: CodeTypePanelProps) {
  const codeType = getTwoPointCode(results.clinicalScales);
  const codeLabel = getTwoPointCodeLabel(results.clinicalScales);

  if (!codeType) {
    return (
      <div>
        <div className="no-code-type">{codeLabel}</div>
        {!compact && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Fewer than two clinical scales are elevated at T &ge; 65 (excluding Mf and Si). A two-point code type cannot be determined. Interpret individual scale elevations instead.
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <div className="code-type-label">{codeType.label}</div>
        <div className="code-type-codes">{codeLabel} ({codeType.codes})</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {codeType.narrative.split('.').slice(0, 2).join('.') + '.'}
        </div>
      </div>
    );
  }

  return (
    <div className="code-type-card">
      <div className="code-type-label">{codeType.label}</div>
      <div className="code-type-codes">{codeLabel} ({codeType.codes})</div>
      <div className="code-type-narrative">{codeType.narrative}</div>

      <div className="code-type-section">
        <div className="code-type-section-label">Differential Considerations</div>
        <div className="code-type-section-text">{codeType.differentials}</div>
      </div>

      <div className="code-type-section">
        <div className="code-type-section-label">Treatment Considerations</div>
        <div className="code-type-section-text">{codeType.treatmentConsiderations}</div>
      </div>
    </div>
  );
}
