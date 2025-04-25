//hooks/plugin.ts
import { PluginModule } from './types';
import { registerComponents } from './service';
import { registerOptions } from './option';

import { 
  actionRegistry, 
  routeRegistry, 
  dynamicRouteRegistry, 
  sidebarMenuRegistry 
} from './registries';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

let initialized = false;

export function initializePlugins() {
  clearRegistries();
  
  const pluginContext = require.context('../plugins', true, /\.tsx$/);
  pluginContext.keys().forEach(key => {
    const plugin = pluginContext(key) as PluginModule;
    if (plugin.metadata) registerComponents(plugin);
  });

  initialized = true;
}

function clearRegistries() {
  Object.keys(actionRegistry).forEach(key => delete actionRegistry[key]);
  routeRegistry.view = [];
  routeRegistry.admin = [];
  dynamicRouteRegistry.view = [];
  dynamicRouteRegistry.admin = [];
  sidebarMenuRegistry.length = 0;
}

if (!initialized) initializePlugins();
