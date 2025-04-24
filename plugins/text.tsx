//plugins/text.tsx
import React from 'react';

export const metadata = {
  "PluginName": "Text",
  "Version": "2.2.0",
  "Description": "In tribute to the famous Hello Dolly plugin",
  "Status": "enable" //enable disable
};

// কম্পোনেন্ট ১: হেডার ডিজাইন এ
export const hello = () => (
  <div className="bg-blue-600 text-white p-4">
    <h1 className="text-2xl font-bold">HeLLo</h1>
  </div>
);
// একশন কনফিগারেশন
export const actions = [
  { hookName: 'Nex-header', position: 1, componentName: 'hello' },
  { hookName: 'Nex-plugin', position: 1, componentName: 'hello' },
];