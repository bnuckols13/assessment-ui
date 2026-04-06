# Assessment UI — Standard Operating Procedure

| | |
|---|---|
| **Document** | ASSESS-SOP |
| **Version** | 1.2.0 |
| **Last Updated** | 2026-04-06 |
| **Author** | Brian Nuckols + Claude |
| **Status** | Active — Production |
| **Source of Truth** | `~/assessment-ui/CLAUDE.md` (project), `~/assessment-ui/docs/SOP.md` (operations) |
| **Repo** | github.com/bnuckols13/assessment-ui (public) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.2.0 | 2026-04-06 | Phase 8: Six dashboard enhancements. URL deep links in email (auto-score on click). Validity gating (invalid profiles blur interpretation until override). Content corroboration promoted inline in Brief Step 3 + reordered in Detail. Longitudinal comparison (baseline selection, delta T-scores, dual-line charts). Session View (shared clinician-client screen with discussion prompts). Harris-Lingoes subscale scoring pipeline + conditional display. Three-view system (Brief/Detail/Session). |
| 1.1.0 | 2026-04-06 | Added React clinician dashboard (Phase 7). New interpretive analysis system with validity rules, code types, scale interpretations, content corroboration. Updated deployment to include Vite build step. Three-app architecture. |
| 1.0.0 | 2026-04-06 | Initial SOP. Full system documented: scoring engine, client reflection, clinician dashboard, EmailJS delivery, GitHub Pages deployment, safety features, design system. Phases 1-6 complete. |

---

## Active Issues & Blockers

| Issue | Status | Action Required |
|-------|--------|-----------------|
| EmailJS free tier | Active (200/mo) | Monitor usage; upgrade if client volume exceeds ~50/month |
| Scale data validation | Pending | Compare T-score outputs against a trusted reference implementation for golden-case validation |
| Short form SI items | By design | Items 506, 520, 524 (active SI) are above item 370 — not administered in short form. Clinician report notes this. |
| EmailJS template update | Pending | Add `{{dashboard_url}}` to template `template_zdn60cd` to include clickable dashboard deep link in email reports. Code sends the variable; template needs the display. |
| Harris-Lingoes transform data | Pending | `scoring-data.js` needs `harrisLingoesSubscales` array populated with keyed items + gender-specific T-score transform tables from reference manual. Scoring pipeline and dashboard display are ready. |

---

## Document Hierarchy

```
~/assessment-ui/CLAUDE.md        <- Project command center (architecture, state, decisions)
~/assessment-ui/docs/SOP.md      <- This file (operations, workflow, troubleshooting)
~/assessment-ui/README.md        <- GitHub-facing project documentation
```

**Update protocol:** When this SOP changes, bump the version number above and add a row to the version history.

---

> Operational playbook for the Personal Reflection Inventory assessment system.
> Covers sending assessments to clients, reviewing results, development workflow, deployment, and troubleshooting.

**Client URL:** https://bnuckols13.github.io/assessment-ui/client.html
**Clinician URL (legacy):** https://bnuckols13.github.io/assessment-ui/index.html
**Dashboard URL:** https://bnuckols13.github.io/assessment-ui/dashboard/

---

## Table of Contents

