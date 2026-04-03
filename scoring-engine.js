/**
 * Scoring Engine — Pure functions: (answers, config, data) → results
 *
 * answers: object keyed by 1-based item index, values: true | false | undefined
 *   true  = "T"
 *   false = "F"
 *   undefined = "?" (can't say / skipped)
 *
 * config: { gender: "male"|"female", formLength: "long"|"short" }
 */

function getAnswer(answers, itemNum) {
  if (answers[itemNum - 1] === true) return "T";
  if (answers[itemNum - 1] === false) return "F";
  return "?";
}

// ─── 5.1 Global Counts ──────────────────────────────────────────────────────

function globalCounts(answers, lastItem) {
  let t = 0, f = 0, q = 0;
  for (let i = 1; i <= lastItem; i++) {
    const a = getAnswer(answers, i);
    if (a === "T") t++;
    else if (a === "F") f++;
    else q++;
  }
  return { total: lastItem, trueCount: t, falseCount: f, cantSay: q };
}

// ─── 5.2 Pair-based Inconsistency Scales ─────────────────────────────────────

function scoreInconsistency(answers, gender, pairScales, lastItem) {
  const results = [];
  for (const scale of pairScales) {
    let raw = scale.baseRaw;
    for (const [itemA, expectedA, itemB, expectedB, delta] of scale.rules) {
      if (itemA > lastItem || itemB > lastItem) continue;
      const aA = getAnswer(answers, itemA);
      const aB = getAnswer(answers, itemB);
      if (aA === expectedA && aB === expectedB) {
        raw += delta;
      }
    }
    const transform = gender === "male" ? scale.maleTransform : scale.femaleTransform;
    let tScore = null;
    if (raw >= 0 && raw < transform.length) {
      const val = transform[raw];
      if (val !== "" && val !== null && val !== undefined) tScore = val;
    }
    // Clamp
    if (tScore === null && raw >= transform.length - 1) {
      tScore = 120;
    }

    // TRIN direction suffix
    let direction = "";
    if (scale.name === "trin") {
      if (raw > scale.baseRaw) direction = "T";
      else if (raw < scale.baseRaw) direction = "F";
    }

    results.push({
      code: scale.code,
      name: scale.name,
      description: scale.description,
      raw,
      tScore,
      direction,
      category: "inconsistency",
    });
  }
  return results;
}

// ─── 5.3 Keyed Scale Scoring ─────────────────────────────────────────────────

function scoreKeyedScale(answers, scale, gender, kRaw, lastItem) {
  // Determine keyed items (handle gender-variant scales like Mf)
  let trueKeyed, falseKeyed;
  if (scale.isGenderVariant) {
    trueKeyed = gender === "male" ? scale.trueKeyedItemsMale : scale.trueKeyedItemsFemale;
    falseKeyed = gender === "male" ? scale.falseKeyedItemsMale : scale.falseKeyedItemsFemale;
  } else {
    trueKeyed = scale.trueKeyedItems;
    falseKeyed = scale.falseKeyedItems;
  }

  let raw = 0;
  let nKeyedAnswered = 0;
  const totalKeyed = trueKeyed.length + falseKeyed.length;

  for (const item of trueKeyed) {
    if (item > lastItem) continue;
    const a = getAnswer(answers, item);
    if (a === "T") { raw++; nKeyedAnswered++; }
    else if (a === "F") { nKeyedAnswered++; }
    // "?" does not count toward answered
  }

  for (const item of falseKeyed) {
    if (item > lastItem) continue;
    const a = getAnswer(answers, item);
    if (a === "F") { raw++; nKeyedAnswered++; }
    else if (a === "T") { nKeyedAnswered++; }
  }

  const pctAnswered = totalKeyed > 0 ? Math.round((nKeyedAnswered / totalKeyed) * 100) : 100;

  // Look up T-score from transform table
  const transform = gender === "male" ? scale.maleTransform : scale.femaleTransform;
  let corrected = null;
  let tScore = null;

  if (transform && transform.length > 1) {
    const multiplier = transform[0];
    if (typeof multiplier === "number" && multiplier !== null) {
      // K-corrected scale
      corrected = Math.round((kRaw || 0) * multiplier + raw);
      const idx = corrected + 1;
      if (idx >= 0 && idx < transform.length) {
        const val = transform[idx];
        if (val !== "" && val !== null && val !== undefined) tScore = val;
      }
      // Clamp high
      if (tScore === null && idx >= transform.length) tScore = 120;
    } else {
      // Non-corrected: T = transform[raw + 1]
      const idx = raw + 1;
      if (idx >= 0 && idx < transform.length) {
        const val = transform[idx];
        if (val !== "" && val !== null && val !== undefined) tScore = val;
      }
      if (tScore === null && idx >= transform.length) tScore = 120;
    }
  }

  return {
    code: scale.code,
    name: scale.name,
    description: scale.description,
    category: scale.category,
    raw,
    corrected,
    tScore,
    pctAnswered,
    isElevationScale: scale.isElevationScale,
    isCorrectionScale: scale.isCorrectionScale,
  };
}

