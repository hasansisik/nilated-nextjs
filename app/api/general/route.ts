import { NextRequest, NextResponse } from "next/server";
import { server } from "@/config";
import axios from "axios";

// GET function to fetch general settings
export async function GET(req: NextRequest) {
  try {
    // Fetch general settings from the backend API
    const response = await axios.get(`${server}/general`);
    return NextResponse.json(response.data.general);
  } catch (error: any) {
    console.error("Error fetching general settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch general settings" },
      { status: error.response?.status || 500 }
    );
  }
}

// PUT function to update general settings
export async function PUT(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json();
    
    // Get the token from the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Update general settings using the backend API
    const response = await axios.put(
      `${server}/general`,
      body,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    
    return NextResponse.json(response.data.general);
  } catch (error: any) {
    console.error("Error updating general settings:", error);
    return NextResponse.json(
      { error: "Failed to update general settings" },
      { status: error.response?.status || 500 }
    );
  }
} 