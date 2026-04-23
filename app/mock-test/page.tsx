import { MockTestSetup } from "@/components/mock/mock-test-setup";
import { getMockSetupData } from "@/lib/server/page-data";

export default function MockTestPage() {
  const data = getMockSetupData();

  return <MockTestSetup mockPlan={data.mockPlan} runtimeLabel={data.runtime.label} />;
}
