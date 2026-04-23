import { SectionHub } from "@/components/sections/section-hub";
import { getSectionHubViewModel } from "@/lib/server/page-data";

export default function LesenPage() {
  return <SectionHub viewModel={getSectionHubViewModel("lesen")} />;
}
