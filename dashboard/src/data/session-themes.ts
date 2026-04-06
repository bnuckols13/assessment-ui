export interface SessionTheme {
  id: string;
  title: string;
  prompt: string;
  clinicalScales: string[];
  criticalGroups: string[];
  clinicalContext: string;
}

export const SESSION_THEMES: SessionTheme[] = [
  {
    id: 'mood',
    title: 'Mood & Emotional Energy',
    prompt: 'You shared some responses about feeling down, discouraged, or low on energy. What feels most relevant to where you are right now?',
    clinicalScales: ['D'],
    criticalGroups: ['Depressed Suicidal Ideation'],
    clinicalContext: 'Scale 2 (Depression) elevated. Look for vegetative symptoms, anhedonia, hopelessness. Check DSI critical items for active risk.',
  },
  {
    id: 'worry',
    title: 'Worry & Tension',
    prompt: 'Some of your responses reflected feelings of worry, tension, or difficulty letting go of concerns. What tends to occupy your mind the most?',
    clinicalScales: ['Pt'],
    criticalGroups: ['Acute Anxiety State'],
    clinicalContext: 'Scale 7 (Psychasthenia) elevated. Consider anxiety disorder spectrum, OCD features, ruminative patterns.',
  },
  {
    id: 'health',
    title: 'Physical Health & Body',
    prompt: 'You mentioned some concerns about your physical health or how your body feels. How has your health been affecting your daily life?',
    clinicalScales: ['Hs', 'Hy'],
    criticalGroups: ['Somatic Symptoms'],
    clinicalContext: 'Scales 1 (Hs) and/or 3 (Hy) elevated. Explore somatic preoccupation vs. conversion features. Check HEA content scale for corroboration.',
  },
  {
    id: 'relationships',
    title: 'Relationships & Family',
    prompt: 'Your responses touched on some tension or difficulty in relationships — with family, friends, or others. What relationship feels most important to talk about?',
    clinicalScales: ['Pd'],
    criticalGroups: ['Family Conflict'],
    clinicalContext: 'Scale 4 (Pd) elevated. Differentiate familial discord vs. authority conflict vs. antisocial features. Check Pd subscales if available.',
  },
  {
    id: 'trust',
    title: 'Trust & Feeling Understood',
    prompt: 'Some of your answers reflected sensitivity about how others perceive or treat you. Have there been situations recently where you felt misunderstood or mistreated?',
    clinicalScales: ['Pa'],
    criticalGroups: ['Persecutory Ideas'],
    clinicalContext: 'Scale 6 (Paranoia) elevated. Distinguish justified suspiciousness from pervasive paranoid ideation. Check CYN and BIZ content scales.',
  },
  {
    id: 'thoughts',
    title: 'Thinking & Inner Experience',
    prompt: 'You endorsed some items about feeling different from others or having unusual experiences. Can you tell me more about what that has been like?',
    clinicalScales: ['Sc'],
    criticalGroups: ['Mental Confusion'],
    clinicalContext: 'Scale 8 (Schizophrenia) elevated. Assess for thought disorder, perceptual disturbance, alienation. Check BIZ content scale.',
  },
  {
    id: 'energy',
    title: 'Energy & Activity Level',
    prompt: 'Your responses suggested you may be experiencing high energy, restlessness, or taking on a lot at once. How has your energy level been affecting you?',
    clinicalScales: ['Ma'],
    criticalGroups: [],
    clinicalContext: 'Scale 9 (Hypomania) elevated. Explore impulsivity, grandiosity, sleep changes. Differentiate from ADHD or bipolar spectrum.',
  },
  {
    id: 'social',
    title: 'Social Comfort',
    prompt: 'Some of your responses reflected a preference for time alone or discomfort in social situations. How do you feel about your social connections right now?',
    clinicalScales: ['Si'],
    criticalGroups: [],
    clinicalContext: 'Scale 0 (Social Introversion) elevated. Distinguish introversion from social anxiety or avoidance. Check SOD content scale.',
  },
  {
    id: 'frustration',
    title: 'Frustration & Anger',
    prompt: 'You endorsed some items related to frustration or anger. What situations tend to bring up those feelings for you?',
    clinicalScales: [],
    criticalGroups: ['Threatened Assault'],
    clinicalContext: 'Threatened Assault critical items endorsed. Assess for anger management concerns, aggression risk, and situational triggers.',
  },
  {
    id: 'substances',
    title: 'Substance Use',
    prompt: 'Some of your responses touched on experiences related to substance use. Would you be open to talking about how that fits into your life right now?',
    clinicalScales: [],
    criticalGroups: ['Situational Stress Due to Alcoholism'],
    clinicalContext: 'Alcoholism critical items endorsed. Assess frequency, consequences, readiness for change. Check MAC-R and AAS supplementary scales.',
  },
];
