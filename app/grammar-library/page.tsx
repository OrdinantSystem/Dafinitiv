import { GrammarLibraryScreen } from "@/components/grammar/grammar-library-screen";
import { getGrammarLibraryViewModel } from "@/lib/server/page-data";

export default function GrammarLibraryPage() {
  return <GrammarLibraryScreen viewModel={getGrammarLibraryViewModel()} />;
}
