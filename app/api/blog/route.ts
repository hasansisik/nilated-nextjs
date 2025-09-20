import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET handler to retrieve all blog posts or a specific post by ID
export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blog.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);
    
    // Check if a specific post ID is requested
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const post = posts.find((p: any) => p.id.toString() === id);
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading blog data:', error);
    return NextResponse.json({ error: 'Failed to read blog data' }, { status: 500 });
  }
}

// POST handler to create a new blog post
export async function POST(request: NextRequest) {
  try {
    const newPost = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'blog.json');
    
    // Read existing posts
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);
    
    // Generate new ID based on existing posts
    const newId = posts.length > 0 ? Math.max(...posts.map((post: any) => post.id)) + 1 : 1;
    
    // Add ID and link to the new post
    const postWithId = {
      ...newPost,
      id: newId,
      link: `/blog/${newId}`
    };
    
    // Add the new post to the array
    const updatedPosts = [...posts, postWithId];
    
    // Save the updated data to the file
    await fs.writeFile(filePath, JSON.stringify(updatedPosts, null, 2));
    
    return NextResponse.json({ success: true, post: postWithId });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// PUT handler to update an existing blog post
export async function PUT(request: NextRequest) {
  try {
    const updatedPost = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'blog.json');
    
    // Read existing posts
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);
    
    // Find the post to update
    const postIndex = posts.findIndex((post: any) => post.id === updatedPost.id);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Update the post
    posts[postIndex] = updatedPost;
    
    // Save the updated data to the file
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to remove a blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'data', 'blog.json');
    
    // Read existing posts
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);
    
    // Filter out the post to delete
    const updatedPosts = posts.filter((post: any) => post.id !== parseInt(id));
    
    if (updatedPosts.length === posts.length) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Save the updated data to the file
    await fs.writeFile(filePath, JSON.stringify(updatedPosts, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 