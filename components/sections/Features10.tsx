'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"

interface Features10Props {
	previewData?: any;
}

export default function Features10({ previewData }: Features10Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Always trigger getFeatures() on component mount
		dispatch(getFeatures())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features10) {
			setData(previewData.features10)
		} 
		// Otherwise use Redux data
		else if (features && features.features10) {
			setData(features.features10)
		}
	}, [previewData, features])

	// If data is still loading, return empty component
	if (!data) {
		return null
	}

	return (
		<>
			<section 
				className="features-10 py-9" 
				style={{ 
					backgroundColor: data.backgroundColor || '#6342EC' 
				}}
			>
				<div className="container">
					<div className="row">
						{data.features && data.features.map((feature: any, index: number) => (
							<div key={index} className="col-lg-3 col-md-6">
								<div 
									className="feature-item mb-5 position-relative mb-lg-0 p-5 rounded-4 hover-up" 
									style={{ 
										backgroundColor: feature.backgroundColor || 'white' 
									}}
								>
									<div 
										className="icon-flip position-relative icon-shape icon-xxl rounded-3 mb-4" 
										style={{ 
											backgroundColor: feature.iconBackgroundColor || '#f8f4ff' 
										}}
									>
										<div className="icon">
											<img src={feature.icon || `/assets/imgs/features-1/icon-${index + 1}.svg`} alt="infinia" />
										</div>
									</div>
									<h6 
										style={{ 
											color: feature.titleColor || '' 
										}}
									>
										{feature.title || `Feature ${index + 1}`}
									</h6>
									<p 
										style={{ 
											color: feature.descriptionColor || '' 
										}}
									>
										{feature.description || "Feature description"}
									</p>
								
									<div className="position-absolute end-0 top-0">
										<img src={data.backgroundImage || "/assets/imgs/feature-10/bg-line.png"} alt="" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
