<!-- task-futbol-streaming.md -->
# Task: Build Live Sports Streaming Web App (futbol.4rolls.com)

## 1. Project Overview
Build a high-performance, dark-mode sports streaming SPA using **React + Vite**.
The app fetches match data from two JSON sources client-side, normalizes the data, and displays it in a responsive, premium "Sharper/Technical" UI.

**Deployment**: Cloudflare Pages (Static Build).
**Domain**: futbol.4rolls.com.

## 2. Data Sources & Logic

### Source 1: Rojadirecta (Primary)
- **URL**: `https://raw.githubusercontent.com/albinchristo04/blogger-autopost/refs/heads/main/rojadirecta_events.json`
- **Format**: Array of objects with `date` (YYYY-MM-DD), `time` (HH:MM:SS), `decoded_url`.
- **Timezone Assumption**: CET (Central European Time).
- **Logic**: 
  - Fetch JSON.
  - Parse `date` + `time` => ISO String (CET).
  - Convert to User Local Time.

### Source 2: Sports Events (Secondary)
- **URL**: `https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json`
- **Format**: Object with keys "SATURDAY", "SUNDAY", etc. `last_updated` (ISO UTC).
- **Timezone Assumption**: UTC.
- **Logic**: 
  - Fetch JSON.
  - Calculate date based on `last_updated` and Day Name.
  - Parse `time` => ISO String (UTC).
  - Convert to User Local Time.

### Merging Strategy
- No de-duplication (per user request).
- Display all events from Source 1.
- Display all events from Source 2.
- UI: Unified list, sorted by time.

## 3. UI/UX Design "Technical/Sharp"
- **Theme**: Slate-950 (Background), Slate-900 (Cards), Signal Green/Red (Accents).
- **Typography**: Inter or Roboto (Google Fonts).
- **Shapes**: 0px-2px border radius (Sharp/Technical look). NO 8px/rounded.
- **Layout**:
  - **Header**: Sticky, Logo, Nav (Home, Football, Basketball, Tennis, Live, Contact).
  - **Hero**: Slider for "Featured/Live" matches.
  - **Live Now**: Grid of strictly live matches.
  - **Schedule**: Grouped by Sport or Time.

## 4. Implementation Steps

### Phase 1: Setup & Config
1.  Initialize Vite + React + TypeScript + Tailwind.
2.  Install dependencies: `date-fns`, `react-router-dom`, `lucide-react`.
3.  Configure clean `tailwind.config.js` (colors, fonts).

### Phase 2: Core Logic (Hooks)
1.  `useSportsData`: Custom hook to fetch both endpoints in parallel.
2.  `useTimezone`: Utility to handle CET/UTC -> Local conversion.
3.  `normalizeData`: Function to unify differing JSON structures into a single `Match` interface.

### Phase 3: Components
1.  `Header`: Sticky, responsive.
2.  `HeroSlider`: Dynamic featured content.
3.  `MatchCard`: Displays teams, time (local), sharing buttons.
    - Status badges: "LIVE", "UPCOMING", "ENDED".
4.  `StreamPlayer`: Iframe wrapper with Aspect Ratio lock.

### Phase 4: Pages
1.  **Home (`/`)**: 
    - Hero Section.
    - "Live Now" Grid.
    - "Upcoming" List.
2.  **Match (`/match/:id`)**:
    - Title, Team info.
    - Iframe Player (Server 1 / Server 2 tabs if applicable, otherwise single source).
    - Social Share (Telegram, WhatsApp, Copy Link).

### Phase 5: Build & Deploy Config
1.  Ensure `npm run build` produces clean static `dist`.
2.  Add `public/_headers` for Cloudflare security (CORS, X-Frame).
3.  Config for Cloudflare Pages (node version etc).

## 5. Requirements Checklist
- [ ] No server-side code (Functions/Workers).
- [ ] Auto-detect user timezone.
- [ ] "Sharp" Design System (No rounded corners).
- [ ] Responsive Mobile/Desktop.
