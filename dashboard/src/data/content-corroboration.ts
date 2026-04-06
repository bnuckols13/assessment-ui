import type { CorroborationMapping } from '../lib/types';

export const CONTENT_CORROBORATION: CorroborationMapping[] = [
  {
    clinicalCode: 'Hs',
    contentCodes: ['HEA'],
    interpretation: 'HEA elevation corroborates somatic preoccupation seen in Hs. Broad pattern of health concerns across body systems.',
    nonCorroboration: 'Hs elevated without HEA elevation may suggest more circumscribed or vague somatic complaints rather than pervasive health concerns.',
  },
  {
    clinicalCode: 'D',
    contentCodes: ['DEP', 'LSE', 'WRK'],
    interpretation: 'DEP corroborates depressive mood and hopelessness. LSE confirms negative self-concept. WRK suggests functional impairment from depression.',
    nonCorroboration: 'D elevated without DEP may reflect characterological pessimism or situational dissatisfaction rather than clinical depression.',
  },
  {
    clinicalCode: 'Hy',
    contentCodes: ['HEA'],
    interpretation: 'HEA elevation alongside Hy supports conversion or somatization pattern. Physical symptoms as expression of distress.',
    nonCorroboration: 'Hy elevated without HEA may reflect the denial/repression component (need for approval) rather than somatic conversion.',
  },
  {
    clinicalCode: 'Pd',
    contentCodes: ['ASP', 'ANG', 'FAM', 'CYN'],
    interpretation: 'ASP confirms antisocial attitudes. ANG suggests anger management issues. FAM indicates family conflict. CYN reflects distrust underlying social deviance.',
    nonCorroboration: 'Pd elevated without ASP/ANG may reflect family conflict or authority issues without broader antisocial pattern.',
  },
  {
    clinicalCode: 'Pa',
    contentCodes: ['CYN', 'BIZ', 'ANG'],
    interpretation: 'CYN corroborates general mistrust. BIZ suggests paranoid ideation may extend to more bizarre thinking. ANG confirms hostile component.',
    nonCorroboration: 'Pa elevated without CYN/BIZ may reflect situational suspiciousness or sensitivity rather than characterological paranoia.',
  },
  {
    clinicalCode: 'Pt',
    contentCodes: ['ANX', 'OBS', 'WRK', 'LSE'],
    interpretation: 'ANX confirms anxiety symptoms. OBS corroborates ruminative/obsessive features. WRK and LSE suggest anxiety is broadly impairing.',
    nonCorroboration: 'Pt elevated without ANX may reflect more characterological worry and self-doubt than acute anxiety symptoms.',
  },
  {
    clinicalCode: 'Sc',
    contentCodes: ['BIZ', 'DEP', 'SOD'],
    interpretation: 'BIZ strongly corroborates thought disorder features. DEP confirms depressive alienation component. SOD supports social withdrawal.',
    nonCorroboration: 'Sc elevated without BIZ may reflect alienation and identity confusion rather than active thought disorder.',
  },
  {
    clinicalCode: 'Ma',
    contentCodes: ['ANG', 'ASP', 'TPA'],
    interpretation: 'ANG suggests irritability component of hypomania. ASP confirms impulsive/risk-taking behavior. TPA corroborates drivenness and impatience.',
    nonCorroboration: 'Ma elevated without ANG/ASP may reflect high energy and optimism without significant behavioral dysregulation.',
  },
  {
    clinicalCode: 'Si',
    contentCodes: ['SOD', 'LSE'],
    interpretation: 'SOD directly corroborates social discomfort. LSE suggests low self-esteem contributes to social avoidance.',
    nonCorroboration: 'Si elevated without SOD may reflect preference for solitude rather than social anxiety.',
  },
];
