import type { ScaleInterpretation } from '../lib/types';

export const CLINICAL_SCALE_INTERPRETATIONS: ScaleInterpretation[] = [
  {
    code: 'Hs',
    name: 'Hypochondriasis',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Excessive bodily concern and somatic preoccupation. May have vague, diffuse physical complaints. Tends to be self-centered and demanding of attention from others. May use symptoms to control interpersonal relationships.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Extreme preoccupation with bodily functioning. Multiple somatic complaints without adequate organic basis. May be functionally impaired by symptom focus. Resistant to psychological explanations.',
    },
    behavioralCorrelates: 'Frequent medical visits, excessive bodily monitoring, functional limitations disproportionate to findings.',
  },
  {
    code: 'D',
    name: 'Depression',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Unhappy, pessimistic, and self-dissatisfied. Low energy, poor concentration, and sleep disturbance. Feelings of inadequacy and guilt. Social withdrawal and diminished interest in activities.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Severe depression with marked hopelessness and psychomotor retardation. May endorse suicidal ideation. Profound self-deprecation and guilt. Significant functional impairment.',
    },
    behavioralCorrelates: 'Social withdrawal, tearfulness, psychomotor slowing, sleep and appetite changes, anhedonia.',
  },
  {
    code: 'Hy',
    name: 'Hysteria',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Uses denial and repression as primary defenses. May develop physical symptoms under stress. Seeks affection and social approval. Tends to be emotionally shallow and resistant to insight.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Strong tendency to convert psychological distress into physical symptoms. Naive, suggestible, and demanding. May show la belle indifference toward symptoms. Significant denial of interpersonal difficulties.',
    },
    behavioralCorrelates: 'Physical symptoms without organic basis, attention-seeking, emotional lability, difficulty with insight.',
  },
  {
    code: 'Pd',
    name: 'Psychopathic Deviate',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Rebellious, nonconforming, and dissatisfied with authority. Family conflict and interpersonal difficulties. May have acting-out potential. Often resentful of societal expectations.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Severe difficulty with social conformity and impulse control. Chronic interpersonal conflict. May have antisocial behavior, substance use, or legal involvement. Poor frustration tolerance.',
    },
    behavioralCorrelates: 'Authority conflicts, impulsive actions, unstable relationships, substance use, legal problems.',
  },
  {
    code: 'Mf',
    name: 'Masculinity-Femininity',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'For males: broad interests, sensitive, aesthetic. May feel different from peers. For females: assertive, competitive, confident. Interests may be less traditionally feminine.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Strong identification with non-traditional gender role interests. For males: very sensitive, passive, may have significant gender-related distress. For females: very assertive, dominant, action-oriented.',
    },
    behavioralCorrelates: 'Gender role flexibility, artistic or mechanical interests (depending on gender), sensitivity to interpersonal nuance.',
  },
  {
    code: 'Pa',
    name: 'Paranoia',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Suspicious, guarded, and sensitive to perceived slights. Tends to externalize blame and feel mistreated. Interpersonally rigid and moralistic. May be argumentative.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Pervasive suspiciousness with possible paranoid ideation or delusions. May feel persecuted, conspired against, or surveilled. Hostile and resentful. Significant impairment in relationships.',
    },
    behavioralCorrelates: 'Suspiciousness, guardedness, blaming others, interpersonal conflict, rigidity.',
  },
  {
    code: 'Pt',
    name: 'Psychasthenia',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Anxious, tense, and ruminative. Excessive worry, self-doubt, and perfectionism. May have obsessive thoughts or compulsive behaviors. Difficulty making decisions. Guilt-prone.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Severe anxiety with possible obsessional thinking and compulsive rituals. Overwhelmed by worry. May feel paralyzed by indecision. Significant functional impairment from anxiety symptoms.',
    },
    behavioralCorrelates: 'Worry, rumination, indecision, perfectionism, ritualistic behavior, sleep disturbance.',
  },
  {
    code: 'Sc',
    name: 'Schizophrenia',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Feelings of alienation, unusual thought processes, and social withdrawal. May feel misunderstood or fundamentally different. Difficulties in concentration and abstract thinking. Emotional flatness or inappropriate affect.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Severe alienation with possible thought disorder. May endorse unusual perceptions, bizarre ideation, or feelings of unreality. Significant social impairment. Confused and disorganized thinking.',
    },
    behavioralCorrelates: 'Social isolation, unusual beliefs or perceptions, flat affect, cognitive disorganization, difficulty with reality testing.',
  },
  {
    code: 'Ma',
    name: 'Hypomania',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Elevated mood, increased activity, and grandiosity. Talkative, energetic, and impulsive. May overcommit and have difficulty following through. Restless and easily bored.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Possible manic or hypomanic episode. Racing thoughts, pressured speech, poor judgment. Grandiose plans without realistic assessment. May engage in risky behavior. Agitation if frustrated.',
    },
    behavioralCorrelates: 'Excessive activity, reduced sleep need, grandiosity, rapid speech, impulsive spending or behavior.',
  },
  {
    code: 'Si',
    name: 'Social Introversion',
    moderate: {
      label: 'Clinically Elevated (T 65-79)',
      description: 'Socially introverted, shy, and reserved. Prefers solitary activities. May feel uncomfortable in social situations. Tends to be modest and self-effacing.',
    },
    marked: {
      label: 'Marked Elevation (T 80+)',
      description: 'Extreme social withdrawal and isolation. Avoids interpersonal contact. May be seen as aloof or distant. Significant impairment in social functioning. Very low self-esteem in social contexts.',
    },
    behavioralCorrelates: 'Social avoidance, few close relationships, discomfort in groups, preference for routine.',
  },
];

