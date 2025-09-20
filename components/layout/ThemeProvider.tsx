"use client";

import { useState, useEffect } from "react";
import Layout from "./Layout";
import { server } from "@/config";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import PhoneButton from "@/components/common/PhoneButton";
import CookieConsent from "@/components/common/CookieConsent";
import { useThemeConfig } from "@/lib/store/themeConfig";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setHeaderStyle, setFooterStyle } = useThemeConfig();
  const [themeConfig, setThemeConfig] = useState({
    headerStyle: 1,
    footerStyle: 1
  });

  useEffect(() => {
    async function fetchThemeConfig() {
      try {
        setIsLoading(true);
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`${server}/general?_t=${timestamp}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch theme configuration");
        }

        const data = await response.json();
        
        if (data && data.general && data.general.theme) {
          
          // Use the theme settings from the server
          const headerStyle = data.general.theme.headerStyle || 1;
          const footerStyle = data.general.theme.footerStyle || 1;
          
          setThemeConfig({
            headerStyle,
            footerStyle
          });
          
          // Update global theme state
          setHeaderStyle(headerStyle);
          setFooterStyle(footerStyle);
        }
      } catch (err) {
        console.error("Error fetching theme config:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchThemeConfig();
  }, [setHeaderStyle, setFooterStyle]);

  // If still loading, show minimal loading state
  if (isLoading) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <Layout 
      headerStyle={themeConfig.headerStyle} 
      footerStyle={themeConfig.footerStyle}
      useGlobalTheme={false}
    >
      {children}
      <WhatsAppButton />
      <PhoneButton />
      <CookieConsent />
    </Layout>
  );
} 