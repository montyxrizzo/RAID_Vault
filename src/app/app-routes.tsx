import { UiLayout } from '@/components/ui/ui-layout'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const AccountListFeature = lazy(() => import('../components/account/account-list-feature'))
const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature'))
const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature'))
const DashboardFeature = lazy(() => import('../components/dashboard/dashboard-feature'))
const WhitepaperPage = lazy(() => import('../components/docs/whitepaper')); // Add this line
const RoadmapFeature = lazy(() => import('../components/dashboard/roadmap'));

const links: { label: string; path: string }[] = [
  { label: 'Staking', path: '/account' },

  { label: 'Roadmap', path: '/roadmap' }, // Add roadmap link
  { label: 'Whitepaper', path: '/whitepaper' }, // Add link to Whitepaper
  { label: 'Clusters', path: '/clusters' },


]

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/roadmap', element: <RoadmapFeature /> }, // Add roadmap route
  { path: '/whitepaper', element: <WhitepaperPage /> }, // Add route for Whitepaper

]

export function AppRoutes() {
  return (
    <UiLayout links={links}>
      {useRoutes([
        { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
        { path: '/dashboard', element: <DashboardFeature /> },
        ...routes,
        { path: '*', element: <Navigate to={'/dashboard'} replace={true} /> },
      ])}
    </UiLayout>
  )
}
