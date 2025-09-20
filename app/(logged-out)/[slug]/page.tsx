import { Metadata } from "next"
import SlugPageClient from './SlugPageClient';

// Type definitions
export interface BlogPost {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
  category: string[];
  author: string;
  date: string;
}

export interface Project {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  company: string;
  subtitle: string;
  fullDescription: string;
  tag: string;
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
}

// Function to convert title to slug (same function used in components)
export const slugify = (text: string) => {
  // Turkish character mapping
  const turkishMap: {[key: string]: string} = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  
  // Replace Turkish characters
  let result = text.toString();
  for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
    result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
  }
  
  return result
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

// Fetch blogs from API endpoint
const fetchBlogs = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/local-blogs`, { cache: 'no-store' });
    if (!response.ok) {
      console.warn(`Failed to fetch blogs: ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Fetch projects from API endpoint
const fetchProjects = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/local-projects`, { cache: 'no-store' });
    if (!response.ok) {
      console.warn(`Failed to fetch projects: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Generate dynamic metadata for each page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch blog and project data from API endpoints
    const [blogData, projectData] = await Promise.all([
      fetchBlogs(),
      fetchProjects()
    ]);
    
    // Find the content by slugified title in either data set
    const blogPost = Array.isArray(blogData) ? 
      blogData.find((post: BlogPost) => slugify(post.title) === slug) : null;
    
    const project = Array.isArray(projectData) ? 
      projectData.find((proj: Project) => slugify(proj.title) === slug) : null;
    
    // If we have a blog post
    if (blogPost) {
      return {
        title: `${blogPost.title} | WordPress Clone Blog`,
        description: blogPost.description,
        keywords: blogPost.category.join(', '),
        openGraph: {
          title: blogPost.title,
          description: blogPost.description,
          images: [blogPost.image],
          type: 'article',
        },
      };
    }
    
    // If we have a project
    if (project) {
      return {
        title: `${project.title} | WordPress Clone Projects`,
        description: project.description,
        keywords: project.categories.join(', '),
        openGraph: {
          title: project.title,
          description: project.description,
          images: [project.image],
          type: 'article',
        },
      };
    }
    
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Default metadata if not found
  return {
    title: `${slug} | WordPress Clone`,
    description: "WordPress Clone Content",
  };
}

export default async function SlugPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Await params before accessing its properties
  const { slug } = await params;
  
  // Pass the slug directly to the client component
  return <SlugPageClient slug={slug} />;
}
