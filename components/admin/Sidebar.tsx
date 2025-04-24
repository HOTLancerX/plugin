//components/Sidebar.tsx
"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSidebarMenus } from '@/hooks';
import Link from 'next/link';

// Default menus
export const defaultSidebarMenus = [
  {
    title: "Dashboard",
    icon: "🏠︎",
    position: 1,
    link: "/admin/dashboard",
    submenu: []
  },
  {
    title: "Plugins",
    icon: "📌",
    position: 2,
    link: "/admin/plugins",
    submenu: []
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    // Initialize all menus with submenus as expanded if their main link is active
    const initial: Record<string, boolean> = {};
    const allMenus = [...defaultSidebarMenus, ...getSidebarMenus()];
    allMenus.forEach(menu => {
      initial[menu.link] = menu.submenu.some(sub => pathname?.startsWith(sub.link)) || 
                         pathname?.startsWith(menu.link);
    });
    return initial;
  });

  // Combine default menus with plugin menus
  const menus = [...defaultSidebarMenus, ...getSidebarMenus()].sort((a, b) => a.position - b.position);

  const toggleMenu = (link: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [link]: !prev[link]
    }));
  };

  return (
    <div className="w-64 bg-gray-200 text-gray-700 h-full bottom-0 fixed left-0 top-0">
      <div className="text-xl font-bold p-2">Admin Panel</div>
      <nav className='w-full h-full'>
        <ul className="h-full overflow-y-auto block divide-y divide-gray-100">
          {menus.map(menu => (
            <li key={menu.link}>
              <div 
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${pathname === menu.link ? 'bg-gray-100' : ''}`}
                onClick={() => menu.submenu.length > 0 && toggleMenu(menu.link)}
              >
                <span className="mr-1">{menu.icon}</span>
                <Link href={menu.link} className="flex-grow">
                  {menu.title}
                </Link>
                {menu.submenu.length > 0 && (
                  <span>
                    {expandedMenus[menu.link] ?
                      '▼'
                      :
                      '▶'
                    }
                  </span>
                )}
              </div>
              {menu.submenu.length > 0 && expandedMenus[menu.link] && (
                <ul className="space-y-1">
                  {menu.submenu.sort((a, b) => (a.position || 0) - (b.position || 0)).map(sub => (
                    <li key={sub.link}>
                      <Link 
                        href={sub.link}
                        className={`block p-2 pl-9 rounded hover:bg-gray-100 ${pathname === sub.link ? 'bg-gray-100' : ''}`}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};