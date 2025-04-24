import { notFound } from 'next/navigation';
import { getRouteComponents, getDynamicRouteMatch } from '@/hooks';

type Props = {
  params: {
    view: string[];
  };
};

// Make the function async
export default async function ViewPage({ params }: Props) {
  if (!params?.view || !Array.isArray(params.view)) {
    return notFound();
  }

  const path = `/${params.view.join('/')}`;

  const staticRoutes = getRouteComponents('view');
  const staticRoute = staticRoutes.find((r) => r.route === path);

  if (staticRoute) {
    const Component = staticRoute.component;
    return <Component />;
  }

  const dynamicMatch = getDynamicRouteMatch('view', path);
  if (dynamicMatch) {
    const { component: Component, params: routeParams } = dynamicMatch;
    return <Component params={routeParams} />;
  }

  return notFound();
}
