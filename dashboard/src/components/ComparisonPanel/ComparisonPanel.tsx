import type { ComparisonData } from '../../lib/types';
import { tScoreColor } from '../../lib/clinical-utils';

interface ComparisonPanelProps {
  data: ComparisonData;
  compact?: boolean;
}

function deltaArrow(delta: number | null, direction: string): string {
  if (delta === null) return '—';
  if (direction === 'improved') return `↓${Math.abs(delta)}`;
  if (direction === 'worsened') return `↑${Math.abs(delta)}`;
  return `${delta >= 0 ? '+' : ''}${delta}`;
}

function deltaColor(direction: string): string {
  if (direction === 'improved') return 'var(--true-color)';
  if (direction === 'worsened') return 'var(--false-color)';
  return 'var(--text-tertiary)';
}

export function ComparisonPanel({ data, compact }: ComparisonPanelProps) {
  const elevArrow = data.elevationDelta !== null
    ? (data.elevationDelta <= -5 ? 'improved' : data.elevationDelta >= 5 ? 'worsened' : 'stable')
    : 'unknown';

  const sortedDeltas = [...data.clinicalDeltas]
    .filter(d => d.delta !== null)
    .sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!));

  const displayDeltas = compact ? sortedDeltas.slice(0, 3) : sortedDeltas;
  const codeTypeChanged = data.currentCodeType !== data.previousCodeType;

  return (
    <div className="comparison-panel">
      <div className="comparison-header">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
          vs. {data.previousName || 'Previous'} ({new Date(data.previousTimestamp).toLocaleDateString()})
        </span>
      </div>

      {/* Elevation delta */}
      <div className="comparison-elevation" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: deltaColor(elevArrow) }}>
          {data.previousElevation ?? '—'} → {data.currentElevation ?? '—'}
        </span>
        {data.elevationDelta !== null && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: deltaColor(elevArrow) }}>
            ({deltaArrow(data.elevationDelta, elevArrow)})
          </span>
        )}
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Elevation</span>
      </div>

      {/* Code type shift */}
      {codeTypeChanged && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Code type: {data.previousCodeType} → {data.currentCodeType}
        </div>
      )}

      {/* Delta table */}
      {displayDeltas.length > 0 && (
        <table className="delta-table">
          <thead>
            <tr>
              <th>Scale</th>
              <th>Prev</th>
              <th>Now</th>
              <th>Δ</th>
            </tr>
          </thead>
          <tbody>
            {displayDeltas.map(d => (
              <tr key={d.code}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem' }}>{d.code}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{d.previousT ?? '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: tScoreColor(d.currentT) }}>{d.currentT ?? '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: deltaColor(d.direction) }}>
                  {deltaArrow(d.delta, d.direction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {compact && sortedDeltas.length > 3 && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
          +{sortedDeltas.length - 3} more scales (see Detail View)
        </div>
      )}
    </div>
  );
}
