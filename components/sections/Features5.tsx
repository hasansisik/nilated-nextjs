'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"
import { AppDispatch } from "@/redux/store"

interface Features5Props {
	previewData?: any;
}

export default function Features5({ previewData }: Features5Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Always trigger getFeatures() on component mount
		dispatch(getFeatures())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features5) {
			setData(previewData.features5)
		} 
		// Otherwise use Redux data
		else if (features && features.features5) {
			setData(features.features5)
		}
	}, [previewData, features])

	// If data is still loading, return empty component
	if (!data) {
		return null
	}

	// Sort the sections by position
	const sortedSections = data.sections && Array.isArray(data.sections) 
		? [...data.sections].sort((a, b) => a.position - b.position)
		: [];
	
	// Image style constraints
	const featureImageStyle = {
		width: '100%',
		height: 'auto',
		maxWidth: '534px',
		maxHeight: '446px',
		objectFit: 'cover' as 'cover'
	};
		
	return (
		<>
			<section className="section-feature-5 py-5">
				<div 
					className="container-fluid position-relative" 
					style={{ backgroundColor: data.backgroundColor || 'transparent' }}
				>
					<div className="container">
						{/* Title Section */}
						{(data.title || data.description) && (
							<div className="text-center mb-8">
								{data.title && (
									<h4 
										className="ds-4 my-3 fw-bold"
										style={{ 
											color: data.titleColor || '' 
										}}
									>
										{data.title}
									</h4>
								)}
								{data.description && (
									<p 
										className="fs-5 mb-0" 
										style={{ 
											color: data.descriptionColor || '' 
										}}
									>
										{data.description}
									</p>
								)}
							</div>
						)}

						{/* Sections */}
						{sortedSections.map((section, index) => {
							// Skip if section is not visible
							if (section.visible === false) return null;
							
							// Determine if image should be on left or right
							const imageOnLeft = section.imagePosition === 'left';
							
							return (
								<div 
									key={section.id} 
									className={`row align-items-center ${index > 0 ? 'mt-10' : ''}`}
									style={{ 
										backgroundColor: section.backgroundColor || 'transparent',
										borderRadius: section.backgroundColor ? '1rem' : '0',
										padding: section.backgroundColor ? '2rem' : '0'
									}}
								>
									{/* Image Column */}
									<div className={`col-lg-5 ${!imageOnLeft ? 'order-1 order-lg-2 offset-lg-1 mt-5 text-lg-end text-center' : ''}`}>
										<div 
											className="photo-description position-relative rounded-4 d-inline-block"
											style={{ 
												backgroundColor: `${section.photoBackgroundColor || 'transparent'} !important`
											}}
										>
											<img 
												className="rounded-4 border border-2 border-white position-relative z-1" 
												src={section.image || `/assets/imgs/features-5/img-${index + 1}.png`} 
												alt="infinia" 
												style={featureImageStyle}
											/>
											<div className={imageOnLeft 
												? "box-gradient-1 ms-lg-8 position-absolute bottom-0 start-0 rounded-4 z-0" 
												: "position-absolute top-50 start-50 translate-middle z-0"
											}
											style={{
												backgroundColor: section.gradientBackgroundColor || ''
											}}
											>
												{!imageOnLeft && (
													<div 
														className="box-gradient-2 position-relative rounded-4 z-0"
														style={{
															backgroundColor: section.gradientBackgroundColor2 || ''
														}}
													></div>
												)}
											</div>
										</div>
									</div>
									
									{/* Text Column */}
									<div className={`col-lg-6 ${imageOnLeft ? 'offset-lg-1' : 'order-2 order-lg-1'} mt-lg-0 mt-5`}>
										<h4 className="ds-4 fw-regular">
											{section.title?.part1 || `Title Part 1 - ${index + 1}`} <br /> 
											{!imageOnLeft && " "}
											<span className="fw-bold" data-aos="fade-zoom-in" data-aos-delay={200} style={{ color: section.title?.part2Color || '' }}>
												{section.title?.part2 || `Title Part 2 - ${index + 1}`} <br className="d-none d-lg-inline" /> 
											</span>
										</h4>
										<p className="fs-5" style={{ color: section.descriptionColor || '' }}>
											{section.description || "Section description placeholder text."}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</>
	)
}
