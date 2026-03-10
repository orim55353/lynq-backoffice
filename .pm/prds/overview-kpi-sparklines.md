# PRD: Overview Dashboard KPI Sparklines

**Status:** Implemented
**Priority:** P0
**Date:** 2026-03-10

---

## Problem Statement

Employers viewing the overview dashboard see static KPI values with no trend context. They cannot determine if metrics are improving or declining without navigating to the full analytics page. This reduces the overview's effectiveness as a quick health check.

## User Stories

- **As an employer**, I want to see sparkline trends on each KPI card so I can quickly identify improving/declining metrics
- **As an employer**, I want to see the percentage change vs last period so I know the magnitude of trends
- **As an employer**, I want visual color coding (green/red) so trends are immediately apparent

## Requirements

### P0 — Must Have
- Each of the 6 KPI cards shows a 14-day sparkline (where daily data exists)
- Change percentage shows 7-day period-over-period comparison (this week vs last week)
- Sparkline color: green for positive trend, red for negative
- Graceful handling when <14 days of data exist

### P1 — Should Have
- Loading skeleton preserves sparkline area height
- Smooth animation on data load (already handled by MotionCard)

### P2 — Nice to Have
- Tooltip on sparkline hover showing exact date/value (deferred)

## Acceptance Criteria

- [x] All 6 KPI cards display sparklines from real daily data (where available)
- [x] Change badges show accurate 7-day deltas (not hardcoded 0)
- [x] Empty/insufficient data: no sparkline shown, change shows 0
- [x] Pure transform functions with no side effects
- [x] No new Firestore collections or UI components

## Out of Scope

- Configurable date range selector on overview page
- Sparkline tooltips/hover interactions
- New Firestore data structures

## Data Architecture

### Existing Data (no changes needed)

**Firestore Collection: `jobAnalytics`**
```typescript
interface JobAnalytics {
  id: string;
  orgId: string;
  jobId: string;
  date: string;          // "YYYY-MM-DD"
  impressions: number;
  scrollStops: number;
  expands: number;
  applies: number;
  costPerApplicant: number;
  createdAt: Timestamp;
}
```

### Data Aggregation Strategy

For each day in the 14-day window, sum across all jobs:
- **Total Impressions**: `SUM(impressions)` per day
- **Apply Rate**: `SUM(applies) / SUM(impressions) * 100` per day
- **Cost per Applicant**: Weighted average `SUM(cpa * applies) / SUM(applies)` per day
- **Active Jobs**: Snapshot count (no daily series)
- **Avg Dwell Time**: No data yet — empty sparkline
- **Time to Hire**: No data yet — empty sparkline

### Change Calculation
- Split 14 days into two 7-day halves
- `change = ((currentWeekAvg - prevWeekAvg) / prevWeekAvg) * 100`
- If prevWeekAvg is 0, change = 0

## Implementation

### Files Created
| File | Purpose |
|------|---------|
| `src/lib/hooks/transforms/overview-sparkline-transforms.ts` | Pure transform: aggregate daily data → sparklines + changes |

### Files Modified
| File | Purpose |
|------|---------|
| `src/lib/hooks/types.ts` | Added `SparklineEntry` and `OverviewSparklines` interfaces |
| `src/lib/hooks/use-analytics.ts` | Added `useOrgDailyAnalytics()`, extended `useOverviewKpis()` return |
| `src/components/screens/overview/overview-sections.tsx` | Wired sparkline data to `KpiCard` props |

### Existing Code Reused
- `KpiCard` sparkline rendering (`src/components/dashboard/kpi-card.tsx:69-85`)
- `MOCK_ANALYTICS` daily data (`src/lib/data/mock-analytics.ts`) — 30 days per job
- Chart colors from CSS variables: `var(--success)` / `var(--danger)`

## Success Metrics

- Overview page provides at-a-glance trend awareness without clicking into analytics
- No additional Firestore reads beyond what's needed (single collection query)
