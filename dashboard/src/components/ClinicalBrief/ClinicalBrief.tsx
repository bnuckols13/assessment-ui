import type { ScoringResults } from '../../lib/types';
import { elevationBandLabel, getElevatedScales, tScoreColor } from '../../lib/clinical-utils';
import { CLINICAL_SCALE_INTERPRETATIONS } from '../../data/scale-interpretations';
import { ValidityPanel } from '../ValidityPanel/ValidityPanel';
import { CodeTypePanel } from '../CodeTypePanel/CodeTypePanel';
import { CriticalItems } from '../CriticalItems/CriticalItems';
import { ProfileChart } from '../ProfileChart/ProfileChart';

interface ClinicalBriefProps {
  results: ScoringResults;
  clientName?: string;
}

export function ClinicalBrief({ results, clientName }: ClinicalBriefProps) {
  const elevation = elevationBandLabel(results.profileElevation);
  const elevated = getElevatedScales(results.clinicalScales, 65);

  return (
    <div className="brief-layout">
      <div className="brief-steps">
        {/* Step 1: Validity */}
        <div className="step-card">
          <div className="step-card-header">
            <div className="step-number">1</div>
            <div className="step-label">Validity</div>
          </div>
          <div className="step-content">
            <ValidityPanel results={results} compact />
          </div>
        </div>

        {/* Step 2: Code Type */}
        <div className="step-card">
          <div className="step-card-header">
            <div className="step-number">2</div>
            <div className="step-label">Code Type</div>
          </div>
          <div className="step-content">
            <CodeTypePanel results={results} compact />
          </div>
        </div>

        {/* Step 3: Elevations */}
        <div className="step-card">
          <div className="step-card-header">
            <div className="step-number">3</div>
            <div className="step-label">Elevations</div>
          </div>
          <div className="step-content">
            {elevated.length === 0 ? (
              <div className="no-code-type">No clinical scales elevated at T &ge; 65.</div>
            ) : (
              elevated.slice(0, 4).map(scale => {
                const interp = CLINICAL_SCALE_INTERPRETATIONS.find(i => i.code === scale.code);
                const band = scale.tScore !== null && scale.tScore >= 80 ? interp?.marked : interp?.moderate;
                return (
                  <div key={scale.code} className="interp-block" style={{ borderLeftColor: tScoreColor(scale.tScore) }}>
                    <div className="interp-header">
                      <span className="interp-code">{scale.code}</span>
                      <span className="interp-name">{scale.description}</span>
                      <span className="interp-tscore" style={{ color: tScoreColor(scale.tScore) }}>T = {scale.tScore}</span>
                    </div>
                    <div className="interp-text">{band?.description}</div>
                  </div>
                );
              })
            )}
            {elevated.length > 4 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                +{elevated.length - 4} more elevated scales (see Detail View)
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Critical Items */}
        <div className="step-card">
          <div className="step-card-header">
            <div className="step-number">4</div>
            <div className="step-label">Critical Items</div>
          </div>
          <div className="step-content">
            <CriticalItems results={results} compact />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="brief-sidebar">
        <div className="sidebar-card">
          <h3>Summary</h3>
          {clientName && (
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>{clientName}</div>
          )}
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-value" style={{ color: tScoreColor(results.profileElevation) }}>
                {results.profileElevation ?? '—'}
              </div>
              <div className="stat-label">Elevation</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{elevation.label}</div>
              <div className="stat-label">Level</div>
            </div>
          </div>
          <div className="stat-grid" style={{ marginTop: '0.5rem' }}>
            <div className="stat-box">
              <div className="stat-value" style={{ fontSize: '1rem' }}>{results.counts.trueCount}</div>
              <div className="stat-label">True</div>
            </div>
            <div className="stat-box">
              <div className="stat-value" style={{ fontSize: '1rem' }}>{results.counts.falseCount}</div>
              <div className="stat-label">False</div>
            </div>
            <div className="stat-box">
              <div className="stat-value" style={{ fontSize: '1rem' }}>{results.counts.cantSay}</div>
              <div className="stat-label">?</div>
            </div>
          </div>
        </div>

        <div className="sidebar-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <h3>Clinical Profile</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ProfileChart scales={results.clinicalScales} height={220} />
          </div>
        </div>
      </div>
    </div>
  );
}
