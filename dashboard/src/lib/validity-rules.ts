import type { ScoringResults, ValidityRuleResult, ValiditySeverity } from './types';

interface ValidityRule {
  condition: (results: ScoringResults) => boolean;
  severity: ValiditySeverity;
  message: string;
  recommendation: string;
}

function getT(results: ScoringResults, code: string): number | null {
  const all = [...results.inconsistencyResults, ...results.validityScales];
  const s = all.find(s => s.code === code);
  return s?.tScore ?? null;
}

const VALIDITY_RULES: ValidityRule[] = [
  // Cannot Say
  {
    condition: (r) => r.counts.cantSay >= 30,
    severity: 'invalid',
    message: 'Cannot Say count is 30 or higher. Profile may not be interpretable.',
    recommendation: 'Consider re-administration with encouragement to answer all items.',
  },
  {
    condition: (r) => r.counts.cantSay >= 11 && r.counts.cantSay < 30,
    severity: 'caution',
    message: `Elevated Cannot Say count (${11}+). Some scales may be attenuated.`,
    recommendation: 'Check % answered for individual scales. Interpret cautiously.',
  },

  // VRIN — random responding
  {
    condition: (r) => (getT(r, 'VRIN') ?? 0) >= 80,
    severity: 'invalid',
    message: 'VRIN T >= 80. Responses appear random or non-purposeful.',
    recommendation: 'Profile should not be interpreted. Consider re-administration in a controlled setting.',
  },
  {
    condition: (r) => { const t = getT(r, 'VRIN'); return t !== null && t >= 65 && t < 80; },
    severity: 'caution',
    message: 'VRIN is elevated (T 65-79). Some inconsistency in responding.',
    recommendation: 'Interpret profile with caution. Check if client was distracted or rushed.',
  },

  // TRIN — fixed responding
  {
    condition: (r) => (getT(r, 'TRIN') ?? 0) >= 80,
    severity: 'invalid',
    message: 'TRIN T >= 80. Client may be responding with a fixed True or False pattern.',
    recommendation: 'Profile should not be interpreted. Re-administer with emphasis on reading each item.',
  },

  // F — infrequency (over-reporting)
  {
    condition: (r) => {
      const f = getT(r, 'F');
      const fp = getT(r, 'Fp');
      return f !== null && f >= 100 && (fp === null || fp < 70);
    },
    severity: 'warning',
    message: 'F T >= 100 with Fp in normal range. Possible over-reporting, cry for help, or malingering.',
    recommendation: 'Consider Fb for back-half consistency. Evaluate context: litigation, disability evaluation, or genuine severe distress.',
  },
  {
    condition: (r) => {
      const f = getT(r, 'F');
      return f !== null && f >= 80 && f < 100;
    },
    severity: 'caution',
    message: 'F is markedly elevated (T 80-99). May reflect genuine severe psychopathology or over-reporting.',
    recommendation: 'Check Fp and Fb. If Fp is also elevated, consider malingering. If Fp is normal, genuine distress is more likely.',
  },
  {
    condition: (r) => {
      const f = getT(r, 'F');
      return f !== null && f >= 65 && f < 80;
    },
    severity: 'caution',
    message: 'F is elevated (T 65-79). Could indicate genuine distress, atypical experiences, or mild over-reporting.',
    recommendation: 'Likely interpretable. Consider clinical context.',
  },

  // Fb — back-half infrequency
  {
    condition: (r) => (getT(r, 'Fb') ?? 0) >= 80,
    severity: 'warning',
    message: 'Fb T >= 80. Client may have lost focus or changed response style in the second half of the test.',
    recommendation: 'Content and supplementary scales (items 370+) may be less reliable. Compare F and Fb patterns.',
  },

  // Fp — infrequent psychopathology
  {
    condition: (r) => (getT(r, 'Fp') ?? 0) >= 80,
    severity: 'warning',
    message: 'Fp T >= 80. Endorsement of rarely-endorsed items even among psychiatric patients. Consider malingering.',
    recommendation: 'Evaluate motivation for testing. If litigation or disability context, weigh profile with additional collateral.',
  },

  // L — uncommon virtues (under-reporting)
  {
    condition: (r) => (getT(r, 'L') ?? 0) >= 80,
    severity: 'warning',
    message: 'L T >= 80. Presenting an unrealistically favorable image. Clinical scales may significantly underestimate.',
    recommendation: 'Profile may underestimate actual difficulties. Interpret elevations as particularly noteworthy given defensive context.',
  },
  {
    condition: (r) => {
      const l = getT(r, 'L');
      return l !== null && l >= 65 && l < 80;
    },
    severity: 'caution',
    message: 'L is elevated (T 65-79). Some tendency to present favorably.',
    recommendation: 'Mild defensiveness. Clinical scales may be slightly attenuated but are generally interpretable.',
  },

  // K — subtle defensiveness
  {
    condition: (r) => (getT(r, 'K') ?? 0) >= 65,
    severity: 'caution',
    message: 'K T >= 65. Subtle defensiveness or well-adjusted coping style.',
    recommendation: 'If L is also elevated, defensiveness is more likely. If L is normal, may reflect genuine psychological resources.',
  },

  // L + K combined defensiveness
  {
    condition: (r) => {
      const l = getT(r, 'L');
      const k = getT(r, 'K');
      return l !== null && k !== null && l >= 65 && k >= 65;
    },
    severity: 'warning',
    message: 'Both L and K are elevated. Strong defensive response style. Clinical scales likely underestimate actual difficulties.',
    recommendation: 'Any clinical scale elevations in this context are particularly noteworthy. Consider re-administration with rapport building.',
  },

  // S — superlative self-presentation
  {
    condition: (r) => (getT(r, 'S') ?? 0) >= 70,
    severity: 'caution',
    message: 'S T >= 70. Superlative self-presentation. Client is claiming to be unusually well-adjusted.',
    recommendation: 'Supplements L and K interpretation. Strong defensive pattern if all three are elevated.',
  },

  // All validity normal
  {
    condition: (r) => {
      const vrin = getT(r, 'VRIN');
      const trin = getT(r, 'TRIN');
      const f = getT(r, 'F');
      const l = getT(r, 'L');
      const k = getT(r, 'K');
      return r.counts.cantSay < 11 &&
        (vrin === null || vrin < 65) &&
        (trin === null || trin < 65) &&
        (f === null || f < 65) &&
        (l === null || l < 65) &&
        (k === null || k < 65);
    },
    severity: 'valid',
    message: 'All validity indicators within acceptable limits. Profile appears interpretable.',
    recommendation: 'Proceed with clinical scale interpretation.',
  },
];

export function analyzeValidity(results: ScoringResults): ValidityRuleResult[] {
  const triggered: ValidityRuleResult[] = [];
  for (const rule of VALIDITY_RULES) {
    if (rule.condition(results)) {
      triggered.push({
        severity: rule.severity,
        message: rule.message,
        recommendation: rule.recommendation,
      });
    }
  }
  return triggered;
}

export function overallValiditySeverity(rules: ValidityRuleResult[]): ValiditySeverity {
  if (rules.some(r => r.severity === 'invalid')) return 'invalid';
  if (rules.some(r => r.severity === 'warning')) return 'warning';
  if (rules.some(r => r.severity === 'caution')) return 'caution';
  return 'valid';
}
