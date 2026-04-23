import { SectionHub } from "@/components/sections/section-hub";
import { getSectionHubViewModel } from "@/lib/server/page-data";

export default function SprechenPage() {
  return <SectionHub viewModel={getSectionHubViewModel("sprechen")} />;
}
