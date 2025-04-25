//components/admin/Option.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { getOptions, getOptionComponents } from '@/hooks/option';

export const Options = () => {
  const [options, setOptions] = useState(getOptions());
  const [components, setComponents] = useState(getOptionComponents());
  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {
    setOptions(getOptions());
    setComponents(getOptionComponents());
    if (options.length > 0 && activeTab === null) {
      setActiveTab(options[0].id);
    }
  }, []);

  if (options.length === 0) {
    return <div className="p-4">No options available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        {options.map(option => (
          <button
            key={option.id}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === option.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(option.id)}
          >
            {option.title}
          </button>
        ))}
      </div>

      <div className="p-4">
        {options.map(option => {
          const Component = components[option.componentName];
          return (
            <div 
              key={option.id} 
              className={activeTab === option.id ? 'block' : 'hidden'}
            >
              {Component ? <Component /> : `Component ${option.componentName} not found`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Default options
export const Option = [
  {
    id: 1,
    title: 'Hello khan',
    componentName: 'Khan',
  },
  {
    id: 4,
    title: 'Hello khan', 
    componentName: 'Khan',
  }
];