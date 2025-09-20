import { Suspense } from "react";
import { server } from "@/config";
import Hero1 from "@/components/sections/Hero1";
import Hero2 from "@/components/sections/Hero2";
import Cta4 from "@/components/sections/Cta4";
import Faqs1 from "@/components/sections/Faqs1";
import Faqs2 from "@/components/sections/Faqs2";
import Faqs3 from "@/components/sections/Faqs3";
import Hero3 from "@/components/sections/Hero3";
import Cta1 from "@/components/sections/Cta1";
import Cta3 from "@/components/sections/Cta3";
import Services2 from "@/components/sections/Services2";
import Services3 from "@/components/sections/Services3";
import Services5 from "@/components/sections/Services5";
import Contact1 from "@/components/sections/Contact1";
import Project2 from "@/components/sections/Project2";
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";
import Team from "@/components/sections/Team";  
import Team1 from "@/components/sections/Team1";  
import Features1 from "@/components/sections/Features1";
import Features4 from "@/components/sections/Features4";
import Features5 from "@/components/sections/Features5";
import Features8 from "@/components/sections/Features8";
import Features10 from "@/components/sections/Features10";
import { ReduxProvider } from "@/components/ui/ReduxProvider";
import Content1 from "@/components/sections/Content1";
import Content2 from "@/components/sections/Content2";
import Content3 from "@/components/sections/Content3";
import Blog1Category from "@/components/sections/Blog1Category";  
import Blog2Category from "@/components/sections/Blog2Category";
import Blog3Category from "@/components/sections/Blog3Category";
import Blog5Category from "@/components/sections/Blog5Category";  
import Blog1Author from "@/components/sections/Blog1Author";  
import Blog2Author from "@/components/sections/Blog2Author";
import Blog3Author from "@/components/sections/Blog3Author";
import Blog5Author from "@/components/sections/Blog5Author";



// Define section type
interface Section {
  id: string;
  name: string;
  type: keyof typeof sectionComponents;
  description?: string;
  config?: {
    selectedCategory?: string;
    selectedAuthor?: string;
    title?: string;
    subtitle?: string;
  };
}

// Map section types to components
const sectionComponents = {
  Hero1,
  Hero2,
  Hero3,
  Cta1,
  Cta4,
  Cta3,
  Services2,
  Services3,
  Services5,
  Faqs1,
  Faqs2,
  Faqs3,
  Contact1,
  Project2,
  Blog1,
  Blog2,
  Blog3,
  Blog5,
  Team,
  Team1,
  Features1,
  Features4,
  Features5,
  Features8,
  Features10,
  Content1,
  Content2,
  Content3,
  Blog1Category,
  Blog2Category,
  Blog3Category,
  Blog5Category,
  Blog1Author,
  Blog2Author,
  Blog3Author,
  Blog5Author

};

// Minimal placeholder component
function PlaceholderSection() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            {/* No visible loading indicator */}
          </div>
        </div>
      </div>
    </section>
  );
}

// Async function to fetch page data and all required API data in parallel
async function fetchAllData() {
  try {
    // Fetch multiple data sources in parallel
    const [pageResponse, heroResponse, ctaResponse, faqResponse, otherResponse, blogResponse, headerResponse, footerResponse] = await Promise.all([
      fetch(`${server}/page/home`, { cache: "no-store" }),
      fetch(`${server}/hero`, { cache: "no-store" }),
      fetch(`${server}/cta`, { cache: "no-store" }),
      fetch(`${server}/faq`, { cache: "no-store" }),
      fetch(`${server}/other`, { cache: "no-store" }),
      fetch(`${server}/blog`, { cache: "no-store" }),
      fetch(`${server}/header`, { cache: "no-store" }),
      fetch(`${server}/footer`, { cache: "no-store" })
    ]);
    
    // Parse all responses in parallel
    const [pageData, heroData, ctaData, faqData, otherData, blogData, headerData, footerData] = await Promise.all([
      pageResponse.ok ? pageResponse.json() : { page: { sections: [] } },
      heroResponse.ok ? heroResponse.json() : { hero: null },
      ctaResponse.ok ? ctaResponse.json() : { cta: null },
      faqResponse.ok ? faqResponse.json() : { faq: null },
      otherResponse.ok ? otherResponse.json() : { other: null },
      blogResponse.ok ? blogResponse.json() : { blogs: [] },
      headerResponse.ok ? headerResponse.json() : { header: null },
      footerResponse.ok ? footerResponse.json() : { footer: null }
    ]);
    
    return {
      page: pageData.page,
      preloadedState: {
        hero: heroData.hero,
        cta: ctaData.cta,
        faq: faqData.faq,
        other: otherData.other,
        blog: { 
          blogs: blogData.blogs || [],
          loading: false,
          error: null
        },
        header: headerData.header,
        footer: footerData.footer
      }
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      page: { sections: [] },
      preloadedState: {}
    };
  }
}

// Component to render dynamic sections
export default async function Home() {
  // Fetch all data at once
  const { page, preloadedState } = await fetchAllData();
  
  // If no sections defined, use default sections
  const sections = page?.sections?.length > 0 
    ? page.sections 
    : [
        { id: '1', name: 'Hero', type: 'Hero1' },
        { id: '2', name: 'CTA', type: 'Cta4' },
        { id: '3', name: 'Services', type: 'Services2' },
        { id: '4', name: 'FAQs', type: 'Faqs2' }
      ];
  
  return (
    <ReduxProvider preloadedState={preloadedState}>
      <Suspense fallback={<PlaceholderSection />}>
        {sections.map((section: Section) => {
          const SectionComponent = sectionComponents[section.type];
          if (!SectionComponent) return null;
          
          // Pass config props if they exist
          const configProps: any = {};
          if (section.config) {
            if (section.config.selectedCategory) {
              configProps.selectedCategory = section.config.selectedCategory;
            }
            if (section.config.selectedAuthor) {
              configProps.selectedAuthor = section.config.selectedAuthor;
            }
            if (section.config.title) {
              configProps.title = section.config.title;
            }
            if (section.config.subtitle) {
              configProps.subtitle = section.config.subtitle;
            }
          }
          
          return <SectionComponent key={section.id} {...configProps} />;
        })}
      </Suspense>
    </ReduxProvider>
  );
}