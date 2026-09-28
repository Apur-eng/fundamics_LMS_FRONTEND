# ADR-001: Dual-Palette Token Theming Architecture

## Status
Accepted

## Context
The Fundemics LMS mobile application requires a visual presentation consistent with the premier institutional authority of Fundemics Tutorials LLP (established Lucknow, 2014). Students spend extensive hours studying course notes and reviewing exam questions in variable lighting conditions, while faculty and administrators operate during daytime and classroom hours.

## Decision
1. **Light Mode as Default**: High-contrast, clean slate background (`#F8FAFC`) with crisp white card surfaces (`#FFFFFF`) to ensure readability of educational tables and exam schedules.
2. **Deep Navy Brand Dark Mode**: Dark mode directly utilizes the institutional Deep Navy palette (`#0B192C` / `#060E18` / `#14253E`) established on the website, rather than pure OLED black (`#000000`), reducing eye fatigue during nighttime study.
3. **Strict Color Theme Interface**: All components consume semantic tokens (`colors.primary`, `colors.accent`, `colors.surface`, `colors.border`) through the `useTheme()` hook. Zero hardcoded hex colors are allowed in component stylesheets.

## Consequences
- Guarantees visual consistency across platforms.
- Eliminates visual fragmentation between website and mobile application.
- Theme switching requires zero component-level conditional code.
