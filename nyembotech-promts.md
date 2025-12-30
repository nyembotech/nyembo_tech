# Nyembotech Platform – AI Build Prompts (0–54)

A complete prompt specification for building the **Nyembotech** AI-native web platform:

- Stack: **Next.js + React + TypeScript + Tailwind + shadcn/ui + Firebase (Auth, Firestore, Storage)**
- Style: dark, futuristic **space-console** with Nyembotech solar color palette
- Scope: marketing site, admin console, customer portal, AI agents, smart spaces, academy, analytics, navigator, etc.

---

## Prompt 0 – Global Style & Color System (Nyembotech Palette)

> **PROMPT 0 – NYEMBOTECH GLOBAL STYLE SNIPPET**  
>  
> Design a futuristic, layered, 3D–neumorphic UI similar to a space-console / cockpit interface: large rounded cards, soft shadows, floating panels, pill-shaped buttons. Use **shadcn/ui** components styled with **Tailwind**.  
>  
> **Nyembotech core brand colors (MUST use):**  
> - `--nyembo-yellow`: `#F6E30F` (Bright yellow – primary highlight, key CTAs, main labels)  
> - `--nyembo-gold`: `#F9A825` (Golden orange – secondary accent, hovers, gradients with yellow)  
> - `--nyembo-red`: `#F54633` (Vibrant red–orange – warnings, critical, destructive actions)  
> - `--nyembo-sky`: `#35CBF8` (Sky blue – info, links, subtle glows, secondary CTAs)  
> - `--nyembo-white`: `#FFFFFF` (Text and icon emphasis on dark backgrounds)  
>  
> **Support / neutrals (you define exact shades):**  
> - Very dark background (`--background`) = near-black blue/charcoal  
> - Slightly lighter dark card surfaces for depth  
>  
> **Usage rules:**  
> - Primary CTA buttons: solid `#F6E30F` with `#F9A825` hover, subtle outer glow. Text in very dark color for contrast.  
> - Secondary CTAs: outline/ghost buttons with `#35CBF8` borders and text.  
> - Danger: `#F54633` with clear icons.  
> - Labels / chips / floating tags: `#F6E30F` or `#F9A825` over dark cards.  
> - Focus rings & glows: soft blur of `#35CBF8` or gradient between `#F6E30F` and `#F9A825`.  
>  
> **Typography:** bold, condensed sans-serif for headings (space/tech vibe), rounded sans for body. Headings can be all-caps in white with thin glowing underlines using brand colors.  
>  
> Overall feel: **dark space cockpit** with solar yellow/orange highlights, red alerts, blue energy glows, all on deep, soft-shadowed cards.

---

## Prompt 1 – Design System & shadcn Theme

> **PROMPT 1 – DESIGN SYSTEM & THEME**  
>  
> Act as a senior front-end architect + product designer.  
> Using **Next.js 14 (App Router)**, **React**, **TypeScript**, **Tailwind**, and **shadcn/ui**, define a complete design system for Nyembotech.  
>  
> Requirements:  
> - Use shadcn/ui as base (Button, Card, Input, Dialog, Sheet, Tabs, ScrollArea, etc.).  
> - Configure Tailwind + shadcn theme using the **Nyembotech global style snippet (Prompt 0)**.  
> - Define:  
>   - Tailwind theme extensions (colors, radii, shadows, font sizes).  
>   - CSS variables for Nyembotech palette.  
>   - Custom utility classes (`shadow-neumo`, `card-floating`, `border-glow`, etc.).  
> - Provide 3–4 example shadcn components fully styled:  
>   - `Button`, `Card`, `Input`, `NavigationMenu`  
>   - Show focus, hover, pressed states with 3D feel.  
>  
> Output: Tailwind config, theme setup, and component examples.

---

## Prompt 2 – Landing Shell & Navigation

> **PROMPT 2 – LANDING LAYOUT & NAVBAR**  
>  
> Build the **public shell** for the Nyembotech marketing site using Next.js App Router (`app/`), shadcn/ui, Tailwind and the Nyembotech style.  
>  
> Requirements:  
> - `app/layout.tsx` and `app/page.tsx` skeletons.  
> - Top nav: floating, rounded card separated from background with deep shadow.  
>   - Left: logo + wordmark.  
>   - Center links: Home, Solutions, Industries, Smart Spaces, Academy, About, Knowledge, Contact.  
>   - Right: “Login” (ghost) + “Launch a project” (primary).  
>   - Active route has glowing underline / chip.  
> - Hero section:  
>   - Heading: “Future-grade AI software for Africa.”  
>   - Subheading: 2 concise lines about AI-native + Africa/Europe bridge.  
>   - Two CTAs (primary + secondary).  
>   - Background: layered 3D card stack with tilt/parallax.  
>  
> Use shadcn components and Nyembotech palette. Hard-code content initially; later content will come from Firestore.

---

## Prompt 3 – Futuristic Content Cards & Panels

