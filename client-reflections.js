/**
 * Client Reflections — Guided reflection generation, safety checks, clinician report builder.
 * Pure functions: (scoringResults, config) → reflection data + clinician JSON
 */

// ─── Google Sheets Webhook ───────────────────────────────────────────────────
// Paste your Google Apps Script web app URL here after deploying.
// See google-apps-script.js for setup instructions.

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxBKOv1BDsrN3ctN_LDkY-Fe0jo9pyOavUBbsG9q4P3RbjluFnjV8T4izn0AgVaoTe7/exec";

// ─── Overall Tone (from profile elevation) ───────────────────────────────────

const TONE_BANDS = [
  {
    min: 75,
    level: "high",
    heading: "We appreciate you sharing openly.",
    message: "Your responses suggest you may be experiencing some significant stress or emotional difficulty right now. This is important information, and we want you to know that support is available. Your provider will review your responses carefully so they can best support you."
  },
  {
    min: 65,
    level: "moderate",
    heading: "Thank you for your honesty.",
    message: "Your responses suggest you may be going through a challenging time. Many people experience periods like this, and it takes courage to acknowledge it. Sharing this with your provider can be a meaningful step forward."
  },
  {
    min: 55,
    level: "mild",
    heading: "Thank you for completing this assessment.",
    message: "Your responses suggest some areas where you may be experiencing mild stress or discomfort. These are worth exploring with your provider, who can help you understand what they mean in the context of your life."
  },
  {
    min: 0,
    level: "normal",
    heading: "Thank you for completing this assessment.",
    message: "Your responses are generally within expected ranges. Your provider will review the complete picture with you and can address any specific concerns you may have."
  }
];

function getOverallTone(profileElevation) {
  if (profileElevation === null) return TONE_BANDS[3]; // default to normal
  for (const band of TONE_BANDS) {
    if (profileElevation >= band.min) return band;
  }
  return TONE_BANDS[3];
}

// ─── Critical Item Group Reflections ─────────────────────────────────────────

const CRITICAL_GROUP_REFLECTIONS = {
  "Acute Anxiety State": "You indicated experiencing some anxiety or worry.",
  "Depressed Suicidal Ideation": "Some of your responses suggest feelings of sadness or hopelessness.",
  "Threatened Assault": "You noted some experiences related to frustration or anger.",
  "Situational Stress Due to Alcoholism": "You mentioned some experiences related to substance use.",
  "Mental Confusion": "You indicated some difficulty with concentration or clarity of thought.",
  "Persecutory Ideas": "You described feeling misunderstood or mistreated by others.",
  "Antisocial Attitude": "Some responses reflect skepticism about social rules or authority.",
  "Family Conflict": "You noted some tension or difficulty in family relationships.",
  "Somatic Symptoms": "You reported some physical health concerns or discomfort.",
  "Sexual Concern and Deviation": "You indicated some concerns related to sexuality or intimacy."
};

// ─── Elevated Clinical Scale Themes (T >= 65) ───────────────────────────────

const CLINICAL_SCALE_THEMES = {
  "Hs": "concern about physical health and bodily symptoms",
  "D":  "feelings of sadness, low energy, or discouragement",
  "Hy": "a tendency to express stress through physical symptoms or by avoiding conflict",
  "Pd": "frustration with rules or expectations, or tension in relationships",
  "Mf": null, // not used for reflection
  "Pa": "sensitivity to how others perceive or treat you",
  "Pt": "worry, tension, or difficulty letting go of concerns",
  "Sc": "feeling different from others or having unusual experiences",
  "Ma": "high energy, restlessness, or taking on many activities at once",
  "Si": "preference for time alone or discomfort in social situations"
};

// Mapping from critical group themes to clinical scale themes for dedup
const THEME_OVERLAP = {
  "Acute Anxiety State": ["Pt"],
  "Depressed Suicidal Ideation": ["D"],
  "Somatic Symptoms": ["Hs", "Hy"],
  "Persecutory Ideas": ["Pa"],
  "Mental Confusion": ["Sc"],
  "Threatened Assault": ["Pd", "Ma"],
};

// ─── Suicidal Ideation Safety Check ──────────────────────────────────────────

const HIGH_RISK_SI_ITEMS = [506, 520, 524];
const DSI_GROUP_NAME = "Depressed Suicidal Ideation";

