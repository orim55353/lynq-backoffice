"use client";

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
import type { ChartTheme } from "@/lib/chart-theme";

interface CampaignRow {
  id: number;
  job: string;
  status: string;
  budget: string;
  duration: string;
  impressions: string;
  expandRate: string;
  applyRate: string;
  costPerApplicant: string;
}

const campaignData: CampaignRow[] = [
  {
    id: 1,
    job: "Senior Product Designer",
    status: "Active",
    budget: "$500",
    duration: "7 days",
    impressions: "45.2K",
    expandRate: "24.3%",
    applyRate: "5.8%",
    costPerApplicant: "$38"
  },
  {
    id: 2,
    job: "Marketing Manager",
    status: "Active",
    budget: "$750",
    duration: "14 days",
    impressions: "89.1K",
    expandRate: "28.1%",
    applyRate: "6.2%",
    costPerApplicant: "$32"
  },
  {
    id: 3,
    job: "DevOps Engineer",
    status: "Completed",
    budget: "$300",
    duration: "7 days",
    impressions: "34.5K",
    expandRate: "19.8%",
    applyRate: "4.1%",
    costPerApplicant: "$42"
  }
];

const performanceData = [
  { day: "Day 1", organic: 1200, paid: 3800 },
  { day: "Day 2", organic: 1400, paid: 4200 },
  { day: "Day 3", organic: 1300, paid: 4500 },
  { day: "Day 4", organic: 1500, paid: 4800 },
  { day: "Day 5", organic: 1600, paid: 5100 },
  { day: "Day 6", organic: 1400, paid: 5400 },
  { day: "Day 7", organic: 1700, paid: 5600 }
];

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
  return (
    <Card className="space-y-6 rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Rocket className="h-5 w-5 text-lynq-accent" />
        <h2>Campaign Builder</h2>
      </div>

      <div>
        <Label htmlFor="jobSelect">Select Job</Label>
        <select
          id="jobSelect"
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lynq-accent/40"
        >
          <option>Senior Product Designer</option>
          <option>Frontend Engineer (React)</option>
          <option>Marketing Manager</option>
          <option>Data Analyst</option>
          <option>Customer Success Lead</option>
        </select>
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
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Active & Recent Campaigns</h2>
      <DataTable columns={campaignColumns} data={campaignData} rowKey={(row) => row.id} />
    </div>
  );
}

export function PerformanceChartCard({ chart }: { chart: ChartTheme }) {
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
