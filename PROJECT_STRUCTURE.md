# Fundemics Tutorials Website

## 1. Project Overview

Fundemics Tutorials is the institutional website for **Fundemics Tutorials LLP**, a premier academic coaching institute established in Lucknow (operational since 2014, officially incorporated under the LLP Act in 2018).

- **Who it is for**: Students and parents across Classes I through XII enrolled under the ICSE (Classes I–X), ISC (Classes XI–XII), CBSE (Classes I–XII), and Uttar Pradesh State Board curricula in Lucknow, with specialized academic batches for City Montessori School (CMS) scholars.
- **What it accomplishes**: 
  - Establishes academic credibility through 100% verified board examination rankers, subject distinction records, and official certifications (ISO 9001:2015 & MCA Government Incorporation).
  - Clarifies academic pathways across primary, middle, secondary, and senior secondary tiers.
  - Demonstrates the institute's teaching methodology ("The Fundemics Method").
  - Connects parents and students directly with admissions coordinators via structured enquiry forms, one-click phone calls (`tel:+917617018888`), and instant WhatsApp messaging (`https://wa.me/917617018888`).

---

## 2. Technology Stack

The application is built as a fast, statically deliverable Single Page Application (SPA) using:

- **Core Framework**: React 19 (`react: ^19.2.8`, `react-dom: ^19.2.8`) with TypeScript (`typescript: ~6.0.2`).
- **Build Tool & Bundler**: Vite 8 (`vite: ^8.3.0`) with `@vitejs/plugin-react`. Custom Rollup chunking divides code into dedicated vendor, icons, and application bundles.
- **Styling Architecture**: Vanilla CSS with CSS Custom Properties (Tokens) for consistent design language. Zero utility CSS frameworks (Tailwind is intentionally not used). Design tokens are organized in `src/styles/tokens.css`, with global resets and layout rules in `src/styles/globals.css`.
- **Iconography**: Lucide React (`lucide-react: ^1.46.0`) for lightweight, consistent SVG icons.
- **Routing**: Internal hash/pushState-compatible React Router Context (`src/context/RouterContext.tsx`) with zero heavy third-party routing dependencies.
- **SEO & Social Meta**: Custom `<SeoHead />` component managing document titles, canonical URLs, Open Graph tags, and structured JSON-LD schemas.
- **Linter**: Oxlint (`oxlint: ^1.81.0`) for fast static analysis.

---

## 3. Application Structure

```
fundamics_website/
├── public/                     # Static public assets served directly at root
│   ├── assets/                 # Brand logos, official certificates, authentic photos
│   │   ├── rankers/            # 55 authentic student photographs extracted from source files
│   │   ├── LOGO.png            # Fundemics institutional logo
│   │   ├── cisce_logo.jpeg     # Official CISCE board logo
│   │   ├── cbse_logo.jpeg      # Official CBSE board logo
│   │   ├── up_logo.webp        # Official UP State Board logo
│   │   ├── cms_focused.webp    # Authentic CMS students celebration photo
│   │   ├── mayank_aggarwal.jpeg# Real photo: Mayank Aggarwal (Founder & Director)
│   │   ├── manish_k_verma.jpeg # Real photo: Manish K. Verma (Co-Founder, IIT Dhanbad)
│   │   └── fundamics_*.png/pdf # ISO 9001 and LLP Incorporation certificates
│   ├── _headers                # HTTP security and cache headers
│   ├── robots.txt              # Search engine crawler directives
│   └── sitemap.xml             # Search engine XML sitemap
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Base UI elements (Button, Logo, SeoHead, WhatsApp button)
│   │   ├── home/               # Homepage-specific sections (Hero, Boards, Method, CMS, etc.)
│   │   ├── layout/             # Universal Navbar and Footer
│   │   ├── rankers/            # Rankers page UI (Hero, Filters, Cards, Archive, Notice)
│   │   ├── results/            # 3D DeckCard and Topper Carousel mechanics
│   │   └── teachers/           # TeacherCard component with monogram fallbacks
│   ├── context/
│   │   └── RouterContext.tsx   # Lightweight client-side router context and Link component
│   ├── data/
│   │   ├── branches.ts         # Triveni Nagar, Faizullaganj, Aliganj branch details
│   │   ├── navigation.ts       # Main navbar and footer link structures
│   │   ├── rankersData.ts      # Single source of truth for all verified student rankers
│   │   ├── siteConfig.ts       # Central phone numbers, WhatsApp, addresses, LMS links
│   │   └── teachers.ts         # Faculty roster, leadership bios, subject departments
│   ├── pages/                  # Page-level route views
│   │   ├── HomePage.tsx        # Homepage composing all 11 core sections
│   │   ├── RankersPage.tsx     # Filterable rankers database, carousel, and ISC archive
│   │   ├── VisionPage.tsx      # Institute vision, philosophy, and learning standards
│   │   ├── TeachersPage.tsx    # Faculty directory filtered by academic department
│   │   └── QueriesPage.tsx     # Structured admissions enquiry form with validation
│   ├── styles/
│   │   ├── tokens.css          # Design tokens: palette, fluid typography, spacing, shadows
│   │   └── globals.css         # Reset, base typography, card interactive classes, animations
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for SiteConfig, Rankers, Faculty, etc.
│   ├── App.tsx                 # Root application wrapper, route switcher, sticky footer
│   └── main.tsx                # React DOM entry point
├── docs/
│   └── PROJECT_STRUCTURE.md    # Developer reference and architecture guide
├── package.json                # Project scripts and dependencies
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment routes and SPA rewrites
└── vite.config.ts              # Vite configuration and build optimizations
```

