import { notFound } from 'next/navigation'

import AIConsolePage from '@os/app/(os)/ai/page'
import AnalyticsBIPage from '@os/app/(os)/analytics/page'
import AssetsPage from '@os/app/(os)/assets/page'
import AutomationBuilderPage from '@os/app/(os)/automations/page'
import AgendaPage from '@os/app/(os)/calendar/page'
import ChatWorkspacePage from '@os/app/(os)/chat/page'
import CRMPage from '@os/app/(os)/crm/page'
import DocumentEditorPage from '@os/app/(os)/docs/[id]/page'
import DocumentGeneratorPage from '@os/app/(os)/docs/generator/page'
import DocumentsPage from '@os/app/(os)/docs/page'
import FinanceDashboardPage from '@os/app/(os)/finance/page'
import KnowledgeHubPage from '@os/app/(os)/hub/page'
import LegalOpsPage from '@os/app/(os)/legal/page'
import GrowthAcquisitionPage from '@os/app/(os)/marketing/page'
import DashboardPage from '@os/app/(os)/page'
import ProjectOverviewPage from '@os/app/(os)/projects/[id]/page'
import ProjectGraphViewPage from '@os/app/(os)/projects/graph/page'
import ProjectsPage from '@os/app/(os)/projects/page'
import ProjectTimelineViewPage from '@os/app/(os)/projects/timeline/page'
import DecisionSandboxPage from '@os/app/(os)/sandbox/page'
import SettingsPage from '@os/app/(os)/settings/page'
import StrategyControlCenterPage from '@os/app/(os)/strategy/page'
import TeamManagementPage from '@os/app/(os)/team/page'
import IntelligentTimeTrackingPage from '@os/app/(os)/time/page'
import VaultPage from '@os/app/(os)/vault/page'

type OSRouteRendererProps = {
  path?: string[]
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export function renderOSRoute({ path = [], searchParams }: OSRouteRendererProps) {
  const [segment, nested] = path

  if (path.length === 0) {
    return <DashboardPage />
  }

  switch (segment) {
    case 'ai':
      return path.length === 1 ? <AIConsolePage searchParams={searchParams as Promise<{ tab?: string | string[] }> | undefined} /> : notFound()
    case 'analytics':
      return path.length === 1 ? <AnalyticsBIPage /> : notFound()
    case 'assets':
      return path.length === 1 ? <AssetsPage /> : notFound()
    case 'automations':
      return path.length === 1 ? <AutomationBuilderPage /> : notFound()
    case 'calendar':
      return path.length === 1 ? <AgendaPage /> : notFound()
    case 'chat':
      return path.length === 1 ? <ChatWorkspacePage /> : notFound()
    case 'crm':
      return path.length === 1 ? <CRMPage /> : notFound()
    case 'docs':
      if (path.length === 1) {
        return <DocumentsPage />
      }

      if (nested === 'generator' && path.length === 2) {
        return <DocumentGeneratorPage />
      }

      return nested && path.length === 2 ? <DocumentEditorPage /> : notFound()
    case 'finance':
      return path.length === 1 ? <FinanceDashboardPage /> : notFound()
    case 'hub':
      return path.length === 1 ? <KnowledgeHubPage /> : notFound()
    case 'legal':
      return path.length === 1 ? <LegalOpsPage /> : notFound()
    case 'marketing':
      return path.length === 1 ? <GrowthAcquisitionPage /> : notFound()
    case 'projects':
      if (path.length === 1) {
        return <ProjectsPage />
      }

      if (nested === 'graph' && path.length === 2) {
        return <ProjectGraphViewPage />
      }

      if (nested === 'timeline' && path.length === 2) {
        return <ProjectTimelineViewPage />
      }

      return nested && path.length === 2 ? <ProjectOverviewPage /> : notFound()
    case 'sandbox':
      return path.length === 1 ? <DecisionSandboxPage /> : notFound()
    case 'settings':
      return path.length === 1 ? <SettingsPage /> : notFound()
    case 'strategy':
      return path.length === 1 ? <StrategyControlCenterPage /> : notFound()
    case 'team':
      return path.length === 1 ? <TeamManagementPage /> : notFound()
    case 'time':
      return path.length === 1 ? <IntelligentTimeTrackingPage /> : notFound()
    case 'vault':
      return path.length === 1 ? <VaultPage /> : notFound()
    default:
      return notFound()
  }
}
