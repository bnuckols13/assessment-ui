/**
 * Scoring Data — Scale definitions, transform tables, inconsistency rules, critical items.
 *
 * SCHEMA NOTES
 * ------------
 * - Item numbers are 1-based (matching the booklet).
 * - trueKeyedItems / falseKeyedItems: item numbers scored when answered T / F.
 * - maleTransform / femaleTransform:
 *     If index 0 is a Number  → it is the K-correction multiplier.
 *       correctedRaw = round(kRaw * multiplier + raw)
 *       T-score = array[correctedRaw + 1]
 *     If index 0 is NOT a number (null/"") → no K-correction.
 *       T-score = array[raw + 1]          (the +1 offset is baked in)
 *   Sparse slots (empty string "") mean "out of range / not defined."
 *
 * - isCorrectionScale: true for K — its raw is cached for use by other scales.
 * - isElevationScale: true for the 8 clinical scales used in profile elevation.
 * - criticalOnly: true → no transform table; items appear only in the critical
 *   items report when endorsed in the keyed direction.
 *
 * DATA VERSION: 2025-01 (populate from your licensed source)
 */

// ─── Validity Scales ─────────────────────────────────────────────────────────

const SCALE_CANT_SAY = {
  code: "?",
  name: "cantsay",
  description: "Cannot Say",
  // Scored differently — just count "?" responses in range
};

// ─── Inconsistency Pair Scales ───────────────────────────────────────────────
// Each rule: [itemA, expectedA, itemB, expectedB, delta]
// If answer[itemA] === expectedA AND answer[itemB] === expectedB → add delta to raw.
// baseRaw is the starting accumulator (may be non-zero for TRIN).

const INCONSISTENCY_SCALES = [
  {
    code: "VRIN",
    name: "vrin",
    description: "Variable Response Inconsistency",
    baseRaw: 0,
    rules: [
      [3, "T", 39, "T", 1],
      [3, "F", 39, "F", 1],
      [6, "T", 90, "F", 1],
      [6, "F", 90, "T", 1],
      [9, "T", 56, "F", 1],
      [9, "F", 56, "T", 1],
      [28, "T", 59, "F", 1],
      [28, "F", 59, "T", 1],
      [31, "T", 299, "F", 1],
      [31, "F", 299, "T", 1],
      [32, "T", 316, "F", 1],
      [32, "F", 316, "T", 1],
      [40, "T", 176, "T", 1],
      [40, "F", 176, "F", 1],
      [46, "T", 265, "F", 1],
      [46, "F", 265, "T", 1],
      [48, "T", 184, "T", 1],
      [48, "F", 184, "F", 1],
      [49, "T", 280, "F", 1],
      [49, "F", 280, "T", 1],
      [73, "T", 377, "F", 1],
      [73, "F", 377, "T", 1],
      [81, "T", 284, "F", 1],
      [81, "F", 284, "T", 1],
      [83, "T", 288, "F", 1],
      [83, "F", 288, "T", 1],
      [84, "T", 105, "F", 1],
      [84, "F", 105, "T", 1],
      [86, "T", 359, "F", 1],
      [86, "F", 359, "T", 1],
      [95, "T", 388, "F", 1],
      [95, "F", 388, "T", 1],
      [99, "T", 314, "T", 1],
      [99, "F", 314, "F", 1],
      [125, "T", 195, "T", 1],
      [125, "F", 195, "F", 1],
      [135, "T", 482, "F", 1],
      [135, "F", 482, "T", 1],
      [136, "T", 507, "F", 1],
      [136, "F", 507, "T", 1],
      [152, "T", 464, "T", 1],
      [152, "F", 464, "F", 1],
      [161, "T", 185, "F", 1],
      [161, "F", 185, "T", 1],
      [165, "T", 565, "T", 1],
      [165, "F", 565, "F", 1],
      [166, "T", 268, "F", 1],
      [166, "F", 268, "T", 1],
      [196, "T", 415, "F", 1],
      [196, "F", 415, "T", 1],
      [199, "T", 467, "F", 1],
      [199, "F", 467, "T", 1],
      [262, "T", 275, "T", 1],
      [262, "F", 275, "F", 1],
      [265, "T", 360, "F", 1],
      [265, "F", 360, "T", 1],
      [304, "T", 335, "T", 1],
      [304, "F", 335, "F", 1],
      [309, "T", 402, "F", 1],
      [309, "F", 402, "T", 1],
      [349, "T", 515, "F", 1],
      [349, "F", 515, "T", 1],
      [353, "T", 370, "F", 1],
      [353, "F", 370, "T", 1],
      [364, "T", 554, "F", 1],
      [364, "F", 554, "T", 1],
    ],
    // VRIN T-score lookup: index = raw score, value = T-score
    // maleTransform[raw] = T-score for males
    maleTransform: [
      "",  // raw=0
      34, 35, 37, 38, 40, 42, 43, 45, 47, 48,  // raw 1-10
      50, 52, 53, 55, 57, 58, 60, 62, 63, 65,  // raw 11-20
      67, 71, 77, 83, 89, 95, 101, 107, 113, 120  // raw 21-30
    ],
    femaleTransform: [
      "",  // raw=0
      34, 36, 37, 39, 41, 42, 44, 46, 47, 49,  // raw 1-10
      51, 53, 54, 56, 58, 59, 61, 63, 65, 67,  // raw 11-20
      69, 73, 79, 85, 91, 97, 103, 109, 115, 120  // raw 21-30
    ],
  },
  {
    code: "TRIN",
    name: "trin",
    description: "True Response Inconsistency",
    baseRaw: 9,  // TRIN starts at 9 (bidirectional)
    rules: [
      // T-T pairs add +1
      [3, "T", 39, "T", 1],
      [12, "T", 166, "T", 1],
      [40, "T", 176, "T", 1],
      [48, "T", 184, "T", 1],
      [63, "T", 127, "T", 1],
      [65, "T", 95, "T", 1],
      [73, "T", 239, "T", 1],
      [83, "T", 288, "T", 1],
      [99, "T", 314, "T", 1],
      [125, "T", 195, "T", 1],
      [209, "T", 351, "T", 1],
      [359, "T", 367, "T", 1],
      // F-F pairs add -1
      [3, "F", 39, "F", -1],
      [9, "F", 56, "F", -1],
      [32, "F", 316, "F", -1],
      [46, "F", 265, "F", -1],
      [81, "F", 284, "F", -1],
      [95, "F", 388, "F", -1],
      [152, "F", 464, "F", -1],
      [234, "F", 407, "F", -1],
      [262, "F", 275, "F", -1],
      [304, "F", 335, "F", -1],
    ],
    maleTransform: [
      "", "", "", "",    // raw 0-3
      35, 39, 43, 46, 50, 50, 50, 54, 57, 61,  // raw 4-13
      65, 68, 72, 76, 79, 83, 87, 91, 95, 99  // raw 14-23
    ],
    femaleTransform: [
      "", "", "", "",
      36, 39, 43, 47, 50, 50, 50, 54, 57, 61,
      65, 68, 72, 76, 79, 83, 87, 91, 95, 99
    ],
  },
];

