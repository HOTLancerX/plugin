import React from 'react';

type PluginStatus = 'enable' | 'disable';

type PluginMetadata = {
  PluginName: string;
  Version: string;
  Description: string;
  Status: PluginStatus;
};

type ActionConfig = {
  hookName: string;
  position: number;
  componentName?: string;
};

type RouteConfig = {
  type: 'view' | 'admin';
  route: string;
  componentName: string;
  position: number;
};

type DynamicRouteConfig = {
  type: 'view' | 'admin';
  routePattern: string;
  componentName: string;
  position: number;
};

type PluginModule = {
  metadata: PluginMetadata;
  actions?: ActionConfig[];
  routes?: RouteConfig[];
  dynamicRoutes?: DynamicRouteConfig[];
  [key: string]: unknown;
};

const actionRegistry: Record<
  string,
  Array<{
    component: React.ComponentType<any>;
    position: number;
    componentName?: string;
    pluginName: string;
  }>
> = {};

const routeRegistry: Record<
  string,
  Array<{
    component: React.ComponentType<any>;
    route: string;
    position: number;
    pluginName: string;
    status: PluginStatus;
  }>
> = { view: [], admin: [] };

const dynamicRouteRegistry: Record<
  string,
  Array<{
    component: React.ComponentType<any>;
    routePattern: string;
    position: number;
    pluginName: string;
    status: PluginStatus;
    matchFn: (path: string) => Record<string, string> | null;
  }>
> = { view: [], admin: [] };

const pluginRegistry: Record<
  string,
  {
    metadata: PluginMetadata;
    components: Record<string, React.ComponentType<any>>;
  }
> = {};

function createRouteMatcher(routePattern: string) {
  const patternParts = routePattern.split('/');
  
  return (path: string) => {
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    
    const params: Record<string, string> = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        const paramName = patternPart.slice(1, -1);
        params[paramName] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }
    
    return params;
  };
}

export function registerComponents(components: PluginModule) {
  const { 
    metadata, 
    actions = [], 
    routes = [], 
    dynamicRoutes = [], 
    ...comps 
  } = components;
  const pluginName = metadata["PluginName"];

  // Register plugin metadata and components
  pluginRegistry[pluginName] = {
    metadata,
    components: Object.entries(comps).reduce((acc, [key, value]) => {
      if (typeof value === 'function') {
        acc[key] = value as React.ComponentType<any>;
      }
      return acc;
    }, {} as Record<string, React.ComponentType<any>>),
  };

  // Register action components (only if enabled)
  if (metadata.Status === 'enable') {
    actions.forEach(({ hookName, position, componentName }) => {
      if (!componentName) return;

      const component = comps[componentName] as React.ComponentType<any> | undefined;
      if (!component || typeof component !== 'function') return;

      if (!actionRegistry[hookName]) {
        actionRegistry[hookName] = [];
      }

      actionRegistry[hookName].push({ component, position, componentName, pluginName });
      actionRegistry[hookName].sort((a, b) => a.position - b.position);
    });
  }

  // Always register routes but track their status
  routes.forEach(({ type, route, componentName, position }) => {
    if (!componentName) return;

    const component = comps[componentName] as React.ComponentType<any> | undefined;
    if (!component || typeof component !== 'function') return;

    routeRegistry[type].push({
      component,
      route,
      position,
      pluginName,
      status: metadata.Status
    });
    routeRegistry[type].sort((a, b) => a.position - b.position);
  });

  // Register dynamic routes
  dynamicRoutes.forEach(({ type, routePattern, componentName, position }) => {
    if (!componentName) return;

    const component = comps[componentName] as React.ComponentType<any> | undefined;
    if (!component || typeof component !== 'function') return;

    const matchFn = createRouteMatcher(routePattern);

    dynamicRouteRegistry[type].push({
      component,
      routePattern,
      position,
      pluginName,
      status: metadata.Status,
      matchFn
    });
    dynamicRouteRegistry[type].sort((a, b) => a.position - b.position);
  });
}

export const Hooks = ({ name }: { name: string }) => {
  const components = actionRegistry[name] || [];

  return (
    <>
      {components.map(({ component: Component, componentName, pluginName }, index) => (
        <Component key={`${pluginName}-${componentName || 'default'}-${index}`} />
      ))}
    </>
  );
};

export function getRouteComponents(type: 'view' | 'admin') {
  return (routeRegistry[type] || []).filter(route => route.status === 'enable');
}

export function getDynamicRouteMatch(type: 'view' | 'admin', path: string) {
  const routes = dynamicRouteRegistry[type] || [];
  
  for (const route of routes) {
    if (route.status !== 'enable') continue;
    
    const params = route.matchFn(path);
    if (params) {
      return {
        component: route.component,
        params,
        pluginName: route.pluginName
      };
    }
  }
  
  return null;
}

export function getAllPlugins() {
  return Object.values(pluginRegistry).map(({ metadata }) => metadata);
}

export function getPluginComponents(pluginName: string) {
  return pluginRegistry[pluginName]?.components || {};
}

export function togglePluginStatus(pluginName: string, currentStatus: PluginStatus) {
  const newStatus = currentStatus === 'enable' ? 'disable' : 'enable';
  const plugin = pluginRegistry[pluginName];
  
  if (plugin) {
    plugin.metadata.Status = newStatus;
    // Re-register all plugins to update the registries
    registerAllPlugins();
  }
  return newStatus;
}

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

let isRegistered = false;

export function registerAllPlugins() {
  // Clear existing registries
  Object.keys(actionRegistry).forEach(key => delete actionRegistry[key]);
  routeRegistry.view = [];
  routeRegistry.admin = [];
  dynamicRouteRegistry.view = [];
  dynamicRouteRegistry.admin = [];

  const pluginContext = require.context('../plugins', true, /\.tsx$/);

  pluginContext.keys().forEach((key: string) => {
    const pluginModule = pluginContext(key) as PluginModule;
    if (pluginModule.metadata) {
      registerComponents(pluginModule);
    }
  });

  isRegistered = true;
}

if (!isRegistered) {
  registerAllPlugins();
}