1. [Sending Assessments to Clients](#1-sending-assessments-to-clients)
2. [Reviewing Results](#2-reviewing-results)
3. [Safety Protocol](#3-safety-protocol)
4. [Development Workflow](#4-development-workflow)
5. [Deployment](#5-deployment)
6. [Monitoring and Troubleshooting](#6-monitoring-and-troubleshooting)
7. [EmailJS Management](#7-emailjs-management)
8. [Scoring Engine Reference](#8-scoring-engine-reference)

---

## 1. Sending Assessments to Clients

### Via Text Message

Send the client a message like:

> Hi [name], please complete this brief questionnaire before our next session:
> https://bnuckols13.github.io/assessment-ui/client.html

### Via Email

Same link. No login, no account creation required. Works on any device with a browser.

### What the Client Experiences

1. **Setup:** Enters their first name + last initial, selects gender, picks Standard (567 items) or Brief (370 items)
2. **Assessment:** One question at a time. True/False buttons. Arrow key shortcuts. Progress bar at top. Minimap for navigation. Can skip and come back.
3. **Complete:** Sees True/False/Skipped counts. Can review skipped items or proceed.
4. **Reflection:** Warm, non-clinical themed feedback. Crisis resources if DSI items are endorsed. Disclaimer. Encouragement to discuss with provider.

### What the Client Never Sees

- T-scores, raw scores, corrected scores
- Scale names or codes (Hs, D, Hy, etc.)
- Tables, charts, or percentages
- Clinical terminology
- Item numbers
- Validity concerns

---

## 2. Reviewing Results

### Email Reports

When a client clicks "View Your Reflection," you receive an email with:

**Subject:** `Assessment Results: [Client Name]`

**Body contains:**
- Client name, gender, form length, timestamp
- Profile elevation (mean T of 8 clinical scales)
- All validity scale T-scores (VRIN, TRIN, L, F, Fb, Fp, K, S)
- All clinical scale T-scores (Hs, D, Hy, Pd, Mf, Pa, Pt, Sc, Ma, Si)
- Safety level + whether crisis resource was shown
- Critical groups endorsed (with counts)
- Full answer string (for re-scoring if needed)

### T-Score Interpretation Quick Reference

| T Range | Interpretation |
|---------|---------------|
| < 50 | Low / below average |
| 50-59 | Average / within normal limits |
| 60-64 | Borderline / mild elevation |
| 65-79 | Clinically significant elevation |
| 80+ | Marked elevation |

### Profile Elevation Bands

| Elevation | Level | Clinical Meaning |
|-----------|-------|-----------------|
| >= 75 | High | Significant distress / emotional difficulty |
| 65-74 | Moderate | Notable clinical concerns |
| 55-64 | Mild | Some areas of stress |
| < 55 | Normal | Within expected ranges |

### Using the Legacy Clinician View

For basic scoring tables, open:
https://bnuckols13.github.io/assessment-ui/index.html

This version shows full scale tables with T-scores but no interpretation.

### Using the Clinician Dashboard (Recommended)

For interpretive analysis and clinical decision support, open:
https://bnuckols13.github.io/assessment-ui/dashboard/

**Data input options:**
1. **Click dashboard link in email (recommended):** Email report contains a clickable deep link that auto-scores the dashboard and opens Brief view. No copy-paste needed.
2. **Paste answer string:** Copy the `answer_string` from the email report → paste into the textarea → select gender → click "Score & Interpret"
3. **Load from localStorage:** If a client completed the assessment on the same device, their report auto-appears in the "Recent Assessments" list. Click to load.

**Longitudinal comparison:** After loading a current assessment, click the "Compare" button next to any stored report in the Recent Assessments list. The dashboard shows delta T-scores, code type shifts, and a dual-line profile chart (current solid, previous dashed) in both Brief sidebar and Detail View.

**Clinical Brief (press `D` to toggle views):**
- Step 1: **Validity** — Is this profile interpretable? Traffic light + guidance text. If invalid, Steps 2-4 are gated (blurred) until you click "Interpret Anyway".
- Step 2: **Code Type** — Two-point code type with interpretive narrative, differentials, treatment considerations.
- Step 3: **Elevations** — Top elevated clinical scales with interpretive paragraphs + inline content corroboration verdicts + elevated Harris-Lingoes subscale summary.
- Step 4: **Critical Items** — Safety level + endorsement counts.
- Right sidebar: Profile elevation, T/F/? counts, clinical profile chart (with comparison overlay if baseline set), longitudinal comparison card.

**Detail View (9 accordion sections):**
- Validity Profile — chart + table + decision rules (+ gating banner if invalid)
- Longitudinal Comparison — delta table + dual-line chart (only shown when comparison baseline is set)
- Clinical Profile — chart + table + scale-by-scale interpretations + behavioral correlates + Harris-Lingoes subscale bars under elevated scales
- Code Type Analysis — full narrative + differentials + treatment considerations
- Content Corroboration — does the content profile support the clinical elevations? (promoted above Content Scales)
- Content Scales — table + interpretations for elevated scales
- Supplementary Scales — table
- Critical Items — expandable groups with item text
- Raw Data — config summary + JSON export

**Session View (press `S` to toggle):**
- Designed for shared clinician-client viewing during session
- Shows warm, non-clinical discussion prompts for each elevated theme area
- Safety card (calm teal) shown when DSI items are endorsed
- "Show Clinical Context" toggle reveals clinician-only annotations per card
- No T-scores, scale names, or clinical terminology visible by default

---

## 3. Safety Protocol

### Automatic Crisis Resource Display

The client sees a calm teal "Support is available" banner with 988 Suicide & Crisis Lifeline info when **any** item from the "Depressed Suicidal Ideation" critical group is endorsed.

### High-Risk SI Items

Items 506, 520, and 524 represent **active suicidal ideation**:
- Item 506: "I have recently considered killing myself"
- Item 520: "Lately I have thought a lot about killing myself"
- Item 524: "No one knows it but I have tried to kill myself"

**Important:** These are items 506, 520, 524 — all above item 370. They are **not administered in the Brief (short) form**. The clinician report flags this with `highRiskItemsNotAdministered: true`.

### Safety Flags in Clinician Report

| Flag | Meaning |
|------|---------|
| `level: "high"` | 2+ high-risk SI items endorsed (506/520/524) |
| `level: "moderate"` | 1 high-risk SI item endorsed |
| `level: "low"` | DSI items endorsed but none of the 3 high-risk items |
| `level: "none"` | No DSI items endorsed |
| `showCrisisResource: true` | Client saw the 988 banner |
| `highRiskItemsNotAdministered: true` | Short form — items 506/520/524 were not asked |

### Recommended Actions

- **High:** Contact client promptly. Conduct risk assessment at next session.
- **Moderate:** Prioritize discussion at next session. Consider safety planning.
- **Low:** Note for clinical discussion. Monitor over time.
- **Short form + DSI endorsed:** Consider re-administering long form to assess items 506/520/524.

---

## 4. Development Workflow

### Local Development

```bash
# Client + legacy clinician (vanilla)
cd ~/assessment-ui
python3 -m http.server 3002
# Open http://localhost:3002/client.html or /index.html

# Dashboard (React)
cd ~/assessment-ui/dashboard
npx vite --port 5175
# Open http://localhost:5175/assessment-ui/dashboard/
```

Or use the Claude Preview tool with launch.json configs: `assessment` (port 3002) or `dashboard` (port 5175).

### File Editing

**Vanilla files** (client.html, index.html, scoring-*.js): Edit directly, refresh browser. No build step.

**Dashboard** (`dashboard/src/`): Edit React/TypeScript files, Vite HMR auto-reloads. Run `npm run build` to verify production build before pushing.

### Key Files

| File | Purpose | Edit when... |
|------|---------|-------------|
| `client.html` | Client assessment + reflection | Changing client UX, questions, flow |
| `client-reflections.js` | Reflection themes, safety, EmailJS | Changing reflection copy, adding themes, updating delivery |
| `index.html` | Legacy clinician scoring | Changing basic scoring UI |
| `scoring-engine.js` | Scoring functions | Fixing scoring bugs, adding scale types |
| `scoring-data.js` | Scale definitions + norms | Updating keyed items, transform tables, critical groups |
| `dashboard/src/App.tsx` | Dashboard data orchestrator | Changing dashboard flow or data routing |
| `dashboard/src/data/code-types.ts` | 2-point code type narratives | Adding/editing code type interpretations |
| `dashboard/src/data/scale-interpretations.ts` | Scale narratives | Editing interpretive text for clinical/content scales |
| `dashboard/src/data/validity-guidance.ts` | Validity rules | Adding/editing validity decision rules |
| `dashboard/src/data/content-corroboration.ts` | Content-to-clinical mapping | Editing corroboration interpretation text |
| `dashboard/src/data/subscale-interpretations.ts` | Harris-Lingoes subscale narratives | Adding/editing subscale interpretation text |
| `dashboard/src/data/session-themes.ts` | Session discussion themes | Adding/editing warm discussion prompts for Session View |
| `dashboard/src/lib/validity-rules.ts` | Validity analysis engine | Changing rule logic or adding new rules |
| `dashboard/src/lib/clinical-utils.ts` | Clinical utilities | Corroboration summaries, comparison data, T-score classification |
| `dashboard/src/components/SessionView/` | Session View component | Changing shared clinician-client screen |
| `dashboard/src/components/ComparisonPanel/` | Longitudinal comparison | Changing delta display, comparison logic |
| `dashboard/src/components/` | UI components | Changing dashboard layout, visualizations |

### Testing

Before pushing changes:
1. Open `client.html` locally
2. Fill in name, pick gender + form
3. Answer a few items (or use console: `for(let i=0;i<370;i++) answers[i]=Math.random()>0.5; checkComplete();`)
4. Click "View Your Reflection" — verify reflection renders and email arrives
5. Open `index.html` — verify scoring tables render correctly
6. Check browser console for errors

---

## 5. Deployment

### Auto-Deploy

Every `git push` to `main` triggers GitHub Actions:
1. Checkout repo
2. Set up Node 20, install dashboard dependencies
3. Build dashboard: `cd dashboard && npm ci && npm run build`
4. Assemble `_site/`: root vanilla files + `dashboard/dist/` → `_site/dashboard/`
5. Deploy `_site/` to GitHub Pages
6. Live in ~30 seconds

### Manual Deploy Steps

```bash
cd ~/assessment-ui
git add -A
git commit -m "Description of change

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push
```

Check deploy status:
```bash
gh run list --repo bnuckols13/assessment-ui --limit 1
```

### What Gets Deployed

The GitHub Actions workflow assembles a `_site/` directory containing:
- Root vanilla files (client.html, index.html, scoring-*.js, etc.) — served as-is
- `dashboard/dist/` → `_site/dashboard/` — built React app

The `.github/` and `docs/` directories are included but not user-facing.

---

## 6. Monitoring and Troubleshooting

### Email Not Arriving

1. Check EmailJS dashboard: https://dashboard.emailjs.com/admin → Email History
2. Verify template has a To Email address set
3. Check spam/junk folder
4. Verify you haven't exceeded 200 emails/month (shown in dashboard sidebar)
5. Test directly in browser console:
```javascript
emailjs.send("service_ym3061l", "template_zdn60cd", {
  client_name: "Test", elevation: "50", /* ... */
}).then(r => console.log("OK", r)).catch(e => console.log("ERR", e));
```

### Scoring Seems Wrong

1. Compare against clinician version (`index.html`) with the same answers
2. Check if the scale's transform table has enough entries for the raw score
3. Verify K-correction order: K must score before Hs, Pd, Pt, Sc, Ma
4. Check gender selection — Mf scale has different keys per gender
5. For short form, verify items above 370 are excluded from scoring

### Page Not Loading

1. Check GitHub Pages status: https://github.com/bnuckols13/assessment-ui/actions
2. Verify the most recent deploy succeeded
3. Try hard refresh (Cmd+Shift+R)
4. Check if the file exists in the repo

### Client Can't Start Assessment

- Name must be at least 2 characters
- Gender and form length must both be selected
- Begin button is disabled until all 3 fields are complete

---

## 7. EmailJS Management

### Dashboard

https://dashboard.emailjs.com/admin

### Current Configuration

| Setting | Value |
|---------|-------|
| Service | Gmail (`service_ym3061l`) |
| Template | `template_zdn60cd` |
| Public Key | `ANt1qC0LKrmj-dEBp` |
| Monthly Limit | 200 emails (free tier) |
| Reset Date | Monthly |

### Template Variables

The email template receives these variables from `submitReport()`:

| Variable | Content |
|----------|---------|
| `{{client_name}}` | First name, last initial |
| `{{gender}}` | male / female |
| `{{form_length}}` | short / long |
| `{{timestamp}}` | Formatted date/time |
| `{{elevation}}` | Profile elevation (number) |
| `{{vrin}}` through `{{s}}` | Validity T-scores |
| `{{hs}}` through `{{si}}` | Clinical T-scores |
| `{{safety_level}}` | none / low / moderate / high |
| `{{crisis_shown}}` | YES / No |
| `{{si_count}}` | High-risk SI items endorsed (count) |
| `{{critical_groups}}` | Endorsed group names with counts |
| `{{answer_string}}` | Full T/F/? answer string |

### Upgrading

If you need more than 200 emails/month: https://www.emailjs.com/pricing/
Next tier is $15/month for 1,000 emails.

---

## 8. Scoring Engine Reference

### Scale Processing Order

1. Global T/F/? counts
2. VRIN, TRIN (inconsistency pairs)
3. L, F, Fb, Fp (validity — no K-correction)
4. **K** (correction scale — must be scored here, raw cached)
5. S (validity — no K-correction)
6. Hs (0.5K), D, Hy (clinical — D and Hy no K-correction)
7. Pd (0.4K), Mf (gender-variant, no K)
8. Pa (no K), Pt (1.0K), Sc (1.0K), Ma (0.2K), Si (no K)
9. Content scales (ANX through TRT, no K-correction)
10. Supplementary scales (A, R, Es, MAC-R, AAS, APS, MDS, no K-correction)
11. Harris-Lingoes subscales (28 subscales, no K-correction — conditional on `harrisLingoesSubscales` data)
12. Critical items (10 groups, endorsement check only)
13. Profile elevation (mean T of Hs, D, Hy, Pd, Pa, Pt, Sc, Ma)

### K-Correction Formula

```
correctedRaw = round(kRaw * multiplier + raw)
tScore = transform[correctedRaw + 1]
```

### Transform Table Schema

- Index 0: K multiplier (number) or null (no correction)
- Index 1+: T-score for raw score 0, 1, 2, ...
- The +1 offset means: `tScore = transform[raw + 1]` for non-corrected scales

### Data Version

Current: `2025-01` (set in `scoring-data.js` → `SCORING_DATA.version`)

When updating scale data, increment the version and note changes in CLAUDE.md decision log.