---

## 4. Page Structure

### 1. Home (`/`)
- **Purpose**: Welcomes prospective parents and students, establishes academic authority, presents results, explains curriculum paths, and drives admissions queries.
- **Major Sections**: 11 ordered sections (see Section 5 below).
- **Important Interactions**: Board selection tabs, student topper carousel, 4-stage Fundemics Method switcher, interactive CMS batch showcase, and direct WhatsApp CTAs.
- **Data Sources**: `rankersData.ts`, `teachers.ts`, `branches.ts`, `siteConfig.ts`.

### 2. Rankers (`/rankers`)
- **Purpose**: Serves as the official board examination distinction portal. Displays real student achievements across multiple academic sessions with verifiable board and school metadata.
- **Major Sections**: 
  - RankerHero (headline, statistics badges, scroll cue)
  - RankerCarousel (featured 3D perspective card carousel)
  - VerificationNotice (integrity statement and verification criteria)
  - RankerFilters (multi-axis filter bar: Board, Class, Session/Year)
  - RankerCard Grid (responsive cards displaying scores, school, and board badges)
  - Student Detail Modal (opens when clicking any ranker card)
  - IscAchievementArchive (collapsible historical archive from 2019 onwards)
  - AdmissionsCTA (closing enrollment CTA)
- **Important Interactions**: Real-time filtering by board (ICSE, ISC, CBSE), class, and year; student modal with detailed score breakdown; 3D card deck interaction.
- **Data Sources**: `src/data/rankersData.ts`.

### 3. Our Vision (`/vision`)
- **Purpose**: Details the educational ethos of Fundemics Tutorials—conceptual understanding over rote memorization, human care, and structured academic discipline.
- **Major Sections**:
  - Vision Hero (dark navy architectural canvas with fluid typography)
  - Three Core Pillars (Conceptual Rigor, Personal Mentorship, Disciplined Preparation)
  - Editorial Mentorship Showcase (individual mentorship container and standards)
  - The Learning Journey (systematic progression from foundational classes to board mastery)
  - Closing Institutional Statement
- **Important Interactions**: Dynamic scroll cue, interactive links to courses and queries.
- **Data Sources**: Static editorial content coordinated with `siteConfig.ts`.

### 4. Teachers (`/teachers`)
- **Purpose**: Presents the faculty, department heads, and academic leadership behind Fundemics Tutorials.
- **Major Sections**:
  - Faculty Hero (deep navy header with institutional badge)
  - Category Filter Bar (sticky department filter pills: Strategic Planning, Biology, Social Sciences, Mathematics, Physics, Operations, Chemistry, Computer Science, Commerce, Pre-Primary)
  - Faculty Department Grids (cards displaying qualification, subjects taught, classes handled, and bio)
  - Institutional Quality Assurance Notice
