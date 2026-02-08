# Aura Habit Tracker (iOS 26 Liquid Glass)

![Aura Header](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/zap.svg)

A premium, local-first habit-tracking application engineered with a "Liquid Glass" design language. Aura combines high-performance productivity tools with the immersive aesthetics of next-generation mobile operating systems.

---

## 1. Project Overview
**Aura Habit Tracker** is a sophisticated Progressive Web App (PWA) designed to transform habit formation from a chore into an aesthetic ritual. 

### The Problem
Most habit trackers suffer from either overly complex interfaces that increase cognitive load or utilitarian designs that fail to inspire daily engagement.

### The Solution
Aura provides a "Zen-mode" productivity environment. It uses high-saturation liquid backgrounds, frosted glass components, and iOS-inspired physics to create a rewarding user experience. By prioritizing **Local-First architecture**, it ensures absolute privacy and instant responsiveness without relying on a centralized backend.

### Real-World Use Cases
*   **Biohackers & Health Enthusiasts:** Tracking sobriety, supplements, or intermittent fasting.
*   **Professional Development:** Monitoring "Deep Work" sessions or skill acquisition.
*   **Mindfulness:** Daily meditation and journaling reminders.
*   **Remote Workers:** Establishing boundaries through "Start/End of Day" tasks.

---

## 2. Creator & Development Context
*   **Architect/Developer:** Senior Product Engineer (AI-Augmented Workflow).
*   **Augmentation Tools:** Developed using **Google Gemini 2.5/3** via **Google AI Studio**, leveraging advanced prompt engineering for component architecture and aesthetic refinement.
*   **Design Philosophy:** A fusion of Apple’s Glassmorphism and "Liquid UI" principles, focusing on depth, translucency, and vibrant color states.

---

## 3. Features

### Core Productivity
| Feature | Description |
| :--- | :--- |
| **Today Protocol** | A dynamic daily checklist that filters habits based on the current day's schedule. |
| **Temporal Sync** | A custom calendar picker for navigating past check-ins and future planning. |
| **Habit Architect** | A creation suite supporting both recurring habits (streaks) and one-time tasks. |
| **Multi-Pattern Scheduling** | Define habits for specific days of the week (e.g., "Mon, Wed, Fri"). |

### Advanced UX
*   **Liquid Glass Aesthetics:** Layered `backdrop-filter` effects and high-saturation blur backgrounds that shift based on the active tab.
*   **Desktop Pro Dashboard:** An expandable layout with a toggleable sidebar for maximum focus.
*   **Mobile Mini Mode:** A high-density UI for phone users, optimizing vertical real estate.
*   **Offline Shell:** Full functionality without internet access via Service Worker caching.

---

## 4. Tech Stack

### Frontend
*   **React 18:** Functional components with `Hooks` for state management.
*   **TypeScript:** Strict typing for data structures (Habits, Checkins, Settings).
*   **Tailwind CSS:** Utilizing JIT engine for complex glassmorphism utilities.
*   **Date-fns:** Lightweight library for complex date calculations and streak logic.
*   **Lucide React:** Consistent, high-stroke iconography.

### Infrastructure
*   **IndexedDB (via `idb`):** High-performance client-side NoSQL storage.
*   **Vite:** Blazing fast build tool and HMR (Hot Module Replacement).
*   **Service Workers:** Managing the PWA lifecycle and asset caching.

---

## 5. Project Architecture

### Directory Structure
```text
/
├── components/          # Atomic UI components
│   ├── Sidebar.tsx      # Desktop navigation & Profile
│   ├── TabBar.tsx       # Mobile-only fluid Dock
│   ├── TodayView.tsx    # Core check-in logic
│   ├── GlassCard.tsx    # Base aesthetic wrapper
│   └── ...              # View-specific components
├── services/            # Business logic
│   └── streak-service.ts# Algorithmic streak calculations
├── storage.ts           # Storage Provider Abstraction (Interface)
├── storage-indexeddb.ts # Concrete IndexedDB implementation
├── types.ts             # Global TypeScript interfaces
├── db.ts                # Legacy compatibility layer
├── App.tsx              # Root application controller
└── index.tsx            # Entry point & DB initialization
```

### Data Flow
1.  **Input:** User interacts with `TodayView` to check a habit.
2.  **State Update:** `App.tsx` updates local React state for instant UI feedback.
3.  **Persistence:** The `storage` service asynchronously commits the change to `IndexedDB`.
4.  **Revalidation:** Streak algorithms re-calculate stats based on the new check-in record.

---

## 6. Storage & Data Management

Aura uses a **Local-First** persistence strategy. No user data ever leaves the device.

*   **Database:** IndexedDB (Browser-native NoSQL).
*   **Structure:**
    *   `habits`: Stores configuration (name, icon, schedule).
    *   `checkins`: Composite key store `[habitId, dateISO]` for tracking completions.
    *   `settings`: Stores theme and customization preferences.
*   **Persistence Strategy:** Stale-While-Revalidate via Service Workers ensures the UI loads from cache while the DB initializes in the background.

---

## 7. Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn

### Installation Steps
1.  **Clone & Install:**
    ```bash
    git clone https://github.com/user/aura-habit-tracker.git
    cd aura-habit-tracker
    npm install
    ```
2.  **Development Mode:**
    ```bash
    npm run dev
    ```
3.  **Production Build:**
    ```bash
    npm run build
    ```

---

## 8. Usage Guide

### Establishing Your First Protocol
1.  Navigate to the **Habits** tab.
2.  Click the **+** button to open the Habit Architect.
3.  Select an emoji icon and a vibrant color protocol.
4.  Set your schedule (e.g., "Mon, Tue, Wed").
5.  Click **Activate**.

### Managing Daily Tasks
*   Use the **Today** view to see only what matters *now*.
*   Tap a card to toggle completion. Note the haptic feedback (on supported mobile devices).
*   Toggle the **Sidebar** on desktop (top left) to maximize your workspace.

---

## 9. Security & Privacy

*   **Zero-Cloud:** Aura does not use external servers. Your habits are your own.
*   **Data Integrity:** Uses IndexedDB transactions to prevent data corruption during crashes.
*   **Secrets:** No API keys are required for the core app, minimizing the attack surface.
*   **Sanitization:** Habit names are treated as plain text to prevent XSS.

---

## 10. Deployment

### GitHub Pages (Recommended)
The project includes a pre-configured `vite.config.ts` and `.github/workflows/deploy.yml` for automated deployment to GitHub Pages.
1.  Enable "GitHub Actions" in your repository settings.
2.  Ensure `base` in `vite.config.ts` matches your repository name.

### PWA Installation
*   **iOS:** Safari -> Share -> Add to Home Screen.
*   **Android:** Chrome -> Options -> Install App.

---

## 11. Limitations & Roadmap

### Current Limitations
*   **Cross-Device Sync:** Currently limited to a single device (LocalStorage/IndexedDB).
*   **Export/Import:** Manual JSON backup only (located in Settings).

### Future Roadmap
*   **Aura AI:** Local LLM integration (via Gemini Nano) for habit coaching.
*   **E2EE Sync:** Optional encrypted cloud sync via Web3 or private Dropbox.
*   **Widgets:** Support for iOS/Android home screen widgets.

---

## 12. License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Aura** — *Reclaim your daily ritual.*
