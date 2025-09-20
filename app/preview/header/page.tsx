"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import Header1 from "@/components/layout/header/Header1";
import Header2 from "@/components/layout/header/Header2";
import Header3 from "@/components/layout/header/Header3";
import Header4 from "@/components/layout/header/Header4";
import Header5 from "@/components/layout/header/Header5";

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

// Additional styles to properly render headers
const fixHeaderStyles = `
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

/* Header specific styles */
.navbar {
  display: flex;
  position: relative;
  z-index: 999;
}

/* Fix for logo */
.main-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-logo img {
  max-width: 40px;
  max-height: 40px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Fix for menu items */
.navbar-nav {
  display: flex;
  gap: 15px;
}

.nav-item {
  position: relative;
}

/* Button styling */
.btn-gradient {
  background: linear-gradient(90deg, #6342EC 0%, #4731D8 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

/* Top bar styles */
.top-bar {
  background-color: rgba(99, 66, 236, 0.1);
}

.bg-primary-soft {
  background-color: rgba(99, 66, 236, 0.1);
}

.bg-primary {
  background-color: #6342EC !important;
}

.text-white {
  color: #fff !important;
}

.text-900 {
  color: #111827 !important;
}

.fs-7 {
  font-size: 0.875rem;
}

.px-8 {
  padding-left: 3rem;
  padding-right: 3rem;
}

.icon-shape {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-md {
  width: 2rem;
  height: 2rem;
}

.icon-lg {
  width: 3rem;
  height: 3rem;
}

.rounded-circle {
  border-radius: 50%;
}

/* Mobile menu trigger */
.burger-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.burger-icon span {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #333;
  margin: 2px 0;
}

/* Override container fluid for header-specific styles */
.container-fluid {
  padding-left: 3rem;
  padding-right: 3rem;
}

/* Fix for header types with specific classes */
.header-4 {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.bg-linear-2 {
  background: linear-gradient(90deg, #FF577F 0%, #F05672 100%);
}

/* Responsive design adjustments */
@media (max-width: 991px) {
  .d-none.d-md-block, .d-none.d-lg-flex {
    display: none !important;
  }
}
`;

export default function HeaderPreview() {
  const searchParams = useSearchParams();
  const [headerData, setHeaderData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Demo state for scroll effects and mobile menu
  const [scroll, setScroll] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isOffCanvas, setIsOffCanvas] = useState(false);

  // Handle mobile menu and other UI triggers
  const handleMobileMenu = () => setIsMobileMenu(!isMobileMenu);
  const handleSearch = () => setIsSearch(!isSearch);
  const handleOffCanvas = () => setIsOffCanvas(!isOffCanvas);

  // Initialize any required JavaScript
  useEffect(() => {
    // Apply styles to ensure full height display
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "auto";
    
    // Signal to parent that the preview is ready
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }
    
    // Cleanup function
    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Get data from URL parameters
    const headerDataParam = searchParams.get("headerData");
    
    
    if (headerDataParam) {
      try {
        const parsedData = JSON.parse(headerDataParam);
        setHeaderData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      if (event.data.type === "UPDATE_HEADER_DATA") {
        setHeaderData(event.data.headerData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
      
      // Listen for scroll toggle command
      if (event.data.type === "TOGGLE_HEADER_SCROLL") {
        setScroll(event.data.scroll);
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!headerData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...ader preview...</div>;
  }

  // Render the appropriate header component
  const renderHeaderComponent = () => {
    const headerComponent = headerData.headerComponent || "Header1";
        
    const props = {
      scroll,
      isMobileMenu,
      handleMobileMenu,
      isSearch,
      handleSearch,
      isOffCanvas,
      handleOffCanvas
    };
    
    switch (headerComponent) {
      case "Header1":
        return <Header1 {...props} />;
      case "Header2":
        return <Header2 {...props} />;
      case "Header3":
        return <Header3 {...props} />;
      case "Header4":
        return <Header4 {...props} />;
      case "Header5":
        return <Header5 {...props} />;
      default:
        return <Header1 {...props} />;
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
      <style jsx global>{fixHeaderStyles}</style>
      <div className="h-full overflow-auto">
        {renderHeaderComponent()}
      </div>
    </>
  );
}

// Add type definition if needed
declare global {
  interface Window {
    AOS: any;
  }
} 