- **Important Interactions**: Category switching with real-time member counts; smooth scroll to departmental anchors.
- **Data Sources**: `src/data/teachers.ts`.

### 5. Queries (`/queries`)
- **Purpose**: Direct intake form for prospective students and parents seeking admission, batch details, or transport arrangements.
- **Major Sections**:
  - Direct Contact Info (Phone, WhatsApp, Email, Branch addresses)
  - Structured Enquiry Form (Student Name, Mobile Number, Email, Target Class, Board, Preferred Batch, Transport Requirement, Message)
  - Form Confirmation State (displays verification checklist and quick-contact phone)
- **Important Interactions**: Client-side validation (phone regex, required fields, character limits), branch selector (`Triveni Nagar`, `Faizullaganj`, `Aliganj`), instant reset.
- **Data Sources**: `src/data/branches.ts`, `src/data/siteConfig.ts`.

---

## 5. Homepage Architecture

The homepage is composed in `src/pages/HomePage.tsx` in the following strict order:

1. **Hero (`HeroSlideshow.tsx`)**: Full-viewport deep navy banner featuring the 10 Years of Excellence badge, headline "Educating for a Better Tomorrow", subtext, primary "Explore Courses" button, and secondary "Send a Query" CTA.
2. **Our Students, Our Pride (`FeaturedTopperCarousel.tsx`)**: High-impact editorial showcase displaying top rankers in an interactive 3D perspective card deck with scores and school details.
3. **Choose Your Path (`CoursesSection.tsx`)**: Board spectrum selector covering ICSE, CBSE, and State Board with academic stages (Primary, Middle, Secondary, Senior Secondary).
4. **The Fundemics Method (`WhyChooseFundemics.tsx`)**: "The Difference Is in How We Teach" section highlighting the 4 pedagogical principles (Attention, Direction, Measurement, Continuity).
5. **Specialized Support for CMS Students (`CmsBatchesSection.tsx`)**: Dedicated section for City Montessori School students with authentic celebration photography, morning batch alignment, and campus coverage.
6. **More Than Just Classes (`WhatMakesDifferent.tsx`)**: Scroll-synced timeline showcasing 5 core differentiators (Personalized Attention, Regular Testing, Student LMS Portal, Regular Attendance Tracking, Performance Tracking).
7. **Meet the Teachers (`TeachersSection.tsx`)**: Homepage faculty feature highlighting Founders Mayank Aggarwal and Manish K. Verma (IIT Dhanbad) with authentic photography and academic credentials.
8. **Our Vision (`VisionSection.tsx`)**: Institutional banner featuring the institute motto: *"Fundamentals First. Confidence Forever."*
9. **Our Centres (`CentresSection.tsx`)**: Physical locations in Lucknow featuring the Triveni Nagar flagship campus and surrounding branch centres.
10. **Certifications & Registration (`CertificationsSection.tsx`)**: Official ISO 9001:2015 and Government LLP Registration verification cards with modal previews and PDF download links.
11. **Admissions & Guidance CTA (`FinalContactCTA.tsx`)**: Closing section with direct phone and WhatsApp contact buttons.

---

## 6. Rankers / Results System

### Student Data Structure
All student ranker records reside in `src/data/rankersData.ts`. Each student record follows the `RankerRecord` interface:

```typescript
export interface RankerRecord {
  id: string;                      // Unique identifier e.g. "isc-2025-01"
  name: string;                    // Student full name
  board: 'ICSE' | 'ISC' | 'CBSE' | 'STATE BOARD';
  class: 'Class X' | 'Class XII'; // Normalized class
  className?: string;              // Optional alternate formatting
  year: string;                    // Academic session e.g. "2025–26", "2024–25"
  overallPercentage?: number | null;// Overall percentage e.g. 98.6
  percentileOrScore?: string;      // Formatted display string e.g. "98.6%"
  school?: string;                 // School name e.g. "City Montessori School, Lucknow"
  stream?: string;                 // e.g. "Science (PCM)", "Commerce"
  subjectScores?: Array<{          // Itemized subject scores
    subject: string;
    marks: number;
    maxMarks?: number;
  }>;
  image?: string;                  // Path from /public e.g. "/assets/rankers/student_name.png"
  achievementBadge?: string;       // e.g. "School Topper", "99 in Mathematics"
  isHistoricalArchive?: boolean;   // true for older archive records (2019–2023)
}
```