// ─── Validity + Clinical + Content Scales ────────────────────────────────────
// Processing ORDER matters: K must come before K-corrected scales.

const SCALES = [
  // ── Validity ──
  {
    code: "L",
    name: "L",
    description: "Lie",
    category: "validity",
    trueKeyedItems: [],
    falseKeyedItems: [16, 29, 41, 51, 77, 93, 102, 107, 123, 139, 153, 183, 203, 232, 260],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,  // no K multiplier
      33, 36, 39, 42, 45, 48, 51, 54, 57, 60,
      63, 67, 70, 73, 76, 80
    ],
    femaleTransform: [
      null,
      33, 36, 39, 42, 45, 48, 52, 55, 58, 61,
      64, 68, 71, 74, 77, 81
    ],
  },
  {
    code: "F",
    name: "F",
    description: "Infrequency",
    category: "validity",
    trueKeyedItems: [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96, 114, 138, 144, 150, 162, 168, 180, 198, 216, 228, 234, 240, 246, 252, 258, 264, 270, 282, 288, 294, 300, 306, 312, 324, 336, 349, 355, 361],
    falseKeyedItems: [6, 12, 78, 90, 102, 108, 318, 330, 342],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      38, 42, 45, 49, 52, 56, 59, 62, 66, 69,
      73, 76, 80, 83, 86, 90, 93, 97, 100, 103,
      107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
      117, 118, 119, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      null,
      38, 42, 46, 50, 53, 57, 61, 64, 68, 72,
      75, 79, 83, 86, 90, 94, 97, 101, 105, 108,
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "Fb",
    name: "Fb",
    description: "Back F",
    category: "validity",
    trueKeyedItems: [281, 291, 303, 311, 317, 319, 322, 323, 329, 332, 333, 334, 387, 395, 407, 431, 450, 454, 463, 468, 476, 478, 484, 489, 506, 516, 517, 520, 524, 525, 526, 528, 530, 539, 540, 544, 548, 551, 554, 555],
    falseKeyedItems: [],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      40, 44, 49, 53, 57, 61, 65, 70, 74, 78,
      82, 86, 91, 95, 99, 103, 107, 110, 112, 113,
      114, 115, 116, 117, 118, 119, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      null,
      40, 45, 50, 55, 60, 64, 69, 74, 79, 84,
      88, 93, 98, 103, 107, 110, 112, 113, 114, 115,
      116, 117, 118, 119, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "Fp",
    name: "Fp",
    description: "Infrequency-Psychopathology",
    category: "validity",
    trueKeyedItems: [66, 114, 162, 193, 216, 228, 252, 270, 282, 294, 322, 323, 336, 355, 361, 466, 478, 501, 506, 516, 530, 539, 551, 555],
    falseKeyedItems: [51, 77, 90, 93, 102, 108, 192],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      42, 47, 52, 56, 61, 66, 71, 76, 80, 85,
      90, 95, 100, 104, 109, 114, 118, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      null,
      42, 48, 53, 58, 63, 68, 74, 79, 84, 89,
      94, 99, 104, 110, 115, 118, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "K",
    name: "K",
    description: "Correction",
    category: "validity",
    trueKeyedItems: [],
    falseKeyedItems: [29, 37, 58, 76, 83, 90, 116, 130, 148, 157, 167, 171, 196, 213, 243, 267, 284, 290, 330, 338, 339, 341, 346, 365, 375, 377, 382, 389, 411, 415],
    isCorrectionScale: true,
    isElevationScale: false,
    maleTransform: [
      null,
      30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
      50, 52, 54, 56, 58, 60, 62, 63, 65, 67,
      69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89
    ],
    femaleTransform: [
      null,
      30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
      50, 52, 54, 56, 58, 60, 62, 64, 66, 68,
      70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90
    ],
  },
  {
    code: "S",
    name: "S",
    description: "Superlative Self-Presentation",
    category: "validity",
    trueKeyedItems: [49, 78, 108, 139, 148, 160, 165, 192, 232, 318],
    falseKeyedItems: [15, 30, 52, 89, 130, 176, 196, 205, 213, 225, 243, 264, 273, 277, 285, 289, 302, 325, 331, 338, 341, 346, 352, 374, 382, 400, 415, 444, 448, 461, 486, 497, 500, 504, 519, 536, 545, 547, 556, 562],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      28, 30, 31, 33, 34, 36, 37, 39, 40, 42,
      43, 44, 46, 47, 49, 50, 51, 53, 54, 56,
      57, 59, 60, 61, 63, 64, 66, 67, 68, 70,
      71, 73, 74, 76, 77, 78, 80, 81, 83, 84,
      86, 87, 88, 90, 91, 93, 94, 95, 97, 98, 100
    ],
    femaleTransform: [
      null,
      28, 30, 31, 33, 34, 36, 38, 39, 41, 42,
      44, 45, 47, 48, 50, 51, 53, 54, 56, 57,
      59, 60, 62, 63, 65, 66, 67, 69, 70, 72,
      73, 75, 76, 78, 79, 81, 82, 83, 85, 86,
      88, 89, 91, 92, 94, 95, 97, 98, 100, 101, 103
    ],
  },

  // ── Clinical Scales ── (order: Hs through Si)

  {
    code: "Hs",
    name: "Hs",
    description: "Hypochondriasis (Scale 1)",
    category: "clinical",
    trueKeyedItems: [18, 28, 39, 53, 59, 97, 101, 111, 149, 175, 247],
    falseKeyedItems: [2, 3, 8, 10, 20, 45, 47, 57, 91, 117, 141, 143, 152, 164, 173, 176, 179, 181, 194, 204, 224, 249, 255],
    isCorrectionScale: false,
    isElevationScale: true,
    // K-corrected: Hs uses 0.5K
    maleTransform: [
      0.5,   // K multiplier
      28, 30, 33, 35, 38, 40, 43, 45, 47, 50,
      52, 55, 57, 60, 62, 64, 67, 69, 72, 74,
      77, 79, 81, 84, 86, 89, 91, 93, 96, 98,
      101, 103, 106, 108, 110, 113, 115, 118, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      0.5,
      24, 27, 29, 32, 35, 37, 40, 42, 45, 47,
      50, 53, 55, 58, 60, 63, 65, 68, 71, 73,
      76, 78, 81, 83, 86, 89, 91, 94, 96, 99,
      101, 104, 107, 109, 112, 114, 117, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "D",
    name: "D",
    description: "Depression (Scale 2)",
    category: "clinical",
    trueKeyedItems: [5, 15, 18, 31, 38, 39, 46, 56, 73, 92, 117, 127, 130, 146, 147, 170, 175, 181, 215, 233, 243, 263, 273, 277, 289, 301, 305, 339],
    falseKeyedItems: [2, 9, 10, 20, 29, 33, 37, 43, 45, 49, 75, 95, 109, 118, 140, 141, 142, 143, 148, 165, 178, 188, 189, 212, 221, 223, 226, 238, 245, 248, 260, 267, 330],
    isCorrectionScale: false,
    isElevationScale: true,
    maleTransform: [
      null,
      28, 29, 30, 31, 32, 34, 35, 36, 37, 38,
      39, 41, 42, 43, 44, 45, 47, 48, 49, 50,
      51, 52, 54, 55, 56, 57, 58, 60, 61, 62,
      63, 64, 65, 67, 68, 69, 70, 71, 73, 74,
      75, 76, 77, 78, 80, 81, 82, 83, 84, 86,
      87, 88, 89, 90, 91, 93, 94, 95, 96, 97, 99, 100
    ],
    femaleTransform: [
      null,
      24, 26, 27, 28, 30, 31, 32, 34, 35, 36,
      38, 39, 40, 42, 43, 44, 46, 47, 48, 50,
      51, 52, 54, 55, 56, 58, 59, 60, 62, 63,
      64, 66, 67, 68, 70, 71, 72, 74, 75, 76,
      78, 79, 80, 82, 83, 84, 86, 87, 88, 90,
      91, 92, 94, 95, 96, 98, 99, 100, 102, 103, 104, 106
    ],
  },
  {
    code: "Hy",
    name: "Hy",
    description: "Hysteria (Scale 3)",
    category: "clinical",
    trueKeyedItems: [11, 18, 23, 28, 31, 39, 40, 44, 53, 57, 59, 72, 97, 111, 127, 130, 175, 179, 196, 218, 230, 247, 252, 263, 274],
    falseKeyedItems: [2, 3, 7, 8, 9, 10, 14, 26, 29, 45, 49, 58, 76, 83, 91, 95, 98, 110, 115, 116, 135, 141, 142, 152, 164, 173, 176, 188, 190, 223, 243, 249, 253, 263],
    isCorrectionScale: false,
    isElevationScale: true,
    maleTransform: [
      null,
      25, 27, 28, 30, 31, 33, 34, 36, 37, 38,
      40, 41, 43, 44, 46, 47, 48, 50, 51, 53,
      54, 56, 57, 59, 60, 61, 63, 64, 66, 67,
      69, 70, 72, 73, 74, 76, 77, 79, 80, 82,
      83, 84, 86, 87, 89, 90, 92, 93, 95, 96,
      97, 99, 100, 102, 103, 105, 106, 107, 109, 110
    ],
    femaleTransform: [
      null,
      22, 23, 25, 26, 28, 29, 31, 32, 34, 35,
      37, 38, 40, 41, 43, 44, 46, 47, 49, 50,
      52, 53, 55, 56, 58, 59, 61, 62, 64, 65,
      67, 68, 70, 71, 73, 74, 76, 77, 79, 80,
      82, 83, 85, 86, 88, 89, 91, 92, 94, 95,
      97, 98, 100, 101, 103, 104, 106, 107, 109, 110
    ],
  },
  {
    code: "Pd",
    name: "Pd",
    description: "Psychopathic Deviate (Scale 4)",
    category: "clinical",
    trueKeyedItems: [17, 21, 22, 31, 32, 35, 42, 52, 54, 56, 71, 82, 89, 94, 99, 105, 113, 195, 202, 219, 225, 259, 264, 288],
    falseKeyedItems: [9, 12, 34, 70, 79, 83, 95, 122, 125, 129, 143, 157, 158, 160, 167, 171, 185, 209, 214, 217, 226, 243, 261, 263, 266, 267],
    isCorrectionScale: false,
    isElevationScale: true,
    // K-corrected: Pd uses 0.4K
    maleTransform: [
      0.4,
      24, 26, 28, 29, 31, 33, 34, 36, 38, 39,
      41, 43, 44, 46, 48, 49, 51, 53, 54, 56,
      58, 60, 61, 63, 65, 66, 68, 70, 71, 73,
      75, 76, 78, 80, 81, 83, 85, 87, 88, 90,
      92, 93, 95, 97, 98, 100, 102, 103, 105, 107,
      109, 110, 112, 114, 115, 117, 119, 120, 120, 120, 120
    ],
    femaleTransform: [
      0.4,
      23, 25, 27, 28, 30, 32, 33, 35, 37, 38,
      40, 42, 44, 45, 47, 49, 50, 52, 54, 55,
      57, 59, 61, 62, 64, 66, 67, 69, 71, 73,
      74, 76, 78, 79, 81, 83, 85, 86, 88, 90,
      91, 93, 95, 96, 98, 100, 102, 103, 105, 107,
      108, 110, 112, 114, 115, 117, 119, 120, 120, 120, 120
    ],
  },
  {
    code: "Mf",
    name: "Mf",
    description: "Masculinity-Femininity (Scale 5)",
    category: "clinical",
    // Gender-variant: different keyed items by gender
    trueKeyedItemsMale: [4, 25, 62, 64, 67, 74, 80, 112, 119, 122, 128, 137, 166, 177, 187, 191, 196, 205, 209, 219, 236, 251, 256, 268, 271, 274, 276, 277, 287, 292, 300, 340, 344, 351, 359, 371, 384, 392, 395, 397, 426, 432, 435, 438, 441, 447, 453, 455, 458, 462, 467, 470, 473],
    falseKeyedItemsMale: [1, 19, 26, 27, 63, 68, 69, 76, 86, 103, 104, 133, 163, 184, 193, 194, 197, 199, 201, 207, 231, 235, 237, 239, 254, 257, 272, 306, 474],
    trueKeyedItemsFemale: [4, 25, 62, 64, 67, 74, 80, 112, 119, 121, 122, 128, 137, 177, 187, 191, 196, 205, 219, 236, 251, 256, 271, 274, 276, 277, 287, 292, 300, 340, 344, 351, 384, 392, 395, 397, 426, 432, 435, 438, 441, 447, 453, 458, 462, 467, 470, 473],
    falseKeyedItemsFemale: [1, 19, 26, 27, 63, 68, 69, 76, 86, 103, 104, 133, 163, 166, 184, 193, 194, 197, 199, 201, 207, 209, 231, 235, 237, 239, 254, 257, 268, 272, 306, 359, 371, 455, 474],
    get trueKeyedItems() { return []; }, // handled specially in engine
    get falseKeyedItems() { return []; },
    isGenderVariant: true,
    isCorrectionScale: false,
    isElevationScale: false,  // Mf not in standard elevation set
    maleTransform: [
      null,
      26, 27, 29, 30, 31, 33, 34, 36, 37, 38,
      40, 41, 43, 44, 45, 47, 48, 50, 51, 52,
      54, 55, 57, 58, 59, 61, 62, 64, 65, 66,
      68, 69, 71, 72, 73, 75, 76, 78, 79, 80,
      82, 83, 85, 86, 87, 89, 90, 92, 93, 94,
      96, 97, 99, 100, 101, 103, 104, 106, 107, 108,
      110, 111, 112, 113, 115, 116, 117, 118, 119, 120, 120, 120
    ],
    femaleTransform: [
      null,
      78, 77, 75, 74, 73, 71, 70, 68, 67, 66,
      64, 63, 61, 60, 59, 57, 56, 54, 53, 52,
      50, 49, 47, 46, 45, 43, 42, 40, 39, 38,
      36, 35, 33, 32, 31, 29, 28, 26, 25, 24,
      22, 21, 19, 18, 17, 15, 14, 13, 12, 11,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
    ],
  },
  {
    code: "Pa",
    name: "Pa",
    description: "Paranoia (Scale 6)",
    category: "clinical",
    trueKeyedItems: [16, 17, 22, 23, 24, 42, 99, 113, 138, 144, 145, 162, 234, 259, 271, 277, 285, 305, 307, 333, 334, 336, 355, 361],
    falseKeyedItems: [81, 95, 98, 100, 104, 110, 244, 255, 266, 283, 284, 286, 297, 314, 315],
    isCorrectionScale: false,
    isElevationScale: true,
    maleTransform: [
      null,
      30, 33, 35, 38, 40, 43, 46, 48, 51, 53,
      56, 59, 61, 64, 66, 69, 71, 74, 77, 79,
      82, 84, 87, 89, 92, 95, 97, 100, 102, 105,
      107, 110, 113, 115, 118, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      null,
      30, 33, 35, 38, 40, 43, 45, 48, 50, 53,
      55, 58, 60, 63, 66, 68, 71, 73, 76, 78,
      81, 83, 86, 88, 91, 94, 96, 99, 101, 104,
      106, 109, 112, 114, 117, 119, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "Pt",
    name: "Pt",
    description: "Psychasthenia (Scale 7)",
    category: "clinical",
    trueKeyedItems: [11, 16, 23, 31, 38, 56, 65, 73, 82, 89, 94, 116, 125, 130, 147, 170, 175, 196, 218, 233, 243, 263, 273, 275, 277, 285, 289, 301, 302, 304, 305, 317, 321, 325, 326, 327, 328, 339, 351, 364, 442],
    falseKeyedItems: [3, 9, 33, 109, 140, 165, 174, 245, 318, 330, 348, 369, 385, 400, 405, 408, 439, 444, 461, 482, 502],
    isCorrectionScale: false,
    isElevationScale: true,
    // K-corrected: Pt uses 1.0K
    maleTransform: [
      1.0,
      21, 23, 24, 26, 27, 29, 30, 31, 33, 34,
      36, 37, 39, 40, 42, 43, 44, 46, 47, 49,
      50, 52, 53, 55, 56, 57, 59, 60, 62, 63,
      65, 66, 67, 69, 70, 72, 73, 75, 76, 78,
      79, 80, 82, 83, 85, 86, 88, 89, 91, 92,
      93, 95, 96, 98, 99, 101, 102, 103, 105, 106,
      108, 109, 111, 112, 113, 115, 116, 118, 119, 120, 120
    ],
    femaleTransform: [
      1.0,
      18, 20, 21, 23, 24, 26, 27, 29, 30, 32,
      33, 35, 36, 38, 39, 41, 42, 44, 45, 46,
      48, 49, 51, 52, 54, 55, 57, 58, 60, 61,
      63, 64, 66, 67, 69, 70, 71, 73, 74, 76,
      77, 79, 80, 82, 83, 85, 86, 88, 89, 91,
      92, 93, 95, 96, 98, 99, 101, 102, 104, 105,
      107, 108, 110, 111, 112, 114, 115, 117, 118, 120, 120
    ],
  },
  {
    code: "Sc",
    name: "Sc",
    description: "Schizophrenia (Scale 8)",
    category: "clinical",
    trueKeyedItems: [16, 17, 21, 22, 23, 31, 32, 35, 38, 42, 44, 46, 48, 65, 85, 92, 94, 138, 145, 147, 166, 168, 170, 180, 182, 190, 218, 221, 229, 233, 234, 242, 247, 252, 256, 268, 273, 274, 277, 279, 281, 287, 291, 292, 296, 298, 299, 303, 307, 311, 316, 319, 320, 322, 323, 325, 329, 332, 333, 355],
    falseKeyedItems: [6, 9, 12, 34, 90, 91, 106, 165, 177, 179, 192, 210, 255, 276, 278, 280, 290, 295, 343],
    isCorrectionScale: false,
    isElevationScale: true,
    // K-corrected: Sc uses 1.0K
    maleTransform: [
      1.0,
      16, 18, 19, 21, 22, 24, 25, 26, 28, 29,
      31, 32, 33, 35, 36, 38, 39, 40, 42, 43,
      45, 46, 47, 49, 50, 52, 53, 55, 56, 57,
      59, 60, 62, 63, 64, 66, 67, 69, 70, 71,
      73, 74, 76, 77, 78, 80, 81, 83, 84, 85,
      87, 88, 90, 91, 92, 94, 95, 97, 98, 99,
      101, 102, 103, 105, 106, 108, 109, 110, 112, 113,
      115, 116, 117, 119, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
    femaleTransform: [
      1.0,
      13, 15, 16, 18, 19, 21, 22, 23, 25, 26,
      28, 29, 31, 32, 33, 35, 36, 38, 39, 41,
      42, 43, 45, 46, 48, 49, 50, 52, 53, 55,
      56, 58, 59, 60, 62, 63, 65, 66, 67, 69,
      70, 72, 73, 74, 76, 77, 79, 80, 82, 83,
      84, 86, 87, 89, 90, 91, 93, 94, 96, 97,
      98, 100, 101, 103, 104, 106, 107, 108, 110, 111,
      113, 114, 115, 117, 118, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120
    ],
  },
  {
    code: "Ma",
    name: "Ma",
    description: "Hypomania (Scale 9)",
    category: "clinical",
    trueKeyedItems: [13, 15, 21, 23, 50, 55, 61, 85, 87, 98, 113, 122, 131, 145, 155, 168, 169, 182, 190, 200, 205, 206, 211, 212, 218, 220, 227, 229, 238, 242, 244, 248, 250, 253, 269],
    falseKeyedItems: [88, 93, 100, 106, 107, 136, 154, 158, 167, 243, 263],
    isCorrectionScale: false,
    isElevationScale: true,
    // K-corrected: Ma uses 0.2K
    maleTransform: [
      0.2,
      20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
      40, 42, 44, 46, 48, 50, 52, 53, 55, 57,
      59, 61, 63, 65, 67, 69, 71, 73, 75, 77,
      79, 81, 83, 85, 87, 89, 91, 93, 95, 97,
      99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 120
    ],
    femaleTransform: [
      0.2,
      18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
      38, 40, 42, 44, 46, 48, 50, 52, 54, 56,
      58, 60, 62, 64, 66, 68, 70, 72, 74, 76,
      78, 80, 82, 84, 86, 88, 90, 92, 94, 96,
      98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 120
    ],
  },
  {
    code: "Si",
    name: "Si",
    description: "Social Introversion (Scale 0)",
    category: "clinical",
    trueKeyedItems: [31, 46, 56, 70, 100, 104, 110, 127, 135, 158, 161, 167, 185, 215, 243, 251, 265, 275, 284, 289, 296, 302, 308, 326, 337, 338, 347, 348, 349, 351, 352, 357, 358, 364, 367, 368, 369, 372, 375, 376, 378, 379, 380, 381, 382, 390, 391, 393, 394, 396, 399, 400, 409, 415, 420, 421, 424, 441, 443, 446, 448, 450, 451, 455, 457, 458, 460, 463, 464, 469, 480, 482, 486, 497, 500, 504, 515, 517, 519, 521, 531, 547, 549, 553, 555, 558, 559, 562, 564, 565, 566],
    falseKeyedItems: [25, 49, 78, 86, 95, 131, 174, 188, 189, 207, 209, 231, 244, 262, 280, 290, 321, 330, 340, 342, 343, 344, 345, 350, 353, 354, 359, 360, 362, 363, 365, 366, 370, 374, 386, 388, 401, 402, 405, 440, 452, 456, 459, 461, 466, 474, 477, 479, 481, 494, 498, 502, 507, 510, 523, 529, 532, 534, 537, 541, 545, 552, 560, 561],
    isCorrectionScale: false,
    isElevationScale: false,  // Si not in standard 8-scale elevation
    maleTransform: [
      null,
      27, 28, 28, 29, 30, 31, 31, 32, 33, 33,
      34, 35, 36, 36, 37, 38, 38, 39, 40, 41,
      41, 42, 43, 43, 44, 45, 46, 46, 47, 48,
      49, 49, 50, 51, 51, 52, 53, 54, 54, 55,
      56, 56, 57, 58, 59, 59, 60, 61, 62, 62,
      63, 64, 64, 65, 66, 67, 67, 68, 69, 69
    ],
    femaleTransform: [
      null,
      25, 26, 27, 27, 28, 29, 29, 30, 31, 32,
      32, 33, 34, 35, 35, 36, 37, 37, 38, 39,
      40, 40, 41, 42, 43, 43, 44, 45, 45, 46,
      47, 48, 48, 49, 50, 50, 51, 52, 53, 53,
      54, 55, 56, 56, 57, 58, 58, 59, 60, 61,
      61, 62, 63, 64, 64, 65, 66, 66, 67, 68
    ],
  },

  // ── Content Scales ──
  {
    code: "ANX",
    name: "ANX",
    description: "Anxiety",
    category: "content",
    trueKeyedItems: [15, 30, 31, 39, 170, 196, 273, 290, 299, 301, 305, 339, 408, 415, 463, 469, 509, 556],
    falseKeyedItems: [140, 208, 318, 388, 405],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      34, 38, 41, 44, 47, 50, 53, 57, 60, 63,
      66, 69, 72, 76, 79, 82, 85, 88, 91, 95,
      98, 101, 104, 107
    ],
    femaleTransform: [
      null,
      31, 34, 37, 40, 43, 47, 50, 53, 56, 59,
      62, 65, 68, 72, 75, 78, 81, 84, 87, 90,
      94, 97, 100, 103
    ],
  },
  {
    code: "FRS",
    name: "FRS",
    description: "Fears",
    category: "content",
    trueKeyedItems: [154, 317, 322, 329, 334, 392, 395, 397, 435, 438, 441, 447, 453, 458, 468, 471, 555],
    falseKeyedItems: [115, 163, 186, 385, 401, 453, 462],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      34, 38, 41, 44, 48, 51, 54, 58, 61, 64,
      68, 71, 74, 78, 81, 84, 88, 91, 94, 97,
      101, 104, 107, 111
    ],
    femaleTransform: [
      null,
      30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
      60, 63, 66, 69, 72, 75, 78, 81, 84, 87,
      90, 93, 96, 100
    ],
  },
  {
    code: "OBS",
    name: "OBS",
    description: "Obsessiveness",
    category: "content",
    trueKeyedItems: [55, 87, 135, 196, 309, 313, 327, 328, 394, 442, 482, 497, 509, 547, 553],
    falseKeyedItems: [225],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      35, 39, 43, 47, 50, 54, 58, 61, 65, 69,
      73, 76, 80, 84, 87, 91, 95
    ],
    femaleTransform: [
      null,
      33, 37, 40, 44, 48, 51, 55, 59, 62, 66,
      70, 73, 77, 81, 84, 88, 92
    ],
  },
  {
    code: "DEP",
    name: "DEP",
    description: "Depression (Content)",
    category: "content",
    trueKeyedItems: [38, 52, 56, 65, 71, 82, 92, 130, 146, 215, 233, 273, 277, 289, 303, 306, 331, 339, 364, 395, 399, 400, 411, 454, 472, 485, 505, 516, 539, 546, 554],
    falseKeyedItems: [3, 9, 75, 95, 388],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      33, 36, 38, 40, 42, 44, 47, 49, 51, 53,
      55, 57, 60, 62, 64, 66, 68, 71, 73, 75,
      77, 79, 82, 84, 86, 88, 90, 92, 95, 97,
      99, 101, 103, 106, 108, 110, 112
    ],
    femaleTransform: [
      null,
      30, 33, 35, 37, 39, 41, 44, 46, 48, 50,
      52, 55, 57, 59, 61, 63, 65, 68, 70, 72,
      74, 76, 79, 81, 83, 85, 87, 89, 92, 94,
      96, 98, 100, 103, 105, 107, 109
    ],
  },
  {
    code: "HEA",
    name: "HEA",
    description: "Health Concerns",
    category: "content",
    trueKeyedItems: [11, 18, 28, 36, 40, 44, 53, 59, 97, 101, 111, 149, 175, 176, 182, 229, 247, 252, 253, 256, 268, 274, 294, 296, 462, 464],
    falseKeyedItems: [20, 33, 45, 47, 57, 91, 117, 118, 141, 142, 159, 164, 176, 179, 181, 194, 204, 224, 249, 255, 295, 404],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      31, 33, 35, 37, 39, 41, 43, 45, 47, 49,
      51, 52, 54, 56, 58, 60, 62, 64, 66, 68,
      70, 72, 74, 76, 78, 80, 82, 84, 85, 87,
      89, 91, 93, 95, 97, 99, 101, 103, 105, 107,
      109, 111, 113, 115, 117, 119, 120, 120, 120
    ],
    femaleTransform: [
      null,
      28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
      48, 50, 52, 53, 55, 57, 59, 61, 63, 65,
      67, 69, 71, 73, 75, 77, 79, 81, 83, 84,
      86, 88, 90, 92, 94, 96, 98, 100, 102, 104,
      106, 108, 110, 112, 114, 116, 118, 120, 120
    ],
  },
  {
    code: "BIZ",
    name: "BIZ",
    description: "Bizarre Mentation",
    category: "content",
    trueKeyedItems: [24, 32, 60, 96, 138, 162, 198, 228, 259, 298, 311, 316, 319, 333, 336, 355, 361, 466, 490, 508, 543, 551],
    falseKeyedItems: [427],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      40, 44, 49, 53, 58, 62, 67, 71, 75, 80,
      84, 89, 93, 97, 102, 106, 111, 115, 119, 120,
      120, 120, 120, 120
    ],
    femaleTransform: [
      null,
      41, 46, 51, 56, 61, 66, 71, 76, 81, 86,
      90, 95, 100, 105, 110, 115, 119, 120, 120, 120,
      120, 120, 120, 120
    ],
  },
  {
    code: "ANG",
    name: "ANG",
    description: "Anger",
    category: "content",
    trueKeyedItems: [29, 37, 116, 134, 302, 389, 410, 414, 430, 461, 486, 507, 513, 540, 542, 548],
    falseKeyedItems: [],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      36, 39, 43, 46, 49, 53, 56, 59, 63, 66,
      69, 73, 76, 79, 83, 86, 90
    ],
    femaleTransform: [
      null,
      34, 38, 41, 45, 48, 52, 55, 59, 62, 66,
      69, 73, 76, 80, 83, 87, 90
    ],
  },
  {
    code: "CYN",
    name: "CYN",
    description: "Cynicism",
    category: "content",
    trueKeyedItems: [50, 58, 76, 81, 104, 110, 124, 225, 241, 254, 283, 284, 286, 315, 346, 352, 358, 374, 399, 403, 445, 470, 538],
    falseKeyedItems: [],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      28, 31, 33, 36, 38, 40, 43, 45, 48, 50,
      52, 55, 57, 60, 62, 64, 67, 69, 72, 74,
      76, 79, 81, 84
    ],
    femaleTransform: [
      null,
      28, 31, 34, 36, 39, 42, 44, 47, 50, 52,
      55, 57, 60, 63, 65, 68, 71, 73, 76, 78,
      81, 84, 86, 89
    ],
  },
  {
    code: "ASP",
    name: "ASP",
    description: "Antisocial Practices",
    category: "content",
    trueKeyedItems: [26, 35, 66, 81, 84, 104, 105, 110, 123, 227, 240, 248, 250, 254, 269, 283, 284, 374, 412, 418, 419],
    falseKeyedItems: [266],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      30, 33, 36, 39, 42, 44, 47, 50, 53, 56,
      58, 61, 64, 67, 70, 72, 75, 78, 81, 84,
      86, 89, 92
    ],
    femaleTransform: [
      null,
      29, 32, 36, 39, 42, 45, 49, 52, 55, 58,
      62, 65, 68, 71, 75, 78, 81, 84, 88, 91,
      94, 97, 101
    ],
  },
  {
    code: "TPA",
    name: "TPA",
    description: "Type A",
    category: "content",
    trueKeyedItems: [27, 136, 151, 212, 302, 358, 414, 419, 420, 423, 430, 437, 507, 510, 523, 531, 535, 541, 545],
    falseKeyedItems: [],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
      60, 63, 66, 69, 72, 75, 78, 81, 84, 87
    ],
    femaleTransform: [
      null,
      30, 34, 37, 40, 44, 47, 50, 54, 57, 60,
      64, 67, 70, 74, 77, 80, 84, 87, 90, 94
    ],
  },
  {
    code: "LSE",
    name: "LSE",
    description: "Low Self-Esteem",
    category: "content",
    trueKeyedItems: [70, 73, 130, 235, 326, 369, 376, 377, 380, 411, 421, 450, 457, 476, 483, 485, 503, 504, 519, 526, 562],
    falseKeyedItems: [61, 78, 109],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      36, 39, 42, 45, 48, 51, 54, 57, 60, 63,
      66, 69, 72, 75, 78, 81, 84, 87, 90, 93,
      96, 99, 102, 105, 108
    ],
    femaleTransform: [
      null,
      34, 37, 40, 43, 46, 49, 52, 55, 58, 61,
      64, 67, 70, 73, 76, 79, 82, 85, 88, 91,
      94, 97, 100, 103, 106
    ],
  },
  {
    code: "SOD",
    name: "SOD",
    description: "Social Discomfort",
    category: "content",
    trueKeyedItems: [46, 158, 167, 185, 243, 265, 275, 289, 337, 349, 367, 375, 480, 515],
    falseKeyedItems: [49, 86, 262, 280, 321, 340, 353, 359, 360, 370],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      31, 34, 36, 39, 41, 44, 46, 49, 51, 54,
      57, 59, 62, 64, 67, 69, 72, 74, 77, 79,
      82, 85, 87, 90, 92
    ],
    femaleTransform: [
      null,
      29, 32, 34, 37, 39, 42, 44, 47, 49, 52,
      54, 57, 59, 62, 64, 67, 69, 72, 74, 77,
      79, 82, 84, 87, 89
    ],
  },
  {
    code: "FAM",
    name: "FAM",
    description: "Family Problems",
    category: "content",
    trueKeyedItems: [21, 54, 145, 190, 195, 202, 205, 256, 292, 300, 323, 378, 379, 382, 413, 449, 478, 543, 550],
    falseKeyedItems: [83, 125, 217, 383, 455],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      32, 35, 38, 41, 44, 47, 50, 53, 56, 59,
      62, 65, 68, 71, 74, 77, 80, 83, 86, 89,
      92, 95, 98, 101, 104
    ],
    femaleTransform: [
      null,
      31, 34, 37, 39, 42, 45, 47, 50, 53, 55,
      58, 61, 63, 66, 69, 71, 74, 77, 79, 82,
      85, 87, 90, 93, 95
    ],
  },
  {
    code: "WRK",
    name: "WRK",
    description: "Work Interference",
    category: "content",
    trueKeyedItems: [15, 17, 31, 54, 73, 98, 135, 233, 243, 299, 302, 318, 339, 364, 368, 394, 409, 428, 445, 464, 491, 497, 500, 502, 505, 509, 517, 525, 545, 554, 559, 566],
    falseKeyedItems: [10, 108, 318, 521, 561],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
      50, 52, 54, 56, 58, 60, 62, 64, 66, 68,
      70, 72, 74, 76, 78, 80, 82, 84, 86, 88,
      90, 92, 94, 96, 98, 100, 102, 104
    ],
    femaleTransform: [
      null,
      28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
      48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
      68, 70, 72, 74, 76, 78, 80, 82, 84, 86,
      88, 90, 92, 94, 96, 98, 100, 102
    ],
  },
  {
    code: "TRT",
    name: "TRT",
    description: "Negative Treatment Indicators",
    category: "content",
    trueKeyedItems: [22, 92, 274, 306, 364, 368, 373, 376, 377, 391, 399, 482, 488, 491, 495, 497, 499, 500, 504, 528, 539, 554],
    falseKeyedItems: [493, 494, 501],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      36, 39, 42, 45, 48, 51, 55, 58, 61, 64,
      67, 70, 74, 77, 80, 83, 86, 89, 92, 96,
      99, 102, 105, 108, 111, 114
    ],
    femaleTransform: [
      null,
      34, 37, 40, 43, 46, 49, 53, 56, 59, 62,
      65, 68, 71, 75, 78, 81, 84, 87, 90, 93,
      97, 100, 103, 106, 109, 112
    ],
  },
];


