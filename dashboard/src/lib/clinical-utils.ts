import type { ScaleResult, ScoringResults, CodeTypeInfo, ScaleDelta, ComparisonData } from './types';
import { CODE_TYPES } from '../data/code-types';
import { CONTENT_CORROBORATION } from '../data/content-corroboration';

export function tScoreBand(t: number | null): 'normal' | 'borderline' | 'elevated' | 'marked' | 'unknown' {
  if (t === null) return 'unknown';
  if (t >= 80) return 'marked';
  if (t >= 65) return 'elevated';
  if (t >= 60) return 'borderline';
  return 'normal';
}

export function tScoreColor(t: number | null): string {
  const band = tScoreBand(t);
  switch (band) {
    case 'marked': return 'var(--false-color)';
    case 'elevated': return 'var(--false-color)';
    case 'borderline': return 'var(--warn)';
    case 'normal': return 'var(--true-color)';
    default: return 'var(--text-tertiary)';
  }
}

export function tScoreBandLabel(t: number | null): string {
  const band = tScoreBand(t);
  switch (band) {
    case 'marked': return 'Marked Elevation';
    case 'elevated': return 'Clinically Elevated';
    case 'borderline': return 'Borderline';
    case 'normal': return 'Within Normal Limits';
    default: return 'N/A';
  }
}

export function elevationBandLabel(elevation: number | null): { label: string; level: string } {
  if (elevation === null) return { label: 'N/A', level: 'unknown' };
  if (elevation >= 75) return { label: 'High', level: 'high' };
  if (elevation >= 65) return { label: 'Moderate', level: 'moderate' };
  if (elevation >= 55) return { label: 'Mild', level: 'mild' };
  return { label: 'Normal', level: 'normal' };
}

export function getElevatedScales(scales: ScaleResult[], threshold = 65): ScaleResult[] {
  return scales.filter(s => s.tScore !== null && s.tScore >= threshold);
}

export function getTwoPointCode(clinicalScales: ScaleResult[]): CodeTypeInfo | null {
  // Exclude Mf (scale 5) and Si (scale 0) from code typing
  const codeable = clinicalScales.filter(s => s.code !== 'Mf' && s.code !== 'Si');
  const elevated = codeable
    .filter(s => s.tScore !== null && s.tScore >= 65)
    .sort((a, b) => (b.tScore || 0) - (a.tScore || 0));

  if (elevated.length < 2) return null;

  const top2 = [elevated[0].code, elevated[1].code].sort();
  const key = top2.join('-');

  return CODE_TYPES[key] || null;
}

export function getTwoPointCodeLabel(clinicalScales: ScaleResult[]): string {
  const codeable = clinicalScales.filter(s => s.code !== 'Mf' && s.code !== 'Si');
  const elevated = codeable
    .filter(s => s.tScore !== null && s.tScore >= 65)
    .sort((a, b) => (b.tScore || 0) - (a.tScore || 0));

  if (elevated.length < 2) return 'No code type (< 2 scales elevated)';
  return `${elevated[0].code}-${elevated[1].code}`;
}

export interface CorroborationSummary {
  clinicalCode: string;
  supported: boolean;
  supportingCodes: string[];
  missingCodes: string[];
  shortVerdict: string;
}

export function getCorroborationSummary(
  clinicalScale: ScaleResult,
  contentScales: ScaleResult[]
): CorroborationSummary | null {
  const mapping = CONTENT_CORROBORATION.find(m => m.clinicalCode === clinicalScale.code);
  if (!mapping) return null;

  const supportingCodes: string[] = [];
  const missingCodes: string[] = [];

  for (const code of mapping.contentCodes) {
    const contentScale = contentScales.find(s => s.code === code);
    if (contentScale && contentScale.tScore !== null && contentScale.tScore >= 65) {
      supportingCodes.push(code);
    } else {
      missingCodes.push(code);
    }
  }

  const supported = supportingCodes.length > 0;
  const shortVerdict = supported
    ? `Supported by ${supportingCodes.join(', ')}`
    : 'Not corroborated';

  return { clinicalCode: clinicalScale.code, supported, supportingCodes, missingCodes, shortVerdict };
}

export function getSafetyLevel(results: ScoringResults): { level: string; description: string } {
  const dsi = results.criticalItems.find(g => g.name === 'Depressed Suicidal Ideation');
  if (!dsi || dsi.endorsed.length === 0) return { level: 'none', description: 'No DSI items endorsed' };

  const highRiskItems = [506, 520, 524];
  const endorsedHighRisk = dsi.endorsed.filter(e => highRiskItems.includes(e.num));

  if (endorsedHighRisk.length >= 2) return { level: 'high', description: `${endorsedHighRisk.length} high-risk SI items endorsed (506/520/524)` };
  if (endorsedHighRisk.length === 1) return { level: 'moderate', description: '1 high-risk SI item endorsed' };
  return { level: 'low', description: 'DSI items endorsed, no high-risk items' };
}

function buildScaleDeltas(currentScales: ScaleResult[], previousScales: ScaleResult[]): ScaleDelta[] {
  return currentScales.map(current => {
    const prev = previousScales.find(p => p.code === current.code);
    const previousT = prev?.tScore ?? null;
    const currentT = current.tScore;
    let delta: number | null = null;
    let direction: ScaleDelta['direction'] = 'unknown';

    if (currentT !== null && previousT !== null) {
      delta = currentT - previousT;
      if (delta <= -5) direction = 'improved';
      else if (delta >= 5) direction = 'worsened';
      else direction = 'stable';
    }

    return { code: current.code, name: current.description, currentT, previousT, delta, direction };
  });
}

export function buildComparisonData(
  current: ScoringResults,
  previous: ScoringResults,
  previousName: string,
  previousTimestamp: string,
): ComparisonData {
  const clinicalDeltas = buildScaleDeltas(current.clinicalScales, previous.clinicalScales);
  const contentDeltas = buildScaleDeltas(current.contentScales, previous.contentScales);

  const currentElev = current.profileElevation;
  const previousElev = previous.profileElevation;
  const elevationDelta = currentElev !== null && previousElev !== null ? currentElev - previousElev : null;

  return {
    previousName,
    previousTimestamp,
    clinicalDeltas,
    contentDeltas,
    elevationDelta,
    currentElevation: currentElev,
    previousElevation: previousElev,
    previousCodeType: getTwoPointCodeLabel(previous.clinicalScales),
    currentCodeType: getTwoPointCodeLabel(current.clinicalScales),
    previousClinicalScales: previous.clinicalScales,
  };
}
