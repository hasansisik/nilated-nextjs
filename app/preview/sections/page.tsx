"use client";

import PreviewWrapper from "@/components/editor/PreviewWrapper";
import Hero1 from "@/components/sections/Hero1";
import Hero3 from "@/components/sections/Hero3";
import Features1 from "@/components/sections/Features1";
import Features2 from "@/components/sections/Features2";
import Testimonial1 from "@/components/sections/Testimonial1";
import Testimonial2 from "@/components/sections/Testimonial2";
import Team1 from "@/components/sections/Team1";
import Team2 from "@/components/sections/Team2";
import Pricing1 from "@/components/sections/Pricing1";
import Pricing2 from "@/components/sections/Pricing2";
import Cta1 from "@/components/sections/Cta1";

export default function SectionPreview() {
  // Render the appropriate section component based on section type
  const renderSection = (sectionData: any) => {
    // Get active section type from data
    const sectionType = sectionData.activeSection || "hero1";
    
    
    // Map of available section components
    const sectionComponents: { [key: string]: React.ComponentType<any> } = {
      // Hero sections
      "hero1": Hero1,
      "hero3": Hero3,
      
      // Features sections
      "features1": Features1, 
      "features2": Features2,
      
      // Testimonial sections
      "testimonial1": Testimonial1,
      "testimonial2": Testimonial2,
      
      // Team sections
      "team1": Team1,
      "team2": Team2,
      
      // Pricing sections
      "pricing1": Pricing1,
      "pricing2": Pricing2,
      
      // CTA sections
      "cta1": Cta1,
    };
    
    // Get the component to render
    const SectionComponent = sectionComponents[sectionType];
    
    if (!SectionComponent) {
      return <div className="p-10 bg-red-50 text-red-500">Section type not found: {sectionType}</div>;
    }
    
    // Check if we need to use special prop naming for the section
    const isSectionWithPreviewData = ['hero1', 'hero3'].includes(sectionType);
    
    // Render with appropriate props based on section type
    return isSectionWithPreviewData 
      ? <SectionComponent previewData={sectionData} />
      : <SectionComponent data={sectionData[sectionType]} />;
  };

  return (
    <PreviewWrapper>
      {(sectionData) => renderSection(sectionData)}
    </PreviewWrapper>
  );
} 