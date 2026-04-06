import type { ScaleResult, InconsistencyResult } from '../../lib/types';
import { tScoreColor } from '../../lib/clinical-utils';

interface ScaleTableProps {
  scales: (ScaleResult | InconsistencyResult)[];
  showCorrected?: boolean;
  showBar?: boolean;
}

function isInconsistency(s: ScaleResult | InconsistencyResult): s is InconsistencyResult {
  return s.category === 'inconsistency';
}

export function ScaleTable({ scales, showCorrected = true, showBar = true }: ScaleTableProps) {
  return (
    <table className="scale-table">
      <thead>
        <tr>
          <th>Scale</th>
          <th>Raw</th>
          {showCorrected && <th>Corrected</th>}
          <th>T-Score</th>
          {showBar && <th style={{ width: 140 }}>Profile</th>}
        </tr>
      </thead>
      <tbody>
        {scales.map(scale => {
          const t = scale.tScore;
          const color = tScoreColor(t);
          const direction = isInconsistency(scale) && scale.direction ? ` (${scale.direction})` : '';

          return (
            <tr key={scale.code}>
              <td>
                <span style={{ fontWeight: 500 }}>{scale.code}</span>
                <span style={{ color: 'var(--text-tertiary)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                  {scale.description}{direction}
                </span>
              </td>
              <td className="mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                {scale.raw}
              </td>
              {showCorrected && (
                <td className="mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                  {!isInconsistency(scale) && (scale as ScaleResult).corrected !== null ? (scale as ScaleResult).corrected : '—'}
                </td>
              )}
              <td className="t-score-cell" style={{ color }}>
                {t !== null ? t : '—'}
              </td>
              {showBar && (
                <td>
                  <div className="t-bar-container">
                    <div
                      className="t-bar"
                      style={{
                        width: t !== null ? `${Math.min((t / 120) * 100, 100)}%` : '0%',
                        background: color,
                      }}
                    />
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