> **PROMPT 3 – SPACE CONSOLE CONTENT CARDS**  
>  
> Implement a reusable `FuturisticPanel` component to display key features and information in a console-like style.  
>  
> Requirements:  
> - Props: `title`, `subtitle`, `icon`, `ctaLabel`, `onCtaClick`, `variant` (`primary`, `accent`, `ghost`).  
> - Visual:  
>   - Rounded rectangles with subtle cut corners.  
>   - Layered 3D effect: outer shadow + inner highlight.  
>   - Hover: slight scale + stronger glow.  
> - Variants:  
>   - `primary`: dark card with yellow/gold border and glow.  
>   - `accent`: brighter card for spotlight sections.  
>   - `ghost`: transparent card with outline and blur.  
> - Create a landing page grid of 4 panels for Nyembotech’s main pillars:  
>   - AI Agents & Automation  
>   - Cloud & Legacy Modernization  
>   - Modern Workplace & Teams  
>   - Smart Spaces & Academy  
>  
> Use shadcn `Card` as base, styled with Nyembotech palette.

---

## Prompt 4 – Admin Dashboard Shell

> **PROMPT 4 – ADMIN DASHBOARD SHELL**  
>  
> Build an `AdminShell` layout for `/admin` using Next.js, shadcn/ui, Tailwind.  
>  
> Requirements:  
> - Left sidebar:  
>   - Logo + brand.  
>   - Nav items: Overview, Content, Projects, Customers, Tasks, Academy, Smart Spaces, Analytics, System, Labs, Settings.  
>   - Icons via `lucide-react`, glowing when active.  
> - Top bar:  
>   - Search input.  
>   - Live status indicator (green/yellow/red).  
>   - User avatar + menu.  
> - Main area:  
>   - Stats cards row (Active projects, Open tickets, Upcoming trainings).  
>   - Central panel with tabs: Projects / Tasks / Alerts.  
>   - All styled in 3D Nyembotech console style.  
>  
> Output: `AdminShell` layout + example `/admin/page.tsx` using it.

---

## Prompt 5 – Kanban Board for Internal Tasks

> **PROMPT 5 – INTERNAL KANBAN BOARD**  
>  
> Implement a Kanban board for internal tasks at `/admin/tasks`.  
>  
> Requirements:  
> - Columns: `Backlog`, `In Progress`, `Blocked`, `Done`.  
> - Firestore `tasks` collection:  
>   - `{ id, title, description, status, projectId?, assigneeInitials, priority, createdAt }`.  
> - Each column = tall 3D card with header chip label.  
> - Drag-and-drop tasks between columns using a library (`@dnd-kit` or similar).  
> - Task card: title, project tag, assignee initials, priority pill, small progress bar.  
> - “New Task” button triggers shadcn `Dialog` with create form.  
> - Hover: card lifts and border glows with Nyembotech colors.  
>  
> Implement with real Firestore reads/writes.

---

## Prompt 6 – Customer Portal Dashboard

> **PROMPT 6 – CUSTOMER PORTAL HOME**  
>  
> Build `/portal` for logged-in customers.  
>  
> Requirements:  
> - Greeting: “Welcome back, [Name]. Here’s your Nyembotech mission status.”  
> - Cards:  
>   - Projects: list active projects with status chips and progress.  
>   - Support Tickets: open count + last few.  
>   - Upcoming Milestones: timeline or table.  
> - Bottom: horizontal “insight cards” with metrics like AI deflection rate.  
> - Use `framer-motion` for subtle entrance + hover animations.  
> - Fully styled with Nyembotech console look.  
>  
> Use data from Firestore (`projects`, `tickets`, `milestones`) via hooks.

---

## Prompt 7 – Smart Spaces & Academy Pages (UI)

> **PROMPT 7 – SMART SPACES & ACADEMY UI**  
>  
> Create two rich public pages: `/smart-spaces` and `/academy`.  
>  
> **`/smart-spaces`**  
> - Hero: “Turn your building into a living system.”  
> - Sections:  
>   - What we automate (Access, Security, Climate, Energy, AI concierge).  
>   - 3D-style cards showing room controls (lights, temperature, locks).  
>   - Project journey timeline (Survey → Design → Install → Configure → Monitor).  
>   - “Transform my space” CTA form (name, company, property type, location, budget band).  
>  
> **`/academy`**  
> - Hero: “Nyembotech Academy – train your team for the AI era.”  
> - Tabs (shadcn Tabs): Engineers, Business Teams, Leadership.  
> - Each tab: program cards with duration, level, format, next date.  
> - Floating CTA ribbon: “Book a custom training”.  
>  
> Use Nyembotech palette and console styling.

---

## Prompt 8 – Firestore-Driven CMS Editor

> **PROMPT 8 – CMS EDITOR FOR SITE CONTENT**  
>  
> Implement `/admin/content/[pageId]` as a CMS for editing Firestore-driven site content.  
>  
> Requirements:  
> - `site_content` collection with docs: `home`, `solutions`, `industries`, `about`, `academy`, `smart-spaces`, etc.  
> - Example doc shape:  
>   ```ts
>   {
>     hero: { title, subtitle, ctaPrimary, ctaSecondary? },
>     sections: Array<{
>       key: string;
>       type: "cards" | "text" | "timeline" | "grid";
>       data: any;
>     }>
>   }
>   ```  
> - Editor UI:  
>   - List of sections as 3D cards with section keys.  
>   - Inline editors for hero + each section’s fields using shadcn Inputs, Textareas, Selects.  
>   - Add/remove simple cards for `cards` sections.  
>   - Right-side live preview using the same components as public pages.  
>   - “Save” button with glowing Nyembotech style + unsaved-changes indicator.  
>  
> Save to Firestore with optimistic updates.

