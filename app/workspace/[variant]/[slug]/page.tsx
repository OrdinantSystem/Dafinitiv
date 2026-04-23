import { WorkspaceScreen } from "@/components/workspace/workspace-screen";
import { getWorkspaceViewModel } from "@/lib/server/page-data";

export default async function WorkspacePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string; variant: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const viewModel = await getWorkspaceViewModel(
    resolvedParams.variant,
    resolvedParams.slug,
    resolvedSearchParams
  );

  return <WorkspaceScreen viewModel={viewModel} />;
}
