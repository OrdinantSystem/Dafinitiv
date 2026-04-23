import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardViewModel } from "@/lib/server/page-data";

export default function HomePage() {
  const viewModel = getDashboardViewModel();

  return <DashboardOverview viewModel={viewModel} />;
}
