//hooks/service.ts
import { 
  PluginModule, 
  ActionConfig, 
  RouteConfig, 
  DynamicRouteConfig,
  PluginStatus
} from './types';

import { 
  actionRegistry, 
  routeRegistry, 
  dynamicRouteRegistry, 
  pluginRegistry 
} from './registries';

import { createRouteMatcher } from './route';
import { registerSidebarMenus } from './sidebar';

export function registerComponents(components: PluginModule) {
  const { metadata, actions = [], routes = [], dynamicRoutes = [], sidebarMenus, ...comps } = components;
  const pluginName = metadata.PluginName;

  pluginRegistry[pluginName] = {
    metadata,
    components: Object.fromEntries(
      Object.entries(comps).filter(([, value]) => typeof value === 'function')
    ) as Record<string, React.ComponentType<any>>
  };

  if (metadata.Status === 'enable') {
    registerActions(actions, comps, pluginName);
  }

  registerRoutes(routes, comps, pluginName, metadata.Status);
  registerDynamicRoutes(dynamicRoutes, comps, pluginName, metadata.Status);

  if (sidebarMenus?.menus) {
    registerSidebarMenus(sidebarMenus.menus);
  }
}

function registerActions(actions: ActionConfig[], comps: any, pluginName: string) {
  actions.forEach(({ hookName, position, componentName }) => {
    if (!componentName) return;
    const component = comps[componentName];
    if (typeof component !== 'function') return;
    
    (actionRegistry[hookName] ??= []).push({ component, position, componentName, pluginName });
    actionRegistry[hookName].sort((a, b) => a.position - b.position);
  });
}

function registerRoutes(routes: RouteConfig[], comps: any, pluginName: string, status: PluginStatus) {
  routes.forEach(({ type, route, componentName, position }) => {
    if (!componentName) return;
    const component = comps[componentName];
    if (typeof component !== 'function') return;
    
    routeRegistry[type].push({ component, route, position, pluginName, status });
    routeRegistry[type].sort((a, b) => a.position - b.position);
  });
}

function registerDynamicRoutes(dynamicRoutes: DynamicRouteConfig[], comps: any, pluginName: string, status: PluginStatus) {
  dynamicRoutes.forEach(({ type, routePattern, componentName, position }) => {
    if (!componentName) return;
    const component = comps[componentName];
    if (typeof component !== 'function') return;
    
    dynamicRouteRegistry[type].push({
      component,
      routePattern,
      position,
      pluginName,
      status,
      matchFn: createRouteMatcher(routePattern)
    });
    dynamicRouteRegistry[type].sort((a, b) => a.position - b.position);
  });
}
