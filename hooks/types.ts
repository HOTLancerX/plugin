import { ComponentType } from 'react';

export type PluginStatus = 'enable' | 'disable';

export interface PluginMetadata {
  PluginName: string;
  Version: string;
  Description: string;
  Status: PluginStatus;
}

export interface ActionConfig {
  hookName: string;
  position: number;
  componentName?: string;
}

export interface RouteConfig {
  type: 'view' | 'admin';
  route: string;
  componentName: string;
  position: number;
}

export interface DynamicRouteConfig {
  type: 'view' | 'admin';
  routePattern: string;
  componentName: string;
  position: number;
}

export interface SubmenuItem {
  title: string;
  link: string;
  position?: number;
}

export interface MenuItem {
  title: string;
  icon: string;
  position: number;
  link: string;
  submenu: SubmenuItem[];
}

export interface SidebarMenuConfig {
  menus: MenuItem[];
}

export interface PluginModule {
  metadata: PluginMetadata;
  actions?: ActionConfig[];
  routes?: RouteConfig[];
  dynamicRoutes?: DynamicRouteConfig[];
  sidebarMenus?: SidebarMenuConfig;
  [key: string]: unknown;
}

export interface RouteRegistryItem {
  component: ComponentType<any>;
  route: string;
  position: number;
  pluginName: string;
  status: PluginStatus;
}

export interface DynamicRouteRegistryItem {
  component: ComponentType<any>;
  routePattern: string;
  position: number;
  pluginName: string;
  status: PluginStatus;
  matchFn: (path: string) => Record<string, string> | null;
}