### Filtering Mechanics
- **Board Filter**: Toggles between `ALL`, `ICSE`, `ISC`, and `CBSE`.
- **Class Filter**: Dynamically extracts available classes from the active board data. Automatically resets to `ALL` if the current class isn't offered in the selected board.
- **Session Filter**: Dynamically extracts available academic years (e.g. `2025–26`, `2024–25`, `2023–24`).
- **Results Count**: Real-time counter updates with matching candidate count.

### 3D Perspective Card Carousel (`RankerCarousel.tsx` & `DeckCard.tsx`)
- High-performing students (sorted descending by `overallPercentage`) are arranged in an infinite-wrapping or clamped perspective carousel.
- Center card is elevated with interactive hover tilt, displaying student photograph, percentage badge, board badge, and school.
- Keyboard navigation (ArrowLeft / ArrowRight) and touch swipe gestures are supported with touch momentum dampening.

### Image Handling
- Photographs are stored as PNGs in `public/assets/rankers/`.
- The `<StudentImage />` component handles fallback initials/monograms gracefully if an image is missing or fails to load.

### How to Add a New Student Record
Add an object to the `rankersData` array in `src/data/rankersData.ts`:

```typescript
{
  id: 'isc-2026-new-candidate',
  name: 'Candidate Name',
  board: 'ISC',
  class: 'Class XII',
  year: '2025–26',
  overallPercentage: 97.4,
  percentileOrScore: '97.4%',
  school: 'City Montessori School, Gomti Nagar',
  stream: 'Science (PCM)',
  subjectScores: [
    { subject: 'Physics', marks: 98 },
    { subject: 'Mathematics', marks: 99 },
    { subject: 'Chemistry', marks: 95 },
  ],
  image: '/assets/rankers/candidate_name.png',
  achievementBadge: '99 in Mathematics',
},
```

---

## 7. Learning for Every Stage

Implemented in `src/components/home/CoursesSection.tsx`:

- **Board Switcher**: Horizontal tabs for **ICSE**, **CBSE**, and **STATE BOARD**.
- **Interactive State**: Clicking a board tab updates `activeBoardId`, transitioning the board description, official curriculum logo (`cisce_logo.jpeg`, `cbse_logo.jpeg`, `up_logo.webp`), and board-specific stages.
- **Academic Stages Rendered for Each Board**:
  1. **Primary**: Classes I–V (curiosity, foundational numeracy and reading)
  2. **Middle**: Classes VI–VIII (analytical thinking and basic proofs)
  3. **Secondary**: Classes IX–X (rigorous board exam preparation, precision testing)
  4. **Senior Secondary**: Classes XI–XII (in-depth Science/Commerce, derivations, entrance alignment)

---

## 8. The Fundemics Method

Implemented in `src/components/home/WhyChooseFundemics.tsx` under the heading *"The difference is in how we teach"*.

It defines 4 core pedagogical principles:
1. **01 ATTENTION — Small Batches**: Limited batch sizes ensuring every student participates and receives one-on-one attention.
2. **02 DIRECTION — Board-Focused Learning**: Curriculum aligned directly with ICSE, ISC, CBSE, and State Board syllabi.
3. **03 MEASUREMENT — Continuous Assessment**: Weekly checkpoints, unit tests, and performance reviews to identify gaps early.
4. **04 CONTINUITY — Beyond the Classroom**: 24/7 LMS access, curated revision notes, attendance monitoring, and parent communication.

**Interaction Model**:
- **Desktop (>= 1024px)**: Two-column layout. The right column displays an interactive timeline of the 4 principles with active vertical indicator bars. Clicking or hovering changes the active stage, triggering a smooth crossfade of the left graphic visual container and stage watermark.
- **Mobile (< 1024px)**: Stacked editorial card panels with synchronized progress pills (`STAGE 01 / 04`) that update on scroll.

---

## 9. Teachers

Implemented in `src/components/home/TeachersSection.tsx` and `src/pages/TeachersPage.tsx`:

