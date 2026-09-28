# Fundemics LMS Design System & Theming Architecture

## Light vs. Dark Mode Architectural Decision

### 1. Context & Use Cases
Fundemics Tutorials is a premier coaching institute catering to students (Classes I through XII preparing for ICSE, ISC, CBSE, and UP State Board examinations), faculty members, and institutional administrators.

- **Students**: Spend prolonged hours reading notes, reviewing syllabus topics, solving practice questions, and checking test scores. Usage happens across daylight hours and late-night study sessions.
- **Teachers**: Review attendance rosters, evaluate test papers, and monitor batch schedules under standard classroom and staff room lighting.
- **Administrators**: Track branch analytics, fee reconciliation, and student records primarily during standard institutional office hours.

### 2. Decision: Dual-Palette Token Mapping (Default Light Mode)
Rather than inventing an unverified dark-only or light-only design:
1. **Light Mode as Default**: Provides optimal legibility and contrast for dense educational tables, marks sheets, and text reading during daytime use.
2. **First-Class Dark Mode Token Architecture**: Both `lightThemeColors` and `darkThemeColors` implement the identical strict `ColorTheme` interface. The dark mode directly leverages the institutional **Deep Navy** (`#0B192C` / `#060E18`) foundational canvas established in the Fundemics Tutorials website, avoiding synthetic pure-black OLED strain while maintaining brand continuity.
3. **No Component-Level Branching**: Components consume semantic tokens (`colors.surface`, `colors.primary`, `colors.textPrimary`, `colors.border`) through the `useTheme()` hook. Switching modes requires zero component rewrites.

---

## Token Reference

| Token Category | Values & Scalings |
|---|---|
| **Brand Primary** | Deep Navy (`#0B192C`, `#060E18`, `#14253E`) |
| **Brand Accent** | Emerald (`#059669`, `#10B981`, `#047857`) |
| **Brand Distinction** | Amber Gold (`#D97706`, `#F59E0B`) |
| **Spacing Scale** | 4pt/8pt grid: `none (0)`, `xxs (2)`, `xs (4)`, `sm (8)`, `md (12)`, `lg (16)`, `xl (20)`, `xxl (24)`, `xxxl (32)`, `huge (40)`, `massive (48)` |
| **Corner Radius** | `none (0)`, `xs (4)`, `sm (6)`, `md (10)`, `lg (14)`, `xl (18)`, `pill (28)`, `full (9999)` |
| **Typography** | `hero (28/34)`, `h1 (24/30)`, `h2 (20/26)`, `h3 (18/24)`, `h4 (16/22)`, `subtitle (15/21)`, `body (14/20)`, `bodySmall (12/16)`, `caption (11/15)`, `badge (11/14)`, `button (15/20)` |
