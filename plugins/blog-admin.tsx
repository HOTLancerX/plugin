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
      icon: "Book",
      position: 3,
      link: "/blog",
      submenu: [
        {
          title: "All Blogs",
          link: "/blog/all",
          position: 1
        },
        {
          title: "Add New",
          link: "/blog/new",
          position: 2
        },
        {
          title: "Categories",
          link: "/blog/categories",
          position: 3
        }
      ]
    }
  ]
};