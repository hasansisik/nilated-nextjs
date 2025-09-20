import { Metadata } from "next";
import { store } from '@/redux/store';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface SeoPageConfig {
  id: string;
  name: string;
  url: string;
  title: string;
  description: string;
  lastUpdated: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const defaultSeoData: Record<string, SeoData> = {
  general: {
    title: "WordPress Clone - Modern CMS Template",
    description: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun ve yönetin.",
    keywords: "wordpress, clone, cms, website builder, blog, portfolio",
    ogTitle: "WordPress Clone - Modern Web Site Oluşturucu",
    ogDescription: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun ve yönetin.",
    ogImage: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  home: {
    title: "Ana Sayfa | WordPress Clone",
    description: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
    keywords: "wordpress, clone, website, cms, blog",
    ogTitle: "WordPress Clone | Modern CMS",
    ogDescription: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
    ogImage: "/og-image.jpg",
  },
  blog: {
    title: "Blog | WordPress Clone",
    description: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
    keywords: "blog, makaleler, wordpress, içerik, yazılar",
    ogTitle: "Blog Makaleleri | WordPress Clone",
    ogDescription: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
    ogImage: "/blog-og-image.jpg",
  },
  about: {
    title: "Hakkımızda | WordPress Clone",
    description: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
    keywords: "hakkımızda, şirket, ekip, misyon, vizyon",
    ogTitle: "Hakkımızda | WordPress Clone",
    ogDescription: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
    ogImage: "/about-og-image.jpg",
  },
  contact: {
    title: "İletişim | WordPress Clone",
    description: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
    keywords: "iletişim, bize ulaşın, adres, telefon, email",
    ogTitle: "İletişim | WordPress Clone",
    ogDescription: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
    ogImage: "/contact-og-image.jpg",
  },
  service: {
    title: "Hizmetlerimiz | WordPress Clone",
    description: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
    keywords: "hizmetler, çözümler, servisler, örnekler, işler",
    ogTitle: "Hizmetlerimiz | WordPress Clone",
    ogDescription: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
    ogImage: "/services-og-image.jpg",
  },
};

// Replace the getSeoData function with a new implementation that uses the Redux store
export function getSeoData(page: string): SeoData {
  const state = store.getState();
  
  // Check if we have data in the Redux store
  if (state.general.general?.seo) {
    // For general page settings
    if (page === 'general') {
      return state.general.general.seo.general;
    }
    
    // For specific pages
    const pageData = state.general.general.seo.pages?.find((p: SeoPageConfig) => p.id === page);
    if (pageData) {
      return {
        title: pageData.title,
        description: pageData.description,
        keywords: pageData.keywords,
        ogTitle: pageData.ogTitle,
        ogDescription: pageData.ogDescription,
        ogImage: pageData.ogImage
      };
    }
    
    // If specific page not found, return general seo data
    return state.general.general.seo.general;
  }
  
  // Return empty SEO data object if nothing found in store
  return {
    title: "",
    description: ""
  };
}

export function generateMetadata(page: string): Metadata {
  const seoData = getSeoData(page);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle || seoData.title,
      description: seoData.ogDescription || seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : [],
    },
    ...(seoData.canonicalUrl && {
      alternates: {
        canonical: seoData.canonicalUrl,
      },
    }),
  };
}

/**
 * Get general SEO data from the Redux store
 */
export const getGeneralSeoData = () => {
  const state = store.getState();
  if (!state.general.general || !state.general.general.seo) {
    // Return empty object if general data is not yet loaded
    return {
      title: "",
      description: ""
    };
  } 
  
  const generalSeo = state.general.general.seo.general;
  return generalSeo;
};

/**
 * Get all SEO pages data from the Redux store
 */
export const getAllSeoPages = (): SeoPageConfig[] => {
  const state = store.getState();
  if (!state.general.general || !state.general.general.seo) {
    return [];
  }
  
  const pages = state.general.general.seo.pages || [];
  return pages;
};

/**
 * Get SEO data for a specific page by ID
 * @param pageId The ID of the page to retrieve SEO data for
 */
export const getSeoPageById = (pageId: string): SeoPageConfig | null => {
  const state = store.getState();
  if (!state.general.general || !state.general.general.seo) {
    return null;
  }
  
  const pages = state.general.general.seo.pages || [];
  return pages.find((page: SeoPageConfig) => page.id === pageId) || null;
};

/**
 * Get SEO data for a page by URL
 * @param url The URL of the page to retrieve SEO data for
 */
export const getSeoPageByUrl = (url: string): SeoPageConfig | null => {
  const state = store.getState();
  if (!state.general.general || !state.general.general.seo) {
    return null;
  }
  
  const pages = state.general.general.seo.pages || [];
  return pages.find((page: SeoPageConfig) => page.url === url) || null;
}; 