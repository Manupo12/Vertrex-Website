import AIControlCenterScreen from "@/components/ai/ai-control-center-screen";
import { coerceAITab, getAIControlCenterData } from "@/lib/ai/control-center";

type AIConsolePageProps = {
  searchParams?: Promise<{ tab?: string | string[] }>;
};

export default async function AIConsolePage({ searchParams }: AIConsolePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawTab = resolvedSearchParams?.tab;
  const tab = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  const data = await getAIControlCenterData();

  return <AIControlCenterScreen activeTab={coerceAITab(tab)} data={data} />;
}