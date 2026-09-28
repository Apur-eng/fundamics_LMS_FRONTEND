# ADR-003: Role-Based Navigation Architecture with React Navigation 7

## Status
Accepted

## Context
The application serves three distinct user roles: Students, Faculty/Teachers, and Institute Administrators. Each role requires completely separate tab hierarchies, workflows, and access controls.

## Decision
1. **Dynamic Root Navigator**: `RootNavigator.tsx` conditionally switches between `AuthNavigator` and dedicated role navigators (`StudentNavigator`, `TeacherNavigator`, `AdminNavigator`) based on `isAuthenticated` and `userRole`.
2. **Clean Unmounting**: When a user logs out or switches roles, React Navigation automatically unmounts the previous navigator tree, guaranteeing no lingering screen state or unauthorized role access.
3. **Phase 2 Extensibility**: Bottom tabs currently point to dashboard shells and future module placeholders (`attendance/`, `classes/`, `exams/`, `assignments/`, `results/`, `fees/`, `notifications/`). Feature stacks can be connected to any tab without modifying the root navigation contract.

## Consequences
- Strict role isolation.
- Fast transitions powered by `@react-navigation/native-stack` and `@react-navigation/bottom-tabs`.
- Clear file and route boundaries.