function checkSuicidalIdeation(scoringResults, formLength) {
  const lastItem = formLength === "short" ? 370 : 567;
  const dsiGroup = scoringResults.criticalItems.find(g => g.name === DSI_GROUP_NAME);

  const result = {
    showCrisisResource: false,
    level: "none",
    endorsedHighRiskCount: 0,
    totalDSIEndorsed: 0,
    highRiskItemsNotAdministered: false,
    endorsedHighRiskItems: []
  };

  if (!dsiGroup || dsiGroup.endorsed.length === 0) return result;

  result.totalDSIEndorsed = dsiGroup.endorsed.length;
  result.showCrisisResource = true; // any DSI endorsement triggers banner

  // Check high-risk items
  const highRiskAdministered = HIGH_RISK_SI_ITEMS.filter(n => n <= lastItem);
  result.highRiskItemsNotAdministered = highRiskAdministered.length < HIGH_RISK_SI_ITEMS.length;

  for (const item of dsiGroup.endorsed) {
    if (HIGH_RISK_SI_ITEMS.includes(item.num)) {
      result.endorsedHighRiskCount++;
      result.endorsedHighRiskItems.push(item.num);
    }
  }

  if (result.endorsedHighRiskCount >= 2) {
    result.level = "high";
  } else if (result.endorsedHighRiskCount === 1) {
    result.level = "moderate";
  } else {
    result.level = "low";
  }

  return result;
}

// ─── Main Reflection Generator ───────────────────────────────────────────────

function generateReflection(scoringResults, formLength) {
  // 1. Overall tone
  const tone = getOverallTone(scoringResults.profileElevation);

  // 2. Critical item reflections
  const criticalReflections = [];
  const coveredScales = new Set();

  for (const group of scoringResults.criticalItems) {
    const reflection = CRITICAL_GROUP_REFLECTIONS[group.name];
    if (reflection) {
      criticalReflections.push(reflection);
      // Track which clinical scale themes are already covered
      const overlaps = THEME_OVERLAP[group.name] || [];
      overlaps.forEach(s => coveredScales.add(s));
    }
  }

  // 3. Elevated clinical scale themes (deduplicated)
  const elevatedThemes = [];
  for (const scale of scoringResults.clinicalScales) {
    if (scale.tScore !== null && scale.tScore >= 65) {
      const theme = CLINICAL_SCALE_THEMES[scale.code];
      if (theme && !coveredScales.has(scale.code)) {
        elevatedThemes.push(theme);
      }
    }
  }

  // 4. Safety check
  const safety = checkSuicidalIdeation(scoringResults, formLength);

  // 5. Determine if there are any themes at all
  const hasThemes = criticalReflections.length > 0 || elevatedThemes.length > 0;

  return {
    tone,
    criticalReflections,
    elevatedThemes,
    safety,
    hasThemes,
    profileLevel: tone.level
  };
}

// ─── Clinician Report Builder ────────────────────────────────────────────────

function buildAnswerString(answers, lastItem) {
  let str = "";
  for (let i = 0; i < lastItem; i++) {
    if (answers[i] === true) str += "T";
    else if (answers[i] === false) str += "F";
    else str += "?";
  }
  return str;
}

function buildClinicianReport(scoringResults, answers, config) {
  const lastItem = config.form === "short" ? 370 : 567;
  const ts = Date.now();
  const safety = checkSuicidalIdeation(scoringResults, config.form);

  return {
    id: `assessment_${ts}`,
    timestamp: new Date(ts).toISOString(),
    client: {
      clientName: config.clientName || "",
      gender: config.gender,
      formLength: config.form,
      identifier: `${config.clientName || "anon"}_${new Date(ts).toISOString().slice(0, 10)}_${ts}`
    },
    scoring: {
      profileElevation: scoringResults.profileElevation,
      counts: scoringResults.counts,
      validityScales: scoringResults.validityScales,
      clinicalScales: scoringResults.clinicalScales,
      contentScales: scoringResults.contentScales,
      supplementaryScales: scoringResults.supplementaryScales,
      inconsistencyResults: scoringResults.inconsistencyResults,
      criticalItems: scoringResults.criticalItems
    },
    safetyFlags: safety,
    answerString: buildAnswerString(answers, lastItem),
    version: scoringResults.version
  };
}

/**
 * Submit the clinician report to Google Sheets (and localStorage fallback).
 * Returns a promise: { ok: true } on success, { ok: false, error } on failure.
 */
async function submitReport(report) {
  // Always save to localStorage as fallback
  try {
    localStorage.setItem(report.id, JSON.stringify(report));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  // POST to Google Sheets webhook
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn("No Google Sheets webhook URL configured — results saved to localStorage only.");
    return { ok: true, method: "localStorage" };
  }

  try {
    const resp = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script web apps require no-cors from browser
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    // no-cors means we can't read the response, but if fetch didn't throw, it was sent
    return { ok: true, method: "sheets" };
  } catch (err) {
    console.warn("Google Sheets submission failed, results saved to localStorage:", err);
    return { ok: false, error: err.message, method: "localStorage" };
  }
}
