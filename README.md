# fundamics_LMS_FRONTEND

Cross-platform mobile application frontend for the **Fundamics Learning Management System (LMS)**, built with **React Native**.

---

## 📱 Overview

The **Fundamics LMS Frontend** delivers a modern, high-performance mobile learning experience for students, educators, and coaching institutions. It integrates seamlessly with the [Fundamics LMS Backend](https://github.com/Apur-eng/fundamics_LMS_BACKEND.git) to provide real-time course access, student tracking, assessments, and attendance workflows.

---

## 📂 Repository Structure

```
fundamics_lms_frontend/
├── docs/                 # Project documentation and specifications
│   ├── api/              # API contracts and schemas
│   ├── architecture/     # Mobile app architecture and flow diagrams
│   ├── database/         # Local storage & offline data schemas
│   ├── decisions/        # Architecture Decision Records (ADRs)
│   ├── requirements/     # Product and feature specifications
│   └── security/         # Mobile security and authentication policies
├── src/                  # React Native application source code
│   ├── assets/           # Images, fonts, and static resources
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation stacks and screen routing
│   ├── screens/          # Main application screens
│   ├── services/         # API clients and network integration
│   ├── store/            # State management (Redux / Zustand / Context)
│   └── utils/            # Helper functions and constants
├── tests/                # Unit, component, and E2E test suites
├── .env.example          # Template for environment variables
├── .gitignore            # Git ignore rules for React Native, Expo, Android, and iOS
├── CONTRIBUTING.md       # Contribution and development guidelines
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.x
- **npm** or **yarn** or **pnpm**
- **Mobile Development Setup**:
  - For Android: Android Studio & Android SDK
  - For iOS (macOS only): Xcode & CocoaPods
  - Alternatively: Expo Go app for physical device testing

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Apur-eng/fundamics_LMS_FRONTEND.git
   cd fundamics_lms_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your backend API URL and development credentials.

4. **Start the development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

---

## 🔗 Related Repositories

- **Backend Repository**: [fundamics_LMS_BACKEND](https://github.com/Apur-eng/fundamics_LMS_BACKEND.git)

---

## 📄 License

All rights reserved. © Fundamics
