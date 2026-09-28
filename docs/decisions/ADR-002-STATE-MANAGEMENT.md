# ADR-002: Native React Context State Architecture

## Status
Accepted

## Context
Phase 1 of the Fundemics LMS application requires state management for authentication status, the active user record, role switching, network loading, and error states. Introducing heavy third-party state managers (such as Redux Toolkit, MobX, or Zustand) at this stage introduces dependency overhead, boilerplate, and maintenance burden before module requirements are fully finalized.

## Decision
1. Utilize React's native Context API and state hooks inside `src/app/providers/AuthContext.tsx`.
2. Provide a typed `useAuth()` hook exposing `user`, `userRole`, `isAuthenticated`, `isLoading`, `error`, and handlers (`login`, `logout`, `switchRole`, `clearError`).
3. Encapsulate all cross-cutting providers inside `StateProvider.tsx` (`SafeAreaProvider`, `ThemeProvider`, `AuthProvider`).

## Consequences
- Zero external state management dependencies.
- Zero state bloat.
- Provides a clean foundation that can be upgraded in Phase 2 if complex cross-module caching is needed.
