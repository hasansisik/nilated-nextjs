"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import Footer1 from "@/components/layout/footer/Footer1";
import Footer2 from "@/components/layout/footer/Footer2";
import Footer3 from "@/components/layout/footer/Footer3";
import Footer4 from "@/components/layout/footer/Footer4";

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

// Additional styles to properly render footers
const fixFooterStyles = `
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

/* Footer specific styles */
footer {
  margin-top: auto;
  width: 100%;
  overflow: visible;
}

.section-footer {
  position: relative;
  width: 100%;
  overflow: visible;
}

.bgft-1 {
  background-color: #111827;
}

.bg-primary-soft {
  background-color: rgba(99, 66, 236, 0.1);
}

.py-90 {
  padding-top: 90px;
  padding-bottom: 90px;
}

.social-icons a {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hover-effect:hover {
  color: #6342EC !important;
  transition: color 0.3s ease;
}

.icon-shape {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-md {
  width: 2.5rem;
  height: 2.5rem;
}

.icon-lg {
  width: 3rem;
  height: 3rem;
}

.bg-6 {
  background-color: #111827;
}

/* Handle light footer */
.bg-white {
  background-color: #ffffff;
}

.text-900 {
  color: #111827;
}

.opacity-50 {
  opacity: 0.5;
}

/* Fix layout */
.container {
  width: 100%;
  max-width: 1320px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
}

/* Handle different grid columns */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-lg-3, .col-lg-4, .col-lg-6, .col-lg-8, .col-md-3, .col-md-4, .col-6 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 576px) {
  .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 768px) {
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-lg-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
}

/* Image sizing */
img {
  max-width: 100%;
  height: auto;
}

.main-logo img {
  max-width: 40px;
  max-height: 40px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Additional footer menu fixes */
.d-flex.flex-column.align-items-start {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
}

.text-white {
  color: #fff !important;
}

.fs-6 {
  font-size: 1rem !important;
}

.fw-medium {
  font-weight: 500 !important;
}

.fw-black {
  font-weight: 800 !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.pb-3 {
  padding-bottom: 1rem !important;
}

.pt-5 {
  padding-top: 3rem !important;
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.opacity-50 {
  opacity: 0.5 !important;
}

.text-uppercase {
  text-transform: uppercase !important;
}

.border-opacity-10 {
  --bs-border-opacity: 0.1;
}

.border-white {
  --bs-border-color: #fff;
}

.border-top {
  border-top: 1px solid;
  border-top-color: rgba(var(--bs-white-rgb), var(--bs-border-opacity));
}

/* Fix for menu link display */
.hover-effect {
  display: inline-block;
  text-decoration: none;
  transition: color 0.3s ease;
}

.hover-effect:hover {
  color: #6342EC !important;
}
`;

// Add this debugging CSS right before returning the main component JSX
const debuggingStyles = `
.preview-footer {
  border: 1px solid transparent;
  margin-top: auto !important;
  display: block !important;
  width: 100% !important;
  min-height: 200px;
  overflow: visible !important;
}

.py-90 {
  padding-top: 90px !important;
  padding-bottom: 90px !important;
}

.section-footer {
  display: block !important;
  width: 100% !important;
  overflow: visible !important;
}

/* Make sure text is visible */
.text-white, .text-900 {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.text-white.opacity-50 {
  opacity: 0.5 !important;
}

/* Fix column layout */
.row {
  width: 100% !important;
  display: flex !important;
  flex-wrap: wrap !important;
}

.col-lg-3, .col-lg-4, .col-lg-6, .col-lg-8, .col-md-3, .col-md-4, .col-md-6, .col-6 {
  display: block !important;
  visibility: visible !important;
}

/* Debugging outlines if needed */
.debug-mode .row {
  border: 1px dashed rgba(255,0,0,0.2);
}
.debug-mode .col-lg-3, 
.debug-mode .col-lg-4, 
.debug-mode .col-lg-6, 
.debug-mode .col-lg-8, 
.debug-mode .col-md-3, 
.debug-mode .col-md-4, 
.debug-mode .col-md-6, 
.debug-mode .col-6 {
  border: 1px solid rgba(0,0,255,0.2);
}
`;

