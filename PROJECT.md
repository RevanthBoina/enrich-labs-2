# Project: Enrich Labs AI Specialists Showcase

## Architecture
- `index.html` is the core file containing HTML, styles, and script logic.
- We will insert custom CSS styles (embedded or in the existing CSS file if preferred, but adding directly in `<style>` inside `index.html` keeps changes scoped and modular, or inside a separate `<style>` tag at the bottom/top of the document).
- Floating icons, ambient glows, GPU-accelerated 3D tilt effects, and custom animated panels will be added inside the `.agent-card` elements.
- An interactive overlay modal (specialist-specific workspace) will be added to the DOM and controlled via JS to show detailed dashboards.
- An idle cycle script will automatically highlight cards sequentially and update activity.

## Milestones
| # | Name | Scope | Dependencies | Status | Conv ID |
|---|------|-------|-------------|--------|---------|
| 1 | E2E Testing Track | Design and build test suite covering Tiers 1-4 based on R1-R5 | none | DONE | ed12f261-72ac-4fbf-92f1-58b6e1ecd2b2 |
| 2 | Codebase Exploration | Map existing CSS classes and DOM layout of card containers | none | DONE | 9c260180-796e-4824-ab7e-d1f9bd269571 |
| 3 | Core Card CSS & Living AI Specialists | Staggered entrance, particle effects, drifting gradients, orbiting SVG widgets (Helena, Sam, Kai, Angela UI overlays) | M2 | IN_PROGRESS | d4442c68-74a4-4078-ac26-741a2e7b3138 |
| 4 | Interactive Hover & Modal Workspace | 3D tilt response, cards expansion click overlay with specialist dashboards | M3 | IN_PROGRESS | d4442c68-74a4-4078-ac26-741a2e7b3138 |
| 5 | Idle Autoplay Cycle | 5s idle autoplay highlight, mouse interaction pause, prefers-reduced-motion checks | M4 | IN_PROGRESS | d4442c68-74a4-4078-ac26-741a2e7b3138 |
| 6 | E2E Verification & Audit | Run E2E tests and perform forensic integrity audit | M1, M5 | PLANNED | TBD |

## Code Layout
- `index.html`: Main landing page containing the AI Specialists section.
- `css/` / `js/`: Existing assets directory, but main changes will be integrated into `index.html` as it holds the structure and layout.

## Interface Contracts
### Cards Interaction Layout
- Specialist elements inside cards have unique animation loops (counters, scrolling keyword lists, fading chat bubbles, svg node animations).
- Overlay modal classes: `.workspace-overlay` with active class `.visible`.
- Autoplay controller state variables: `autoplayActive`, `autoplayTimer`.
