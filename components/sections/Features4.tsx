'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"
import { AppDispatch } from "@/redux/store"

interface Features4Props {
	previewData?: any;
}

export default function Features4({ previewData }: Features4Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Always trigger getFeatures() on component mount
		dispatch(getFeatures())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features4) {
			setData(previewData.features4)
		} 
		// Otherwise use Redux data
		else if (features && features.features4) {
			setData(features.features4)
		}
	}, [previewData, features])

	// If data is still loading, return empty component
	if (!data) {
		return null
	}

	return (
		<>
			<section>
				<div 
					className="container-fluid position-relative py-5" 
					style={{ 
						backgroundColor: data.backgroundColor || 'var(--bs-gradient-3, linear-gradient(96deg, #FFF3E5 5.75%, #EDFFFA 52.86%, #FFEDF8 100%))' 
					}}
				>
					<div className="container">
						<div className="text-center mb-8">
							{data.badge?.visible !== false && (
								<div 
									className="d-flex align-items-center justify-content-center d-inline-flex rounded-pill border-white border px-3 py-1" 
									style={{ 
										backgroundColor: data.badge?.backgroundColor || '#f8f4ff' 
									}}
									data-aos="zoom-in" 
									data-aos-delay={200}
								>
									<span 
										className="tag-spacing fs-7 fw-bold ms-2 text-uppercase" 
										style={{ 
											color: data.badge?.labelTextColor || '#6342EC' 
										}}
									>
										{data.badge?.label || "What we offers"}
									</span>
							</div>
							)}
							<h3 className="ds-3 my-3 fw-regular">
								{data.title?.part1 || "Professional"}
								<span 
									className="fw-bold" 
									data-aos="fade-zoom-in" 
									data-aos-delay={200} 
									style={{ 
										color: data.title?.part2TextColor || '' 
									}}
								>
									{data.title?.part2 || " UltraHD Video "}<br className="d-none d-lg-block" />
									{data.title?.part3 || "Conferencing Platform"}
								</span>
							</h3>
						</div>
						<div className="row">
							{data.features && data.features.map((feature: any, index: number) => (
								<div 
									key={index} 
									className={`col-lg-3 col-md-6 mt-4 mt-lg-0 ${index % 2 === 1 ? 'mt-lg-6' : ''}`} 
									data-aos="fade-zoom-in" 
									data-aos-delay={index * 100}
								>
									<div 
										className="card-service p-5 rounded-4 hover-up" 
										style={{ 
											backgroundColor: feature.backgroundColor || '#FFFFFF' 
										}}
									>
										<img 
											src={feature.icon || `/assets/imgs/features-4/icon-${index + 1}.svg`} 
											alt="infinia" 
											style={{ 
												filter: feature.iconColor ? `brightness(0) invert(${feature.iconColor === 'white' ? 1 : 0})` : '' 
											}} 
										/>
										<h6 
											className="my-3 fs-5" 
											style={{ 
												color: feature.titleColor || '' 
											}}
										>
											{feature.title || `Feature ${index + 1}`}
										</h6>
										<p 
											className="mb-6" 
											style={{ 
												color: feature.descriptionColor || '' 
											}}
										>
											{feature.description || "Feature description"}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="row mt-8">
							<div className="col-lg-7">
								<div className="d-flex align-items-center justify-content-lg-end justify-content-center">
									{data.buttons?.primary?.visible !== false && (
										<Link 
											href={data.buttons?.primary?.link || "#"} 
											className="btn px-4 py-2" 
											style={{
												backgroundColor: data.buttons?.primary?.backgroundColor || 'var(--bs-primary, #6342EC)',
												color: data.buttons?.primary?.textColor || '#FFFFFF'
											}}
										>
											{data.buttons?.primary?.text || "Get Free Quote"}
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path 
													d="M17.25 15.25V6.75H8.75" 
													stroke={data.buttons?.primary?.iconColor || "white"} 
													strokeWidth="1.5" 
													strokeLinecap="round" 
													strokeLinejoin="round" 
												/>
												<path 
													d="M17 7L6.75 17.25" 
													stroke={data.buttons?.primary?.iconColor || "white"} 
													strokeWidth="1.5" 
													strokeLinecap="round" 
													strokeLinejoin="round" 
												/>
											</svg>
										</Link>
									)}
									{data.buttons?.secondary?.visible !== false && (
										<Link 
											href={data.buttons?.secondary?.link || "#"} 
											className="ms-5 text-decoration-underline fw-bold" 
											style={{ 
												color: data.buttons?.secondary?.textColor || '#212529' 
											}}
										>
											{data.buttons?.secondary?.text || "How We Work"}
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
