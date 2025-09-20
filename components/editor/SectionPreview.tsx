"use client";

import { useEditor } from "./EditorProvider";
import { useEffect, FC, useRef, useState, forwardRef, ForwardedRef, RefObject } from "react";

interface SectionPreviewProps {
  previewUrl: string;
  additionalParams?: Record<string, string>;
  paramName?: string;
}

const SectionPreview = forwardRef<HTMLIFrameElement, SectionPreviewProps>(({ 
  previewUrl, 
  additionalParams = {},
  paramName
}, ref) => {
  const { 
    previewMode, 
    sectionData,
    sectionType,
    savedData
  } = useEditor();
  
  // Use the forwarded ref if provided, otherwise use the one from context
  const { iframeRef: contextIframeRef } = useEditor();
  const actualIframeRef = (ref as RefObject<HTMLIFrameElement>) || contextIframeRef;
  
  const initialLoadRef = useRef(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Update iframe URL when data changes (with debounce)
  useEffect(() => {
    // Always load on initial render
    if (!initialLoadRef.current) {
      updateIframe();
      initialLoadRef.current = true;
      return;
    }

    // Debounce updates to prevent too frequent refreshes
    const now = Date.now();
    if (now - lastUpdateTime > 1000) { // Only update if more than 1 second has passed
      updateIframe();
      setLastUpdateTime(now);
    } else {
      // Schedule an update if it's too soon
      const timerId = setTimeout(() => {
        updateIframe();
        setLastUpdateTime(Date.now());
      }, 1000);
      
      return () => clearTimeout(timerId);
    }
  }, [sectionData]);

  // Function to update the iframe
  const updateIframe = () => {
    if (sectionData && actualIframeRef.current) {
      const queryParams = new URLSearchParams();
      
      // Determine the parameter name based on section type
      const dataParamName = paramName || (sectionType === "hero" ? "heroData" : "sectionData");
      
      // Add the main section data
      queryParams.append(dataParamName, JSON.stringify(sectionData));
      
      // Only add section type for non-hero sections
      if (sectionType !== "hero") {
        queryParams.append('sectionType', sectionType);
      }
      
      // Add any additional params
      Object.entries(additionalParams).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const fullPreviewUrl = `${previewUrl}?${queryParams.toString()}`;
      
      
      // Update iframe src
      actualIframeRef.current.src = fullPreviewUrl;
    }
  };

  // Only update iframe width when preview mode changes
  useEffect(() => {
    if (actualIframeRef.current) {
      // Update iframe width class without reloading the content
      actualIframeRef.current.className = `
        border-none w-full h-full transition-all duration-300 ease-in-out bg-white
        ${getPreviewWidthClass()} mx-auto
      `;
    }
  }, [previewMode]);

  // Determine preview width class based on responsive mode
  const getPreviewWidthClass = () => {
    switch (previewMode) {
      case "desktop": return "w-full";
      case "tablet": return "w-[768px]";
      case "mobile": return "w-[375px]";
      default: return "w-full";
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto">
      <iframe 
        ref={actualIframeRef}
        src={`${previewUrl}`} 
        className={`
          border-none w-full h-full transition-all duration-300 ease-in-out bg-white
          ${getPreviewWidthClass()} mx-auto
        `}
        title={`${sectionType} Preview`}
      />
    </div>
  );
});

SectionPreview.displayName = 'SectionPreview';

export default SectionPreview; 