import { sidebarMenuRegistry } from './registries';
import { MenuItem, SubmenuItem } from './types';

export function registerSidebarMenus(menus: MenuItem[]) {
  menus.forEach(menu => {
    const existing = sidebarMenuRegistry.find(m => m.link === menu.link);
    if (existing) {
      menu.submenu.forEach(sub => {
        if (!existing.submenu.some(s => s.link === sub.link)) {
          existing.submenu.push(sub);
        }
      });
      existing.submenu.sort(sortSubmenu);
    } else {
      sidebarMenuRegistry.push(menu);
    }
  });
  sidebarMenuRegistry.sort(sortMenu);
}

const sortSubmenu = (a: SubmenuItem, b: SubmenuItem) => (a.position || 0) - (b.position || 0);
const sortMenu = (a: MenuItem, b: MenuItem) => a.position - b.position;