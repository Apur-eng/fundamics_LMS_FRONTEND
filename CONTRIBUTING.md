# Contributing to Fundamics LMS Frontend

Thank you for contributing to the **Fundamics LMS Frontend**! This guide outlines the development standards and workflow for contributing to our React Native mobile application.

---

## 🧭 Code of Conduct

Please maintain a respectful, constructive, and professional environment across all issues, pull requests, and discussions.

---

## 🛠️ Development Workflow

1. **Branching Strategy**:
   - Branch off `main` for new features or bug fixes.
   - Use descriptive branch naming conventions:
     - `feat/<feature-name>` for new features or screens
     - `fix/<bug-name>` for bug fixes
     - `refactor/<scope>` for code improvements
     - `docs/<doc-name>` for documentation updates

2. **Commit Conventions**:
   Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` A new feature or screen
   - `fix:` A bug fix
   - `docs:` Documentation changes only
   - `style:` Code style/formatting changes (no logic changes)
   - `refactor:` Code changes that neither fix a bug nor add a feature
   - `test:` Adding or updating tests
   - `chore:` Build process, tooling, or dependency updates

3. **Code Quality**:
   - Ensure code passes linting and formatting (`npm run lint`).
   - Keep components modular and reusable under `src/components/`.
   - Never commit sensitive keys, keystores, or `.env` files.

4. **Pull Requests**:
   - Provide a clear PR title and description outlining what was changed and why.
   - Attach screenshots or screen recordings for any UI changes.
   - Ensure all automated checks and tests pass before requesting review.
