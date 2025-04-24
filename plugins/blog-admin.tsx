export const metadata = {
  "PluginName": "BlogAdmin",
  "Version": "1.0.0",
  "Description": "Blog management for admin",
  "Status": "enable"
};

export const sidebarMenus = {
  menus: [
    {
      title: "Blog",
      icon: "📌",
      position: 3,
      link: "/admin/blog",
      submenu: [
        {
          title: "All Blogs",
          link: "/admin/blog/all",
          position: 1
        },
        {
          title: "Add New",
          link: "/admin/blog/new",
          position: 2
        },
        {
          title: "Categories",
          link: "/admin/blog/categories",
          position: 3
        }
      ]
    }
  ]
};