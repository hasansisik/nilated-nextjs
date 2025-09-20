"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cta4 from "@/components/sections/Cta4";
import Cta3 from "@/components/sections/Cta3"
import Cta1 from "@/components/sections/Cta1";
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

// Additional styles to properly render CTA sections
const fixCtaStyles = `
/* Force section padding for CTA content */
.py-5 {
  padding: 80px 0;
}

.pb-110 {
  padding-bottom: 110px;
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

/* Ellipse animations */
.rotate-center {
  animation: rotate-center 20s linear infinite both;
}

.rotate-center-rev {
  animation: rotate-center-rev 20s linear infinite both;
}

@keyframes rotate-center {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-center-rev {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(-360deg);
  }
}

/* Ellipse styles */
.ellipse-rotate-success {
  width: 40px;
  height: 40px;
  top: 20%;
  left: 20%;
  border-radius: 50%;
  background: rgba(5, 178, 90, 0.1);
}

.ellipse-rotate-primary {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 75%;
  border-radius: 50%;
  background: rgba(99, 66, 236, 0.1);
}

/* Fix for text sizes */
.ds-5 {
  font-size: 30px;
  line-height: 1.3;
  font-weight: 700;
}

.ds-3 {
  font-size: 36px;
  line-height: 1.3;
  font-weight: 700;
}

/* Fix for section spacing */
.pt-120 {
  padding-top: 120px;
}

.pb-80 {
  padding-bottom: 80px;
}

/* Backdrop filter */
.backdrop-filter {
  backdrop-filter: blur(10px);
}

/* Icon styles */
.icon-shape {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-md {
  width: 42px;
  height: 42px;
}

/* Vector position fixes */
.vector-2 {
  right: -40px;
  bottom: 40px;
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

/* Text styles */
.text-linear-2 {
  background: linear-gradient(to right, #6342EC, #5333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-primary {
  color: #6342EC !important;
}

.bg-primary-soft {
  background-color: rgba(99, 66, 236, 0.1);
}

/* Spacing */
.mt-8 {
  margin-top: 2rem;
}

/* Fix for feature lists */
.phase-items li {
  margin-top: 0.75rem;
}
`;

export default function CtaPreview() {
  const searchParams = useSearchParams();
  const [ctaData, setCtaData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AOS (Animate on Scroll)
  useEffect(() => {
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
    
    // Re-initialize AOS whenever the data changes
    if (ctaData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          
          // Signal to parent that the preview has updated
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: "PREVIEW_UPDATED", 
              activeCta: ctaData.activeCta 
            }, "*");
          }
        }
      }, 200);
    }
  }, [ctaData]);

  useEffect(() => {
    // Get data from URL parameters
    const ctaDataParam = searchParams.get("ctaData");
    
    
    if (ctaDataParam) {
      try {
        const parsedData = JSON.parse(ctaDataParam);
        setCtaData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing CTA data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      if (event.data.type === "UPDATE_CTA_DATA") {
        setCtaData(event.data.ctaData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!ctaData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...A preview...</div>;
  }

  // Render the appropriate CTA component
  const renderCtaComponent = () => {
    const activeComponent = ctaData.activeCta || "cta4";
        
    switch (activeComponent) {
      case "cta1":
        return <Cta1 previewData={ctaData} />;
      case "cta4":
        return <Cta4 previewData={ctaData} />;
      case "cta3":
        return <Cta3 previewData={ctaData} />;
      default:
        return <Cta4 previewData={ctaData} />;
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
      <script src="https://unpkg.com/react-modal-video@2.0.0/js/modal-video.min.js" />
      <link rel="stylesheet" href="https://unpkg.com/react-modal-video@2.0.0/css/modal-video.min.css" />
      <style jsx global>{fixCtaStyles}</style>
      <div style={{ overflow: "hidden" }}>
        {renderCtaComponent()}
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