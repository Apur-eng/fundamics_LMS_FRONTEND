# Fundemics LMS Mobile App Architecture

## 1. Architectural Principles

The Fundemics LMS mobile application frontend is constructed upon four core principles:

1. **Separation of Concerns**: UI components remain pure and stateless where possible; state is managed through dedicated context providers; network operations are encapsulated strictly within the service layer.
2. **Design Token Centralization**: Zero arbitrary styling values. All colors, spacing dimensions, typography scales, radii, and shadows derive from centralized tokens aligned with the institutional website brand identity.
3. **Role-Based Decoupling**: Student, Teacher, and Administrator flows are completely partitioned. Each role possesses an isolated bottom-tab navigation hierarchy that mounts and unmounts cleanly without state bleeding.
4. **Backend-Agnostic Service Layer**: UI components interact with domain service abstractions (`authService`, `dashboardService`) through standardized TypeScript envelopes (`ApiResponse<T>`). When connecting to the future FastAPI backend, only the transport client requires reconfiguration.

---

## 2. Directory Layout & Module Boundaries

```
src/
├── app/
│   ├── navigation/        # Screen routing, role navigators, and param lists
│   └── providers/         # Root context providers (Theme, Auth, SafeArea)
│
├── components/
│   ├── common/            # Atomic primitives (Text, Button, Card, Avatar, Badge, IconButton, ModalSheet)
│   ├── forms/             # Form input fields, validation labels, and toggles
│   └── feedback/          # LoadingState, EmptyState, and ErrorState alerts
│
├── features/              # Vertical slices by business domain
│   ├── auth/              # Authentication flows (Splash, Login, Password Recovery, OTP)
│   ├── dashboard/         # Role-specific dashboard layouts and KPI cards
│   ├── students/          # [Phase 2] Student directory and profiles
│   ├── attendance/        # [Phase 2] Biometric and manual attendance logs
│   ├── classes/           # [Phase 2] Timetables and classroom allocations
│   ├── exams/             # [Phase 2] Test series and examination calendars
│   ├── assignments/       # [Phase 2] Homework and DPP assignment repository
│   ├── results/           # [Phase 2] Report cards and score analytics
│   ├── fees/              # [Phase 2] Fee installment tracking and receipts
│   └── notifications/     # [Phase 2] Institutional circulars and broadcasts
│
├── services/
│   └── api/               # Network layer (ApiClient, MockData, Domain services)
│
├── theme/                 # Design tokens, color palettes, and theme provider
├── types/                 # Shared TypeScript contracts and interfaces
└── utils/                 # Formatters and validation routines
```

---

## 3. Data & State Flow

```
+--------------------------------------------------------------+
|                        User Interface                        |
|   (StudentDashboardScreen / TeacherDashboardScreen / etc.)   |
+------------------------------+-------------------------------+
                               |
                               | Consumes useAuth() & useTheme()
                               v
+--------------------------------------------------------------+
|                     Application State                        |
|  - AuthContext (user, userRole, isAuthenticated, session)    |
|  - ThemeContext (colors, typography, spacing, isDark)        |
+------------------------------+-------------------------------+
                               |
                               | Calls domain service methods
                               v
+--------------------------------------------------------------+
|                    Domain Service Layer                      |
|  - authService.login()                                       |
|  - dashboardService.getStudentDashboard()                    |
|  - dashboardService.getTeacherDashboard()                    |
+------------------------------+-------------------------------+
                               |
                               | Dispatches requests
                               v
+--------------------------------------------------------------+
|                    Centralized ApiClient                     |
|  - Token insertion (Bearer Authorization)                    |
|  - Latency simulation (during mock phase)                    |
|  - Error normalization                                       |
+------------------------------+-------------------------------+
                               |
                               | HTTP / REST
                               v
+--------------------------------------------------------------+
|               FastAPI Backend + PostgreSQL                   |
+--------------------------------------------------------------+
```
