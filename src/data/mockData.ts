export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'Author';
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: Category;
  tags: string[];
  createdAt: string;
  status: 'Published' | 'Draft';
  readTime: number;
  views: number;
  commentsCount: number;
}

export const mockAuthor: Author = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  role: 'Admin',
};

export const mockRegularAuthor: Author = {
  id: 'u2',
  name: 'John Smith',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  role: 'Author',
};

export const mockUsers: Author[] = [mockAuthor, mockRegularAuthor];

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Technology', slug: 'technology' },
  { id: 'c2', name: 'Design', slug: 'design' },
  { id: 'c3', name: 'Lifestyle', slug: 'lifestyle' },
  { id: 'c4', name: 'Productivity', slug: 'productivity' },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    title: 'The Future of Claymorphism in Web Design',
    excerpt: 'Explore how soft 3D UI elements are revolutionizing modern user interfaces and replacing flat design.',
    content: 'Long form content goes here...',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: mockAuthor,
    category: mockCategories[1],
    tags: ['UI', 'Design Trends'],
    createdAt: '2023-10-12T10:00:00Z',
    status: 'Published',
    readTime: 5,
    views: 1204,
    commentsCount: 12,
  },
  {
    id: 'p2',
    title: 'Building Scalable React Applications',
    excerpt: 'A comprehensive guide to structuring large-scale React apps with TypeScript and modern tooling.',
    content: 'Long form content goes here...',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: mockRegularAuthor,
    category: mockCategories[0],
    tags: ['React', 'TypeScript'],
    createdAt: '2023-10-15T08:30:00Z',
    status: 'Published',
    readTime: 8,
    views: 840,
    commentsCount: 5,
  },
  {
    id: 'p3',
    title: 'Draft: 10 Productivity Hacks for Remote Workers',
    excerpt: 'Boost your daily output with these battle-tested remote work strategies and tools.',
    content: 'Working from home comes with its own set of challenges...',
    coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: mockRegularAuthor,
    category: mockCategories[3],
    tags: ['Work', 'Remote'],
    createdAt: '2023-10-20T14:15:00Z',
    status: 'Draft',
    readTime: 4,
    views: 0,
    commentsCount: 0,
  },
];
