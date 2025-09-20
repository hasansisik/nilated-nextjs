"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Features1 from "@/components/sections/Features1";
import Features4 from "@/components/sections/Features4";
import Features5 from "@/components/sections/Features5";
import Features8 from "@/components/sections/Features8";
import Features10 from "@/components/sections/Features10";
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

// Additional styles to properly render features
const fixFeaturesStyles = `
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

/* Force section padding for feature content */
.py-5 {
  padding: 80px 0;
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

.ds-4 {
  font-size: 42px;
  line-height: 1.2;
  font-weight: 700;
}

/* Background linear gradient */
.bg-linear-1 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.1), rgba(99, 66, 236, 0.05));
}

.bg-linear-3 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.05), rgba(99, 66, 236, 0.02));
}

.bg-primary-light {
  background-color: #6342EC;
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

/* Fix feature items */
.feature-item {
  height: 100%;
}

/* Fix icon shapes */
.icon-shape {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-xxl {
  width: 60px;
  height: 60px;
}

.icon-flip {
  transition: all 0.3s ease;
}

.icon-flip:hover {
  transform: rotateY(180deg);
}

.hover-up {
  transition: all 0.3s ease;
}

.hover-up:hover {
  transform: translateY(-10px);
}

/* Features8 specific styles */
.bg-primary-light ul li a:hover h5 {
  color: #fff !important;
}

/* Features5 specific styles */
.box-gradient-1, .box-gradient-2 {
  width: 80%;
  height: 80%;
}

.section-feature-5 .photo-description img {
  max-width: 100%;
}

/* Star icon animation */
@keyframes rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}

.rotate-animation {
  animation: rotation 10s infinite linear;
}
`;

export default function FeaturesPreview() {
  const searchParams = useSearchParams();
  const [featuresData, setFeaturesData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AOS (Animate on Scroll)
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
    
    // Re-initialize AOS whenever the features data changes
    if (featuresData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          
          // Signal to parent that the preview has updated
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: "PREVIEW_UPDATED", 
              activeFeature: featuresData.activeFeature 
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
  }, [featuresData]);

  useEffect(() => {
    // Get data from URL parameters
    const featuresDataParam = searchParams.get("featuresData");
    
    if (featuresDataParam) {
      try {
        const parsedData = JSON.parse(featuresDataParam);
        setFeaturesData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing features data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      if (event.data.type === "UPDATE_FEATURES_DATA") {
        setFeaturesData(event.data.featuresData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!featuresData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...atures preview...</div>;
  }

  // Render the appropriate features component
  const renderFeaturesComponent = () => {
    const activeComponent = featuresData.activeFeature || "features1";
    
    switch (activeComponent) {
      case "features1":
        return <Features1 previewData={featuresData} />;
      case "features4":
        return <Features4 previewData={featuresData} />;
      case "features5":
        return <Features5 previewData={featuresData} />;
      case "features8":
        return <Features8 previewData={featuresData} />;
      case "features10":
        return <Features10 previewData={featuresData} />;
      default:
        return <Features1 previewData={featuresData} />;
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
      <style jsx global>{fixFeaturesStyles}</style>
      <div className="h-full overflow-auto">
        {renderFeaturesComponent()}
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