// ─── Critical Items ──────────────────────────────────────────────────────────
// Koss-Butcher & Lachar-Wrobel critical item sets
// Each group: name, items with keyed direction

const CRITICAL_ITEM_GROUPS = [
  {
    name: "Acute Anxiety State",
    items: [
      { num: 5, keyed: "T" },
      { num: 15, keyed: "T" },
      { num: 28, keyed: "T" },
      { num: 39, keyed: "T" },
      { num: 59, keyed: "T" },
      { num: 172, keyed: "T" },
      { num: 218, keyed: "T" },
      { num: 223, keyed: "F" },
      { num: 301, keyed: "T" },
      { num: 444, keyed: "T" },
      { num: 463, keyed: "T" },
      { num: 469, keyed: "T" },
    ]
  },
  {
    name: "Depressed Suicidal Ideation",
    items: [
      { num: 38, keyed: "T" },
      { num: 65, keyed: "T" },
      { num: 71, keyed: "T" },
      { num: 75, keyed: "F" },
      { num: 92, keyed: "T" },
      { num: 95, keyed: "F" },
      { num: 130, keyed: "T" },
      { num: 146, keyed: "T" },
      { num: 215, keyed: "T" },
      { num: 233, keyed: "T" },
      { num: 273, keyed: "T" },
      { num: 303, keyed: "T" },
      { num: 306, keyed: "T" },
      { num: 388, keyed: "F" },
      { num: 411, keyed: "T" },
      { num: 454, keyed: "T" },
      { num: 485, keyed: "T" },
      { num: 506, keyed: "T" },
      { num: 516, keyed: "T" },
      { num: 520, keyed: "T" },
      { num: 524, keyed: "T" },
    ]
  },
  {
    name: "Threatened Assault",
    items: [
      { num: 37, keyed: "T" },
      { num: 85, keyed: "T" },
      { num: 134, keyed: "T" },
      { num: 150, keyed: "T" },
      { num: 324, keyed: "T" },
      { num: 381, keyed: "T" },
      { num: 513, keyed: "T" },
      { num: 542, keyed: "T" },
      { num: 548, keyed: "T" },
    ]
  },
  {
    name: "Situational Stress Due to Alcoholism",
    items: [
      { num: 264, keyed: "T" },
      { num: 387, keyed: "T" },
      { num: 489, keyed: "T" },
      { num: 502, keyed: "F" },
      { num: 511, keyed: "T" },
      { num: 527, keyed: "T" },
      { num: 544, keyed: "T" },
    ]
  },
  {
    name: "Mental Confusion",
    items: [
      { num: 31, keyed: "T" },
      { num: 32, keyed: "T" },
      { num: 72, keyed: "T" },
      { num: 96, keyed: "T" },
      { num: 180, keyed: "T" },
      { num: 198, keyed: "T" },
      { num: 229, keyed: "T" },
      { num: 299, keyed: "T" },
      { num: 311, keyed: "T" },
      { num: 316, keyed: "T" },
      { num: 325, keyed: "T" },
    ]
  },
  {
    name: "Persecutory Ideas",
    items: [
      { num: 17, keyed: "T" },
      { num: 42, keyed: "T" },
      { num: 99, keyed: "T" },
      { num: 124, keyed: "T" },
      { num: 138, keyed: "T" },
      { num: 144, keyed: "T" },
      { num: 145, keyed: "T" },
      { num: 162, keyed: "T" },
      { num: 216, keyed: "T" },
      { num: 228, keyed: "T" },
      { num: 241, keyed: "T" },
      { num: 251, keyed: "T" },
      { num: 259, keyed: "T" },
      { num: 314, keyed: "F" },
      { num: 333, keyed: "T" },
      { num: 361, keyed: "T" },
    ]
  },
  {
    name: "Antisocial Attitude",
    items: [
      { num: 27, keyed: "T" },
      { num: 35, keyed: "T" },
      { num: 84, keyed: "T" },
      { num: 105, keyed: "T" },
      { num: 227, keyed: "T" },
      { num: 240, keyed: "T" },
      { num: 266, keyed: "F" },
      { num: 324, keyed: "T" },
    ]
  },
  {
    name: "Family Conflict",
    items: [
      { num: 21, keyed: "T" },
      { num: 83, keyed: "F" },
      { num: 125, keyed: "F" },
      { num: 195, keyed: "T" },
      { num: 202, keyed: "T" },
      { num: 288, keyed: "T" },
      { num: 382, keyed: "T" },
      { num: 478, keyed: "T" },
    ]
  },
  {
    name: "Somatic Symptoms",
    items: [
      { num: 18, keyed: "T" },
      { num: 28, keyed: "T" },
      { num: 36, keyed: "T" },
      { num: 40, keyed: "T" },
      { num: 44, keyed: "T" },
      { num: 53, keyed: "T" },
      { num: 57, keyed: "F" },
      { num: 59, keyed: "T" },
      { num: 97, keyed: "T" },
      { num: 101, keyed: "T" },
      { num: 111, keyed: "T" },
      { num: 142, keyed: "F" },
      { num: 159, keyed: "F" },
      { num: 164, keyed: "F" },
      { num: 175, keyed: "T" },
      { num: 176, keyed: "F" },
      { num: 247, keyed: "T" },
      { num: 249, keyed: "F" },
      { num: 255, keyed: "F" },
    ]
  },
  {
    name: "Sexual Concern and Deviation",
    items: [
      { num: 12, keyed: "F" },
      { num: 34, keyed: "F" },
      { num: 62, keyed: "T" },
      { num: 121, keyed: "F" },
      { num: 166, keyed: "T" },
      { num: 268, keyed: "T" },
    ]
  },
];