---

## Prompt 9 – Spine & 3D Animated Hero Integration

> **PROMPT 9 – SPINE / ANIMATED HERO SCENE**  
>  
> Integrate a **Spine animation** into the landing hero.  
>  
> Requirements:  
> - Create `HeroSpineScene` component that:  
>   - Renders a Spine animation via a React wrapper (`SpinePlayer` or similar).  
>   - Accepts props: `variant`, `autoPlay`, `loop`, `onEvent`.  
> - Place this in the landing hero behind or beside CTAs.  
> - Use `framer-motion` or CSS transforms to layer static panels in front/behind the Spine canvas for depth.  
> - Provide graceful fallback (static image/illustration) for mobile or unsupported environments.  
>  
> Output: component + usage; stub logic for wiring actual Spine assets.

---

## Prompt 10 – Micro-Interactions & Motion Patterns

> **PROMPT 10 – MICRO-INTERACTIONS PACK**  
>  
> Create a small motion + effects toolkit for Nyembotech UI.  
>  
> Requirements:  
> - CSS/Tailwind helpers for:  
>   - Soft hover lift (`.hover-lift-neumo`).  
>   - Glowing border pulse (`.border-pulse-primary`).  
>   - Ambient float animation for icons or chips.  
> - `MotionCard` wrapper using `framer-motion`:  
>   - Entrance animation (fade + slide).  
>   - Hover scale + shadow change.  
> - Show how to apply these to: nav items, CTAs, hero cards, Kanban tasks, portal cards.  
>  
> All animations must be subtle and performant.

---

## Prompt 11 – Auth & Role-Based Routing

> **PROMPT 11 – AUTH & ROLE-BASED ACCESS**  
>  
> Implement authentication and authorization with **Firebase Auth + Firestore**.  
>  
> Requirements:  
> - Roles: `admin`, `staff`, `customer`.  
> - Firestore profile docs: `{ uid, role, displayName, photoUrl? }`.  
> - `useAuth` hook returns `{ user, role, loading, signIn, signOut }`.  
> - Route guards:  
>   - `/admin/**` → `admin` or `staff`.  
>   - `/portal/**` → `customer`.  
>   - Public routes remain open.  
> - Guard implementation: layout wrappers or middleware for App Router.  
> - `/login` page:  
>   - Nyembotech console styling (“ACCESS GATE”).  
>   - Email/password form using Firebase Auth.  
>   - Toggle UI for Admin vs Customer view (still same Auth backend).  
> - DO NOT store passwords in Firestore, use Firebase Auth only.  

---

## Prompt 12 – Firestore Data Layer & Hooks

> **PROMPT 12 – DATA HOOKS & TYPES**  
>  
> Build a clean Firestore data layer with TypeScript types + hooks.  
>  
> Types for: `Customer`, `AdminUser`, `Project`, `Task`, `Ticket`, `AcademyEvent`, `SmartSpaceInstall`.  
>  
> Hooks:  
> - `useCustomers()`, `useCustomer(id)`  
> - `useProjects(filters?)`, `useProject(id)`  
> - `useTasksByProject(projectId)`  
> - `useTicketsForCustomer(customerId)`  
> - `useAcademyEvents()`  
>  
> Each hook:  
> - Uses Firestore queries + `onSnapshot`.  
> - Handles `loading` / `error`.  
> - Provides simple mutators `create`, `update`, `remove` where appropriate.  
>  
> Put Firestore logic in a `services/firebase` module; keep UI decoupled.

---

## Prompt 13 – Project Request Pipeline (Contact Form → Admin)

> **PROMPT 13 – PROJECT REQUEST FLOW**  
>  
> Implement full flow from public **contact form** to admin pipeline.  
>  
> Requirements:  
> - `project_requests` collection:  
>   - `{ id, contactName, email, phone, companyName, country, problem, desiredSolutionType, urgency, budgetBand, status ("new"|"in-review"|"converted"|"rejected"), requestCode, createdAt }`.  
> - `/contact` multi-step form:  
>   1. About you (name, email, phone, company, country).  
>   2. About project (problem, solution type, urgency, budget).  
>   3. Extra details.  
> - On submit: create `project_requests` doc and show “MISSION RECEIVED” page with `requestCode` and link to `/status?code=...`.  
> - `/admin/requests`:  
>   - Table of requests with filters by status.  
>   - Detail drawer with full info and notes.  
>   - Actions: `Mark In Review`, `Convert to Project`, `Reject`.  
> - On Convert: create `projects` entry and set `project_requests.status = "converted"`.  

---

## Prompt 14 – Public `/status` Page

> **PROMPT 14 – PUBLIC STATUS PAGE**  
>  
> Implement `/status` where users can check their project or request status with a code.  
>  
> Requirements:  
> - Input field for `code` + “Check status” button.  
> - On valid code (from `project_requests` or `projects`):  
>   - Show name, company, high-level `publicStatus`, `publicNotes`.  
>   - Phase indicator (Discovery, Proposal, Build, Testing, Launch, Maintenance).  
>   - Progress bar + timeline of milestones.  
> - On invalid code: show red/orange warning card with guidance.  
> - Only show public-safe messages.  

