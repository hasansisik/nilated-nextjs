import { NextRequest, NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

// Function to get CTA data from server API
export async function GET(req: NextRequest) {
  try {
    // Fetch from MongoDB API
    const { data } = await axios.get(`${server}/cta`);
    return NextResponse.json(data.cta);
  } catch (error) {
    console.error("Error fetching CTA data:", error);
    return NextResponse.json(
      { error: "Failed to fetch CTA data from server" },
      { status: 500 }
    );
  }
}

// Function to update CTA data on server API
export async function POST(req: NextRequest) {
  try {
    // Get CTA data from request
    const ctaData = await req.json();
    
    try {
      // Send to MongoDB API
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${server}/cta`,
        ctaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return NextResponse.json(data.cta);
    } catch (mongoError) {
      console.error("Error updating CTA data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update CTA data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in CTA update request:", error);
    return NextResponse.json(
      { error: "Failed to process CTA update request" },
      { status: 500 }
    );
  }
} 