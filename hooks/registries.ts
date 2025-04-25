//hooks/registries.ts
import { 
  PluginMetadata, 
  PluginStatus, 
  MenuItem,
  RouteRegistryItem,
  DynamicRouteRegistryItem,
  ActionConfig,
  RouteConfig,
  DynamicRouteConfig,
  SidebarMenuConfig
} from './types';
import { ComponentType } from 'react';

// Action registry for plugin hooks
export const actionRegistry: Record<
  string,
  Array<{
    component: ComponentType<any>;
    position: number;
    componentName?: string;
    pluginName: string;
  }>
> = {};

// Route registry for view and admin routes
export const routeRegistry: {
  view: RouteRegistryItem[];
  admin: RouteRegistryItem[];
} = { view: [], admin: [] };

// Dynamic route registry for parameterized routes
export const dynamicRouteRegistry: {
  view: DynamicRouteRegistryItem[];
  admin: DynamicRouteRegistryItem[];
} = { view: [], admin: [] };

// Sidebar menu items registry
export const sidebarMenuRegistry: MenuItem[] = [];

// Plugin component registry
export const pluginRegistry: Record<
  string,
  {
    metadata: PluginMetadata;
    components: Record<string, ComponentType<any>>;
  }
> = {};

// Option tabs registry
export const optionRegistry: Array<{
  id: number;
  title: string;
  componentName: string;
}> = [];

// Helper function to clear all registries
export function clearAllRegistries() {
  // Clear action registry
  Object.keys(actionRegistry).forEach(key => delete actionRegistry[key]);
  
  // Clear route registries
  routeRegistry.view = [];
  routeRegistry.admin = [];
  
  // Clear dynamic route registries
  dynamicRouteRegistry.view = [];
  dynamicRouteRegistry.admin = [];
  
  // Clear sidebar menus
  sidebarMenuRegistry.length = 0;
  
  // Clear plugin registry
  Object.keys(pluginRegistry).forEach(key => delete pluginRegistry[key]);
  
  // Clear option registry
  optionRegistry.length = 0;
}

// Type guards for plugin modules
export function isActionConfig(config: any): config is ActionConfig {
  return config && typeof config.hookName === 'string';
}

export function isRouteConfig(config: any): config is RouteConfig {
  return config && typeof config.route === 'string';
}

export function isDynamicRouteConfig(config: any): config is DynamicRouteConfig {
  return config && typeof config.routePattern === 'string';
}

export function isSidebarMenuConfig(config: any): config is SidebarMenuConfig {
  return config && Array.isArray(config.menus);
}