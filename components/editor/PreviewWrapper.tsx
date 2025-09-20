"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Script from "next/script";

// Import common CSS styles
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

// Fix common styling issues
const fixCommonStyles = `
/* Force section padding for content */
.py-5 {
  padding: 80px 0;
}

/* Fix for hero image */
.hero-img {
  max-width: 100%;
  height: auto;
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

.backdrop-filter {
  backdrop-filter: blur(10px);
}

/* Background linear gradient */
.bg-linear-1 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.1), rgba(99, 66, 236, 0.05));
}
`;

interface PreviewWrapperProps {
  children: (previewData: any) => ReactNode;
  dataParamName?: string;
  typeParamName?: string;
  customStyles?: string;
}

export default function PreviewWrapper({ 
  children, 
  dataParamName = "sectionData",
  typeParamName = "sectionType",
  customStyles = ""
}: PreviewWrapperProps) {
  const searchParams = useSearchParams();
  const [contentData, setContentData] = useState<any>(null);
  const [contentType, setContentType] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize libraries and AOS
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Initialize AOS if available
          try {
            const AOS = (await import('aos')).default;
            
            AOS.init({
              duration: 800,
              easing: 'ease-in-out',
              once: true,
              mirror: false
            });
            
          } catch (error) {
          }
        }
      } catch (error) {
        console.error("Error initializing libraries:", error);
      }
    };
    
    loadLibraries();
    
    // Refresh AOS when content data changes
    if (contentData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
        }
      }, 200);
    }
  }, [contentData]);

  useEffect(() => {
    // Get data from URL parameters
    const dataParam = searchParams.get(dataParamName);
    const typeParam = searchParams.get(typeParamName);
    

    
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setContentData(parsedData);
        
        if (typeParam) {
          setContentType(typeParam);
        }
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      // Handle different message types
      if (event.data.type === "UPDATE_SECTION_DATA") {
        setContentData(event.data.sectionData);
        setContentType(event.data.sectionType);
      } else if (event.data.type === "UPDATE_HERO_DATA") {
        setContentData(event.data.heroData); 
      } else if (event.data.type === "UPDATE_CONTENT") {
        // Generic content update
        setContentData(event.data.data);
        if (event.data.contentType) {
          setContentType(event.data.contentType);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, dataParamName, typeParamName]);

  if (!contentData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...eview...</div>;
  }

  return (
    <>
      <Script src="/assets/js/vendors/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <style jsx global>{`
        ${fixCommonStyles}
        ${customStyles}
      `}</style>
      <div style={{ overflow: "hidden" }}>
        {children(contentData)}
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