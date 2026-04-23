import { MockResultsScreen } from "@/components/mock/mock-results-screen";
import { getMockResultsViewModel } from "@/lib/server/page-data";

export default async function MockResultsPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  return (
    <MockResultsScreen
      viewModel={getMockResultsViewModel((await params).sessionId)}
    />
  );
}
