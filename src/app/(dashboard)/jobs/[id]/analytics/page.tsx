import { JobAnalyticsScreen } from "@/components/screens/jobs/analytics/job-analytics-screen";

export default function JobAnalyticsPage({ params }: { params: { id: string } }) {
  return <JobAnalyticsScreen jobId={params.id} />;
}