// ─── 5.3b Critical Items ─────────────────────────────────────────────────────

function scoreCriticalItems(answers, criticalGroups, questionTexts, lastItem) {
  const results = [];
  for (const group of criticalGroups) {
    const endorsed = [];
    for (const { num, keyed } of group.items) {
      if (num > lastItem) continue;
      const a = getAnswer(answers, num);
      if (a === keyed) {
        endorsed.push({
          num,
          text: questionTexts[num - 1] || `Item ${num}`,
          response: a,
        });
      }
    }
    if (endorsed.length > 0) {
      results.push({
        name: group.name,
        endorsed,
        total: group.items.filter(i => i.num <= lastItem).length,
      });
    }
  }
  return results;
}

// ─── 5.4 Profile Elevation ───────────────────────────────────────────────────

function profileElevation(scaleResults, elevationNames) {
  let sum = 0, count = 0;
  for (const r of scaleResults) {
    if (elevationNames.includes(r.name) && r.tScore !== null) {
      sum += r.tScore;
      count++;
    }
  }
  return count > 0 ? Math.round((sum / count) * 10) / 10 : null;
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

function scoreInstrument(answers, gender, formLength, data, questionTexts) {
  const lastItem = formLength === "short" ? data.abbrevItemCount : data.maxItem;

  // 5.1 Global counts
  const counts = globalCounts(answers, lastItem);

  // 5.2 Inconsistency
  const inconsistencyResults = scoreInconsistency(
    answers, gender, data.inconsistencyScales, lastItem
  );

  // 5.3 Keyed scales (validity + clinical + content + supplementary)
  // Must process K first for K-correction
  let kRaw = 0;
  const allScales = [...data.scales, ...data.supplementaryScales];

  // First pass: find and score K
  for (const scale of allScales) {
    if (scale.isCorrectionScale) {
      const result = scoreKeyedScale(answers, scale, gender, 0, lastItem);
      kRaw = result.raw;
      break;
    }
  }

  // Second pass: score everything
  const scaleResults = [];
  for (const scale of allScales) {
    const result = scoreKeyedScale(answers, scale, gender, kRaw, lastItem);
    scaleResults.push(result);
  }

  // 5.4 Profile elevation
  const elevation = profileElevation(scaleResults, data.elevationScaleNames);

  // 5.3b Critical items
  const criticalItems = scoreCriticalItems(
    answers, data.criticalItemGroups, questionTexts, lastItem
  );

  // Group results by category
  const validityScales = scaleResults.filter(r => r.category === "validity");
  const clinicalScales = scaleResults.filter(r => r.category === "clinical");
  const contentScales = scaleResults.filter(r => r.category === "content");
  const supplementaryScalesResult = scaleResults.filter(r => r.category === "supplementary");

  return {
    version: data.version,
    config: { gender, formLength, lastItem },
    counts,
    inconsistencyResults,
    validityScales,
    clinicalScales,
    contentScales,
    supplementaryScales: supplementaryScalesResult,
    criticalItems,
    profileElevation: elevation,
    allScaleResults: scaleResults,
    timestamp: new Date().toISOString(),
  };
}
