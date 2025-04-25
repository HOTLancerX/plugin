import React from 'react';
import { PluginModule } from './types';
import { pluginRegistry } from './registries';

type OptionItem = {
  id: number;
  title: string;
  componentName: string;
};

const optionRegistry: OptionItem[] = [];

export function registerOptions(plugin: PluginModule) {
  if (plugin.Option && Array.isArray(plugin.Option)) {
    optionRegistry.push(...plugin.Option);
    optionRegistry.sort((a: OptionItem, b: OptionItem) => a.id - b.id);
  }
}

export function getOptions(): OptionItem[] {
  return [...optionRegistry];
}

export function getOptionComponents(): Record<string, React.ComponentType<any>> {
  const options = getOptions();
  const components: Record<string, React.ComponentType<any>> = {};
  
  Object.values(pluginRegistry).forEach(plugin => {
    options.forEach(option => {
      if (option.componentName in plugin.components) {
        components[option.componentName] = plugin.components[option.componentName];
      }
    });
  });
  
  return components;
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

export function registerAllOptions() {
  optionRegistry.length = 0;
  
  const pluginContext = require.context('../plugins', true, /\.tsx$/);
  pluginContext.keys().forEach((key: string) => {
    const plugin = pluginContext(key) as PluginModule;
    if (plugin.metadata) {
      registerOptions(plugin);
    }
  });

  isRegistered = true;
}

if (!isRegistered) {
  registerAllOptions();
}