---

## Prompt 15 – Notifications & Activity Feed

> **PROMPT 15 – NOTIFICATIONS & ACTIVITY LOG**  
>  
> Create an `activity_log` system.  
>  
> - Collection: `activity_log` with docs:  
>   - `{ id, type, actorId, targetType, targetId, message, createdAt, visibility: "admin" | "customer" | "both" }`.  
> - Admin:  
>   - Topbar bell icon with notification badge.  
>   - Click → shadcn Sheet/Popover listing latest activities.  
>   - `/admin/activity` page with filters.  
> - Customer:  
>   - “Recent updates” panel on `/portal`, showing only `visibility !== "admin"` and relevant `customerId`.  
> - Helper: `logActivity({ type, actorId, targetType, targetId, message, visibility })`.  

---

## Prompt 16 – Customer Onboarding Flow

> **PROMPT 16 – CUSTOMER ONBOARDING PIPELINE**  
>  
> Implement onboarding from admin-created customer to first login.  
>  
> Requirements:  
> - `/admin/customers`:  
>   - “New Customer” dialog (companyName, contactName, email, country, phone, industry).  
>   - On submit:  
>     - Create Firebase Auth user with temp password.  
>     - Create `customers` doc with metadata.  
>     - Create `customer_invites` doc with one-time token and expiry.  
> - `/onboarding` public page:  
>   - Validates token, loads invite.  
>   - Lets user set new password, confirm profile, accept terms.  
>   - On success: mark invite used and log them in.  
> - First `/portal` visit: show “Welcome” tour with 3–4 tooltips.  

---

## Prompt 17 – Firestore Security Rules & Audit Trail

> **PROMPT 17 – SECURITY RULES & AUDIT**  
>  
> Write Firestore Security Rules for Nyembotech:  
>  
> - Only `admin`/`staff` can read/write: `projects`, `tasks`, `project_requests`, `activity_log`, `site_content`, `feature_flags`, etc.  
> - Customers can:  
>   - Read only their own `projects`, `tickets`, `documents`, relevant `activity_log`.  
>   - Create tickets and comments tied to their own `uid`.  
> - Anonymous users: only read public content (e.g., some `site_content`, maybe `knowledge_articles`); no writes.  
> - Document the audit strategy: critical changes logged to `activity_log`, optionally snapshotting before/after values.  
>  
> Output: `firestore.rules` + explanation.

---

## Prompt 18 – Performance, SEO & OG Meta

> **PROMPT 18 – PERFORMANCE & SEO SETUP**  
>  
> Optimize the public site for performance & SEO.  
>  
> Requirements:  
> - Use server components + ISR for `/`, `/solutions`, `/industries`, `/about`, `/academy`, `/smart-spaces`, `/knowledge`.  
> - Implement `generateMetadata` with:  
>   - `title`, `description`, `openGraph`, `twitter` for key pages.  
>   - OG image routes with Nyembotech styling (dark BG, yellow headline, blue glow).  
> - Register analytics events (page views, CTA clicks).  
> - Apply best practices: link prefetch, image optimization, lazy load heavy animations, script minimization.  

---

## Prompt 19 – I18N Setup (Swahili, English, German)

> **PROMPT 19 – MULTI-LANGUAGE SUPPORT**  
>  
> Add multi-language support for Swahili (`sw`), English (`en`), and German (`de`).  
>  
> - Use a Next.js-compatible i18n library (`next-intl` / `next-i18next`).  
> - Strategy:  
>   - Either locale JSON files or per-locale `site_content_<locale>` docs.  
>   - Admin CMS allows switching locale and editing content.  
> - URL structure: `/en/...`, `/sw/...`, `/de/...`; persist user choice with localStorage.  
> - Ensure project statuses, CTA labels, and all public-facing strings are translated.  

---

## Prompt 20 – Analytics & Admin Insights Dashboard

> **PROMPT 20 – ANALYTICS CONSOLE**  
>  
> Build `/admin/analytics` to show key metrics.  
>  
> Metrics (fake or real):  
> - Active customers  
> - Projects by status over time  
> - Tickets by status + average resolution time  
> - Request → project conversion rate  
> - Academy bookings / revenue  
>  
> Use a chart lib (e.g., Recharts) styled with Nyembotech colors (yellow/gold main, blue secondary, red for anomalies).  
> Layout: metrics strip at top, charts grid, table of top customers.  

---

## Prompt 21 – Demo Data Seeder (Dev / Staging)

> **PROMPT 21 – DEMO SEED SCRIPT**  
>  
> Create a Node/TS script to seed dev/staging Firestore:  
>  
> - 5–10 customers across industries/countries.  
> - 10–20 projects with different statuses.  
> - 30–50 tasks spread across projects.  
> - 10–15 tickets.  
> - 3–5 academy events + some enrollments.  
> - Several `site_content` docs with nice demo copy.  
>  
> Spread timestamps over months.  
> Provide script + `npm run seed:dev` command, targeting emulator or dev Firebase project.

---

## Prompt 22 – CI/CD Pipeline

