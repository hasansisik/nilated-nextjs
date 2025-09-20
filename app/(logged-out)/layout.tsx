import "@/public/assets/css/vendors/bootstrap.min.css"
import "@/public/assets/css/vendors/swiper-bundle.min.css"
import "@/public/assets/css/vendors/aos.css"
import "@/public/assets/css/vendors/odometer.css"
import "@/public/assets/css/vendors/carouselTicker.css"
import "@/public/assets/css/vendors/magnific-popup.css"
import "@/public/assets/fonts/bootstrap-icons/bootstrap-icons.min.css"
import "@/public/assets/fonts/boxicons/boxicons.min.css"
import "@/public/assets/fonts/satoshi/satoshi.css"
import "@/public/assets/css/main.css"

import "@/node_modules/react-modal-video/css/modal-video.css"

import type { Metadata } from "next"
import { store } from "@/redux/store"
import { getGeneral } from "@/redux/actions/generalActions"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"
import ThemeProvider from "@/components/layout/ThemeProvider"

// This will run server-side
export async function generateMetadata(): Promise<Metadata> {
  // Load general data to Redux store
  await store.dispatch(getGeneral())
  
  // Generate SEO metadata
  return generateSeoMetadata("general")
}

export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
