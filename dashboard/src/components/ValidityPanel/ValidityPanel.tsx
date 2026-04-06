import type { ScoringResults } from '../../lib/types';
import { analyzeValidity, overallValiditySeverity } from '../../lib/validity-rules';

interface ValidityPanelProps {
  results: ScoringResults;
  compact?: boolean;
}

export function ValidityPanel({ results, compact = false }: ValidityPanelProps) {
  const rules = analyzeValidity(results);
  const overall = overallValiditySeverity(rules);

  const labels: Record<string, string> = {
    valid: 'Valid',
    caution: 'Caution',
    warning: 'Warning',
    invalid: 'Invalid',
  };

  if (compact) {
    return (
      <div>
        <span className={`validity-badge ${overall}`}>{labels[overall]}</span>
        {rules.filter(r => r.severity !== 'valid').slice(0, 2).map((rule, i) => (
          <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
            {rule.message}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <span className={`validity-badge ${overall}`}>{labels[overall]}</span>
        <span style={{ marginLeft: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Cannot Say: <span className="mono" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{results.counts.cantSay}</span>
        </span>
      </div>
      {rules.map((rule, i) => (
        <div key={i} className={`validity-rule ${rule.severity}`}>
          <div className="rule-message">{rule.message}</div>
          <div className="rule-recommendation">{rule.recommendation}</div>
        </div>
      ))}
    </div>
  );
}
