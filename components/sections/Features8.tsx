'use client'
import Link from "next/link"
import CountUp from 'react-countup'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"
import { AppDispatch } from "@/redux/store"

interface Features8Props {
	previewData?: any;
}

export default function Features8({ previewData }: Features8Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Always trigger getFeatures() on component mount
		dispatch(getFeatures())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features8) {
			setData(previewData.features8)
		} 
		// Otherwise use Redux data
		else if (features && features.features8) {
			setData(features.features8)
		}
	}, [previewData, features])

	// If data is still loading, return empty component
	if (!data) {
		return null
	}

	// Split values into two columns (left and right)
	const leftValues = data.values ? data.values.slice(0, 3) : [];
	const rightValues = data.values ? data.values.slice(3, 6) : [];

	return (
		<>
			<section>
				<div 
					className="container-fluid position-relative py-5" 
					style={{ 
						backgroundColor: data.backgroundColor || '#6342EC' 
					}}
				>
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-4 col-md-6 mb-lg-0 mb-8 pe-5 pe-lg-10 position-relative z-1">
								<img src={data.starIcon || "/assets/imgs/features-8/icon-star.svg"} alt="infinia" />
								<h2 
									className="mt-3 mb-4 fw-black" 
									style={{ 
										color: data.titleColor || '#FFFFFF' 
									}}
								>
									{data.title || "Core values"}
								</h2>
								<p 
									style={{ 
										color: data.descriptionColor || '#FFFFFF' 
									}}
								>
									{data.description || "We break down barriers so teams can focus on what matters – working together to create products their customers love."}
								</p>
							</div>
							<div className="col-lg-4 col-md-6 mb-lg-0 mb-8 pe-lg-8">
								<ul className="list-unstyled">
									{leftValues.map((value: any, index: number) => (
										<li key={index}>
											<Link href="#" className="d-flex align-items-start mb-6">
												<img className="mt-2" src={value.icon || "/assets/imgs/features-2/tick.svg"} alt="infinia" />
												<div className="ms-3 pb-4 border-bottom border-opacity-25">
													<h5 
														className="mb-2" 
														style={{ 
															color: data.valuesTitleColor || '#FFFFFF' 
														}}
													>
														{value.title}
													</h5>
													<p 
														className="mb-0" 
														style={{ 
															color: data.valuesDescriptionColor || '#FFFFFF' 
														}}
													>
														{value.description}
													</p>
												</div>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="col-lg-4 mb-lg-0 mb-8 pe-lg-8">
								<ul className="list-unstyled">
									{rightValues.map((value: any, index: number) => (
										<li key={index}>
											<Link href="#" className="d-flex align-items-start mb-6">
												<img className="mt-2" src={value.icon || "/assets/imgs/features-2/tick.svg"} alt="infinia" />
												<div className="ms-3 pb-4 border-bottom border-opacity-25">
													<h5 
														className="mb-2" 
														style={{ 
															color: data.valuesTitleColor || '#FFFFFF' 
														}}
													>
														{value.title}
													</h5>
													<p 
														className="mb-0" 
														style={{ 
															color: data.valuesDescriptionColor || '#FFFFFF' 
														}}
													>
														{value.description}
													</p>
												</div>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
