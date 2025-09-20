import { Metadata } from "next"
import { store } from "@/redux/store"
import { getGeneral } from "@/redux/actions/generalActions"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
  // Redux store'a genel verileri yükle
  await store.dispatch(getGeneral())
  
  // SEO metadatasını oluştur
  return generateSeoMetadata("service")
}

export default function HizmetlerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 