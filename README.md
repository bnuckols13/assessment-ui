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
- VRIN/TRIN inconsistency detection
- 10 critical item groups with safety flagging
- Profile elevation (mean T of 8 clinical scales)
- Gender-specific norm tables, short form (370) support

### Client Experience

1. Enter name, select gender + form length
2. Answer items True/False (keyboard nav, minimap, progress bar)
3. See warm guided reflection — no T-scores, no clinical terminology
4. Crisis resources (988 Lifeline) shown automatically when suicidal ideation items are endorsed
5. Full scored report emailed to clinician via EmailJS

### Clinician Dashboard (React)

Interpretive analysis with two views (toggle with Brief/Detail buttons or press `D`):

**Clinical Brief** — 4-step no-scroll decision flow:
1. Validity assessment (rule-based, traffic light)
2. Two-point code type identification + narrative
3. Elevated scale interpretations
4. Critical items + safety flagging

**Detail View** — 8 collapsible sections with charts, tables, scale-by-scale interpretations, content corroboration, and JSON export.

Data input: paste answer string from email or load from localStorage.

### Legacy Clinician View

Basic T-score tables, profile chart, CSV/JSON export. Still available at `/index.html`.

## Design System

Inter font, warm clinical palette. Matches the DBT group app family.

## Documentation

- `CLAUDE.md` — Project command center (architecture, decisions, state)
- `docs/SOP.md` — Operational playbook (sending assessments, reviewing results, safety protocol, troubleshooting)
