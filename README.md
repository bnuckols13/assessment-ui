# Personal Reflection Inventory

Clinical assessment system with dual interfaces: a client-facing guided reflection experience and a clinician-facing scoring dashboard. 567-item True/False self-report inventory with gender-specific norm tables, K-correction, inconsistency detection, critical item flagging, and profile elevation.

## Quick Start

```
# Client + legacy clinician (vanilla, no build step)
python3 -m http.server 3002
# Client: http://localhost:3002/client.html
# Clinician: http://localhost:3002/index.html

# Dashboard (React)
cd dashboard && npm install && npx vite --port 5175
# Dashboard: http://localhost:5175/assessment-ui/dashboard/
```

## Production

- **Client:** https://bnuckols13.github.io/assessment-ui/client.html
- **Clinician:** https://bnuckols13.github.io/assessment-ui/index.html
- **Dashboard:** https://bnuckols13.github.io/assessment-ui/dashboard/

Auto-deploys on push to `main` via GitHub Actions (includes Vite build step for dashboard).

## Architecture

```
client.html              Client assessment + guided reflection (no clinical data)
client-reflections.js    Reflection themes, safety checks, EmailJS delivery
index.html               Legacy clinician scoring (T-score tables, charts)
scoring-engine.js        Pure scoring functions (shared by all)
scoring-data.js          Scale definitions + norm tables (shared)
dashboard/               React clinician dashboard (interpretive analysis)
docs/SOP.md              Operational playbook
```

### Scoring Engine

Pure JS functions — `(answers, config) → results`. No dependencies, no DOM.

- 6 validity scales (L, F, Fb, Fp, K, S)
- 10 clinical scales with K-correction (Hs, D, Hy, Pd, Mf, Pa, Pt, Sc, Ma, Si)
- 15 content scales, 7 supplementary scales
- Harris-Lingoes subscale scoring (28 subscales, conditional on data availability)
- VRIN/TRIN inconsistency detection
- 10 critical item groups with safety flagging
- Profile elevation (mean T of 8 clinical scales)
- Gender-specific norm tables, short form (370) support

### Client Experience

1. Enter name, select gender + form length
2. Answer items True/False (keyboard nav, minimap, progress bar)
3. See warm guided reflection — no T-scores, no clinical terminology
4. Crisis resources (988 Lifeline) shown automatically when suicidal ideation items are endorsed
5. Full scored report + dashboard deep link emailed to clinician via EmailJS

### Clinician Dashboard (React)

Interpretive analysis with three views (toggle with Brief/Detail/Session buttons or press `D`/`S`):

**Clinical Brief** — 4-step no-scroll decision flow:
1. Validity assessment (rule-based, traffic light) — invalid profiles gate Steps 2-4 until explicit override
2. Two-point code type identification + narrative
3. Elevated scale interpretations with inline content corroboration verdicts and Harris-Lingoes subscale summary
4. Critical items + safety flagging

**Detail View** — Collapsible sections with charts, tables, scale-by-scale interpretations, content corroboration (promoted), Harris-Lingoes subscale bars under elevated scales, longitudinal comparison, and JSON export.

**Session View** — Shared clinician-client screen with warm, non-clinical discussion prompts per theme area. Toggleable clinical context annotations. Safety card for DSI. Designed for in-session shared viewing.

**Longitudinal Comparison** — Select a previous assessment as baseline. Delta T-scores, code type shifts, dual-line profile chart (current vs. previous).

Data input: click deep link from email (auto-scores), paste answer string, or load from localStorage.

### Legacy Clinician View

Basic T-score tables, profile chart, CSV/JSON export. Still available at `/index.html`.

## Design System

Inter font, warm clinical palette. Matches the DBT group app family.

## Documentation

- `CLAUDE.md` — Project command center (architecture, decisions, state)
- `docs/SOP.md` — Operational playbook (sending assessments, reviewing results, safety protocol, troubleshooting)
