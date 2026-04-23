import { MistakeNotebookScreen } from "@/components/notebook/mistake-notebook-screen";
import { getMistakeNotebookViewModel } from "@/lib/server/page-data";

export default function MistakeNotebookPage() {
  return <MistakeNotebookScreen viewModel={getMistakeNotebookViewModel()} />;
}