> **PROMPT 22 – CI/CD PIPELINE DESIGN**  
>  
> Implement GitHub Actions (or similar) CI/CD:  
>  
> - Environments: `dev`, `staging`, `prod` mapped to distinct Firebase projects and env vars.  
> - Pipeline steps:  
>   1. Lint + Typecheck  
>   2. Unit tests (+ optional E2E on staging)  
>   3. Build Next.js  
>   4. Deploy to hosting (Vercel or Firebase Hosting)  
>   5. Deploy Firestore rules/indexes  
> - Branch strategy:  
>   - `main` → staging  
>   - tags (`vX.Y.Z`) → production  
> - Post-deploy smoke test (`/api/health`).  

---

## Prompt 23 – E2E Tests for Core Flows

> **PROMPT 23 – E2E TESTING (PLAYWRIGHT/CYPRESS)**  
>  
> Write E2E tests for:  
>  
> - Public user:  
>   - Visit `/`, go to `/contact`, submit a project request, see success + code.  
> - Admin:  
>   - Login, open `/admin/requests`, see new request, convert to project.  
>   - Open `/admin/tasks`, create a task, move it across columns.  
> - Customer:  
>   - Complete onboarding link → first login.  
>   - View `/portal`, open project, create a ticket, see it listed.  
>  
> Use stable selectors (e.g. `data-testid`) and assert on visible text.

---

## Prompt 24 – Accessibility & Responsive Design Audit

> **PROMPT 24 – A11Y & RESPONSIVE PASS**  
>  
> Improve accessibility and responsiveness.  
>  
> - Keyboard navigation: menus, tabs, dialogs, Kanban columns, hero scenes.  
> - Focus styles: visible outlines using `#35CBF8`.  
> - Color contrast validation; adjust text colors where needed.  
> - ARIA labels for nav, sidebars, Kanban columns, health indicators, chat.  
> - Responsive design:  
>   - Mobile: stacked cards, collapsible admin sidebar, simplified Kanban.  
>   - Tablet: two-column layouts.  
>   - Desktop: full console look.  
>  
> Provide a checklist of improvements + updated components.

---

## Prompt 25 – AI Support & Sales Agents

> **PROMPT 25 – AI SUPPORT & SALES AGENTS**  
>  
> Implement two LLM-based agents:  
> 1. **Support agent** (“Nyembo Support”) in `/portal`.  
> 2. **Sales agent** (“Nyembo Guide”) on public site.  
>  
> Requirements:  
> - `useChatAgent` hook config: `agentType`, `userId?`, `projectId?`, `language`.  
> - Next.js API route `/api/agent` calls LLM backend (OpenAI/Azure).  
> - Context from Firestore:  
>   - Knowledge base (`knowledge_articles`, `site_content`).  
>   - For support: customer’s projects, tickets, public project notes.  
>   - For sales: solutions, case studies, service catalog.  
> - Chat UI using shadcn + Nyembotech styling, with quick action buttons.  
> - Log sessions + messages in `agent_sessions` and subcollections.  
> - Enforce data visibility: support agent only uses that customer’s data.

---

## Prompt 26 – Internal AI Architect Assistant

> **PROMPT 26 – AI ARCHITECT PANEL**  
>  
> Build `/admin/ai-architect` for internal architecture reasoning.  
>  
> - Text area to paste client stack + context.  
> - Buttons: “Propose architecture”, “Migration steps”, “Risk analysis”, “Complexity estimate”.  
> - Backend: LLM call with Nyembotech patterns (microservices, cloud, security).  
> - Response: structured sections (Diagram description, Components, Risks, Next steps).  
> - “Save to project” button writes architecture notes into related `projects` or `project_requests`.  
> - Log usage to `activity_log`.  

---

## Prompt 27 – AI Insights Layer

> **PROMPT 27 – AI INSIGHTS FOR ADMINS & CUSTOMERS**  
>  
> Add AI-generated insights panels to `/admin` and `/portal`.  
>  
> - For admins: cross-company view (projects at risk, ticket trends, training demand).  
> - For customers: their own project & support summary.  
> - Backend:  
>   - Aggregate Firestore data into compact JSON summaries.  
>   - Send to LLM with instructions to produce short bullet insights, each with severity (Info, Opportunity, Warning).  
> - UI:  
>   - “AI Insights” card with severity tags.  
>   - Admin side: “Create task from insight” shortcut.  

---

## Prompt 28 – Smart Spaces IoT Abstraction

> **PROMPT 28 – SMART SPACES IOT LAYER**  
>  
> Define IoT abstraction for Smart Spaces.  
>  
> - Interfaces: `Device`, `Sensor`, `Actuator`, `Scene`.  
> - Firestore:  
>   - `smart_spaces`, `devices`, `device_logs`.  
> - Backend: `smartSpacesClient` module hides vendor-specific details (MQTT/REST).  
> - `/admin/smart-spaces/[id]`: admin view with device grid, status, last reading, controls.  
> - `/portal/smart-space`: simplified control for customer.  
> - Event receiver (function stub) from IoT broker → writes to `device_logs`.  

---

## Prompt 29 – Academy Booking Flow

> **PROMPT 29 – ACADEMY BOOKING**  
>  
> Implement training booking from `/academy` to admin.  
>  
> - Public: multi-step booking form (company, program, dates, participants, format, notes).  
> - Firestore `academy_bookings`: `{ company, contact, programId, size, dates, format, notes, status }`.  
> - `/admin/academy`: list bookings with statuses (`requested`, `proposal-sent`, `confirmed`, `completed`).  
> - Details drawer with actions and invoice reference generation.  

