import { useState } from 'react';
import type { ScoringResults, ComparisonData } from '../../lib/types';
import { getElevatedScales, tScoreColor } from '../../lib/clinical-utils';
import { CLINICAL_SCALE_INTERPRETATIONS, CONTENT_SCALE_INTERPRETATIONS } from '../../data/scale-interpretations';
import { SUBSCALE_INTERPRETATIONS } from '../../data/subscale-interpretations';
import { ValidityPanel } from '../ValidityPanel/ValidityPanel';
import { CodeTypePanel } from '../CodeTypePanel/CodeTypePanel';
import { ContentCorroboration } from '../ContentCorroboration/ContentCorroboration';
import { CriticalItems } from '../CriticalItems/CriticalItems';
import { ProfileChart } from '../ProfileChart/ProfileChart';
import { ScaleTable } from '../ScaleTable/ScaleTable';
import { ComparisonPanel } from '../ComparisonPanel/ComparisonPanel';

interface DetailViewProps {
  results: ScoringResults;
  validityGated?: boolean;
  onValidityOverride?: () => void;
  comparisonData?: ComparisonData | null;
}

function DetailSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="detail-section">
      <div className="detail-section-header" onClick={() => setOpen(!open)}>
        <h2>{title}</h2>
        <span className={`detail-section-chevron ${open ? 'open' : ''}`}>▸</span>
      </div>
      <div className={`detail-section-body ${open ? 'open' : ''}`}>
        <div className="detail-section-body-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DetailView({ results, validityGated, onValidityOverride, comparisonData }: DetailViewProps) {
  const elevatedClinical = getElevatedScales(results.clinicalScales, 65);
  const elevatedContent = getElevatedScales(results.contentScales, 65);

  return (
    <div className="detail-layout">
      <DetailSection title="Validity Profile" defaultOpen>
        <ValidityPanel results={results} />
        <div style={{ marginTop: '1rem' }}>
          <ProfileChart
            scales={[...results.inconsistencyResults, ...results.validityScales]}
            title="Validity Pattern"
            height={240}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <ScaleTable scales={[...results.inconsistencyResults, ...results.validityScales]} showCorrected={false} />
        </div>
      </DetailSection>

      {validityGated && (
        <div className="validity-gate-banner">
          <div className="validity-gate-banner-text">
            This profile did not pass validity screening. Clinical interpretation is not recommended. Sections below are hidden until you explicitly choose to proceed.
          </div>
          <button className="validity-gate-btn" onClick={onValidityOverride}>Interpret Anyway</button>
        </div>
      )}

      <div className={validityGated ? 'validity-gated-section' : ''}>

      {comparisonData && (
        <DetailSection title="Longitudinal Comparison">
          <ComparisonPanel data={comparisonData} />
          <div style={{ marginTop: '1rem' }}>
            <ProfileChart
              scales={results.clinicalScales}
              comparisonScales={comparisonData.previousClinicalScales}
              title="Clinical Profile — Current vs. Previous"
              height={300}
            />
          </div>
        </DetailSection>
      )}

      <DetailSection title="Clinical Profile" defaultOpen={!validityGated}>
        <ProfileChart
          scales={results.clinicalScales}
          comparisonScales={comparisonData?.previousClinicalScales}
          title="Clinical Scales"
          height={300}
        />
        <div style={{ marginTop: '1rem' }}>
          <ScaleTable scales={results.clinicalScales} />
        </div>
        {elevatedClinical.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
              Scale Interpretations
            </div>
            {elevatedClinical.map(scale => {
              const interp = CLINICAL_SCALE_INTERPRETATIONS.find(i => i.code === scale.code);
              if (!interp) return null;
              const band = scale.tScore !== null && scale.tScore >= 80 ? interp.marked : interp.moderate;
              const childSubscales = (results.subscaleResults || []).filter(s => s.parentCode === scale.code);
              return (
                <div key={scale.code}>
                  <div className="interp-block" style={{ borderLeftColor: tScoreColor(scale.tScore) }}>
                    <div className="interp-header">
                      <span className="interp-code">{scale.code}</span>
                      <span className="interp-name">{interp.name}</span>
                      <span className="interp-tscore" style={{ color: tScoreColor(scale.tScore) }}>T = {scale.tScore}</span>
                    </div>
                    <div className="interp-text">{band.description}</div>
                    <div className="interp-correlates">Behavioral correlates: {interp.behavioralCorrelates}</div>
                  </div>
                  {childSubscales.length > 0 && (
                    <div className="subscale-group">
                      <div className="subscale-group-label">Harris-Lingoes Subscales</div>
                      {childSubscales.map(sub => {
                        const subInterp = SUBSCALE_INTERPRETATIONS.find(si => si.code === sub.code);
                        const pct = sub.tScore !== null ? Math.min(Math.max((sub.tScore - 30) / 90 * 100, 0), 100) : 0;
                        return (
                          <div key={sub.code} className="subscale-bar-item">
                            <div className="subscale-bar-header">
                              <span className="subscale-bar-code">{sub.code}</span>
                              <span className="subscale-bar-name">{subInterp?.name || sub.description}</span>
                              <span className="subscale-bar-tscore" style={{ color: tScoreColor(sub.tScore) }}>
                                {sub.tScore ?? '—'}
                              </span>
                            </div>
                            <div className="subscale-bar-track">
                              <div className="subscale-bar-fill" style={{ width: `${pct}%`, background: tScoreColor(sub.tScore) }} />
                            </div>
                            {sub.tScore !== null && sub.tScore >= 65 && subInterp && (
                              <div className="subscale-interp">{subInterp.elevated}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Code Type Analysis">
        <CodeTypePanel results={results} />
      </DetailSection>

      <DetailSection title="Content Corroboration">
        <ContentCorroboration results={results} />
      </DetailSection>

      <DetailSection title="Content Scales">
        <ScaleTable scales={results.contentScales} showCorrected={false} />
        {elevatedContent.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
              Content Scale Interpretations
            </div>
            {elevatedContent.map(scale => {
              const interp = CONTENT_SCALE_INTERPRETATIONS.find(i => i.code === scale.code);
              if (!interp) return null;
              const band = scale.tScore !== null && scale.tScore >= 80 ? interp.marked : interp.moderate;
              return (
                <div key={scale.code} className="interp-block" style={{ borderLeftColor: tScoreColor(scale.tScore) }}>
                  <div className="interp-header">
                    <span className="interp-code">{scale.code}</span>
                    <span className="interp-name">{interp.name}</span>
                    <span className="interp-tscore" style={{ color: tScoreColor(scale.tScore) }}>T = {scale.tScore}</span>
                  </div>
                  <div className="interp-text">{band.description}</div>
                </div>
              );
            })}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Supplementary Scales">
        <ScaleTable scales={results.supplementaryScales} showCorrected={false} />
      </DetailSection>

      <DetailSection title="Critical Items">
        <CriticalItems results={results} />
      </DetailSection>

      </div>{/* end validity-gated-section wrapper */}

      <DetailSection title="Raw Data">
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            className="entry-btn"
            style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            onClick={() => {
              const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `assessment-${results.timestamp.slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export JSON
          </button>
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
          Configuration
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
          Gender: {results.config.gender} | Form: {results.config.formLength} | Items: {results.config.lastItem} | Version: {results.version}
        </div>
      </DetailSection>
    </div>
  );
}
