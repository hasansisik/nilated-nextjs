import { NextRequest, NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

// Function to get hero data from server API
export async function GET(req: NextRequest) {
  try {
    // Fetch from MongoDB API
    const { data } = await axios.get(`${server}/hero`);
    return NextResponse.json(data.hero);
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero data from server" },
      { status: 500 }
    );
  }
}

// Function to update hero data on server API
export async function POST(req: NextRequest) {
  try {
    // Get hero data from request
    const heroData = await req.json();
    
    try {
      // Send to MongoDB API
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${server}/hero`,
        heroData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return NextResponse.json(data.hero);
    } catch (mongoError) {
      console.error("Error updating hero data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update hero data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in hero update request:", error);
    return NextResponse.json(
      { error: "Failed to process hero update request" },
      { status: 500 }
    );
  }
} 