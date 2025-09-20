"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Faqs2 from "@/components/sections/Faqs2";
import Faqs3 from "@/components/sections/Faqs3";
import Faqs1 from "@/components/sections/Faqs1";
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

// Additional styles for FAQ preview
const fixFaqStyles = `
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

/* Force section padding for FAQ content */
.py-5 {
  padding: 80px 0;
}

/* FAQs accordion styling */
.card {
  transition: all 0.3s ease-in-out;
}

.card-header {
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.arrow svg {
  transition: transform 0.3s ease;
}

.card-header a[aria-expanded="true"] .arrow svg {
  transform: rotate(180deg);
}

/* Fix ellipse styles */
.ellipse-center {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(99, 66, 236, 0.05);
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

/* Fix button styling */
.btn-gradient {
  background: linear-gradient(90deg, #6342EC 0%, #4731D8 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

.tag-spacing {
  letter-spacing: 1px;
}

/* Spacing */
.mb-6 {
  margin-bottom: 3rem;
}

.mb-8 {
  margin-bottom: 4rem;
}

.mt-8 {
  margin-top: 4rem;
}

.fw-bold {
  font-weight: 700;
}

.ds-3 {
  font-size: 36px;
  line-height: 1.3;
}

.fs-5 {
  font-size: 1.1rem;
}

.fs-7 {
  font-size: 0.9rem;
}

.shadow-2 {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
`;

export default function FaqPreview() {
  const searchParams = useSearchParams();
  const [faqData, setFaqData] = useState<any>(null);
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
    
    // Re-initialize AOS whenever the data changes
    if (faqData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          
          // Signal to parent that the preview has updated
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: "PREVIEW_UPDATED", 
              activeFaq: faqData.activeFaq 
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
  }, [faqData]);

  useEffect(() => {
    // Get data from URL parameters
    const faqDataParam = searchParams.get("faqData");
    
    
    if (faqDataParam) {
      try {
        const parsedData = JSON.parse(faqDataParam);
        setFaqData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing FAQ data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      if (event.data.type === "UPDATE_SECTION_DATA" && event.data.sectionType === "faq") {
        setFaqData(event.data.sectionData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!faqData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...Q preview...</div>;
  }

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
        strategy="beforeInteractive" 
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
        crossOrigin="anonymous"
      />
      <style jsx global>{fixFaqStyles}</style>
      <div className="h-full overflow-auto">
        {faqData.activeFaq === "faqs1" ? (
          <Faqs1 previewData={faqData} />
        ) : faqData.activeFaq === "faqs2" ? (
          <Faqs2 previewData={faqData} />
        ) : (
          <Faqs3 previewData={faqData} />
        )}
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