---

## Prompt 30 – Document Vault

> **PROMPT 30 – DOCUMENT VAULT (STORAGE + FIRESTORE)**  
>  
> Add document management for projects/customers.  
>  
> - `documents` collection:  
>   - `{ id, projectId?, customerId?, title, type, url, uploadedBy, visibility ("admin"|"customer"|"both"), createdAt }`.  
> - Admin `/admin/projects/[id]`:  
>   - “Documents” tab with upload, tags (Contract, Architecture, UX, Training, Other).  
> - Customer `/portal/projects/[id]`:  
>   - Sees only docs with `visibility !== "admin"`.  
>   - Can upload their own assets (tagged as customer uploads).  
> - Implement upload UI with drag-and-drop, progress bar, and Nyembotech styling.  

---

## Prompt 31 – Knowledge Hub / Blog

> **PROMPT 31 – KNOWLEDGE HUB / BLOG**  
>  
> Implement `/knowledge` and `/knowledge/[slug]` for articles.  
>  
> - `knowledge_articles` collection:  
>   - `{ title, slug, summary, content, category, tags[], authorId, publishedAt, language }`.  
> - `/knowledge`: searchable/filterable list.  
> - `/knowledge/[slug]`: article page with strong Nyembotech styling.  
> - `/admin/knowledge`: CRUD editor with rich text / MDX + preview.  
> - Ensure this content is used as context for AI agents.  

---

## Prompt 32 – Observability & System Health

> **PROMPT 32 – OBSERVABILITY LAYER**  
>  
> Add observability:  
>  
> - Error tracking (e.g. Sentry) wired to Next.js client + server.  
> - `/api/health`: check Firestore, Auth, Storage; return JSON status.  
> - `/admin/system`: admin-only: shows health indicators, error trend, last critical issues.  
> - Use Nyembotech styling (status tiles with green/yellow/red badges).  

---

## Prompt 33 – Feature Flags & Labs

> **PROMPT 33 – FEATURE FLAGS & LABS**  
>  
> Implement feature flags.  
>  
> - `feature_flags` collection: `{ key, enabled, targetRoles?, targetEmails?, description }`.  
> - `useFeatureFlag(key)` hook: returns `{ enabled, metadata }`.  
> - Use flags to gate AI Insights, AI Architect, Smart Spaces IoT, Navigator, etc.  
> - `/admin/labs`: control panel for toggling flags and setting targeting.  

---

## Prompt 34 – Multi-Tenant Readiness

> **PROMPT 34 – MULTI-TENANT MODEL**  
>  
> Prepare for multi-tenant (future white-label).  
>  
> - Add `organizationId` field to: `customers`, `admins`, `projects`, `tasks`, `tickets`, `activity_log`, `academy_events`, `documents`, `smart_spaces`, `feature_flags`, etc.  
> - Ensure Firestore queries always filter by `organizationId`.  
> - Provide org-switch UI for super-admins (e.g. in admin topbar).  
> - Document migration from single-tenant to multi-tenant.  

---

## Prompt 35 – Data Export & Account Management (GDPR-friendly)

> **PROMPT 35 – DATA EXPORT & ACCOUNT DELETION**  
>  
> Implement data export & deletion flow.  
>  
> - `/portal/settings`:  
>   - “Download my data” → triggers backend job to export projects, tickets, document metadata, activity logs into JSON/ZIP.  
>   - “Request account deletion” → create `deletion_requests` doc.  
> - `/admin/customers/[id]`:  
>   - Panel for open deletion requests.  
>   - Confirm deletion: disable Auth account, anonymize PII in Firestore (keep non-identifying audit traces).  

---

## Prompt 36 – Marketing Copy Studio

> **PROMPT 36 – MARKETING COPY STUDIO**  
>  
> `/admin/marketing`: AI-powered copy generator.  
>  
> - Modes:  
>   - Landing hero  
>   - Solutions section  
>   - Email sequence  
> - Inputs: target industry, persona, problem, tone sliders.  
> - Use LLM to generate copy; display result.  
> - “Send to CMS” button updates `site_content` drafts.  
> - Store outputs in `marketing_drafts`.  

---

## Prompt 37 – Translation Assistant (EN/SW/DE)

> **PROMPT 37 – TRANSLATION ASSISTANT**  
>  
> `/admin/translate`: AI-based translation of copy between English, Swahili, German.  
>  
> - Left: source text + source language.  
> - Right: translations to other two languages.  
> - Buttons to push translated content into `site_content_<locale>` or `knowledge_articles` localized fields.  
> - Keep key brand/product terms consistent.  
> - Store translation jobs in `translations` collection.  

---

## Prompt 38 – Full Project Registration Flow (Public & Portal)

