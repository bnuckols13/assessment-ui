import type { ScoringResults, Gender, FormLength, StoredReport } from './types';

import scoringDataRaw from '@scoring/scoring-data.js?raw';
import scoringEngineRaw from '@scoring/scoring-engine.js?raw';

// Import question texts
import { questions } from '../data/questions';

// Evaluate the vanilla JS in a shared scope
const module = new Function(
  scoringDataRaw + '\n' + scoringEngineRaw +
  '\nreturn { SCORING_DATA: SCORING_DATA, scoreInstrument: scoreInstrument };'
)();

const { SCORING_DATA, scoreInstrument } = module;

export function parseAnswerString(str: string): (boolean | undefined)[] {
  const answers: (boolean | undefined)[] = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === 'T') answers.push(true);
    else if (ch === 'F') answers.push(false);
    else answers.push(undefined);
  }
  return answers;
}

export function score(answers: (boolean | undefined)[], gender: Gender, formLength: FormLength): ScoringResults {
  return scoreInstrument(answers, gender, formLength, SCORING_DATA, questions) as ScoringResults;
}

export function scoreFromString(answerString: string, gender: Gender, formLength: FormLength): ScoringResults {
  const answers = parseAnswerString(answerString);
  return score(answers, gender, formLength);
}

export function loadStoredReports(): StoredReport[] {
  const reports: StoredReport[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('assessment_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        if (data && data.id && data.client && data.answerString) {
          reports.push(data as StoredReport);
        }
      } catch {
        // skip invalid entries
      }
    }
  }
  return reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
