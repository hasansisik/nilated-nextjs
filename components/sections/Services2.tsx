'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"

interface Services2Props {
	previewData?: any;
}

export default function Services2({ previewData }: Services2Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { other, loading } = useSelector((state: RootState) => state.other)

	useEffect(() => {
		// Fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther())
		}
	}, [dispatch, previewData])
		
	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.services2) {
			setData(previewData.services2);
		} 
		// Otherwise use Redux data
		else if (other && other.services2) {
			setData(other.services2);
		}
	}, [previewData, other])

	// Function to format description text with bullet points
	const formatDescription = (description: string) => {
		if (!description) return '';
		// Replace • with line breaks and bullet points
		return description.split('•').map((item, index) => {
			if (index === 0 && item.trim() === '') return null;
			return (
				<div key={index} className="mb-1">
					{index > 0 && '• '}{item.trim()}
				</div>
			);
		}).filter(Boolean);
	};

	if (!data || loading) {
		return <section>Yükleniyor...rvices2...</section>
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.heading?.titleColor || "#111827"
	};

	const tagStyle = {
		backgroundColor: data.heading?.tagBackgroundColor || "#dbeafe",
		color: data.heading?.tagTextColor || "#2563EB"
	};

	return (
		<>
			<section className="section-team-1 position-relative fix py-5" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						{data.heading?.tagVisible !== false && (
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100} style={tagStyle}>
								<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data.heading?.tag}</span>
							</div>
						)}
						<h3 className="ds-3 my-3 fw-regular" dangerouslySetInnerHTML={{ __html: data.heading?.title }} style={titleStyle}></h3>
					</div>
					<div className="row mt-6 position-relative">
						{data.services.map((service: any, index: number) => (
							<div key={index} className="col-lg-4 col-md-6 d-flex">
								<div className="p-2 rounded-4 shadow-1 bg-white position-relative z-1 hover-up mb-4 w-100">
									<div className="card-service bg-white p-6 border rounded-4 text-center d-flex flex-column h-100">
										<div className="icon-flip position-relative icon-shape icon-xxl rounded-3 mx-auto">
											<div className="icon">
												<img src={service.icon} alt="infinia" />
											</div>
										</div>
										<h5 className="my-3">{service.title}</h5>
										<div className="mb-6 flex-grow-1 text-start">
											{formatDescription(service.description)}
										</div>
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
