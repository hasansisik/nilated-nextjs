import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read projects data from JSON file
    const filePath = path.join(process.cwd(), 'data/projects.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ projects: [] });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching local projects data:', error);
    // Return empty projects array instead of error to prevent breaking the app
    return NextResponse.json({ projects: [] });
  }
} 