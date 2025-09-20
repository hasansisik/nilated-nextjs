import Contact1 from "@/components/sections/Contact1"
import Link from "next/link"
import { Metadata } from "next"
import { store } from "@/redux/store"
import { getGeneral } from "@/redux/actions/generalActions"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
	// Redux store'a genel verileri yükle
	await store.dispatch(getGeneral())
	
	// SEO metadatasını oluştur
	return generateSeoMetadata("contact")
}

export default function PageContact2() {

	return (
		<>

			<Contact1 />
		</>
	)
}