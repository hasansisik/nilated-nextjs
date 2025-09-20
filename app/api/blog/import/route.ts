import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// POST handler to import blog posts from JSON
export async function POST(request: NextRequest) {
  try {
    const posts = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'blog.json');
    
    // Save the imported data to the file
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error importing blog posts:', error);
    return NextResponse.json({ error: 'Failed to import blog posts' }, { status: 500 });
  }
} 