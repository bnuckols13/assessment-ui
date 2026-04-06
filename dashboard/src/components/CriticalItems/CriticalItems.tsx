import { useState } from 'react';
import type { ScoringResults } from '../../lib/types';
import { getSafetyLevel } from '../../lib/clinical-utils';

interface CriticalItemsProps {
  results: ScoringResults;
  compact?: boolean;
}

export function CriticalItems({ results, compact = false }: CriticalItemsProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const safety = getSafetyLevel(results);

  const totalEndorsed = results.criticalItems.reduce((sum, g) => sum + g.endorsed.length, 0);

  return (
    <div>
      <div className={`safety-banner ${safety.level}`}>
        <strong>Safety: {safety.level.toUpperCase()}</strong>
        <span style={{ fontSize: '0.82rem' }}>{safety.description}</span>
      </div>

      {results.config.formLength === 'short' && (
        <div style={{ fontSize: '0.8rem', color: 'var(--warn)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
          Brief form: high-risk SI items (506, 520, 524) were not administered.
        </div>
      )}

      {!compact && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {totalEndorsed} critical items endorsed across {results.criticalItems.length} group{results.criticalItems.length !== 1 ? 's' : ''}
        </div>
      )}

      {results.criticalItems.length === 0 ? (
        <div className="no-code-type">No critical items endorsed.</div>
      ) : (
        results.criticalItems.map(group => {
          const isOpen = expanded[group.name] ?? false;
          return (
            <div key={group.name} className="critical-group">
              <div className="critical-group-header" onClick={() => setExpanded(prev => ({ ...prev, [group.name]: !prev[group.name] }))}>
                <span className="critical-group-name">
                  {isOpen ? '▾' : '▸'} {group.name}
                </span>
                <span className="critical-group-count">
                  {group.endorsed.length}/{group.total}
                </span>
              </div>
              {isOpen && group.endorsed.map(item => (
                <div key={item.num} className="critical-item">
                  <span className="critical-item-num">#{item.num}</span>
                  <span className="critical-item-response" style={{ color: item.response === 'T' ? 'var(--true-color)' : 'var(--false-color)' }}>
                    {item.response}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
