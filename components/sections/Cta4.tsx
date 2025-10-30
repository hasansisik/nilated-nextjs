'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getCta } from "@/redux/actions/ctaActions"
import { AppDispatch } from "@/redux/store"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Cta4Props {
	previewData?: any;
}

export default function Cta4({ previewData }: Cta4Props = {}) {
	const [isOpen, setOpen] = useState(false)
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { cta, loading } = useSelector((state: RootState) => state.cta)

	useEffect(() => {
		// Always trigger getCta() on component mount
		dispatch(getCta())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.cta4) {
			setData(previewData.cta4)
		} 
		// Otherwise use Redux data
		else if (cta && cta.cta4) {
			setData(cta.cta4)
		}
	}, [previewData, cta])

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
	
	const getSecondaryButtonStyles = () => {
		return {
			color: data.buttons?.secondary?.textColor || ''
		};
	}

	// Responsive image style
	const videoImageStyle: React.CSSProperties = {
		width: '100%',
		height: 'auto',
		maxWidth: '620px',
		objectFit: 'cover' as 'cover'
	};

	return (
		<>
			<section className="section-cta-4 my-5">
				<div className="container">
					<div className="row justify-content-center align-items-center">
						<div className="col-lg-6 col-md-8 col-12 text-center mb-4 mb-lg-0">
							<div className="text-center rounded-4 position-relative d-inline-flex w-100">
								<div className="zoom-img rounded-4 position-relative z-1 w-100">
									<img 
										className="rounded-4 w-100" 
										src={data.videoGuide.image} 
										alt="infinia" 
										style={videoImageStyle}
									/>
									<div className="position-absolute top-50 start-50 translate-middle z-2">
										<Link href="#" onClick={() => setOpen(true)} scroll={false} className="d-inline-flex align-items-center rounded-4 text-nowrap backdrop-filter px-2 px-sm-3 py-2 popup-video hover-up shadow-1">
											<span className="backdrop-filter me-2 icon-shape icon-md rounded-circle">
												<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
													<path className="stroke-dark" d="M5.0978 3.31244L12.0958 6.80342C13.077 7.29449 13.0767 8.69249 12.0954 9.18316L5.09734 12.6927C4.21074 13.136 3.16687 12.4925 3.16687 11.5027L3.16687 4.50219C3.16687 3.51217 4.2112 2.86872 5.0978 3.31244Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
											<span className="fw-bold fs-7 text-900 d-none d-sm-inline">
												{data.videoGuide.buttonText}
											</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6 col-12">
							{data.heading?.visible !== false && (
								<>
									<h6 className="text-primary text-center text-lg-start" style={{ color: data.heading?.smallColor || "#6342EC" }}>
										{data.heading.small}
									</h6>
									<h5 className="ds-5 my-3 text-center text-lg-start" style={{ color: data.heading?.titleColor || "#111827" }}>
										{data.heading.title}
									</h5>
								</>
							)}
							<div className="fs-5 text-500 text-center text-lg-start">
								<p className="mb-2">{data.description}</p>
								{data.description2 && (
									<p className="mb-0">{data.description2}</p>
								)}
							</div>
							<div className="d-md-flex align-items-start mt-4 mb-5">
								<ul className="list-unstyled phase-items mb-3 mb-md-0 flex-fill">
									{data.features.slice(0, 2).map((feature: string, index: number) => (
										<li key={index} className="d-flex align-items-center mt-3">
											<img src="/assets/imgs/cta-2/check.svg" alt="infinia" />
											<span className="ms-2 text-900">{feature}</span>
										</li>
									))}
								</ul>
								{data.features.length > 2 && (
									<ul className="list-unstyled phase-items ms-md-4 flex-fill">
										{data.features.slice(2, 4).map((feature: string, index: number) => (
											<li key={index} className="d-flex align-items-center mt-3">
												<img src="/assets/imgs/cta-2/check.svg" alt="infinia" />
												<span className="ms-2 text-900">{feature}</span>
											</li>
										))}
									</ul>
								)}
							</div>
							<div className="mt-4 mt-lg-5">
								<div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start justify-content-center justify-content-lg-start gap-3">
									{data.buttons?.primary?.visible !== false && (
										<Link 
											href={data.buttons.primary.link} 
											className="btn btn-gradient d-inline-flex align-items-center w-100 w-sm-auto justify-content-center"
											style={getPrimaryButtonStyles()}
										>
											<span>{data.buttons.primary.text}</span>
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									)}
									{data.buttons?.secondary?.visible !== false && (
										<Link 
											href={data.buttons.secondary.link} 
											className="text-decoration-underline fw-bold text-center"
											style={getSecondaryButtonStyles()}
										>
											{data.buttons.secondary.text}
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Dialog open={isOpen} onOpenChange={setOpen}>
				<DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
					<div className="relative w-full flex justify-center items-center">
						<img 
							src="https://res.cloudinary.com/ddmwgv3av/image/upload/v1761862181/E-000_HATT-I_EMAN_xxchcu.png" 
							alt="Hatt-ı Eman" 
							className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
