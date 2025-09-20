import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { server } from '@/config';

export async function POST(req: NextRequest) {
  try {
    // Get header data from request
    const headerData = await req.json();
    
    try {
      // Send to MongoDB API with token
      const authHeader = req.headers.get('authorization');
      const token = authHeader ? authHeader.split(' ')[1] : '';
      
      const { data } = await axios.put(
        `${server}/header`,
        headerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Header data saved successfully',
        data: data.header 
      });
    } catch (mongoError) {
      console.error("Error updating header data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update header data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in header update request:', error);
    return NextResponse.json(
      { error: "Failed to process header update request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get data from MongoDB via server API
    const { data } = await axios.get(`${server}/header`);
    
    if (data && data.header) {
      return NextResponse.json(data.header);
    } else {
      throw new Error('Invalid response from server API');
    }
  } catch (error) {
    console.error('Error fetching header data from server:', error);
    
    // Return default data structure if server API fails
    const defaultData = {
      logo: {
        src: "/assets/imgs/template/favicon.svg",
        alt: "infinia",
        text: "Infinia"
      },
      links: {
        freeTrialLink: {
          href: "#",
          text: "Join For Free Trial"
        }
      },
      mainMenu: [
        { _id: "1", name: "Home", link: "/", order: 0 },
        { _id: "2", name: "About", link: "/about", order: 1 },
        { _id: "3", name: "Services", link: "/services", order: 2 },
        { _id: "4", name: "Blog", link: "/blog", order: 3 },
        { _id: "5", name: "Contact", link: "/contact", order: 4 }
      ],
      socialLinks: [],
      topBarItems: [],
      showDarkModeToggle: true,
      showActionButton: true,
      actionButtonText: "Join For Free Trial",
      actionButtonLink: "#",
      headerComponent: "Header1",
      workingHours: "Mon-Fri: 10:00am - 09:00pm",
      topBarColor: "#3b71fe"
    };
    
    return NextResponse.json(defaultData);
  }
} 