export const CONTENT_SCALE_INTERPRETATIONS: ScaleInterpretation[] = [
  {
    code: 'ANX', name: 'Anxiety',
    moderate: { label: 'T 65-79', description: 'Generalized anxiety, tension, and worry. Somatic symptoms of anxiety (nervousness, sleep difficulties). Reports feeling overwhelmed.' },
    marked: { label: 'T 80+', description: 'Severe anxiety with pervasive worry and physical tension. May be functionally impaired by anxiety symptoms.' },
    behavioralCorrelates: 'Restlessness, sleep disturbance, tension, worry.',
  },
  {
    code: 'FRS', name: 'Fears',
    moderate: { label: 'T 65-79', description: 'Multiple specific fears. May be somewhat phobic. Fears may limit activity.' },
    marked: { label: 'T 80+', description: 'Numerous and intense fears. Significant avoidance behavior. May meet criteria for specific phobia or agoraphobia.' },
    behavioralCorrelates: 'Avoidance behavior, specific fears, anxiety in feared situations.',
  },
  {
    code: 'OBS', name: 'Obsessiveness',
    moderate: { label: 'T 65-79', description: 'Difficulty making decisions. Ruminative and worried. May have intrusive thoughts. Excessive worry about minor issues.' },
    marked: { label: 'T 80+', description: 'Severe indecision and rumination. May have obsessions or compulsions. Overwhelmed by intrusive thoughts.' },
    behavioralCorrelates: 'Indecision, rumination, counting or checking behaviors.',
  },
  {
    code: 'DEP', name: 'Depression',
    moderate: { label: 'T 65-79', description: 'Significant depressive symptoms. Sadness, fatigue, and hopelessness. Self-critical and dissatisfied with life.' },
    marked: { label: 'T 80+', description: 'Severe depression with pervasive hopelessness. May endorse suicidal ideation. Profound fatigue and anhedonia.' },
    behavioralCorrelates: 'Crying, withdrawal, fatigue, loss of interest, suicidal thoughts.',
  },
  {
    code: 'HEA', name: 'Health Concerns',
    moderate: { label: 'T 65-79', description: 'Multiple physical symptoms across body systems. Preoccupied with health and illness.' },
    marked: { label: 'T 80+', description: 'Extensive somatic complaints. May be functionally impaired by health preoccupation.' },
    behavioralCorrelates: 'Frequent medical visits, symptom focus, functional limitations.',
  },
  {
    code: 'BIZ', name: 'Bizarre Mentation',
    moderate: { label: 'T 65-79', description: 'Unusual thoughts or perceptions. May endorse psychotic-like experiences. Feeling that something is wrong with thinking.' },
    marked: { label: 'T 80+', description: 'Clearly unusual ideation. May include hallucinations, delusions, or paranoid thinking. Evaluate for psychotic process.' },
    behavioralCorrelates: 'Unusual beliefs, perceptual disturbances, paranoid ideation.',
  },
  {
    code: 'ANG', name: 'Anger',
    moderate: { label: 'T 65-79', description: 'Anger management difficulties. Irritable, impatient, and easily annoyed. May have hostile feelings toward others.' },
    marked: { label: 'T 80+', description: 'Severe anger control problems. May break things or assault others. Explosive temper. Feels misunderstood and mistreated.' },
    behavioralCorrelates: 'Verbal outbursts, physical aggression, irritability.',
  },
  {
    code: 'CYN', name: 'Cynicism',
    moderate: { label: 'T 65-79', description: 'Mistrusts others\' motives. Believes people are dishonest and self-serving. Guarded in relationships.' },
    marked: { label: 'T 80+', description: 'Pervasive distrust and misanthropy. Expects the worst from everyone. Isolated and suspicious.' },
    behavioralCorrelates: 'Distrust, guardedness, difficulty forming relationships.',
  },
  {
    code: 'ASP', name: 'Antisocial Practices',
    moderate: { label: 'T 65-79', description: 'History of rule-breaking or antisocial behavior. Enjoys risk-taking. May have had legal problems.' },
    marked: { label: 'T 80+', description: 'Significant antisocial attitudes and behaviors. Stealing, lying, or exploiting others. Poor moral reasoning.' },
    behavioralCorrelates: 'Rule violations, legal problems, manipulation, risk-taking.',
  },
  {
    code: 'TPA', name: 'Type A',
    moderate: { label: 'T 65-79', description: 'Driven, competitive, and time-pressured. Impatient with others. Works excessively.' },
    marked: { label: 'T 80+', description: 'Extreme drivenness with hostile competitiveness. May become aggressive when frustrated. Workaholic patterns.' },
    behavioralCorrelates: 'Overwork, impatience, competitiveness, hostility.',
  },
  {
    code: 'LSE', name: 'Low Self-Esteem',
    moderate: { label: 'T 65-79', description: 'Negative self-concept. Feels inadequate and inferior to others. Self-critical and lacking confidence.' },
    marked: { label: 'T 80+', description: 'Extremely poor self-regard. Overwhelmed by feelings of worthlessness. May feel unable to change.' },
    behavioralCorrelates: 'Self-deprecation, passivity, giving up easily, sensitivity to criticism.',
  },
  {
    code: 'SOD', name: 'Social Discomfort',
    moderate: { label: 'T 65-79', description: 'Uncomfortable around others. Prefers being alone. Shy and reserved in social situations.' },
    marked: { label: 'T 80+', description: 'Extreme social discomfort. Avoids groups and social events. Very few friends or social contacts.' },
    behavioralCorrelates: 'Social avoidance, isolation, discomfort in groups.',
  },
  {
    code: 'FAM', name: 'Family Problems',
    moderate: { label: 'T 65-79', description: 'Family discord and conflict. Feels unsupported by family. May have resentment toward family members.' },
    marked: { label: 'T 80+', description: 'Severe family dysfunction. Hatred toward family members. Childhood may have been abusive or neglectful.' },
    behavioralCorrelates: 'Family conflict, estrangement, resentment, childhood difficulties.',
  },
  {
    code: 'WRK', name: 'Work Interference',
    moderate: { label: 'T 65-79', description: 'Attitudes and behaviors likely to impair work performance. Low motivation, difficulty concentrating, poor confidence.' },
    marked: { label: 'T 80+', description: 'Significant work impairment. May be unable to function in occupational role. Feels overwhelmed by responsibilities.' },
    behavioralCorrelates: 'Absenteeism, poor concentration, lack of ambition, difficulty with coworkers.',
  },
  {
    code: 'TRT', name: 'Negative Treatment Indicators',
    moderate: { label: 'T 65-79', description: 'Negative attitudes toward mental health treatment. May feel change is impossible. Reluctant to discuss problems.' },
    marked: { label: 'T 80+', description: 'Strong resistance to treatment. Apathetic about change. May not engage meaningfully in therapy.' },
    behavioralCorrelates: 'Treatment resistance, hopelessness about change, poor engagement.',
  },
];
