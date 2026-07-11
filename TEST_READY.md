# E2E Test Suite Ready: Enrich Labs AI Specialists Showcase

This document outlines the setup, execution, and coverage status of the Playwright E2E test suite for the AI Specialists section in `index.html`.

## How to Run the Tests

To run the Playwright test suite, follow the steps below:

1. **Pre-requisites**:
   - Ensure [Node.js](https://nodejs.org/) is installed on your system.

2. **Installation**:
   - The test runner and dependencies are located in the `tests/` directory.
   - Run the following command from the project root to install dependencies:
     ```bash
     cd tests
     npm install
     npx playwright install chromium
     ```

3. **Running the Tests**:
   - To run the full suite of 60 tests, run the following command from the project root:
     ```bash
     npm --prefix tests run test
     ```
   - Alternatively, change directory to `tests` and execute:
     ```bash
     npm run test
     ```

## Feature & Test Coverage Checklist

The test suite covers the following 4 tiers with a total of **60 distinct test cases**:

### Tier 1: Feature Coverage (25 Test Cases)
- **Feature 1: Staggered Entrance & Ambient Effects (R1)**
  - [x] Section container `#agents` presence in the DOM
  - [x] Section title/subtitle reveal class structure
  - [x] Four specialist cards reveal class structure
  - [x] Staggered delay classes (`delay-1`, `delay-2`, `delay-3`)
  - [x] Ambient glow elements (`.agent-card-glow`) inside cards
- **Feature 2: Living AI Specialists & Orbiting Elements (R2)**
  - [x] Status badge (`.ac-badge`) presence
  - [x] Active live indicator dots (`.live-dot`) presence
  - [x] Active workflow activity blocks (`.ac-activity`)
  - [x] Skill tags (`.ac-tag`) coverage (>=16 total tags)
  - [x] Orbiting/helper widgets or canvases
- **Feature 3: Hover Tilt & Click Workspace Expansion (R3)**
  - [x] "Learn more" CTA link (`.btn-ac`) inside cards
  - [x] Workspace overlay modal (`.workspace-overlay`) presence
  - [x] Close button (`.close-workspace`) presence inside modal
  - [x] Clicking Helena CTA opens the workspace overlay modal
  - [x] Clicking close on workspace overlay hides it
- **Feature 4: Card-Specific Continuous Animations (R4)**
  - [x] Helena analytics dashboard / KPI counters simulation
  - [x] Sam SEO health / keyword tracker visuals
  - [x] Kai social chatter / brand mention bubbles
  - [x] Angela email automation nodes visualization
  - [x] Card continuous animation container elements visible
- **Feature 5: Idle Autoplay Cycle (R5)**
  - [x] Autoplay active state variable (`window.autoplayActive`)
  - [x] Autoplay timer variable (`window.autoplayTimer`)
  - [x] Autoplay highlight class application (`.autoplay-highlight`)
  - [x] Autoplay progress indicator element (`.autoplay-progress`)
  - [x] Autoplay active by default on load

### Tier 2: Boundary & Corner Cases (25 Test Cases)
- **Feature 1 Boundary (R1)**
  - [x] Reduced motion simulation disables slide/fade transition durations
  - [x] Scroll reveal triggers even if section is immediately in viewport on load
  - [x] Scroll boundary safety (extreme scrolling)
  - [x] Staggered delay classes index values do not exceed 3
  - [x] Staggered animation classes do not break grid styling or layouts
- **Feature 2 Boundary (R2)**
  - [x] Reduced motion hides particle canvases or stops rendering
  - [x] Orbiting elements behave gracefully and scale properly on window resize
  - [x] Badge status text is fully visible and not clipped at mobile widths
  - [x] Cards do not overlap layout when text is long
  - [x] Pulse dot layout size is constant (8x8px) and does not layout shift
- **Feature 3 Boundary (R3)**
  - [x] Hover tilt angle is capped at maximum safe range (e.g., within 15 degrees)
  - [x] Clicking Helena CTA when Angela workspace is open closes Angela first
  - [x] Pressing the Escape key closes the active workspace overlay modal
  - [x] Overlay content area is scrollable if content exceeds mobile viewport height
  - [x] Clicking the workspace backdrop closes the modal
- **Feature 4 Boundary (R4)**
  - [x] Continuous KPI counter values fit within bounds without clipping
  - [x] Cards continuous animations use GPU-accelerated transition properties
  - [x] Continuous scrolling tickers wrap cleanly without layout shifts
  - [x] Animated SVG nodes in Angela card have correct viewBox and scale correctly
  - [x] Continuous animations pause when cards are scrolled out of viewport
- **Feature 5 Boundary (R5)**
  - [x] Reduced motion settings disable the idle autoplay cycle
  - [x] Autoplay cycle interval does not transition faster than 5 seconds
  - [x] Rapid hover toggling resets the autoplay timer cleanly without leak
  - [x] Autoplay highlight class is cleared from other cards when a card is hovered
  - [x] Autoplay remains paused indefinitely while user mouse remains hovered on a card

### Tier 3: Cross-Feature Combinations (5 Test Cases)
- [x] Hovering card clears autoplay highlight class and pauses idle autoplay timer
- [x] Opening workspace overlay modal pauses autoplay and keeps it paused
- [x] Hovering card during scroll reveal does not cause layout collapse
- [x] Reduced motion modal transition behaves instantly without fade/slide durations
- [x] Autoplay cycle continues correctly after window resize events

### Tier 4: Real-World Application Scenarios (5 Test Cases)
- [x] User Journey: Scroll to Helena, hover, click to open dashboard, inspect timeline, close modal
- [x] Autoplay interruption and resume scenario
- [x] Multi-card interactive inspection journey
- [x] Responsive viewport resize and card vertical layout scenario
- [x] Keyboard accessibility navigation scenario

---

*Note: Since the interactive features in Milestones 3-5 are not yet fully implemented in `index.html`, several test cases focusing on interactions, modals, and autoplay cycles are expected to fail. The suite is fully integrated and ready to run verification once implementation commences.*
