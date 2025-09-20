'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getCta } from "@/redux/actions/ctaActions"
import { AppDispatch } from "@/redux/store"

interface Cta3Props {
	previewData?: any;
}

export default function Cta3({ previewData }: Cta3Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { cta, loading } = useSelector((state: RootState) => state.cta)

	useEffect(() => {
		// Always trigger getCta() on component mount
		dispatch(getCta())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.cta3) {
			setData(previewData.cta3)
		} 
		// Otherwise use Redux data
		else if (cta && cta.cta3) {
			setData(cta.cta3)
		}
	}, [previewData, cta])

	// If data is still loading, show a loading indicator
	if (!data) {
		return (
			<section className="py-5">
				<div className="container text-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Yükleniyor...</span>
					</div>
				</div>
			</section>
		)
	}
	
	// Button classes and styles
	const getPrimaryButtonStyles = () => {
		const buttonStyle: React.CSSProperties = {
			color: data.buttons?.primary?.textColor || '#FFFFFF'
		}
		
		// Only include backgroundColor if a custom one is set
		if (data.buttons?.primary?.backgroundColor) {
			buttonStyle.backgroundColor = data.buttons.primary.backgroundColor;
			buttonStyle.backgroundImage = 'none'; // Override gradient
		}
		
		return buttonStyle;
	}

	return (
		<>
			<section className="section-cta-12 position-relative py-5 fix">
				<div className="container">
					<div className="row">
						<div className="col-lg-5">
							{data.tagVisible !== false && (
								<div 
									className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" 
									data-aos="zoom-in" 
									data-aos-delay={100}
									style={{ backgroundColor: data.tagBackgroundColor || "#f1f0fe" }}
								>
									<span 
										className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
										style={{ color: data.tagTextColor || "#6342EC" }}
									>
										{data?.tag || "Our History"}
									</span>
								</div>
							)}
							<h5 
								className="ds-5 my-3"
								style={{ color: data.titleColor || "#111827" }}
							>
								{data?.title || "A Journey of Innovation and Growth"}
							</h5>
							<p 
								className="fs-5 text-500 mb-8"
								style={{ color: data.subtitleColor || "#6E6E6E" }}
							>
								{data?.subtitle || "Loved By Developers Trusted By Enterprises"}
							</p>
							{data?.buttons?.primary?.visible !== false && (
								<Link 
									href={data?.buttons?.primary?.link || "#"} 
									className="btn btn-gradient d-inline-flex align-items-center"
									style={getPrimaryButtonStyles()}
								>
									<span>{data?.buttons?.primary?.text || "Get Started"}</span>
									<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							)}
							
							{/* Rounded Image at bottom left */}
							<div className="mt-5">
								<img 
									src="https://res.cloudinary.com/ddmwgv3av/image/upload/v1750094155/pski_hx5nw3.avif"
									alt="Dr. Cemil Çelik"
									className="rounded-lg"
									style={{ width: '600px', height: '300px', objectFit: 'cover' }}
								/>
							</div>
						</div>
						<div className="col-lg-6 offset-lg-1 mt-lg-0 mt-8">
							<div 
								className="fs-5 text-900 mb-5"
								style={{ color: data.descriptionColor || "#111827" }}
							>
								<p className="mb-4">
									<strong>Kurucumuz: Dr. Cemil Çelik</strong><br />
									Psikiyatrist, psikoterapist, eğitmen, yol arkadaşı… Ama en çok da bir çağın sesi… Dr. Cemil Çelik, yıllar boyunca hem danışanlara hem de meslektaşlarına dokunarak, bilgiyi yalnızca aktaran değil, anlamla buluşturan bir dil kurdu. NİLATED, onun yıllara yayılan emeğinin, hayalinin ve içsel yolculuğunun doğal bir devamıdır.
								</p>
								
								<p className="mb-4">
									<strong>NİLATED Ne Demek?</strong><br />
									NİLATED bir kısaltma değil; bir niyettir. Her harfinde bir sorumluluk, her sesinde bir adanmışlık vardır. Çok dillidir, çünkü insanın dili çoktur. Çok katmanlıdır, çünkü ruh bir tek hikâyeyle anlatılamaz. Ve evrenseldir; çünkü her kalpte yankı bulmak için kurulmuştur.
								</p>
								
								<p className="mb-4">
									<strong>Biz Kimiz?</strong><br />
									NİLATED, alanında uzman ve ruhunda sorumluluk taşıyan kişilerden oluşan bir "onlular topluluğudur." Her birimizin kendine özgü bir mühürü, bir görevi ve bir sesi vardır. Kimi yazar, kimi anlatır… Kimi planlar, kimi paylaşır… Ama hepimiz aynı idealin hizmetindeyiz: Bilgiyi taşı, Yaraya tanık ol, Anlamı duyur.
								</p>
								
								<p className="mb-4">
									<strong>Ne Yapıyoruz?</strong><br />
									• Terapist ve ruh sağlığı uzmanlarına yönelik profesyonel eğitimler<br />
									• Gerçek vaka analizleriyle öğretici ve etkileyici içerikler<br />
									• Kurumlara özel danışmanlık ve içsel gelişim rehberliği<br />
									• Youtube ve dijital platformlarda psikoeğitim serileri<br />
									• Ruhsal, metaforik, şiirsel içerikler: 304 – Güvercin – Çağın Sesi
								</p>
								
								<p className="mb-0">
									<strong>Sözümüz Var…</strong><br />
									Biz, etik çizgiden sapmadan, insanın yarasına eğilerek, kalpten kalbe bir yol açmak için buradayız. Terapide, eğitimde, danışmanlıkta, anlatıda… Her adımımızda bir mühür, her kelimemizde bir tanıklık taşıyoruz.<br />
									<strong>NİLATED – Her Kalbe Bir Mühür</strong>
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
