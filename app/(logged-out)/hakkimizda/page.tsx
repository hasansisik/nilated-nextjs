import { Metadata } from "next";
import { store } from "@/redux/store";
import { getGeneral } from "@/redux/actions/generalActions";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import Cta3 from "@/components/sections/Cta3";

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
  // Redux store'a genel verileri yükle
  await store.dispatch(getGeneral());

  // SEO metadatasını oluştur
  return generateSeoMetadata("about");
}

export default function PageAbout3() {
  return (
    <>
      {/*CTA 1*/}
      <Cta3 />
    </>
  );
}
