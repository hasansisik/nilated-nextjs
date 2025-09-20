import { NextRequest, NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

// Function to get other data from server API
export async function GET(req: NextRequest) {
  try {
    // Fetch from MongoDB API
    const { data } = await axios.get(`${server}/other`);
    return NextResponse.json(data.other);
  } catch (error) {
    console.error("Error fetching other data:", error);
    return NextResponse.json(
      { error: "Failed to fetch other data from server" },
      { status: 500 }
    );
  }
}

// Function to update other data on server API
export async function POST(req: NextRequest) {
  try {
    // Get other data from request
    const otherData = await req.json();
    
    try {
      // Send to MongoDB API
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${server}/other`,
        otherData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return NextResponse.json(data.other);
    } catch (mongoError) {
      console.error("Error updating other data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update other data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in other update request:", error);
    return NextResponse.json(
      { error: "Failed to process other update request" },
      { status: 500 }
    );
  }
} 