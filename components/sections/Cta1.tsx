'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getCta } from "@/redux/actions/ctaActions"
import { AppDispatch } from "@/redux/store"

interface Cta1Props {
	previewData?: any;
}

export default function Cta1({ previewData }: Cta1Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { cta } = useSelector((state: RootState) => state.cta)

	useEffect(() => {
		// Only fetch if we don't already have data
		if (!cta?.cta1) {
			dispatch(getCta())
		}
	}, [dispatch, cta])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.cta1) {
			setData(previewData.cta1)
		} 
		// Otherwise use Redux data
		else if (cta && cta.cta1) {
			setData(cta.cta1)
		}
	}, [previewData, cta])

	// Return invisible placeholder during data loading (minimal and without text)
	if (!data) {
		return (
			<section className="section-testimonial-13 position-relative pt-5 pb-80 fix" aria-hidden="true">
				<div className="container position-relative z-1">
					<div className="row pb-9">
						<div className="col-lg-12" style={{ minHeight: "200px" }}></div>
					</div>
				</div>
				<div className="container">
					<div className="d-flex align-items-center justify-content-center position-relative" style={{ minHeight: "100px" }}></div>
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

	// Image style based on image index/position
	const getTeamImageStyle = (index: number) => {
		// Base style for all images
		const baseStyle: React.CSSProperties = {
			height: 'auto',
			objectFit: 'cover'
		};
		
		// Different constraints based on image position
		switch(index) {
			// First and last images (smallest)
			case 0:
			case 4:
				return {
					...baseStyle,
					maxWidth: '225px',
					maxHeight: '157px'
				};
			// Second and fourth images (medium)
			case 1:
			case 3:
				return {
					...baseStyle,
					maxWidth: '316px',
					maxHeight: '220px'
				};
			// Middle/third image (largest)
			case 2:
				return {
					...baseStyle,
					maxWidth: '486px',
					maxHeight: '337px'
				};
			// Default
			default:
				return {
					...baseStyle,
					maxWidth: '316px',
					maxHeight: '220px'
				};
		}
	};

	return (
		<>
			<section className="section-testimonial-13 position-relative py-10 fix">
				<div className="container position-relative z-1">
					<div className="row pb-9">
						<div className="col-lg-12">
							<div className="text-center mb-lg-0 mb-5">
								{data.badgeVisible !== false && (
									<div 
										className="d-flex align-items-center position-relative z-2 justify-content-center d-inline-flex rounded-pill border border-2 border-white px-3 py-1"
										style={{ backgroundColor: data.badgeBackgroundColor || "#f1f0fe" }}
									>
										<span 
											className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
											style={{ color: data.badgeTextColor || "#6342EC" }}
										>
											{data?.badge || "About us"}
										</span>
									</div>
								)}
								<h3 
									className="ds-3 my-3 fw-regular"
									dangerouslySetInnerHTML={{ __html: data?.title || "Together, We are Shaping a Promising Future." }}
								></h3>
								
								{/* Buttons Section */}
								{(data.buttons?.primary?.visible !== false || data.buttons?.secondary?.visible !== false) && (
									<div className="mt-4 d-flex justify-content-center align-items-center flex-wrap gap-3">
										{data.buttons?.primary?.visible !== false && (
											<Link 
												href={data.buttons?.primary?.link || "#"} 
												className="btn btn-gradient d-inline-flex align-items-center"
												style={getPrimaryButtonStyles()}
											>
												<span>{data.buttons?.primary?.text || "Get Started"}</span>
												<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
													<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										)}
										
										{data.buttons?.secondary?.visible !== false && (
											<Link 
												href={data.buttons?.secondary?.link || "#"} 
												className="btn btn-outline d-inline-flex align-items-center"
												style={{
													backgroundColor: data.buttons?.secondary?.backgroundColor || 'transparent',
													color: data.buttons?.secondary?.textColor || ''
												}}
											>
												<span>{data.buttons?.secondary?.text || "Learn More"}</span>
											</Link>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="d-flex align-items-center justify-content-center position-relative">
					{data.images && data.images.map((image: any, index: number) => (
						<div key={index} className={`pe-3 position-relative z-1 ${index === 0 || index === 4 ? 'd-none d-md-block' : ''}`}>
							<img 
								className="rounded-3 border border-3 border-white" 
								src={image.src} 
								alt={image.alt || "Team image"} 
								style={getTeamImageStyle(index)}
							/>
						</div>
					))}
					{!data.images && (
						<>
						<div className="pe-3 position-relative z-1 d-none d-md-block">
							<img 
								className="rounded-3 border border-3 border-white" 
								src="/assets/imgs/cta-15/img-1.png" 
								alt="infinia" 
								style={getTeamImageStyle(0)}
							/>
						</div>
						<div className="pe-3 position-relative z-1">
							<img 
								className="rounded-3 border border-3 border-white" 
								src="/assets/imgs/cta-15/img-2.png" 
								alt="infinia" 
								style={getTeamImageStyle(1)}
							/>
						</div>
						<div className="pe-3 position-relative z-1">
							<img 
								className="rounded-3 border border-3 border-white" 
								src="/assets/imgs/cta-15/img-3.png" 
								alt="infinia" 
								style={getTeamImageStyle(2)}
							/>
						</div>
						<div className="pe-3 position-relative z-1">
							<img 
								className="rounded-3 border border-3 border-white" 
								src="/assets/imgs/cta-15/img-4.png" 
								alt="infinia" 
								style={getTeamImageStyle(3)}
							/>
						</div>
						<div className="pe-3 position-relative z-1 d-none d-md-block">
							<img 
								className="rounded-3 border border-3 border-white" 
								src="/assets/imgs/cta-15/img-5.png" 
								alt="infinia" 
								style={getTeamImageStyle(4)}
							/>
						</div>
						</>
					)}
					</div>
				</div>
			</section>
		</>
	)
}
