import { NextResponse } from 'next/server';
import axios from 'axios';
import { server } from '@/config';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data structure
    if (!data.sections || !Array.isArray(data.sections)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Get the token from the request cookies
    const token = request.headers.get('authorization')?.split(' ')[1] || '';
    
    // Update the page in the database
    const response = await axios.put(`${server}/page/home`, 
      { sections: data.sections },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.status !== 200) {
      throw new Error('Failed to update page in database');
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Page updated successfully" 
    });
  } catch (error) {
    console.error('Error updating homepage:', error);
    return NextResponse.json({ 
      error: 'Failed to update homepage',
      details: (error as Error).message 
    }, { status: 500 });
  }
} 