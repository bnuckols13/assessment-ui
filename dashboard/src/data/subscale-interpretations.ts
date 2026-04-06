export interface SubscaleInterpretation {
  code: string;
  parentCode: string;
  name: string;
  description: string;
  elevated: string;
}

export const SUBSCALE_INTERPRETATIONS: SubscaleInterpretation[] = [
  // ── D (Depression) subscales ──
  { code: 'D1', parentCode: 'D', name: 'Subjective Depression', description: 'Feelings of unhappiness, nervousness, and low energy', elevated: 'Reports significant subjective distress, feelings of unhappiness, and reduced capacity for daily functioning.' },
  { code: 'D2', parentCode: 'D', name: 'Psychomotor Retardation', description: 'Immobilization and withdrawal', elevated: 'Reports significant loss of interest, energy, and motivation. May present as listless and withdrawn.' },
  { code: 'D3', parentCode: 'D', name: 'Physical Malfunctioning', description: 'Somatic complaints and health preoccupation', elevated: 'Reports physical symptoms as part of depressive presentation. Somatic component of depression is prominent.' },
  { code: 'D4', parentCode: 'D', name: 'Mental Dullness', description: 'Difficulty concentrating and reduced mental efficiency', elevated: 'Reports significant cognitive complaints including poor concentration, memory difficulties, and reduced mental sharpness.' },
  { code: 'D5', parentCode: 'D', name: 'Brooding', description: 'Rumination, crying, and self-deprecation', elevated: 'Reports ruminative thinking, excessive worry, and self-critical ideation. Tends to dwell on problems and feel overwhelmed.' },

  // ── Hy (Hysteria) subscales ──
  { code: 'Hy1', parentCode: 'Hy', name: 'Denial of Social Anxiety', description: 'Comfort in social situations', elevated: 'Reports high degree of social comfort and ease. May reflect genuine extraversion or denial of social difficulties.' },
  { code: 'Hy2', parentCode: 'Hy', name: 'Need for Affection', description: 'Need for approval and avoiding confrontation', elevated: 'Strong need for acceptance and approval. Avoids conflict and may suppress negative feelings to maintain relationships.' },
  { code: 'Hy3', parentCode: 'Hy', name: 'Lassitude-Malaise', description: 'Fatigue and general malaise', elevated: 'Reports significant fatigue, weakness, and general physical discomfort. May reflect somatic expression of distress.' },
  { code: 'Hy4', parentCode: 'Hy', name: 'Somatic Complaints', description: 'Specific somatic symptoms', elevated: 'Reports specific physical symptoms (headaches, dizziness, pain) that may serve as expressions of psychological distress.' },
  { code: 'Hy5', parentCode: 'Hy', name: 'Inhibition of Aggression', description: 'Denial of hostile or aggressive impulses', elevated: 'Strongly denies aggressive or hostile impulses. May suppress anger, leading to passive expression or somatic channeling.' },

  // ── Pd (Psychopathic Deviate) subscales ──
  { code: 'Pd1', parentCode: 'Pd', name: 'Familial Discord', description: 'Conflict and dissatisfaction with family', elevated: 'Reports significant family conflict, feeling unsupported, and viewing home environment as unpleasant or hostile.' },
  { code: 'Pd2', parentCode: 'Pd', name: 'Authority Problems', description: 'Conflict with authority and rules', elevated: 'Reports resentment of authority, societal rules, and conventions. May have history of legal or disciplinary problems.' },
  { code: 'Pd3', parentCode: 'Pd', name: 'Social Imperturbability', description: 'Social confidence and poise', elevated: 'Reports social confidence and comfort. May reflect genuine social skills or superficial charm masking deeper difficulties.' },
  { code: 'Pd4', parentCode: 'Pd', name: 'Social Alienation', description: 'Feeling isolated and misunderstood', elevated: 'Reports feeling alienated, misunderstood, and unfairly treated. Perceives others as unsupportive and the world as hostile.' },
  { code: 'Pd5', parentCode: 'Pd', name: 'Self-Alienation', description: 'Self-dissatisfaction and guilt', elevated: 'Reports discomfort with self, excessive guilt, and feelings of regret. May feel unable to change problematic patterns.' },

  // ── Pa (Paranoia) subscales ──
  { code: 'Pa1', parentCode: 'Pa', name: 'Persecutory Ideas', description: 'Perceived external threats and persecution', elevated: 'Reports feeling persecuted, plotted against, or unfairly targeted. May endorse frankly paranoid ideation.' },
  { code: 'Pa2', parentCode: 'Pa', name: 'Poignancy', description: 'Emotional sensitivity and feeling different', elevated: 'Reports heightened emotional sensitivity, feeling misunderstood, and perceiving self as uniquely perceptive or burdened.' },
  { code: 'Pa3', parentCode: 'Pa', name: 'Naiveté', description: 'Optimistic and trusting attitudes', elevated: 'Reports unrealistically positive views of others. High scores reflect denial of suspicious or hostile attitudes.' },

  // ── Sc (Schizophrenia) subscales ──
  { code: 'Sc1', parentCode: 'Sc', name: 'Social Alienation', description: 'Feeling misunderstood and mistreated', elevated: 'Reports pervasive sense of being misunderstood, unloved, and unfairly treated. Feels fundamentally different from others.' },
  { code: 'Sc2', parentCode: 'Sc', name: 'Emotional Alienation', description: 'Emotional detachment and flatness', elevated: 'Reports emotional detachment, flatness, or depersonalization. May feel emotionally dead or disconnected from experience.' },
  { code: 'Sc3', parentCode: 'Sc', name: 'Lack of Ego Mastery, Cognitive', description: 'Strange thoughts and cognitive disruption', elevated: 'Reports unusual thought processes, difficulty concentrating, and feelings of unreality. May endorse bizarre mentation.' },
  { code: 'Sc4', parentCode: 'Sc', name: 'Lack of Ego Mastery, Conative', description: 'Inhibition, withdrawal, and giving up', elevated: 'Reports depression, despair, and difficulty coping. May have given up trying to manage life circumstances.' },
  { code: 'Sc5', parentCode: 'Sc', name: 'Lack of Ego Mastery, Defective Inhibition', description: 'Loss of control over emotions and impulses', elevated: 'Reports feeling out of control emotionally and behaviorally. May describe episodes of dissociation or impulsive actions.' },
  { code: 'Sc6', parentCode: 'Sc', name: 'Bizarre Sensory Experiences', description: 'Unusual perceptual and sensory experiences', elevated: 'Reports unusual sensory experiences, hallucination-like phenomena, or bizarre bodily sensations.' },

  // ── Ma (Hypomania) subscales ──
  { code: 'Ma1', parentCode: 'Ma', name: 'Amorality', description: 'Antisocial attitudes and exploitation', elevated: 'Reports attitudes supportive of exploiting others, seeing people as selfish and dishonest, and justifying personal gain.' },
  { code: 'Ma2', parentCode: 'Ma', name: 'Psychomotor Acceleration', description: 'Overactivity and pressure of thought', elevated: 'Reports racing thoughts, excessive activity, and feeling driven. May describe speech pressure and restlessness.' },
  { code: 'Ma3', parentCode: 'Ma', name: 'Imperturbability', description: 'Denial of social anxiety and concerns', elevated: 'Reports denial of social anxiety and lack of sensitivity to others. May reflect grandiosity or emotional insensitivity.' },
  { code: 'Ma4', parentCode: 'Ma', name: 'Ego Inflation', description: 'Grandiosity and self-importance', elevated: 'Reports unrealistic self-appraisal, grandiose beliefs, and resentment of demands from others.' },
];
