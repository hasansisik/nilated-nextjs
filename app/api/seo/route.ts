import { NextRequest, NextResponse } from "next/server";
import { server } from "@/config";
import axios from "axios";

// GET function to fetch SEO settings
export async function GET(req: NextRequest) {
  try {
    // Get the URL parameter for page ID if provided
    const url = new URL(req.url);
    const pageId = url.searchParams.get('pageId');
    
    // Fetch general settings from the backend API
    const response = await axios.get(`${server}/general`);
    const general = response.data.general;
    
    if (!general || !general.seo) {
      return NextResponse.json(
        { error: "SEO settings not found" },
        { status: 404 }
      );
    }
    
    // If pageId is provided, return specific page SEO data
    if (pageId) {
      if (pageId === 'general') {
        return NextResponse.json(general.seo.general);
      }
      
      const page = general.seo.pages.find((p: any) => p.id === pageId);
      if (!page) {
        return NextResponse.json(
          { error: `Page with ID ${pageId} not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(page);
    }
    
    // Otherwise return all SEO data
    return NextResponse.json(general.seo);
  } catch (error: any) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
      { status: error.response?.status || 500 }
    );
  }
}

// PUT function to update SEO settings
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
    
    // Format the update payload
    const payload = {
      seo: body
    };
    
    // Update SEO settings using the general endpoint
    const response = await axios.put(
      `${server}/general`,
      payload,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    
    return NextResponse.json(response.data.general.seo);
  } catch (error: any) {
    console.error("Error updating SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
      { status: error.response?.status || 500 }
    );
  }
} 