# Personal Reflection Inventory

Clinical assessment system with dual interfaces: a client-facing guided reflection experience and a clinician-facing scoring dashboard. 567-item True/False self-report inventory with gender-specific norm tables, K-correction, inconsistency detection, critical item flagging, and profile elevation.

## Quick Start

No build step. Open in any browser:

```
# Local development
python3 -m http.server 3002
# Client: http://localhost:3002/client.html
# Clinician: http://localhost:3002/index.html
```

## Production

- **Client:** https://bnuckols13.github.io/assessment-ui/client.html
- **Clinician:** https://bnuckols13.github.io/assessment-ui/index.html

Auto-deploys on push to `main` via GitHub Actions.

## Architecture

```
client.html              Client assessment + guided reflection (no clinical data)
client-reflections.js    Reflection themes, safety checks, EmailJS delivery
index.html               Clinician scoring dashboard (full T-scores, charts)
scoring-engine.js        Pure scoring functions (shared)
scoring-data.js          Scale definitions + norm tables (shared)
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

### Clinician Dashboard

Full scoring report with:
- T-score tables (validity, clinical, content, supplementary)
- Color-coded T-score bars
- Canvas profile charts with T=65 threshold
- Critical items with endorsed item text
- CSV/JSON export

## Design System

Inter font, warm clinical palette. Matches the DBT group app family.

## Documentation

- `CLAUDE.md` — Project command center (architecture, decisions, state)
- `docs/SOP.md` — Operational playbook (sending assessments, reviewing results, safety protocol, troubleshooting)