export default function FooterPreview() {
  const searchParams = useSearchParams();
  const [footerData, setFooterData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
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
    const footerDataParam = searchParams.get("footerData");
    
    
    if (footerDataParam) {
      try {
        const parsedData = JSON.parse(footerDataParam);
        
        // Debug column and menu data
        if (parsedData.columns) {
          parsedData.columns.forEach((col: any, i: number) => {
          });
        } else {
          console.warn("No columns data found in footer data");
          // Initialize with empty columns if missing
          parsedData.columns = [];
        }
        
        if (parsedData.socialLinks) {
        } else {
          console.warn("No social links found in footer data");
          // Initialize with empty social links if missing
          parsedData.socialLinks = [];
        }
        
        // Force specific footer component for debugging if needed
        // parsedData.footerComponent = "Footer1";
        
        // Create a deep clone with defaults for any missing properties
        const enhancedData = {
          ...parsedData,
          logo: parsedData.logo || { 
            src: "/assets/imgs/logo/logo-white.svg", 
            alt: "logo", 
            text: "Logo" 
          },
          copyright: parsedData.copyright || "Copyright © 2024. All Rights Reserved",
          description: parsedData.description || "",
          columns: Array.isArray(parsedData.columns) ? parsedData.columns : [],
          socialLinks: Array.isArray(parsedData.socialLinks) ? parsedData.socialLinks : [],
          footerComponent: parsedData.footerComponent || "Footer1"
        };
        
        setFooterData(enhancedData);
        
        // Mark as loaded after a longer delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 800);
      } catch (error: any) {
        console.error("Error parsing footer data:", error);
        setIsErrored(true);
        setErrorMessage(`Error parsing JSON: ${error.message}`);
      }
    } else {
      console.warn("No footer data received");
      setIsErrored(true);
      setErrorMessage("No footer data received");
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      
      if (event.data.type === "UPDATE_FOOTER_DATA" && event.data.footerData) {
        
        const updatedData = event.data.footerData;
        
        // Debug column and menu data
        if (updatedData.columns) {
          updatedData.columns.forEach((col: any, i: number) => {
          });
        } else {
          console.warn("No columns data found in updated footer data");
          // Initialize with empty columns if missing
          updatedData.columns = [];
        }
        
        // Create enhanced version with defaults
        const enhancedData = {
          ...updatedData,
          logo: updatedData.logo || { 
            src: "/assets/imgs/logo/logo-white.svg", 
            alt: "logo", 
            text: "Logo" 
          },
          copyright: updatedData.copyright || "Copyright © 2024. All Rights Reserved",
          description: updatedData.description || "",
          columns: Array.isArray(updatedData.columns) ? updatedData.columns : [],
          socialLinks: Array.isArray(updatedData.socialLinks) ? updatedData.socialLinks : [],
          footerComponent: updatedData.footerComponent || "Footer1"
        };
        
        setFooterData(enhancedData);
        
        // Mark as loaded if not already and reset any error state
        setIsErrored(false);
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 800);
        }
        
        // Send confirmation back to parent
        if (window.parent) {
          window.parent.postMessage({ 
            type: "PREVIEW_UPDATED",
            status: "success"
          }, "*");
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (isErrored) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-lg">
        <div className="text-red-500 font-medium">Error loading footer preview</div>
        <div className="text-sm text-gray-500 mt-2">{errorMessage}</div>
      </div>
    );
  }

  if (!footerData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Yükleniyor...oter preview...</div>;
  }

  // Ensure columns and links data is properly structured
  const safeFooterData = {
    ...footerData,
    // Ensure columns are an array and have properly structured links
    columns: Array.isArray(footerData.columns) ? 
      footerData.columns.map((column: any) => ({
        ...column,
        links: Array.isArray(column.links) ? column.links : [],
        _id: column._id || `col-${Math.random().toString(36).substr(2, 9)}`,
        title: column.title || "Menu",
        order: typeof column.order === 'number' ? column.order : 0
      })) : [],
    socialLinks: Array.isArray(footerData.socialLinks) ? 
      footerData.socialLinks.map((link: any) => ({
        ...link,
        _id: link._id || `social-${Math.random().toString(36).substr(2, 9)}`,
        name: link.name || "Social Link",
        link: link.link || "#",
        order: typeof link.order === 'number' ? link.order : 0
      })) : [],
    privacyLinks: Array.isArray(footerData.privacyLinks) ? 
      footerData.privacyLinks.map((link: any) => ({
        ...link,
        _id: link._id || `privacy-${Math.random().toString(36).substr(2, 9)}`,
        name: link.name || "Privacy Link",
        link: link.link || "#",
        order: typeof link.order === 'number' ? link.order : 0
      })) : [],
    logo: footerData.logo || {
      src: "/assets/imgs/logo/logo-white.svg",
      alt: "logo",
      text: "Infinia"
    },
    copyright: footerData.copyright || "Copyright © 2024 Infinia. All Rights Reserved",
    description: footerData.description || "You may also realize cost savings from your energy efficient choices in your custom home.",
    contactItems: footerData.contactItems || {
      address: "0811 Erdman Prairie, CA",
      phone: "+01 (24) 568 900",
      email: "contact@infinia.com",
      hours: "Mon-Fri: 9am-5pm"
    },
    showPrivacyLinks: !!footerData.showPrivacyLinks,
    showAppLinks: !!footerData.showAppLinks,
    showInstagram: !!footerData.showInstagram,
    footerComponent: footerData.footerComponent || "Footer1"
  };

  // Render the appropriate footer component with strict safety checks
  const renderFooterComponent = () => {
    const footerComponent = safeFooterData.footerComponent || "Footer1";
    
    // Common props for all footer components with complete fallbacks
    const footerProps = {
      logo: safeFooterData.logo,
      copyright: safeFooterData.copyright,
      description: safeFooterData.description,
      socialLinks: safeFooterData.socialLinks,
      columns: safeFooterData.columns,
      contactItems: safeFooterData.contactItems,
      privacyLinks: safeFooterData.privacyLinks,
      appLinks: footerData.appLinks || [],
      instagramPosts: footerData.instagramPosts || [],
      showPrivacyLinks: safeFooterData.showPrivacyLinks,
      showAppLinks: safeFooterData.showAppLinks,
      showInstagram: safeFooterData.showInstagram
    };
    
    // Add debugging class to footer for CSS inspection
    const debugProps = {
      className: "preview-footer",
    };
    
    
    switch (footerComponent) {
      case "Footer1":
        return <Footer1 {...footerProps} {...debugProps} />;
      case "Footer2":
        return <Footer2 {...footerProps} {...debugProps} />;
      case "Footer3":
        return <Footer3 {...footerProps} {...debugProps} />;
      case "Footer4":
        return <Footer4 {...footerProps} {...debugProps} />;
      default:
        return <Footer1 {...footerProps} {...debugProps} />;
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
      <style jsx global>{fixFooterStyles}</style>
      <style jsx global>{debuggingStyles}</style>
      <div className="h-full overflow-auto">
        {renderFooterComponent()}
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