> **PROMPT 38 – PROJECT REGISTRATION FLOW**  
>  
> Implement full flow for new projects, public + logged-in customers.  
>  
> - `projects` collection fields include:  
>   - `createdByUid?`, `customerId?`, `contactName`, `contactEmail`, `companyName`, `phone`, `country`,  
>   - `title`, `description`, `projectType`, `businessImpact`, `budgetBand`, `urgency`,  
>   - `status` (`new`, `contacted`, `qualified`, `proposal-sent`, `won`, `lost`),  
>   - `source` (`public-form`, `customer-portal`, `internal`),  
>   - `projectCode`, `createdAt`, `updatedAt`.  
> - Public: “Start a Project” wizard on Home/Contact.  
> - Portal: `/portal/projects` → “Register New Project” for existing customers (pre-fill contact).  
> - Admin: `/admin/projects` highlights `status = "new"` projects for follow-up, with actions to mark contacted/qualified/won/lost.  
> - `/status` shows public-safe status messages based on `status`.  

---

## Prompt 39 – Project & Lead CRM Board

> **PROMPT 39 – CRM BOARD**  
>  
> `/admin/crm`: Kanban CRM board for projects/leads.  
>  
> - Columns: `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`.  
> - Each card = project with title, company, contact, source, type, budget band, createdAt.  
> - Drag-and-drop changes `status`.  
> - Details panel with full info, notes, quick actions.  
> - Filters: projectType, country, industry.  
> - Log moves via `activity_log`.  

---

## Prompt 40 – Homepage Content Generator

> **PROMPT 40 – HOMEPAGE CONTENT (FIRESTORE STRUCTURE)**  
>  
> Act as marketer; generate structured content for `site_content.home`.  
>  
> Sections:  
> 1. Hero: headline, subheadline, primary/secondary CTAs.  
> 2. Trust strip: 4 bullet statements.  
> 3. 4 pillars: AI Agents, Cloud Modernization, Modern Workplace, Smart Spaces & Academy – with title, short description, 3 outcome bullets each.  
> 4. Industries teaser: intro text + cards (Retail, Logistics, Finance, Health, Government) with pain + promise lines.  
> 5. Process steps: Discover, Design, Build, Launch, Evolve with short descriptions.  
> 6. Micro case snippets (4 example impact statements).  
> 7. Final CTA section.  
>  
> Output as JSON-like object ready for Firestore.

---

## Prompt 41 – Solutions Page Content

> **PROMPT 41 – SOLUTIONS PAGE CONTENT**  
>  
> Generate structured content for `site_content.solutions`.  
>  
> Sections:  
> - Intro paragraph.  
> - For each solution area (AI Agents, Cloud & Legacy, Modern Workplace, Smart Spaces, Academy):  
>   - Summary (1–2 sentences).  
>   - “Best for” bullets.  
>   - “What we build” bullets.  
>   - “Business outcomes” bullets.  
>   - Short mini-story example.  
> - Closing “Why choose Nyembotech” with 5 differentiator bullets.  

---

## Prompt 42 – Industries Page Content

> **PROMPT 42 – INDUSTRIES PAGE CONTENT**  
>  
> Generate `site_content.industries`.  
>  
> For each industry (Retail & eCommerce, Logistics & Transport, Finance/SACCOs, Healthcare, Education, Government/NGOs):  
> - Title  
> - 2–3 sentence description of local challenges  
> - 3 “Key pains” bullets  
> - 3 “What Nyembotech delivers” bullets  
> - 1 signature solution idea  
>  
> Also provide intro + closing paragraph and CTA.

---

## Prompt 43 – Smart Spaces Page Content

> **PROMPT 43 – SMART SPACES CONTENT**  
>  
> Generate structured content for `site_content.smart-spaces`:  
>  
> - Hero headline + subheadline.  
> - “What we automate” bullets (Access, Security, Climate, Energy, AI Concierge) with 1–2 lines each.  
> - Paragraph: “Why Smart Spaces matter now in Africa”.  
> - Smart Office tiers (Starter, Pro, Enterprise) with features and ideal customer.  
> - Smart Home section: 3–4 bullets for safety, convenience, energy.  
> - Project journey steps.  
> - CTA copy for “Transform my space” form.

---

## Prompt 44 – Academy Page Content

> **PROMPT 44 – ACADEMY PAGE CONTENT**  
>  
> Generate `site_content.academy`:  
>  
> - Hero: headline + subheadline.  
> - Tracks: Engineers, Business Teams, Leadership – summary + 3 outcomes each.  
> - 4–6 program examples with name, audience, duration, format, outcomes.  
> - “How we run trainings” text.  
> - Corporate benefits (4 bullets).  
> - Strong CTA copy for booking.  

---

## Prompt 45 – About Page Content

> **PROMPT 45 – ABOUT PAGE CONTENT**  
>  
> Generate `site_content.about`:  
>  
> - Mission statement (1–2 sentences).  
> - Vision paragraph.  
> - Story: Tanzania roots, European exposure, why Nyembotech exists.  
> - Values (5 bullets).  
> - “Where we operate” (TZ + DE) paragraphs.  
> - “How it feels to work with us” (4 bullets).  
> - CTAs for working with Nyembotech (clients) and working at Nyembotech (careers).  

---

## Prompt 46 – Case Studies & Knowledge Seed Content

> **PROMPT 46 – SEED CASE STUDIES & ARTICLES**  
>  
> Generate seed data for:  
> - 3–5 case studies  
> - 6–10 knowledge articles  
>  
> **Case studies:**  
> - Title, industry, country, client size, problem, solution bullets, result bullets, summary “quote”.  
>  
> Include cases like: telco AI support, smart office build, cloud modernization for SACCO, logistics optimization, AI training program.  
>  
> **Knowledge articles:**  
> - Title, 1–2 sentence summary, category, 4–6 bullet outline points.  

