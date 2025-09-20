"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Hero1 from "@/components/sections/Hero1";
import Hero2 from "@/components/sections/Hero2";
import Hero3 from "@/components/sections/Hero3";
import Script from "next/script";

// Import all the necessary CSS directly in this component
import "@/public/assets/css/vendors/bootstrap.min.css";
import "@/public/assets/css/vendors/swiper-bundle.min.css";
import "@/public/assets/css/vendors/aos.css";
import "@/public/assets/css/vendors/odometer.css";
import "@/public/assets/css/vendors/carouselTicker.css";
import "@/public/assets/css/vendors/magnific-popup.css";
import "@/public/assets/fonts/bootstrap-icons/bootstrap-icons.min.css";
import "@/public/assets/fonts/boxicons/boxicons.min.css";
import "@/public/assets/fonts/satoshi/satoshi.css";
import "@/public/assets/css/main.css";

// Additional styles to properly render Hero1
const fixHeroStyles = `
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}

body > div {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Force section padding for hero content */
.py-5 {
  padding: 80px 0;
}

/* Fix for hero image */
.hero-img {
  max-width: 100%;
  height: auto;
}

/* Make cards visible */
.card-hero {
  right: 0;
  bottom: 60px;
  max-width: 280px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
}

/* Fix animation classes */
.alltuchtopdown {
  animation: alltuchtopdown 1.5s ease-in-out infinite alternate-reverse both;
}

@keyframes alltuchtopdown {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

.rightToLeft {
  animation: rightToLeft 2s ease-in-out infinite alternate-reverse both;
}

@keyframes rightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-10px);
  }
}

/* Fix for text sizes */
.ds-3 {
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
}

.ds-1 {
  font-size: 48px;
  line-height: 1.2;
  font-weight: 700;
}

.backdrop-filter {
  backdrop-filter: blur(10px);
}

/* Background linear gradient */
.bg-linear-1 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.1), rgba(99, 66, 236, 0.05));
}

/* Ensure all hero elements are visible */
.section-hero-3, .position-relative {
  overflow: visible !important;
}

/* Fix button styling */
.btn-gradient {
  background: linear-gradient(90deg, #6342EC 0%, #4731D8 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

/* Fix spacing issues */
.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

/* Fix image sizes */
.icon-shape {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.icon-xxl {
  width: 60px;
  height: 60px;
}

.border-white-keep {
  border-color: white !important;
}

/* Fix avatars */
.avt-hero {
  margin-left: -10px;
}
`;

export default function HeroPreview() {
  const searchParams = useSearchParams();
  const [heroData, setHeroData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AOS (Animate on Scroll) for Hero1 component
  useEffect(() => {
    // Apply styles to ensure full height display
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "auto";
    
    // Load AOS library dynamically
    const loadAOS = async () => {
      try {
        if (typeof window !== 'undefined') {
          const AOS = (await import('aos')).default;
          
          // Initialize AOS with default settings
          AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
          });
          
          
          // Signal to parent that the preview is ready
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
          }
        }
      } catch (error) {
        console.error("Error initializing AOS:", error);
      }
    };
    
    loadAOS();
    
    // Re-initialize AOS whenever the hero data changes
    if (heroData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          
          // Signal to parent that the preview has updated
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: "PREVIEW_UPDATED", 
              activeHero: heroData.activeHero 
            }, "*");
          }
        }
      }, 200);
    }
    
    // Cleanup function
    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, [heroData]);

  useEffect(() => {
    // Get data from URL parameters
    const heroDataParam = searchParams.get("heroData");
    
    
    if (heroDataParam) {
      try {
        const parsedData = JSON.parse(heroDataParam);
        setHeroData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing hero data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      if (event.data.type === "UPDATE_HERO_DATA") {
        setHeroData(event.data.heroData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!heroData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...ro preview...</div>;
  }

  // Render the appropriate hero component
  const renderHeroComponent = () => {
    const activeComponent = heroData.activeHero || "hero1";
    
    
    switch (activeComponent) {
      case "hero1":
        return <Hero1 previewData={heroData} />;
      case "hero2":
        return <Hero2 previewData={heroData} />;
      case "hero3":
        return <Hero3 previewData={heroData} />;
      default:
        return <Hero1 previewData={heroData} />;
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
        strategy="beforeInteractive" 
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
        crossOrigin="anonymous"
      />
      <style jsx global>{fixHeroStyles}</style>
      <div className="h-full overflow-auto">
        {renderHeroComponent()}
      </div>
    </>
  );
}

// Add type definition for AOS in the window object
declare global {
  interface Window {
    AOS: any;
  }
} 