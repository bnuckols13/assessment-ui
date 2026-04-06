# Assessment UI — New Session Onboarding Prompt

Copy everything below the line and paste it into a new Claude Code session.

---

## Prompt

You are picking up work on the **Personal Reflection Inventory** — a clinical assessment system I built with Claude. Before doing anything, read the project documentation to get full context.

**Project location:** `~/assessment-ui/`

### Step 1: Read these files in order

1. `~/assessment-ui/CLAUDE.md` — Project command center. Architecture, file map, current state, work streams, conventions, decision log. This is your single source of truth.
2. `~/assessment-ui/docs/SOP.md` — Operational playbook. How to send assessments, review results, safety protocol, EmailJS management, scoring engine reference, troubleshooting.
3. `~/assessment-ui/README.md` — Quick reference.

### Step 2: Understand the system

This is a **567-item True/False self-report clinical inventory** with two completely separate user experiences sharing one scoring engine:

**Client version** (`client.html`) — What patients see when I text/email them a link:
- Warm intake (name, gender, form length) → assessment → guided reflection with non-clinical themes
- No T-scores, no scale names, no clinical terminology ever shown
- 988 crisis banner auto-triggered when suicidal ideation items are endorsed
- Full scored report silently emailed to me via EmailJS on completion
- Live at: https://bnuckols13.github.io/assessment-ui/client.html

**Clinician version** (`index.html`) — What I use for in-office scoring:
- Same assessment → full scoring report with all T-scores, tables, profile charts, critical items, CSV/JSON export
- Live at: https://bnuckols13.github.io/assessment-ui/index.html

**Scoring engine** (`scoring-engine.js` + `scoring-data.js`) — Shared by both versions:
- Pure functions, no DOM dependency: `scoreInstrument(answers, gender, formLength, data, questions) → results`
- K-correction (0.5K for Hs, 0.4K for Pd, 1.0K for Pt/Sc, 0.2K for Ma)
- Gender-specific norm tables including gender-variant Mf scale
- VRIN/TRIN inconsistency detection (67 + 23 pair rules)
- 10 critical item groups with safety flagging
- Profile elevation = mean T of Hs, D, Hy, Pd, Pa, Pt, Sc, Ma
- Data version: 2025-01

**Reflection engine** (`client-reflections.js`) — Client-only:
- Maps profile elevation to 4 tone bands (high/moderate/mild/normal)
- Maps 10 critical item groups to warm, non-clinical sentences
- Maps elevated clinical scales (T>=65) to broad themes, deduplicated with critical groups
- Suicidal ideation safety check with tiered risk levels
- EmailJS delivery (service_ym3061l / template_zdn60cd)
- localStorage fallback

### Step 3: Key conventions

- **No build step.** All vanilla HTML/CSS/JS. Edit files, push, live in 20 seconds.
- **Design system:** Inter font, warm clinical palette (cream #FAFAF7 backgrounds, earth-tone colors). CSS variables in each HTML file's `<style>` block. Matches the DBT group app family.
- **Scoring order matters:** K scale must be scored before K-corrected scales.
- **Transform table offset:** `tScore = transform[raw + 1]` — the +1 is baked into the schema.
- **Item numbers are 1-based** (matching booklet). Array indices are 0-based. `getAnswer(answers, itemNum)` handles the conversion.
- **Short form (370 items):** Items above 370 are not scored. High-risk SI items (506, 520, 524) are not administered.
- **Safety is conservative:** Any DSI endorsement triggers crisis banner. Clinician report always includes safety flags.
- **Deploy:** `git push` to main → GitHub Actions auto-deploys to GitHub Pages.
- **No server, no database.** Clinical data lives only in the email. No PHI stored anywhere.

### Step 4: What I might ask you to do

Common tasks on this project include:
- Adjusting the client reflection copy or tone
- Adding/modifying scale definitions in scoring-data.js
- Updating the email template content
- Fixing scoring bugs (compare against reference implementation)
- Adding new scales or subscales
- UI refinements to either version
- Adding content scales or Harris-Lingoes subscales
- Modifying the assessment flow (e.g., adding informed consent screen)

### Step 5: Before making changes

1. Read the relevant file(s) first — don't propose changes to code you haven't read
2. Test locally: `python3 -m http.server 3002` in `~/assessment-ui/`
3. For scoring changes, verify against both client and clinician versions
4. Keep the client version free of all clinical terminology
5. Don't break the safety features (DSI detection, crisis banner)
6. Follow existing design patterns and conventions from CLAUDE.md
