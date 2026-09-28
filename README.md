# Fundemics LMS Mobile Application Frontend

Cross-platform mobile application frontend for the **Fundemics Learning Management System (LMS)**, built with **React Native**, **TypeScript**, **Expo SDK 52**, and **React Navigation 7**.

---

## 📱 Project Overview

The **Fundemics LMS Mobile App** delivers an institutional learning management experience for students, educators, and leadership across **Fundemics Tutorials LLP** (Lucknow, established 2014).

It provides specialized, role-based workflows for:
- **Students**: Academic profile, class attendance tracking, daily timetable, weekly board assessment scores, and official circulars.
- **Faculty / Teachers**: Department rosters, daily batch teaching schedules, attendance logging, and priority grading queues.
- **Administrators**: Multi-branch operational KPIs (*Triveni Nagar Flagship*, *Faizullaganj*, *Aliganj*), staff-student ratios, fee collection realization, and institutional audit trails.

---

## 🎨 Brand Identity & Design System

The mobile application incorporates the verified visual language and design tokens of Fundemics Tutorials:

- **Primary Canvas**: Institutional Deep Navy (`#0B192C` / `#060E18` / `#14253E`)
- **Academic Accent**: Growth Emerald (`#059669` / `#10B981` / `#047857`)
- **Honors & Distinction**: Amber Gold (`#D97706` / `#F59E0B`)
- **Design Tokens**: Standardized 4pt/8pt grid spacing, WCAG-accessible contrast ratios, minimum 44x44pt touch targets, and authentic monogram avatar fallbacks.
- **Theming**: Fully typed dual-palette architecture (`lightThemeColors` & `darkThemeColors`) with Light mode as default for daylight academic reading. See [src/theme/README.md](file:///d:/fundamics/fundamics_lms_frontend/src/theme/README.md).

---

## 📂 Repository Structure

```
fundamics_lms_frontend/
├── docs/                               # Architecture, ADRs, and API documentation
│   ├── api/API_CONTRACTS.md            # Frontend API service layer & backend contracts
│   ├── architecture/ARCHITECTURE.md    # Mobile application architecture & navigation tree
│   └── decisions/                      # Architecture Decision Records (ADRs)
│
├── src/
│   ├── app/                            # Application root setup
│   │   ├── navigation/                 # Role-based stacks & tab navigators
│   │   │   ├── AuthNavigator.tsx       # Splash, Login, Forgot Password, OTP
│   │   │   ├── StudentNavigator.tsx    # Bottom tabs for Student portal
│   │   │   ├── TeacherNavigator.tsx    # Bottom tabs for Faculty portal
│   │   │   ├── AdminNavigator.tsx      # Bottom tabs for Admin portal
│   │   │   ├── RootNavigator.tsx       # Dynamic role router with theme binding
│   │   │   └── types.ts                # Route param list definitions
│   │   └── providers/                  # Application context providers
│   │       ├── AuthContext.tsx         # User authentication & role manager
│   │       └── StateProvider.tsx       # Root wrapper (SafeArea, Theme, Auth)
│   │
│   ├── components/                     # Reusable design system components
│   │   ├── common/                     # Text, Button, Card, Avatar, Badge, IconButton, ModalSheet
│   │   ├── forms/                      # Input with icons, password toggle, and error states
│   │   └── feedback/                   # LoadingState, EmptyState, ErrorState
│   │
│   ├── features/                       # Modular feature domains
│   │   ├── auth/                       # Splash, Login, ForgotPassword, OtpVerification
│   │   ├── dashboard/                  # Student, Teacher, and Admin dashboard shells
│   │   ├── students/                   # Future Phase 2 module placeholder
│   │   ├── attendance/                 # Future Phase 2 module placeholder
│   │   ├── classes/                    # Future Phase 2 module placeholder
│   │   ├── exams/                      # Future Phase 2 module placeholder
│   │   ├── assignments/                # Future Phase 2 module placeholder
│   │   ├── results/                    # Future Phase 2 module placeholder
│   │   ├── fees/                       # Future Phase 2 module placeholder
│   │   └── notifications/              # Future Phase 2 module placeholder
│   │
│   ├── services/
│   │   └── api/                        # Centralized API abstraction layer
│   │       ├── apiClient.ts            # Network client for future FastAPI backend
│   │       ├── mockData.ts             # Realistic institutional fixtures
│   │       ├── authService.ts          # Authentication service interface
│   │       └── dashboardService.ts     # Role dashboard data fetcher
│   │
│   ├── theme/                          # Design tokens, typography, and theme provider
│   ├── types/                          # TypeScript contracts (Auth, API, Dashboard)
│   └── utils/                          # Phone, email, admission no, and date formatters
│
├── App.tsx                             # Root component with dynamic status bar
├── index.ts                            # Expo entry point
├── app.json                            # Expo configuration
├── package.json                        # Dependencies and scripts
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.x (Tested with Node.js v24)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Apur-eng/fundamics_LMS_FRONTEND.git
   cd fundamics_lms_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify TypeScript compilation**:
   ```bash
   npm run typecheck
   ```

---

## 🖥️ Running & Reviewing the App

### Option 1: Web Browser (Instant Preview)
```bash
npm run web
```
Opens the application directly in your browser at `http://localhost:8081`. Press `F12` and toggle device toolbar (`Ctrl+Shift+M`) for realistic mobile dimensions.

### Option 2: Physical Device (Expo Go)
```bash
npm start
```
Scan the QR code displayed in the terminal with the **Expo Go** app on Android or iOS.

### Option 3: Emulator / Simulator
- For Android: `npm run android`
- For iOS (macOS only): `npm run ios`

---

## 🧪 Testing Role Perspectives

On the **Login Screen**:
1. Use the **Student**, **Faculty**, or **Admin** toggle pills at the top of the card.
2. Tap **Sign In** directly — credentials are pre-configured to automatically load that role's dashboard.
3. Tap the sign-out icon in any dashboard header to return to the login screen and switch roles.

---

## 🔗 Architecture & Backend Integration

The frontend uses a strict 3-tier decoupling pattern:
```
React Native Components
          ↓
  Domain Services (authService, dashboardService)
          ↓
  Centralized ApiClient (apiClient.ts)
          ↓
  FastAPI Backend (Future integration)
          ↓
  PostgreSQL Database
```

To switch from mock mode to the real backend in Phase 2:
1. Update `EXPO_PUBLIC_API_BASE_URL` in `.env`.
2. Toggle `USE_MOCK_API = false` in [src/services/api/apiClient.ts](file:///d:/fundamics/fundamics_lms_frontend/src/services/api/apiClient.ts). Zero UI components require modification.

---

## 📄 License

All rights reserved. © Fundemics Tutorials LLP.
