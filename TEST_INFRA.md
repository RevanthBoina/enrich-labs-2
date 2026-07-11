# E2E Test Infra: Enrich Labs AI Specialists Showcase

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 (Coverage) | Tier 2 (Boundaries) | Tier 3 (Cross-Feature) | Tier 4 (Workload) |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | Staggered Entrance & Ambient Effects | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Living Specialists & Orbiting Elements | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 3 | Hover Tilt & Click Workspace Expansion | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 4 | Card-Specific Continuous Animations | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 5 | Idle Autoplay Cycle | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: Playwright (Node.js)
- Test suite location: `tests/e2e.test.js`
- Directory layout:
  - `tests/e2e.test.js` — Core E2E tests
  - `tests/package.json` — Playwright dependency definitions
- Invocation: `npm --prefix tests run test`
- Pass/fail semantics: Standard exit code (0 for pass, non-zero for fail)

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total: 25)
- Tier 2: ≥5 per feature (Total: 25)
- Tier 3: pairwise coverage of major feature interactions (Total: 5)
- Tier 4: ≥5 realistic application scenarios (Total: 5)
- Total minimum: 60 test cases