---

## Prompt 47 – Filling Empty CMS Fields

> **PROMPT 47 – AUTO-FILL EMPTY CONTENT FIELDS**  
>  
> Given a `site_content` JSON with empty strings/nulls, inspect page key (`home`, `solutions`, etc.) and section keys, and generate context-appropriate text for each missing field using Nyembotech positioning.  
>  
> Rules:  
> - Short, punchy, value-oriented.  
> - No “Lorem ipsum”.  
>  
> Return a fully-populated content object.

---

## Prompt 48 – Multi-Language Copies for Site Content

> **PROMPT 48 – TRANSLATE SITE CONTENT (EN→SW/DE)**  
>  
> Given `site_content` in English, create corresponding Swahili and German versions: `site_content_sw`, `site_content_de`.  
>  
> - Preserve keys and structure.  
> - Translate text naturally.  
> - Keep brand name and some tech terms as-is where appropriate.  

---

## Prompt 49 – Business Navigator Super-Agent

> **PROMPT 49 – BUSINESS NAVIGATOR SUPER-AGENT**  
>  
> Build `/portal/navigator`:  
>  
> - Inputs: budget range, region, area of interest.  
> - Chat UI with a “Business Navigator” agent.  
> - First message: summarize constraints + propose 3–5 business/digital directions.  
> - Agent explains: idea, why it fits budget/region, risks, dependencies, tech stack, where Nyembotech can help.  
> - Use LLM backend with Nyembotech offerings and knowledge context (via Prompt 50).  
> - Log sessions in `navigator_sessions`.  

---

## Prompt 50 – Knowledge Ingestion from PDFs / MD for Navigator

> **PROMPT 50 – PDF/MD KNOWLEDGE PIPELINE**  
>  
> `/admin/knowledge-upload`:  
>  
> - Upload `.pdf` / `.md` files.  
> - Store raw file in Storage.  
> - Extract text server-side, chunk into 300–800 token pieces.  
> - Store in `navigator_knowledge`: `{ docId, docTitle, sourceType, language, chunk, chunkIndex, tags[] }`.  
> - Optionally store embeddings for semantic search.  
>  
> Retrieval helper:  
> - For each Navigator query, perform similarity search to get top N chunks.  
> - Provide these chunks as context to the LLM.  

---

## Prompt 51 – TODO Plan Generator & Task Export

> **PROMPT 51 – ACTION PLAN FROM NAVIGATOR**  
>  
> Extend Navigator with plan generation.  
>  
> - In navigator UI: button “Turn this idea into a 30-day action plan”.  
> - Backend: LLM returns structured JSON grouped into phases (Research, Setup, Build, Launch, Iterate) with tasks `{ title, description, ownerType, timing }`.  
> - Show as “Mission Timeline” view.  
> - “Export tasks to portal”: write to `navigator_plans` and optionally to user’s own `tasks`/`portal_tasks`.  
> - Highlight tasks where Nyembotech is recommended owner.  

---

## Prompt 52 – Mapping Navigator Output to Nyembotech Services

> **PROMPT 52 – SERVICE RECOMMENDATIONS FROM NAVIGATOR**  
>  
> Create `service_catalog` collection: `{ id, name, category, idealBudgetRange, idealIndustries[], idealRegions[], shortDescription, engagementModels[] }`.  
>  
> When Navigator generates an idea/plan:  
> - Match relevant services based on budget, industry, region, and tasks flagged for Nyembotech.  
> - Provide subset to LLM; instruct it to include at most 3 under a “Where Nyembotech fits” section.  
> - In UI, show service cards linking to `/solutions` or `/contact` with pre-filled context.  
> - `/admin/services` to maintain catalog.  

---

## Prompt 53 – Navigator Session History & Revisit

> **PROMPT 53 – NAVIGATOR HISTORY & CONTINUATION**  
>  
> Support multi-session Navigator usage.  
>  
> - `navigator_sessions`: `{ id, userId, createdAt, updatedAt, activeIdeaSummary, budgetBand, initialInterest, status }`.  
> - `navigator_messages`: chat history.  
> - `navigator_plans`: plans linked to sessions.  
>  
> `/portal/navigator`:  
> - Sidebar or top list of past missions (session list).  
> - Clicking loads previous chat and plan.  
>  
> `/portal` home: “Pick up where you left off” card for last active Navigator session.  
>  
> `/admin/navigator`: summarised view of idea types by industry/budget (anonymized).  

---

## Prompt 54 – Navigator Guardrails & Ethics

> **PROMPT 54 – BUSINESS NAVIGATOR GUARDRAILS**  
>  
> Add guardrails to Navigator:  
>  
> - System prompt instructs:  
>   - No illegal, unethical, fraudulent models.  
>   - No guaranteed returns.  
>   - Emphasize suggestions are **ideas, not financial/legal advice**.  
>   - Prefer sustainable, region-appropriate business ideas.  
> - UI disclaimer: small panel indicating it’s guidance, not professional advice.  
> - Optionally log risky queries in `navigator_flags` for admin review.  

---
