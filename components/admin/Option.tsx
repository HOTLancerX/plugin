//components/admin/Option.tsx
"use client";
import React, { useState } from 'react';
import { getOptions, getPluginComponents } from '@/hooks';

// Define OptionItem type locally since it's not imported
type OptionItem = {
  id: number;
  title: string;
  componentName: string;
  pluginName?: string;
};

// Default component definition
const DefaultComponent: React.FC = () => (
  <div className="bg-gray-100 p-6 rounded-lg">
    <h2 className="text-xl font-semibold">Default Component</h2>
    <p className="mt-2 text-gray-600">Select an option from the tabs above</p>
  </div>
);

// Default options configuration
const defaultOptions: OptionItem[] = [
  {
    id: 1,
    title: 'Dashboard',
    componentName: 'DefaultComponent',
  },
  {
    id: 2,
    title: 'Settings',
    componentName: 'DefaultComponent',
  }
];

// Main Option component
const Option: React.FC = () => {
  // Get all registered options
  const allOptions = [...defaultOptions, ...getOptions()];
  
  // State for active option
  const [activeOptionId, setActiveOptionId] = useState<number>(allOptions[0]?.id || 0);

  // Find the active option data
  const activeOption = allOptions.find(option => option.id === activeOptionId);
  
  // Determine which component to render
  let ActiveComponent: React.ComponentType = DefaultComponent;

  if (activeOption) {
    if (activeOption.pluginName) {
      // Try to get component from plugin
      const pluginComponents = getPluginComponents(activeOption.pluginName);
      const PluginComponent = pluginComponents[activeOption.componentName];
      if (PluginComponent) {
        ActiveComponent = PluginComponent;
      }
    } else if (activeOption.componentName === 'DefaultComponent') {
      // Use default component
      ActiveComponent = DefaultComponent;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {allOptions.map(option => (
            <button
              key={`${option.id}-${option.title}`}
              onClick={() => setActiveOptionId(option.id)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                ${activeOptionId === option.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {option.title}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Active component display */}
      <div className="p-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Option;
export { defaultOptions };