// ─── Supplementary Scales (commonly reported) ────────────────────────────────

const SUPPLEMENTARY_SCALES = [
  {
    code: "A",
    name: "A",
    description: "Anxiety (Welsh)",
    category: "supplementary",
    trueKeyedItems: [31, 38, 56, 65, 82, 127, 135, 215, 233, 243, 251, 273, 277, 289, 301, 309, 310, 311, 325, 328, 338, 339, 341, 347, 390, 391, 394, 400, 408, 411, 415, 442, 448, 451, 464, 469],
    falseKeyedItems: [388],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      30, 32, 34, 36, 37, 39, 41, 43, 44, 46,
      48, 50, 51, 53, 55, 57, 59, 60, 62, 64,
      66, 67, 69, 71, 73, 74, 76, 78, 80, 82,
      83, 85, 87, 89, 90, 92, 94, 96
    ],
    femaleTransform: [
      null,
      29, 30, 32, 34, 36, 37, 39, 41, 43, 44,
      46, 48, 50, 51, 53, 55, 57, 59, 60, 62,
      64, 66, 67, 69, 71, 73, 74, 76, 78, 80,
      82, 83, 85, 87, 89, 90, 92, 94
    ],
  },
  {
    code: "R",
    name: "R",
    description: "Repression (Welsh)",
    category: "supplementary",
    trueKeyedItems: [],
    falseKeyedItems: [1, 7, 10, 14, 37, 41, 69, 112, 116, 120, 128, 134, 142, 168, 178, 189, 197, 199, 248, 255, 256, 297, 330, 340, 342, 344, 345, 350, 353, 354, 359, 363, 365, 422, 423, 430, 432, 449, 456, 465],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      26, 28, 30, 32, 33, 35, 37, 38, 40, 42,
      43, 45, 47, 48, 50, 52, 54, 55, 57, 59,
      60, 62, 64, 65, 67, 69, 70, 72, 74, 76,
      77, 79, 81, 82, 84, 86, 87, 89, 91, 93, 94
    ],
    femaleTransform: [
      null,
      24, 26, 28, 29, 31, 33, 34, 36, 38, 40,
      41, 43, 45, 46, 48, 50, 52, 53, 55, 57,
      58, 60, 62, 63, 65, 67, 69, 70, 72, 74,
      75, 77, 79, 81, 82, 84, 86, 87, 89, 91, 93
    ],
  },
  {
    code: "Es",
    name: "Es",
    description: "Ego Strength",
    category: "supplementary",
    trueKeyedItems: [2, 33, 45, 98, 141, 159, 169, 177, 179, 189, 199, 209, 213, 230, 245, 323, 385, 406, 413, 425],
    falseKeyedItems: [23, 31, 36, 39, 53, 59, 62, 82, 87, 119, 128, 175, 196, 215, 221, 225, 229, 236, 282, 303, 313, 339, 364, 390, 394, 441, 447, 458, 464, 469, 471, 482],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      20, 21, 23, 24, 26, 27, 29, 30, 32, 33,
      35, 36, 37, 39, 40, 42, 43, 45, 46, 48,
      49, 51, 52, 54, 55, 56, 58, 59, 61, 62,
      64, 65, 67, 68, 69, 71, 72, 74, 75, 77,
      78, 80, 81, 83, 84, 85, 87, 88, 90, 91, 93, 94
    ],
    femaleTransform: [
      null,
      19, 20, 22, 23, 25, 27, 28, 30, 31, 33,
      34, 36, 37, 39, 40, 42, 43, 45, 47, 48,
      50, 51, 53, 54, 56, 57, 59, 60, 62, 63,
      65, 67, 68, 70, 71, 73, 74, 76, 77, 79,
      80, 82, 84, 85, 87, 88, 90, 91, 93, 94, 96, 97
    ],
  },
  {
    code: "MAC-R",
    name: "MAC-R",
    description: "MacAndrew Alcoholism-Revised",
    category: "supplementary",
    trueKeyedItems: [7, 24, 36, 49, 52, 69, 72, 82, 84, 103, 105, 113, 115, 128, 168, 172, 190, 205, 206, 214, 224, 229, 238, 257, 280, 342, 344, 407, 412, 414, 422, 434, 439, 445, 456, 473, 502, 506, 549],
    falseKeyedItems: [73, 107, 117, 137, 160, 166, 251, 266, 287, 299],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      22, 24, 25, 27, 29, 30, 32, 33, 35, 37,
      38, 40, 42, 43, 45, 46, 48, 50, 51, 53,
      55, 56, 58, 59, 61, 63, 64, 66, 68, 69,
      71, 72, 74, 76, 77, 79, 81, 82, 84, 85,
      87, 89, 90, 92, 94, 95, 97, 98, 100, 102
    ],
    femaleTransform: [
      null,
      20, 22, 24, 25, 27, 29, 30, 32, 34, 35,
      37, 39, 41, 42, 44, 46, 47, 49, 51, 52,
      54, 56, 58, 59, 61, 63, 64, 66, 68, 70,
      71, 73, 75, 76, 78, 80, 82, 83, 85, 87,
      88, 90, 92, 94, 95, 97, 99, 100, 102, 104
    ],
  },
  {
    code: "AAS",
    name: "AAS",
    description: "Addiction Acknowledgement",
    category: "supplementary",
    trueKeyedItems: [172, 264, 288, 362, 387, 429, 474, 487, 489, 511, 527, 544],
    falseKeyedItems: [266],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      36, 41, 46, 51, 56, 60, 65, 70, 75, 80,
      85, 90, 95, 100
    ],
    femaleTransform: [
      null,
      38, 44, 49, 54, 60, 65, 70, 76, 81, 87,
      92, 97, 103, 108
    ],
  },
  {
    code: "APS",
    name: "APS",
    description: "Addiction Potential",
    category: "supplementary",
    trueKeyedItems: [7, 29, 72, 82, 125, 205, 209, 235, 260, 267, 296, 299, 325, 344, 362, 387, 439, 445, 487, 489, 502, 511, 527],
    falseKeyedItems: [4, 43, 76, 107, 120, 130, 174, 188, 190, 264, 266, 312, 337, 340, 429, 455, 467, 474],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
      44, 46, 48, 50, 52, 54, 56, 58, 60, 62,
      64, 66, 68, 70, 72, 74, 76, 78, 80, 82,
      84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104
    ],
    femaleTransform: [
      null,
      24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
      44, 46, 48, 50, 52, 54, 56, 58, 60, 62,
      64, 66, 68, 70, 72, 74, 76, 78, 80, 82,
      84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104
    ],
  },
  {
    code: "MDS",
    name: "MDS",
    description: "Marital Distress",
    category: "supplementary",
    trueKeyedItems: [21, 22, 54, 84, 195, 219, 288, 382, 484, 563],
    falseKeyedItems: [12, 83, 95, 125],
    isCorrectionScale: false,
    isElevationScale: false,
    maleTransform: [
      null,
      34, 38, 43, 47, 51, 56, 60, 64, 69, 73,
      77, 82, 86, 90, 95
    ],
    femaleTransform: [
      null,
      32, 37, 41, 45, 50, 54, 58, 63, 67, 71,
      76, 80, 84, 89, 93
    ],
  },
];


// ─── Export all data ─────────────────────────────────────────────────────────

const SCORING_DATA = {
  version: "2025-01",
  maxItem: 567,
  abbrevItemCount: 370,
  inconsistencyScales: INCONSISTENCY_SCALES,
  scales: SCALES,
  supplementaryScales: SUPPLEMENTARY_SCALES,
  criticalItemGroups: CRITICAL_ITEM_GROUPS,
  elevationScaleNames: ["Hs", "D", "Hy", "Pd", "Pa", "Pt", "Sc", "Ma"],
};
