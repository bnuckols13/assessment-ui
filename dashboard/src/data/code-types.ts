import type { CodeTypeInfo } from '../lib/types';

// Two-point code type interpretations
// Keys are sorted scale code pairs (e.g., "D-Hs" not "Hs-D")
// Excludes Mf (5) and Si (0) per psychometric convention

export const CODE_TYPES: Record<string, CodeTypeInfo> = {
  // Scale 1-2 / 2-1: Hs-D
  'D-Hs': {
    codes: '1-2 / 2-1',
    label: 'Somatic Depression',
    narrative: 'Individuals with this code type typically present with somatic complaints accompanied by depression, worry, and tension. They tend to be passive, dependent, and experience physical symptoms that may serve as an expression of psychological distress. Pain complaints are common.',
    differentials: 'Major depressive disorder with somatic features, somatic symptom disorder, illness anxiety disorder.',
    treatmentConsiderations: 'Address both somatic and depressive features. Behavioral activation alongside medical workup. May resist psychological explanations for symptoms.',
  },
  // 1-3 / 3-1: Hs-Hy
  'Hs-Hy': {
    codes: '1-3 / 3-1',
    label: 'Conversion Valley',
    narrative: 'Classic "conversion V" pattern. Somatic complaints with histrionic features. These individuals tend to develop physical symptoms under stress but maintain a relatively positive outlook. La belle indifference may be present. Denial of psychological problems is common.',
    differentials: 'Conversion disorder, somatic symptom disorder, factitious disorder.',
    treatmentConsiderations: 'Build rapport before exploring psychological factors. Avoid direct confrontation of symptom legitimacy. Gradual insight work.',
  },
  // 1-4 / 4-1: Hs-Pd
  'Hs-Pd': {
    codes: '1-4 / 4-1',
    label: 'Somatic + Antisocial',
    narrative: 'Combination of somatic complaints with social nonconformity and acting-out potential. May use health complaints manipulatively. History of interpersonal conflict is common. Poor treatment prognosis if both are markedly elevated.',
    differentials: 'Antisocial personality features with somatic concerns, malingering in forensic context.',
    treatmentConsiderations: 'Establish clear treatment contract. Monitor secondary gain from symptoms. Consistent boundaries are essential.',
  },
  // 2-3 / 3-2: D-Hy
  'D-Hy': {
    codes: '2-3 / 3-2',
    label: 'Depressive + Histrionic',
    narrative: 'Depression with a need for approval and attention. These individuals feel inadequate but try to maintain a socially acceptable facade. Somatic symptoms may be present. They often feel helpless and look to others for support and direction.',
    differentials: 'Persistent depressive disorder, dependent personality features, adjustment disorder.',
    treatmentConsiderations: 'Supportive therapy initially. May benefit from interpersonal therapy. Watch for excessive dependence on therapist.',
  },
  // 2-4 / 4-2: D-Pd
  'D-Pd': {
    codes: '2-4 / 4-2',
    label: 'Depression + Impulsivity',
    narrative: 'Depression combined with antisocial features and impulsivity. Often presents after getting into trouble. May experience genuine remorse but has difficulty sustaining behavioral change. Substance use is common in this pattern.',
    differentials: 'Substance use disorders, borderline personality features, antisocial personality with depression.',
    treatmentConsiderations: 'Assess substance use thoroughly. Address impulsivity with DBT skills. Depression may be reactive to consequences of behavior.',
  },
  // 2-7 / 7-2: D-Pt
  'D-Pt': {
    codes: '2-7 / 7-2',
    label: 'Depression + Anxiety',
    narrative: 'One of the most common clinical code types. Pronounced depression with anxiety, rumination, and self-doubt. These individuals are distressed, guilt-prone, and perfectionistic. They tend to internalize problems and are often good candidates for psychotherapy.',
    differentials: 'Major depressive disorder with anxious distress, generalized anxiety disorder, OCD.',
    treatmentConsiderations: 'Generally good treatment prognosis. Respond well to CBT and insight-oriented approaches. May need medication for acute symptom relief.',
  },
  // 2-8 / 8-2: D-Sc
  'D-Sc': {
    codes: '2-8 / 8-2',
    label: 'Depression + Thought Disturbance',
    narrative: 'Severe distress with possible thought disorder features. These individuals may experience cognitive confusion, social withdrawal, and unusual thinking alongside depressive symptoms. When highly elevated, evaluate for psychotic depression or schizoaffective features.',
    differentials: 'Schizoaffective disorder depressive type, psychotic depression, schizophrenia with prominent negative symptoms.',
    treatmentConsiderations: 'Psychiatric evaluation recommended. May need antipsychotic medication. Structured therapeutic approach. Safety assessment is important.',
  },
  // 2-9 / 9-2: D-Ma
  'D-Ma': {
    codes: '2-9 / 9-2',
    label: 'Depression + Hypomania',
    narrative: 'Mixed mood presentation with alternating or concurrent depressive and manic features. May present as agitated depression or mixed bipolar state. Emotional volatility is common. Self-destructive behavior risk during mixed states.',
    differentials: 'Bipolar disorder mixed features, cyclothymia, agitated depression.',
    treatmentConsiderations: 'Mood stabilizer evaluation. Assess bipolar spectrum carefully. Antidepressant monotherapy may worsen mixed states.',
  },
  // 3-4 / 4-3: Hy-Pd
  'Hy-Pd': {
    codes: '3-4 / 4-3',
    label: 'Passive-Aggressive',
    narrative: 'Chronic anger with poor emotional expression. These individuals suppress hostility and then express it indirectly or in episodic outbursts. May appear controlled but have difficulty managing frustration. Interpersonal relationships are often conflictual.',
    differentials: 'Intermittent explosive features, passive-aggressive personality pattern, emotional dysregulation.',
    treatmentConsiderations: 'Anger management and emotional expression skills. Assertiveness training. Long-term personality work may be needed.',
  },
  // 4-6 / 6-4: Pd-Pa
  'Pa-Pd': {
    codes: '4-6 / 6-4',
    label: 'Angry + Suspicious',
    narrative: 'Hostility, suspiciousness, and interpersonal sensitivity. These individuals feel mistreated and blame others for their problems. Argumentative and resentful. May have difficulty forming trusting therapeutic relationships.',
    differentials: 'Paranoid personality features, antisocial personality with paranoid features, trauma-related hypervigilance.',
    treatmentConsiderations: 'Slow trust-building essential. Avoid power struggles. Transparent therapeutic frame. May benefit from examining attribution biases.',
  },
  // 4-7 / 7-4: Pd-Pt
  'Pd-Pt': {
    codes: '4-7 / 7-4',
    label: 'Acting Out + Guilt',
    narrative: 'Cyclical pattern of impulsive behavior followed by guilt and self-criticism. These individuals know their behavior is problematic but struggle to change. May present with addictive behaviors. The anxiety component can serve as a motivator for treatment.',
    differentials: 'Borderline personality features, substance use with comorbid anxiety, ADHD with anxiety.',
    treatmentConsiderations: 'The guilt/anxiety can be leveraged therapeutically. Address the behavioral cycle. DBT or schema therapy may be beneficial.',
  },
  // 4-8 / 8-4: Pd-Sc
  'Pd-Sc': {
    codes: '4-8 / 8-4',
    label: 'Alienated + Unconventional',
    narrative: 'Social alienation with unconventional or bizarre behavior. Poor judgment and unpredictable actions. May feel fundamentally different from others. Angry, distrustful, and emotionally unstable. History of erratic relationships is common.',
    differentials: 'Schizotypal personality features, antisocial personality with thought disturbance, substance-induced psychosis.',
    treatmentConsiderations: 'Structured treatment with clear expectations. Monitor for safety. Build alliance gradually. May need psychiatric support.',
  },
  // 4-9 / 9-4: Pd-Ma
  'Ma-Pd': {
    codes: '4-9 / 9-4',
    label: 'Antisocial + Energized',
    narrative: 'High energy combined with disregard for social norms. Impulsive, sensation-seeking, and risk-taking. May be charming but manipulative. Poor long-term planning. Substance use and legal problems are common.',
    differentials: 'Antisocial personality disorder, narcissistic personality features, bipolar disorder with antisocial features.',
    treatmentConsiderations: 'Generally poor prognosis without external motivation. Contingency management may help. Address substance use if present.',
  },
  // 6-8 / 8-6: Pa-Sc
  'Pa-Sc': {
    codes: '6-8 / 8-6',
    label: 'Paranoid + Thought Disorder',
    narrative: 'Paranoid ideation with thought disorder features. May experience persecutory delusions, ideas of reference, or grandiosity. Social withdrawal and angry suspiciousness. One of the more severe code types suggesting significant psychopathology.',
    differentials: 'Paranoid schizophrenia, delusional disorder, schizoaffective disorder.',
    treatmentConsiderations: 'Psychiatric evaluation priority. Antipsychotic medication likely needed. Supportive therapy with low-demand approach. Reality testing without direct confrontation.',
  },
  // 6-9 / 9-6: Pa-Ma
  'Ma-Pa': {
    codes: '6-9 / 9-6',
    label: 'Paranoid + Grandiose',
    narrative: 'Grandiosity combined with suspiciousness. May present as entitled, hostile, and hypervigilant. Pressured speech and racing thoughts with paranoid content. Can be volatile and confrontational.',
    differentials: 'Bipolar disorder with paranoid features, delusional disorder grandiose type, narcissistic personality with paranoid features.',
    treatmentConsiderations: 'Medication evaluation for mood and psychotic features. Non-confrontational approach. Limit-setting may be necessary for safety.',
  },
  // 7-8 / 8-7: Pt-Sc
  'Pt-Sc': {
    codes: '7-8 / 8-7',
    label: 'Anxiety + Thought Disturbance',
    narrative: 'Severe anxiety with possible thought disorder features. Rumination, confusion, and difficulty concentrating. These individuals are distressed and may feel overwhelmed. Turmoil in thinking is prominent. Social withdrawal is common.',
    differentials: 'Severe anxiety disorder with dissociative features, schizoaffective disorder, early psychotic process.',
    treatmentConsiderations: 'Stabilization first. May need combined medication and therapy. Assess reality testing. Structured, supportive approach.',
  },
  // 7-9 / 9-7: Pt-Ma (rare)
  'Ma-Pt': {
    codes: '7-9 / 9-7',
    label: 'Anxious + Activated',
    narrative: 'Anxiety and tension combined with high energy and activity. These individuals may appear driven, perfectionistic, and unable to relax. Agitated and restless. May use activity as a defense against anxiety.',
    differentials: 'Generalized anxiety with hypomanic features, mixed bipolar features, ADHD.',
    treatmentConsiderations: 'Address underlying anxiety. Relaxation training. Assess for bipolar spectrum. Activity scheduling to channel energy productively.',
  },
  // 8-9 / 9-8: Sc-Ma
  'Ma-Sc': {
    codes: '8-9 / 9-8',
    label: 'Thought Disorder + Hyperactivity',
    narrative: 'Bizarre behavior with hyperactivity and emotional lability. May experience grandiose or persecutory ideation with high energy. Unpredictable and disorganized. One of the more serious code types.',
    differentials: 'Bipolar disorder manic with psychotic features, schizoaffective disorder, acute psychotic episode.',
    treatmentConsiderations: 'Immediate psychiatric evaluation. Likely needs hospitalization if acute. Mood stabilizers and antipsychotics. Safety planning.',
  },
  // Additional common patterns
  // 1-2-3 spike (neurotic triad)
  // These are handled as 2-point codes; the third scale provides modifying context

  // 2-0 / 0-2: D-Si
  'D-Si': {
    codes: '2-0 / 0-2',
    label: 'Depressed + Introverted',
    narrative: 'Depression with social withdrawal and isolation. These individuals are shy, insecure, and avoid interpersonal contact. They tend to be overly sensitive to rejection and may have limited social support.',
    differentials: 'Social anxiety disorder with depression, avoidant personality features, persistent depressive disorder.',
    treatmentConsiderations: 'Gradual social exposure. Address cognitive distortions about social evaluation. Group therapy may be beneficial long-term.',
  },
  // 6-7 / 7-6: Pa-Pt (not previously listed)
  'Pa-Pt': {
    codes: '6-7 / 7-6',
    label: 'Suspicious + Anxious',
    narrative: 'Anxiety driven by suspiciousness and interpersonal sensitivity. These individuals worry that others are judging or plotting against them. Hypervigilant and ruminative. May become rigid and defensive under stress.',
    differentials: 'Social anxiety with paranoid features, paranoid personality, PTSD with hypervigilance.',
    treatmentConsiderations: 'Establish trust carefully. Address cognitive biases around threat perception. May benefit from anxiety management techniques.',
  },
  // 1-8 / 8-1: Hs-Sc
  'Hs-Sc': {
    codes: '1-8 / 8-1',
    label: 'Somatic + Thought Disturbance',
    narrative: 'Somatic complaints combined with unusual thinking and alienation. May experience bizarre somatic delusions or unusual body experiences. Social withdrawal alongside health preoccupation. Confused thinking about bodily processes.',
    differentials: 'Somatic delusions, schizophrenia with somatic features, severe somatization.',
    treatmentConsiderations: 'Psychiatric evaluation recommended. Address both somatic and thought disorder features. Medication may be necessary. Avoid reinforcing somatic preoccupation.',
  },
  // 1-6 / 6-1: Hs-Pa
  'Hs-Pa': {
    codes: '1-6 / 6-1',
    label: 'Somatic + Paranoid',
    narrative: 'Physical complaints with suspiciousness and externalized blame. May believe others are responsible for their health problems. Hostile and demanding in medical settings. Resistant to treatment suggestions.',
    differentials: 'Somatic symptom disorder with paranoid features, delusional disorder somatic type.',
    treatmentConsiderations: 'Build trust before challenging somatic attributions. Avoid power struggles. Collaborative treatment planning is essential.',
  },
  // 1-7 / 7-1: Hs-Pt
  'Hs-Pt': {
    codes: '1-7 / 7-1',
    label: 'Somatic + Anxious',
    narrative: 'Physical complaints driven by anxiety and tension. Ruminates about health concerns. Tense, worried, and preoccupied with bodily sensations. May develop obsessive health monitoring behaviors.',
    differentials: 'Health anxiety, somatic symptom disorder with anxiety features, GAD with somatic focus.',
    treatmentConsiderations: 'CBT for health anxiety. Reduce body-scanning behaviors. Address underlying anxiety with relaxation training.',
  },
  // 1-9 / 9-1: Hs-Ma
  'Hs-Ma': {
    codes: '1-9 / 9-1',
    label: 'Somatic + Energized',
    narrative: 'Physical complaints in the context of high energy and agitation. May present with dramatic, shifting somatic concerns. Restless and demanding of medical attention. Symptoms may wax and wane rapidly.',
    differentials: 'Somatic symptom disorder with manic features, agitated medical patient.',
    treatmentConsiderations: 'Set clear boundaries around medical complaints. Assess for bipolar spectrum. Channel energy productively.',
  },
  // 3-6 / 6-3: Hy-Pa
  'Hy-Pa': {
    codes: '3-6 / 6-3',
    label: 'Histrionic + Paranoid',
    narrative: 'Naivety and denial combined with suspiciousness. May alternate between trusting and suspicious stances. Feels misunderstood and resentful but avoids direct confrontation. Passive-aggressive interpersonal style.',
    differentials: 'Mixed personality features, interpersonal sensitivity, somatization with paranoid overlay.',
    treatmentConsiderations: 'Gentle, consistent approach. Build trust slowly. Help develop more direct communication skills.',
  },
  // 3-7 / 7-3: Hy-Pt
  'Hy-Pt': {
    codes: '3-7 / 7-3',
    label: 'Histrionic + Anxious',
    narrative: 'Physical symptoms with anxiety and rumination. These individuals somatize their anxiety and may develop phobias. Seeking reassurance is prominent. May have difficulty identifying emotions behind physical symptoms.',
    differentials: 'Somatic symptom disorder with anxiety, conversion disorder with anxiety features.',
    treatmentConsiderations: 'Emotional awareness training. Gradual exposure to anxiety-provoking situations. Avoid excessive medical reassurance.',
  },
  // 3-8 / 8-3: Hy-Sc
  'Hy-Sc': {
    codes: '3-8 / 8-3',
    label: 'Histrionic + Thought Disturbance',
    narrative: 'Denial and repression combined with unusual thinking. May have bizarre conversion symptoms or unusual dissociative experiences. Emotional shallowness alongside cognitive confusion.',
    differentials: 'Dissociative disorders, conversion disorder with thought disturbance, early psychotic process.',
    treatmentConsiderations: 'Assess reality testing. Rule out dissociative disorders. Supportive, structured approach.',
  },
};

// Also support reverse lookups by creating aliases
// e.g., "Hs-D" and "D-Hs" both resolve
const aliases: Record<string, string> = {};
for (const key of Object.keys(CODE_TYPES)) {
  const [a, b] = key.split('-');
  const reverse = `${b}-${a}`;
  if (!CODE_TYPES[reverse]) {
    aliases[reverse] = key;
  }
}

// Patch aliases into CODE_TYPES for lookup
for (const [alias, canonical] of Object.entries(aliases)) {
  CODE_TYPES[alias] = CODE_TYPES[canonical];
}
