import {
  BoostSpendCards,
  CurrentPlanCard,
  InvoiceHistoryCard,
  PlanComparisonSection,
  UsageCard
} from "@/components/screens/billing/billing-sections";

export function BillingScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <CurrentPlanCard />
      <BoostSpendCards />
      <UsageCard />
      <PlanComparisonSection />
      <InvoiceHistoryCard />
    </div>
  );
}
