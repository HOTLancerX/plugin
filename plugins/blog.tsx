import React from 'react';

export const metadata = {
  "PluginName": "Blog",
  "Version": "1.0.0",
  "Description": "A dynamic blog plugin",
  "Status": "enable"  //enable disable
};

export const Blogs = [
  {
    id: 1,
    title: "Mastering React Hooks in 2025",
    slug: "mastering-react-hooks-in-2025",
    image: "/images/react-hooks.jpg",
    description: "Learn all about React Hooks in this comprehensive guide.",
    content: "<p>This is the full content of the React Hooks article...</p>"
  },
  {
    id: 2,
    title: "Next.js 15 New Features",
    slug: "nextjs-15-new-features",
    image: "/images/nextjs.jpg",
    description: "Explore the latest features in Next.js 15.",
    content: "<p>This is the full content of the Next.js article...</p>"
  }
];

// Blog Listing Component
export const BlogListing = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Blogs.map(blog => (
          <div key={blog.id} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <a 
                href={`/blog/${blog.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Single Post View Component
export const PostView = ({ params }: { params: { slug: string } }) => {
  const post = Blogs.find(blog => blog.slug === params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <img src={post.image} alt={post.title} className="w-full h-64 object-cover mb-6 rounded-lg" />
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export const routes = [
  {
    type: 'view',
    route: '/blog',
    componentName: 'BlogListing',
    position: 1
  }
];

export const dynamicRoutes = [
  {
    type: 'view',
    routePattern: '/blog/[slug]',
    componentName: 'PostView',
    position: 1
  }
];

export const Sidebar = [
  {
    "id": "dashboard",
    "title": "Dashboard",
    "icon": "Home",
    "position": "1",
    "link": "/dashboard",
    "submenu": []
  },
  {
    "id": "posts",
    "title": "Posts",
    "icon": "FileText",
    "position": "2",
    "link": "/posts",
    "submenu": [
      {
        "id": "all-posts",
        "title": "All Posts",
        "link": "/posts/all"
      },
      {
        "id": "add-new",
        "title": "Add New",
        "link": "/posts/new"
      }
    ]
  }
]
