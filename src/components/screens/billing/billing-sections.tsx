import { Check, Crown, Download, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";

const currentPlan = {
  name: "Pro",
  price: 299,
  period: "month",
  features: [
    "Unlimited job postings",
    "Advanced analytics",
    "AI-powered insights",
    "Priority support",
    "Custom branding"
  ]
};

const boostSpend = { currentMonth: 1847, lastMonth: 1523, budget: 2500 };

const usage = {
  jobs: { current: 12, limit: "Unlimited" },
  impressions: { current: 847000, limit: "Unlimited" },
  candidates: { current: 156, limit: "Unlimited" }
};

const invoices = [
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: 299, status: "Paid" },
  { id: "INV-2026-01", date: "Jan 1, 2026", amount: 299, status: "Paid" },
  { id: "INV-2025-12", date: "Dec 1, 2025", amount: 299, status: "Paid" },
  { id: "INV-2025-11", date: "Nov 1, 2025", amount: 299, status: "Paid" },
  { id: "INV-2025-10", date: "Oct 1, 2025", amount: 299, status: "Paid" }
];

const plans = [
  {
    name: "Starter",
    price: 99,
    period: "month",
    features: ["Up to 5 jobs", "Basic analytics", "Email support"],
    current: false
  },
  {
    name: "Pro",
    price: 299,
    period: "month",
    features: ["Unlimited jobs", "Advanced analytics", "AI insights", "Priority support", "Custom branding"],
    current: true,
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom" as string | number,
    period: "contact us",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "White-label option"
    ],
    current: false
  }
];

export function CurrentPlanCard() {
  return (
    <MotionCard interactive className="rounded-[22px] border border-info/20 bg-card p-5 shadow-soft">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Crown className="h-5 w-5 text-warning" />
            <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
          </div>
          <p className="mb-4 text-3xl font-bold">
            ${currentPlan.price}
            <span className="text-lg font-normal text-muted-foreground">/{currentPlan.period}</span>
          </p>
          <ul className="space-y-2">
            {currentPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline">Manage Subscription</Button>
          <Button variant="outline">Update Payment</Button>
        </div>
      </div>
    </MotionCard>
  );
}

export function BoostSpendCards() {
  const boostPercentage = (boostSpend.currentMonth / boostSpend.budget) * 100;
  const deltaPercentage = Math.round(
    ((boostSpend.currentMonth - boostSpend.lastMonth) / boostSpend.lastMonth) * 100
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <MotionCard interactive className="rounded-[22px] border border-info/20 bg-card p-5 shadow-soft">
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          <h3 className="font-semibold">Boost Spend (Feb)</h3>
        </div>
        <p className="mb-2 text-3xl font-bold">${boostSpend.currentMonth.toLocaleString()}</p>
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-info" style={{ width: `${boostPercentage}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">${boostSpend.budget.toLocaleString()} monthly budget</p>
        </div>
      </MotionCard>

      <MotionCard interactive className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-2 font-semibold">Last Month</h3>
        <p className="mb-2 text-3xl font-bold">${boostSpend.lastMonth.toLocaleString()}</p>
        <Badge className="border-0 bg-success/10 text-success">+{deltaPercentage}% vs current</Badge>
      </MotionCard>

      <MotionCard interactive className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-2 font-semibold">Available Budget</h3>
        <p className="mb-2 text-3xl font-bold">${(boostSpend.budget - boostSpend.currentMonth).toLocaleString()}</p>
        <Button variant="outline" size="sm" className="w-full">
          Adjust Budget
        </Button>
      </MotionCard>
    </div>
  );
}

export function UsageCard() {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Usage This Month</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UsageMetric title="Active Jobs" current={usage.jobs.current} limit={usage.jobs.limit} />
        <UsageMetric
          title="Impressions"
          current={usage.impressions.current.toLocaleString()}
          limit={usage.impressions.limit}
        />
        <UsageMetric title="Candidates" current={usage.candidates.current} limit={usage.candidates.limit} />
      </div>
    </MotionCard>
  );
}

export function PlanComparisonSection() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">All Plans</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <MotionCard
            key={plan.name}
            interactive
            className={`rounded-[22px] p-5 shadow-soft ${
              plan.current ? "border border-info/20 bg-card" : "border-border bg-card"
            }`}
          >
            {plan.popular ? (
              <Badge className="mb-4 border-0 bg-lynq-accent text-lynq-accent-foreground">Most Popular</Badge>
            ) : null}

            <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
            <p className="mb-4 text-3xl font-bold">
              {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
              <span className="text-sm font-normal text-muted-foreground">
                {typeof plan.price === "number" ? `/${plan.period}` : ""}
              </span>
            </p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.current
                  ? "cursor-default bg-muted text-muted-foreground hover:bg-muted"
                  : "bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : typeof plan.price === "number" ? "Upgrade" : "Contact Sales"}
            </Button>
          </MotionCard>
        ))}
      </div>
    </div>
  );
}

export function InvoiceHistoryCard() {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Invoice History</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{invoice.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{invoice.date}</td>
                <td className="px-4 py-3 font-semibold">${invoice.amount}</td>
                <td className="px-4 py-3">
                  <Badge className="border-0 bg-success/10 text-success">{invoice.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}

function UsageMetric({
  title,
  current,
  limit
}: {
  title: string;
  current: string | number;
  limit: string;
}) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">
        {current} <span className="text-sm font-normal text-muted-foreground">/ {limit}</span>
      </p>
    </div>
  );
}
