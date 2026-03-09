"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { DollarSign, Rocket, Target, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DataTable, StatusBadge, type DataTableColumn } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonDataTable } from "@/components/skeletons/skeleton-data-table";
import { SkeletonChartCard } from "@/components/skeletons/skeleton-chart-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useCampaigns } from "@/lib/hooks/use-campaigns";
import { useJobs } from "@/lib/hooks/use-jobs";
import type { Campaign } from "@/lib/firebase/types";
import type { ChartTheme } from "@/lib/chart-theme";

interface CampaignRow {
  id: string;
  job: string;
  status: string;
  budget: string;
  duration: string;
  impressions: string;
  expandRate: string;
  applyRate: string;
  costPerApplicant: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getDurationDays(
  start: { toDate?: () => Date } | Date | undefined,
  end: { toDate?: () => Date } | Date | undefined
): string {
  if (!start || !end) return "—";
  const startDate = typeof (start as { toDate?: () => Date }).toDate === "function"
    ? (start as { toDate: () => Date }).toDate()
    : start as Date;
  const endDate = typeof (end as { toDate?: () => Date }).toDate === "function"
    ? (end as { toDate: () => Date }).toDate()
    : end as Date;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? "s" : ""}`;
}

const campaignColumns: DataTableColumn<CampaignRow>[] = [
  { id: "job", header: "Job", width: "25%", cell: (row) => <span className="font-medium">{row.job}</span> },
  { id: "status", header: "Status", width: "10%", cell: (row) => <StatusBadge status={row.status} /> },
  { id: "budget", header: "Budget", width: "10%", cell: (row) => row.budget },
  { id: "duration", header: "Duration", width: "10%", cell: (row) => row.duration },
  { id: "impressions", header: "Impressions", width: "12%", cell: (row) => row.impressions },
  { id: "expandRate", header: "Expand Rate", width: "12%", cell: (row) => row.expandRate },
  {
    id: "applyRate",
    header: "Apply Rate",
    width: "11%",
    cell: (row) => <span className="text-success">{row.applyRate}</span>
  },
  { id: "costPerApplicant", header: "Cost/Applicant", width: "10%", cell: (row) => row.costPerApplicant }
];

interface CampaignBuilderCardProps {
  budget: number;
  duration: number;
  onBudgetChange: (budget: number) => void;
  onDurationChange: (duration: number) => void;
}

interface ForecastCardProps {
  budget: number;
  duration: number;
  estimatedReach: number;
  predictedApplies: number;
}

export function CampaignBuilderCard({
  budget,
  duration,
  onBudgetChange,
  onDurationChange
}: CampaignBuilderCardProps) {
  const { data: jobs, isLoading: jobsLoading } = useJobs();

  return (
    <Card className="space-y-6 rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Rocket className="h-5 w-5 text-lynq-accent" />
        <h2>Campaign Builder</h2>
      </div>

      <div>
        <Label htmlFor="jobSelect">Select Job</Label>
        {jobsLoading ? (
          <Skeleton className="mt-2 h-10 w-full rounded-lg" />
        ) : (
          <select
            id="jobSelect"
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lynq-accent/40"
          >
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))
            ) : (
              <option disabled>No jobs available</option>
            )}
          </select>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Budget</Label>
          <span className="text-sm font-medium text-lynq-accent">${budget}</span>
        </div>
        <Slider value={[budget]} onValueChange={(value) => onBudgetChange(value[0] ?? 500)} min={100} max={2000} step={50} />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>$100</span>
          <span>$2,000</span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Duration</Label>
          <span className="text-sm font-medium text-lynq-accent">{duration} days</span>
        </div>
        <Slider value={[duration]} onValueChange={(value) => onDurationChange(value[0] ?? 7)} min={1} max={30} step={1} />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>1 day</span>
          <span>30 days</span>
        </div>
      </div>

      <div>
        <Label htmlFor="categories">Target Categories</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge className="border-0 bg-lynq-accent text-lynq-accent-foreground">Design</Badge>
          <Badge className="cursor-pointer border-0 bg-muted text-muted-foreground hover:bg-accent">Product</Badge>
          <Badge className="cursor-pointer border-0 bg-muted text-muted-foreground hover:bg-accent">Tech</Badge>
          <Badge className="cursor-pointer border-0 bg-muted text-muted-foreground hover:bg-accent">Creative</Badge>
        </div>
      </div>

      <div>
        <Label htmlFor="filters">Audience Filters</Label>
        <Input id="filters" className="mt-2" placeholder="e.g. 3+ years experience, San Francisco" />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <input type="checkbox" className="h-4 w-4 accent-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">Urgency Badge</p>
          <p className="text-xs text-muted-foreground">Show &quot;Hiring Urgently&quot; on job card</p>
        </div>
      </div>
    </Card>
  );
}

export function ForecastAndBenefitsCard({
  budget,
  duration,
  estimatedReach,
  predictedApplies
}: ForecastCardProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[10px] border border-lynq-accent/15 bg-card p-5 shadow-soft">
        <div className="mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-lynq-accent" />
          <h3>Campaign Forecast</h3>
        </div>

        <div className="space-y-4">
          <ForecastMetric
            icon={<TrendingUp className="h-4 w-4" />}
            label="Estimated Reach"
            value={estimatedReach.toLocaleString()}
            description={`impressions over ${duration} days`}
          />
          <ForecastMetric
            icon={<Target className="h-4 w-4" />}
            label="Predicted Applies"
            value={predictedApplies.toString()}
            valueClassName="text-success"
            description="~4.5% apply rate"
          />
          <ForecastMetric
            icon={<DollarSign className="h-4 w-4" />}
            label="Est. Cost per Applicant"
            value={`$${Math.floor(budget / predictedApplies)}`}
            description="based on category average"
          />
        </div>

        <Button className="mt-6 w-full">
          <Rocket className="mr-2 h-4 w-4" />
          Launch Boost
        </Button>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">What&apos;s Included</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-success">v</span>
            <span>Premium story bubble placement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">v</span>
            <span>Priority feed distribution</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">v</span>
            <span>Real-time analytics dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success">v</span>
            <span>AI-powered optimization</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

export function CampaignsTableCard() {
  const { data: campaigns, isLoading } = useCampaigns();

  const campaignRows = useMemo<CampaignRow[]>(() => {
    if (!campaigns || campaigns.length === 0) return [];
    return campaigns.map((campaign: Campaign) => {
      const impressions = campaign.metrics?.impressions ?? 0;
      const applications = campaign.metrics?.applications ?? 0;
      const ctr = campaign.metrics?.ctr ?? 0;
      const costPerApplication = campaign.metrics?.costPerApplication ?? 0;

      return {
        id: campaign.id,
        job: campaign.name,
        status: campaign.status,
        budget: `$${campaign.budget}`,
        duration: getDurationDays(campaign.startDate, campaign.endDate),
        impressions: formatNumber(impressions),
        expandRate: `${ctr.toFixed(1)}%`,
        applyRate: impressions > 0 ? `${((applications / impressions) * 100).toFixed(1)}%` : "0%",
        costPerApplicant: applications > 0 ? `$${Math.round(costPerApplication)}` : "—",
      };
    });
  }, [campaigns]);

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold">Active & Recent Campaigns</h2>
        <SkeletonDataTable rows={3} cols={8} />
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold">Active & Recent Campaigns</h2>
        <EmptyState
          icon={<Rocket className="h-6 w-6" />}
          title="No campaigns"
          description="Create your first sponsored campaign"
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Active & Recent Campaigns</h2>
      <DataTable columns={campaignColumns} data={campaignRows} rowKey={(row) => row.id} />
    </div>
  );
}

export function PerformanceChartCard({ chart }: { chart: ChartTheme }) {
  const { data: campaigns, isLoading } = useCampaigns();

  const performanceData = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [];

    const totalImpressions = campaigns.reduce(
      (sum: number, c: Campaign) => sum + (c.metrics?.impressions ?? 0),
      0
    );
    const totalClicks = campaigns.reduce(
      (sum: number, c: Campaign) => sum + (c.metrics?.clicks ?? 0),
      0
    );

    if (totalImpressions === 0 && totalClicks === 0) return [];

    const days = 7;
    return Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const factor = 0.8 + (i * 0.2) / (days - 1);
      return {
        day: `Day ${dayNum}`,
        organic: Math.round((totalImpressions / days) * factor * 0.25),
        paid: Math.round((totalImpressions / days) * factor * 0.75),
      };
    });
  }, [campaigns]);

  if (isLoading) {
    return <SkeletonChartCard />;
  }

  if (!campaigns || campaigns.length === 0 || performanceData.length === 0) {
    return (
      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold">Organic vs Paid Performance</h3>
        <EmptyState
          icon={<TrendingUp className="h-6 w-6" />}
          title="No performance data"
          description="Performance data will appear once campaigns are running"
        />
      </Card>
    );
  }

  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold">Organic vs Paid Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="day" stroke={chart.axisStroke} />
          <YAxis stroke={chart.axisStroke} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="organic" stroke="var(--chart-1)" strokeWidth={2} name="Organic" />
          <Line type="monotone" dataKey="paid" stroke="var(--chart-4)" strokeWidth={2} name="Sponsored" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

function ForecastMetric({
  icon,
  label,
  value,
  description,
  valueClassName
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl bg-background/50 p-4">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueClassName ?? ""}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
