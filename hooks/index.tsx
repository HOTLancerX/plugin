//hooks/index.tsx
import React from 'react';

import { 
  actionRegistry,
  routeRegistry,
  dynamicRouteRegistry,
  pluginRegistry,
  sidebarMenuRegistry
} from './registries';
import { PluginStatus } from './types';
import { initializePlugins } from './plugin';
export { 
  registerOptions, 
  getOptions, 
  getOptionComponents,
  registerAllOptions
} from './option';

export const Hooks = ({ name }: { name: string }) => (
  <>
    {(actionRegistry[name] || []).map(({ component: Component, componentName, pluginName }, i) => (
      <Component key={`${pluginName}-${componentName || i}`} />
    ))}
  </>
);

export const getRouteComponents = (type: 'view' | 'admin') => 
  routeRegistry[type].filter(route => route.status === 'enable');

export const getDynamicRouteMatch = (type: 'view' | 'admin', path: string) => {
  const route = dynamicRouteRegistry[type].find(r => 
    r.status === 'enable' && r.matchFn(path)
  );
  return route ? { 
    component: route.component, 
    params: route.matchFn(path), 
    pluginName: route.pluginName 
  } : null;
};

export const getSidebarMenus = () => [...sidebarMenuRegistry];
export const getAllPlugins = () => Object.values(pluginRegistry).map(p => p.metadata);
export const getPluginComponents = (pluginName: string) => pluginRegistry[pluginName]?.components || {};

export const togglePluginStatus = (pluginName: string, currentStatus: PluginStatus) => {
  const newStatus = currentStatus === 'enable' ? 'disable' : 'enable';
  const plugin = pluginRegistry[pluginName];
  if (plugin) {
    plugin.metadata.Status = newStatus;
    initializePlugins();
  }
  return newStatus;
};