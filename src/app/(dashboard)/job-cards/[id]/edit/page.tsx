import { JobEditorScreen } from "@/components/screens/job-editor-screen";

export default function JobEditorPage({ params }: { params: { id: string } }) {
  return <JobEditorScreen id={params.id} />;
}
