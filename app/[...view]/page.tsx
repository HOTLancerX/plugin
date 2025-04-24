// app/[...view]/page.tsx
import { notFound } from 'next/navigation';
import { getRouteComponents, getDynamicRouteMatch } from '@/hooks';
import type { NextPage } from 'next'; // NextPage টাইপ ইম্পোর্ট করুন

interface ViewPageProps {
  params: {
    view: string[];
  };
}

const ViewPage: NextPage<ViewPageProps> = ({ params }) => {
  if (!params?.view || !Array.isArray(params.view)) {
    return notFound();
  }
  const path = `/${params.view.join('/')}`;
  // First check static routes
  const staticRoutes = getRouteComponents('view');
  const staticRoute = staticRoutes.find((r) => r.route === path);
  if (staticRoute) {
    const Component = staticRoute.component;
    return <Component />;
  }
  // Then check dynamic routes
  const dynamicMatch = getDynamicRouteMatch('view', path);
  if (dynamicMatch) {
    const { component: Component, params: routeParams } = dynamicMatch;
    return <Component params={routeParams} />;
  }
  return notFound();
};

export default ViewPage;