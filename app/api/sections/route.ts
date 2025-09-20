import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Sections verisini tutan dosya
const dataFilePath = path.join(process.cwd(), 'data', 'sections.json');

// Varsayılan veri dosyasını oluştur (eğer yoksa)
const createDefaultDataFile = async () => {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // Dosya bulunamadı, yeni bir tane oluşturalım
    const defaultData = {
      activeSection: "hero1",
      hero1: {
        badge: {
          label: "New",
          text: "Free Lifetime Updates",
          link: "#"
        },
        title: "Create stunning websites with our WordPress Clone",
        description: "Build beautiful, responsive websites without code. Our drag-and-drop interface makes it easy to create professional sites in minutes.",
        primaryButton: {
          text: "Get Started",
          link: "/register"
        },
        secondaryButton: {
          text: "Contact Sales",
          link: "/contact"
        },
        images: {
          background: "/assets/imgs/hero-1/background.png",
          shape1: "/assets/imgs/hero-1/shape-1.png",
          shape2: "/assets/imgs/hero-1/shape-2.png",
          shape3: "/assets/imgs/hero-1/shape-3.png"
        },
        card: {
          image: "/assets/imgs/hero-1/shape-4.png",
          title: "Join Our Community",
          description: "Over 2,500+ happy customers",
          button: {
            label: "Get",
            text: "Free Update",
            link: "#"
          }
        }
      },
      hero3: {
        badge: {
          text: "Build Without Limits"
        },
        title: {
          part1: "Create Stunning",
          part2: "Websites Easily"
        },
        description: "Design professional websites with our powerful drag-and-drop builder. No coding skills required.",
        button: {
          text: "Try It Free",
          link: "/register"
        },
        avatars: [
          {
            image: "/assets/imgs/hero-3/avatar-1.png",
            alt: "User avatar 1"
          },
          {
            image: "/assets/imgs/hero-3/avatar-2.png",
            alt: "User avatar 2"
          },
          {
            image: "/assets/imgs/hero-3/avatar-3.png",
            alt: "User avatar 3"
          }
        ],
        images: {
          image1: "/assets/imgs/hero-3/img-1.png",
          image2: "/assets/imgs/hero-3/img-2.png",
          image3: "/assets/imgs/hero-3/img-3.png",
          image4: "/assets/imgs/hero-3/img-4.png",
          star: "/assets/imgs/hero-3/star-rotate.png"
        }
      },
      features1: {
        title: "Why Choose Us",
        subtitle: "Features",
        description: "Our platform provides everything you need to build professional websites",
        features: [
          {
            icon: "/assets/imgs/features/icon1.png",
            title: "Drag & Drop Builder",
            description: "Build websites without any coding knowledge"
          },
          {
            icon: "/assets/imgs/features/icon2.png",
            title: "Responsive Design",
            description: "All sites look great on any device"
          },
          {
            icon: "/assets/imgs/features/icon3.png",
            title: "SEO Optimization",
            description: "Built-in tools to help you rank better"
          }
        ]
      }
    };
    
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
  }
};

// GET - Veri dosyasını oku 
export async function GET() {
  try {
    // Veri dosyasının varlığını kontrol et (yoksa oluştur)
    await createDefaultDataFile();
    
    // Veri dosyasını oku
    const data = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading sections data:', error);
    return NextResponse.json({ error: 'Failed to read sections data' }, { status: 500 });
  }
}

// POST - Veri dosyasına yaz
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Veriyi doğrula
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Veriyi kaydet
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sections data updated successfully'
    });
  } catch (error) {
    console.error('Error saving sections data:', error);
    return NextResponse.json({ error: 'Failed to save sections data' }, { status: 500 });
  }
} 