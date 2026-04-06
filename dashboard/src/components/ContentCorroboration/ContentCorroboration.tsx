import type { ScoringResults } from '../../lib/types';
import { getElevatedScales } from '../../lib/clinical-utils';
import { CONTENT_CORROBORATION } from '../../data/content-corroboration';

interface ContentCorroborationProps {
  results: ScoringResults;
}

export function ContentCorroboration({ results }: ContentCorroborationProps) {
  const elevatedClinical = getElevatedScales(results.clinicalScales, 65);

  if (elevatedClinical.length === 0) {
    return <div className="no-code-type">No clinical scales are elevated at T &ge; 65. Content corroboration is not applicable.</div>;
  }

  return (
    <div>
      {elevatedClinical.map(clinical => {
        const mapping = CONTENT_CORROBORATION.find(m => m.clinicalCode === clinical.code);
        if (!mapping) return null;

        const corroboratingScales = mapping.contentCodes
          .map(code => results.contentScales.find(s => s.code === code))
          .filter(Boolean);

        const anyElevated = corroboratingScales.some(s => s && s.tScore !== null && s.tScore >= 65);
        const supported = anyElevated;

        return (
          <div key={clinical.code} className={`corrob-item ${supported ? 'corrob-supported' : 'corrob-unsupported'}`}>
            <div className="corrob-header">
              {clinical.code} ({clinical.description}) — T = {clinical.tScore}
            </div>
            <div className="corrob-scales">
              Expected content: {mapping.contentCodes.map(code => {
                const s = results.contentScales.find(sc => sc.code === code);
                const t = s?.tScore;
                return `${code}=${t ?? '?'}`;
              }).join(', ')}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {supported ? mapping.interpretation : mapping.nonCorroboration}
            </div>
          </div>
        );
      })}
    </div>
  );
}