### Leadership & Founders
- **Mayank Aggarwal**: Founder & Director, Head of Physics & Mathematics. Real photo: `/assets/mayank_aggarwal.jpeg`.
- **Manish K. Verma**: Co-Founder & Senior Mentor, B.Tech & M.Tech from IIT Dhanbad. Real photo: `/assets/manish_k_verma.jpeg`.

### Faculty Directory & Department Structure
The full faculty list is structured in `src/data/teachers.ts` across 10 departments:
1. Strategic Planning
2. Biology
3. Social Sciences
4. Mathematics
5. Physics
6. Operations & Support Team
7. Chemistry
8. Computer Science
9. Commerce
10. Pre-Primary

### Non-Permanent / Visiting Faculty Representation
Faculty members without an individual photo display an institutional monogram avatar generated from their initials (e.g. `MK` for Mohit Kumar) styled with deep navy and emerald accents via `<TeacherCard />`.

---

## 10. Images & Assets

### Asset Storage
- All public static images reside in `public/assets/`.
- Ranker photos are grouped in `public/assets/rankers/`.

### Authentic User-Provided Assets
- **Brand**: `public/assets/LOGO.png`
- **Board Logos**: `cisce_logo.jpeg`, `cbse_logo.jpeg`, `up_logo.webp`
- **Certificates**: `fundamics_iso_page_1.png`, `fundamics_certification_page_1.png`, `fundamics_iso.pdf`, `fundamics_certification.pdf`
- **Faculty Photos**: `mayank_aggarwal.jpeg`, `manish_k_verma.jpeg`
- **Student Photos**: 55 authentic `.png` photographs in `public/assets/rankers/` extracted from the institute's official board result documents (`Top_Scorers_*.docx`)
- **School Atmosphere**: `cms_focused.webp` (authentic celebration photo of CMS students)

### Policy on Synthetic / AI Imagery
- No synthetic AI people, fake classrooms, or stock imagery are permitted.
- Where an image is not available, clean graphic containers, monograms, or architectural gradients must be used.

### How to Add a New Authentic Photograph
1. Compress the photograph (WebP or high-quality JPEG/PNG, under 300KB).
2. Save into `public/assets/` (or `public/assets/rankers/` for students).
3. Reference with an absolute path starting with `/assets/...`.

---

## 11. Navigation & Direct Action Integrations

### Navbar (`src/components/layout/Navbar.tsx`)
- Fixed header with transparent-to-solid transition on scroll (`isScrolled > 30px`).
- Desktop Navigation: Home (`/`), Rankers (`/rankers`), Our Vision (`/vision`), Faculty (`/teachers`), LMS Portal (`external`), Call (`tel:+917617018888`), and "Send Query" (`/queries`).
- Mobile Navigation: Slide-over drawer with route links and quick-action call buttons.

### Verified Contact Actions
- **Primary Phone**: `+91 7617018888` (`tel:+917617018888`)
- **Secondary Phone**: `+91 7800001288` (`tel:+917800001288`)
- **WhatsApp Integration**:
  - Direct URL: `https://wa.me/917617018888`
  - WhatsApp Floating Button (`src/components/common/WhatsAppFloatingButton.tsx`) positioned fixed at bottom-right with dismissible tooltip.
  - CTAs in `FinalContactCTA.tsx` and `QueriesPage.tsx` open direct pre-filled WhatsApp conversations.

---

## 12. Responsive Behaviour

The site uses a fluid, mobile-first design strategy without third-party grid frameworks:

- **Desktop (>= 1024px)**:
  - 2-column editorial layouts with side-by-side sticky timelines (The Fundemics Method, CMS Batches, More Than Just Classes).
  - 3D perspective DeckCard carousel with expansive horizontal spacing.
  - Fixed horizontal navbar with direct action buttons.
- **Tablet (640px – 1023px)**:
  - Flexbox and CSS Grid adapt from multi-column to stacked 2-column or single-column.
  - Carousel card widths adjust dynamically (`stepWidth = 220px`).
