import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read blog data from JSON file
    const filePath = path.join(process.cwd(), 'data/blog.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching local blog data:', error);
    // Return empty array instead of error to prevent breaking the app
    return NextResponse.json([]);
  }
} 