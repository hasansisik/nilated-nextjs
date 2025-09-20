import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { server } from '@/config';

export async function POST(req: NextRequest) {
  try {
    // Get footer data from request
    const footerData = await req.json();
    
    try {
      // Send to MongoDB API with token
      const authHeader = req.headers.get('authorization');
      const token = authHeader ? authHeader.split(' ')[1] : '';
      
      const { data } = await axios.put(
        `${server}/footer`,
        footerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Footer data saved successfully',
        data: data.footer 
      });
    } catch (mongoError) {
      console.error("Error updating footer data on server:", mongoError);
      return NextResponse.json(
        { error: "Failed to update footer data on server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in footer update request:', error);
    return NextResponse.json(
      { error: "Failed to process footer update request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get data from MongoDB via server API
    const { data } = await axios.get(`${server}/footer`);
    
    if (data && data.footer) {
      return NextResponse.json(data.footer);
    } else {
      throw new Error('Invalid response from server API');
    }
  } catch (error) {
    console.error('Error fetching footer data from server:', error);
    
    // Return default data structure if server API fails
    const defaultData = {
      logo: {
        src: "/assets/imgs/template/favicon.svg",
        alt: "infinia",
        text: "Infinia"
      },
      copyright: "Copyright © 2024 Infinia. All Rights Reserved",
      description: "You may also realize cost savings from your energy efficient choices in your custom home.",
      socialLinks: [
        {
          _id: "1",
          name: "Facebook",
          link: "https://www.facebook.com/",
          order: 0
        },
        {
          _id: "2",
          name: "Twitter",
          link: "https://twitter.com/",
          order: 1
        },
        {
          _id: "3",
          name: "LinkedIn",
          link: "https://www.linkedin.com/",
          order: 2
        },
        {
          _id: "4",
          name: "Instagram",
          link: "https://www.instagram.com/",
          order: 3
        }
      ],
      columns: [
        {
          _id: "1",
          title: "Company",
          order: 0,
          links: [
            {
              _id: "1",
              name: "Mission & Vision",
              link: "#",
              order: 0
            },
            {
              _id: "2",
              name: "Our Team",
              link: "#",
              order: 1
            },
            {
              _id: "3",
              name: "Careers",
              link: "#",
              order: 2
            }
          ]
        },
        {
          _id: "2",
          title: "Resource",
          order: 1,
          links: [
            {
              _id: "1",
              name: "Knowledge Base",
              link: "#",
              order: 0
            },
            {
              _id: "2",
              name: "Documents",
              link: "#",
              order: 1
            }
          ]
        }
      ],
      contactItems: {
        address: "0811 Erdman Prairie, Joaville CA",
        phone: "+01 (24) 568 900",
        email: "contact@infinia.com",
        hours: "Mon-Fri: 9am-5pm"
      },
      instagramPosts: [],
      appLinks: [],
      showAppLinks: false,
      showInstagram: false,
      showPrivacyLinks: true,
      showSocialLinks: true,
      privacyLinks: [
        {
          _id: "1",
          name: "Privacy policy",
          link: "#",
          order: 0
        },
        {
          _id: "2",
          name: "Cookies",
          link: "#",
          order: 1
        },
        {
          _id: "3",
          name: "Terms of service",
          link: "#",
          order: 2
        }
      ],
      footerComponent: "Footer1"
    };
    
    return NextResponse.json(defaultData);
  }
} 