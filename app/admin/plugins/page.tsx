// app/admin/plugins/page.tsx
'use client';
import { Hooks } from '@/hooks';
import React from 'react';

// Fix for the 'require.context' issue in TypeScript
const plugins = (require as any).context('@/plugins', true, /\.tsx$/).keys().map((key: string) => {
  const mod = require(`@/plugins/${key.replace('./', '')}`);
  return {
    name: mod.metadata?.['PluginName'] || key,
    metadata: mod.metadata || {},
  };
});

// Define the types for the map function parameters
interface Plugin {
  name: string;
  metadata: {
    [key: string]: any;
    Status?: string;
    PluginName?: string;
    Description?: string;
    Version?: string;
  };
}

export default function PluginsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Plugins</h1>
      <Hooks name="Nex-plugin" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map(({ name, metadata }: Plugin, index: number) => {
          const status = metadata.Status?.toLowerCase();
          const enabled = status === 'enable';
          return (
            <div
              key={index}
              className={`rounded-xl p-4 border ${enabled ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}
            >
              <h2 className="text-lg font-semibold">{name}</h2>
              <h2 className="text-lg font-semibold">{metadata.Version}</h2>
              <p className="text-sm text-gray-700">{metadata.Description}</p>
              <div className="text-xs mt-2 text-gray-600">
                <b>Status:</b> {status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
