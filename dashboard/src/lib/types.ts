export type Gender = 'male' | 'female';
export type FormLength = 'short' | 'long';

export interface ScaleResult {
  code: string;
  name: string;
  description: string;
  category: 'validity' | 'clinical' | 'content' | 'supplementary';
  raw: number;
  corrected: number | null;
  tScore: number | null;
  pctAnswered: number;
  isElevationScale: boolean;
  isCorrectionScale: boolean;
}

export interface InconsistencyResult {
  code: string;
  name: string;
  description: string;
  raw: number;
  tScore: number | null;
  direction: '' | 'T' | 'F';
  category: 'inconsistency';
}

export interface CriticalItemEndorsed {
  num: number;
  text: string;
  response: 'T' | 'F';
}

export interface CriticalItemGroup {
  name: string;
  endorsed: CriticalItemEndorsed[];
  total: number;
}

export interface SubscaleResult extends ScaleResult {
  parentCode: string;
}

export interface ScoringResults {
  version: string;
  config: {
    gender: Gender;
    formLength: FormLength;
    lastItem: number;
  };
  counts: {
    total: number;
    trueCount: number;
    falseCount: number;
    cantSay: number;
  };
  inconsistencyResults: InconsistencyResult[];
  validityScales: ScaleResult[];
  clinicalScales: ScaleResult[];
  contentScales: ScaleResult[];
  supplementaryScales: ScaleResult[];
  subscaleResults?: SubscaleResult[];
  criticalItems: CriticalItemGroup[];
  profileElevation: number | null;
  allScaleResults: ScaleResult[];
  timestamp: string;
}

export interface StoredReport {
  id: string;
  timestamp: string;
  client: {
    clientName: string;
    gender: Gender;
    formLength: FormLength;
    identifier: string;
  };
  scoring: {
    profileElevation: number | null;
    counts: ScoringResults['counts'];
    validityScales: ScaleResult[];
    clinicalScales: ScaleResult[];
    contentScales: ScaleResult[];
    supplementaryScales: ScaleResult[];
    inconsistencyResults: InconsistencyResult[];
    criticalItems: CriticalItemGroup[];
  };
  safetyFlags: {
    showCrisisResource: boolean;
    level: 'none' | 'low' | 'moderate' | 'high';
    endorsedHighRiskCount: number;
    totalDSIEndorsed: number;
    highRiskItemsNotAdministered: boolean;
    endorsedHighRiskItems: number[];
  };
  answerString: string;
  version: string;
}

export type ViewMode = 'entry' | 'brief' | 'detail' | 'session';

export interface ScaleDelta {
  code: string;
  name: string;
  currentT: number | null;
  previousT: number | null;
  delta: number | null;
  direction: 'improved' | 'worsened' | 'stable' | 'unknown';
}

export interface ComparisonData {
  previousName: string;
  previousTimestamp: string;
  clinicalDeltas: ScaleDelta[];
  contentDeltas: ScaleDelta[];
  elevationDelta: number | null;
  currentElevation: number | null;
  previousElevation: number | null;
  previousCodeType: string;
  currentCodeType: string;
  previousClinicalScales: ScaleResult[];
}

export type ValiditySeverity = 'valid' | 'caution' | 'warning' | 'invalid';

export interface ValidityRuleResult {
  severity: ValiditySeverity;
  message: string;
  recommendation: string;
}

export interface CodeTypeInfo {
  codes: string;
  label: string;
  narrative: string;
  differentials: string;
  treatmentConsiderations: string;
}

export interface ElevationBand {
  label: string;
  description: string;
}

export interface ScaleInterpretation {
  code: string;
  name: string;
  moderate: ElevationBand;
  marked: ElevationBand;
  behavioralCorrelates: string;
}

export interface CorroborationMapping {
  clinicalCode: string;
  contentCodes: string[];
  interpretation: string;
  nonCorroboration: string;
}
