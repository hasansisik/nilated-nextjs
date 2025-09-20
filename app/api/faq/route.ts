import { NextRequest, NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

// Function to get FAQ data from server API
export async function GET(req: NextRequest) {
  try {
    // Fetch from MongoDB API
    const { data } = await axios.get(`${server}/faq`);
    return NextResponse.json(data.faq);
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ data from server" },
      { status: 500 }
    );
  }
}

// Function to update FAQ data on server API
export async function POST(req: NextRequest) {
  try {
    // Get FAQ data from request
    const faqData = await req.json();
    
    try {
      // Server-side'da localStorage kullanılamaz
      // Token olmadan direkt istek gönder
      const { data } = await axios.put(
        `${server}/faq`,
        faqData
      );
      return NextResponse.json(data.faq);
    } catch (mongoError) {
      console.error("Error updating FAQ data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update FAQ data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in FAQ update request:", error);
    return NextResponse.json(
      { error: "Failed to process FAQ update request" },
      { status: 500 }
    );
  }
} 