- **Mobile (< 640px)**:
  - Single-column vertical stacks.
  - Navigation converts into a full-screen slide drawer with backdrop blur.
  - Carousel switches to touch-optimized swiping (`stepWidth = 170px`).
  - Mobile quick-call bar fixed at viewport bottom on key enquiry pages.
  - Typography uses fluid `clamp()` formulas (e.g. `clamp(2.5rem, 6vw, 4.2rem)`) to prevent overflow.

---

## 13. Important Interactions

1. **Ranker Carousel**:
   - Touch drag / swipe with pointer capture.
   - Arrow keys (`ArrowLeft`, `ArrowRight`) for accessible navigation.
   - Dynamic 3D card elevation based on distance from active center index.
2. **Ranker Modal**:
   - Clicking any student card opens a detailed score breakdown modal.
   - Accessible Escape-key listener and backdrop click to close.
3. **Board Selection Tabs**:
   - Animated tab switching with accessible ARIA tablist roles.
4. **Interactive Differentiators Timeline**:
   - Scroll-synchronized vertical progress bar in `WhatMakesDifferent.tsx`.
5. **Certificate PDF Viewer**:
   - Clicking any certification opens a preview modal with full resolution certificate view and direct PDF download link.

---

## 14. Adding New Content

### Adding a New Student
1. Place student portrait in `public/assets/rankers/student_name.png`.
2. Add a new `RankerRecord` in `src/data/rankersData.ts`.

### Adding a New Academic Result Session
1. Add new student records with the session tag (e.g. `year: "2026–27"`).
2. The session filter on `/rankers` will automatically detect the new year and render a filter pill.

### Adding a New Faculty Member
1. Add an entry to `teachersData` in `src/data/teachers.ts` under the appropriate `category`.
2. If a photograph is available, place it in `public/assets/` and set `image: '/assets/filename.jpeg'`.
3. If no photo is available, leave `image` undefined; the card automatically renders a stylized monogram.

### Updating Contact Information
1. Open `src/data/siteConfig.ts`.
2. Update phone numbers, WhatsApp numbers, email, or LMS links. All components consuming `siteConfig` update automatically.

---

## 15. Development & Maintenance Notes

- **Single Source of Truth**:
  - Student results: `src/data/rankersData.ts` (Never add mock ranker files).
  - Faculty: `src/data/teachers.ts`.
  - Site metadata & phones: `src/data/siteConfig.ts`.
  - Physical branches: `src/data/branches.ts`.
- **CSS Architecture**: Modify variables in `src/styles/tokens.css` to update global spacing, typography scales, or colors. Avoid hardcoding random hex values.
- **Performance Sensitivity**: The topper carousel in `src/components/results/RankerCarousel.tsx` handles fast animation frames and touch events; avoid heavy state updates inside animation loops.
- **Routing**: Internal routing uses `src/context/RouterContext.tsx`. Use `<Link href="/path">` rather than native `<a href="/path">` for internal client-side navigation.

---

## 16. Deployment

- **Hosting Platform**: Vercel.
- **Vercel Config**: `vercel.json` provides:
  - SPA URL rewrites (`"source": "/(.*)", "destination": "/index.html"`).
  - HTTP Security Headers (HSTS, Content-Type-Options, X-Frame-Options).
  - 1-year immutable caching for static assets in `/assets/`.
- **Build Command**: `npm run build` (`tsc -b && vite build`).
- **Build Output**: `dist/`.

---

## 17. Quick Explanation ("How to Explain This Project in 60 Seconds")

> *"Fundemics Tutorials is a modern, high-performance web platform built for a premier academic coaching institute in Lucknow. It is developed with React 19, TypeScript, and Vite, using a bespoke Vanilla CSS design system based on design tokens rather than generic utility frameworks.*
>
> *The site is built around authentic proof: it features 55 verified student rankers with verifiable board marks, an interactive 3D perspective results carousel, and official ISO and Government LLP certifications.*
>
> *Architecturally, the application is clean and data-driven: student records, faculty rosters, branches, and contact channels are centralized in typed single sources of truth. The user experience is tailored for both desktop and mobile, with instant WhatsApp and phone call triggers, structured query intake, and specialized batch coverage for City Montessori School students. The codebase has zero synthetic or AI-generated imagery, zero dead dependencies, and compiles to an ultra-fast production bundle in under one second."*
