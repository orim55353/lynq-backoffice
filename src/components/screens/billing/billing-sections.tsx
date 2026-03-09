"use client";

import { Check, Crown, Download, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";
import { useBilling } from "@/lib/hooks/use-billing";
import { useOrganization } from "@/lib/hooks/use-org";
import { useJobs } from "@/lib/hooks/use-jobs";
import { SkeletonForm } from "@/components/skeletons/skeleton-form";
import { Skeleton } from "@/components/ui/skeleton";

const plans = [
  {
    name: "Starter",
    price: 99,
    period: "month",
    plan: "free" as const,
    features: ["Up to 5 jobs", "Basic analytics", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: 299,
    period: "month",
    plan: "pro" as const,
    features: [
      "Unlimited jobs",
      "Advanced analytics",
      "AI insights",
      "Priority support",
      "Custom branding",
    ],
    current: false,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom" as string | number,
    period: "contact us",
    plan: "enterprise" as const,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "White-label option",
    ],
    current: false,
  },
];

export function CurrentPlanCard() {
  const { data: billing, isLoading: billingLoading } = useBilling();
  const { data: org, isLoading: orgLoading } = useOrganization();

  if (billingLoading || orgLoading) {
    return <SkeletonForm fields={3} />;
  }

  const currentPlanKey = billing?.plan ?? org?.plan ?? "free";
  const matchedPlan = plans.find((p) => p.plan === currentPlanKey) ?? plans[0];

  return (
    <MotionCard
      interactive
      className="rounded-[22px] border border-info/20 bg-card p-5 shadow-soft"
    >
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Crown className="h-5 w-5 text-warning" />
            <h2 className="text-2xl font-bold">{matchedPlan.name} Plan</h2>
          </div>
          <p className="mb-4 text-3xl font-bold">
            {typeof matchedPlan.price === "number"
              ? `$${matchedPlan.price}`
              : matchedPlan.price}
            <span className="text-lg font-normal text-muted-foreground">
              /{matchedPlan.period}
            </span>
          </p>
          <ul className="space-y-2">
            {matchedPlan.features.map((feature) => (
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
  const { isLoading } = useBilling();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[22px] border border-border bg-card p-5 shadow-soft"
          >
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-2 h-9 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const currentMonth = 0;
  const lastMonth = 0;
  const budget = 0;
  const boostPercentage = budget > 0 ? (currentMonth / budget) * 100 : 0;
  const deltaPercentage =
    lastMonth > 0
      ? Math.round(((currentMonth - lastMonth) / lastMonth) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <MotionCard
        interactive
        className="rounded-[22px] border border-info/20 bg-card p-5 shadow-soft"
      >
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          <h3 className="font-semibold">Boost Spend</h3>
        </div>
        <p className="mb-2 text-3xl font-bold">
          ${currentMonth.toLocaleString()}
        </p>
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-info"
              style={{ width: `${boostPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ${budget.toLocaleString()} monthly budget
          </p>
        </div>
      </MotionCard>

      <MotionCard
        interactive
        className="rounded-[22px] border-border bg-card p-5 shadow-soft"
      >
        <h3 className="mb-2 font-semibold">Last Month</h3>
        <p className="mb-2 text-3xl font-bold">
          ${lastMonth.toLocaleString()}
        </p>
        <Badge className="border-0 bg-success/10 text-success">
          {deltaPercentage >= 0 ? "+" : ""}
          {deltaPercentage}% vs current
        </Badge>
      </MotionCard>

      <MotionCard
        interactive
        className="rounded-[22px] border-border bg-card p-5 shadow-soft"
      >
        <h3 className="mb-2 font-semibold">Available Budget</h3>
        <p className="mb-2 text-3xl font-bold">
          ${(budget - currentMonth).toLocaleString()}
        </p>
        <Button variant="outline" size="sm" className="w-full">
          Adjust Budget
        </Button>
      </MotionCard>
    </div>
  );
}

export function UsageCard() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-5 shadow-soft">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeJobs = jobs?.filter((j) => j.status === "active").length ?? 0;
  const totalImpressions =
    jobs?.reduce((sum, j) => sum + (j.viewCount ?? 0), 0) ?? 0;
  const totalApplications =
    jobs?.reduce((sum, j) => sum + (j.applicationCount ?? 0), 0) ?? 0;

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Usage This Month</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UsageMetric
          title="Active Jobs"
          current={activeJobs}
          limit="Unlimited"
        />
        <UsageMetric
          title="Impressions"
          current={totalImpressions.toLocaleString()}
          limit="Unlimited"
        />
        <UsageMetric
          title="Candidates"
          current={totalApplications}
          limit="Unlimited"
        />
      </div>
    </MotionCard>
  );
}

export function PlanComparisonSection() {
  const { data: org } = useOrganization();

  const currentPlanKey = org?.plan ?? "free";

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">All Plans</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.plan === currentPlanKey;

          return (
            <MotionCard
              key={plan.name}
              interactive
              className={`rounded-[22px] p-5 shadow-soft ${
                isCurrent
                  ? "border border-info/20 bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular ? (
                <Badge className="mb-4 border-0 bg-lynq-accent text-lynq-accent-foreground">
                  Most Popular
                </Badge>
              ) : null}

              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <p className="mb-4 text-3xl font-bold">
                {typeof plan.price === "number"
                  ? `$${plan.price}`
                  : plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {typeof plan.price === "number" ? `/${plan.period}` : ""}
                </span>
              </p>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  isCurrent
                    ? "cursor-default bg-muted text-muted-foreground hover:bg-muted"
                    : "bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
                }`}
                disabled={isCurrent}
              >
                {isCurrent
                  ? "Current Plan"
                  : typeof plan.price === "number"
                    ? "Upgrade"
                    : "Contact Sales"}
              </Button>
            </MotionCard>
          );
        })}
      </div>
    </div>
  );
}

export function InvoiceHistoryCard() {
  const { data: billing, isLoading } = useBilling();

  if (isLoading) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-5 shadow-soft">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="ml-auto h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const invoices = billing?.invoices ?? [];

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Invoice History</h2>
      {invoices.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No invoices yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Invoice ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const dateStr = invoice.date?.toDate
                  ? invoice.date.toDate().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—";

                const statusColor =
                  invoice.status === "paid"
                    ? "bg-success/10 text-success"
                    : invoice.status === "pending"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive";

                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-border/50"
                  >
                    <td className="px-4 py-3 font-medium">{invoice.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {dateStr}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ${invoice.amount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`border-0 ${statusColor}`}>
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </MotionCard>
  );
}

function UsageMetric({
  title,
  current,
  limit,
}: {
  title: string;
  current: string | number;
  limit: string;
}) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">
        {current}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          / {limit}
        </span>
      </p>
    </div>
  );
}
