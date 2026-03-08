import { CandidateDetailScreen } from "@/components/screens/candidate-detail-screen";

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  return <CandidateDetailScreen id={params.id} />;
}
