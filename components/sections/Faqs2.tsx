'use client'
import { useState, useEffect } from 'react';
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFaq } from "@/redux/actions/faqActions"
import { AppDispatch } from "@/redux/store"

interface Faqs2Props {
	previewData?: any;
}

export default function Faqs2({ previewData }: Faqs2Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { faq, loading } = useSelector((state: RootState) => state.faq)
	
	// Accordion
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0); // Add a key to force re-render

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	// Always fetch FAQ data when component mounts
	useEffect(() => {
		dispatch(getFaq())
	}, [dispatch])

	// Force refresh when data changes
	useEffect(() => {
		// Increment key to force component re-render when data changes
		setKey(prevKey => prevKey + 1);
	}, [previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.faqs2) {
			setData(previewData.faqs2);
		} 
		// Otherwise use Redux data
		else if (faq && faq.faqs2) {
			setData(faq.faqs2);
		}
	}, [previewData, faq, key])

	// If data is still loading or not available, show a loading indicator
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

	// Calculate how to split the questions between two columns evenly
	const questions = data?.questions || [];
	const totalQuestions = questions.length;
	const firstColumnCount = Math.ceil(totalQuestions / 2);
	const firstColumn = questions.slice(0, firstColumnCount);
	const secondColumn = questions.slice(firstColumnCount);

	return (
		<>
			<section className="section-faqs-2 py-5 bg-4 position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="text-center mb-8">
						{data.tagVisible !== false && (
							<div 
								className="d-flex align-items-center position-relative z-2 justify-content-center d-inline-flex rounded-pill border border-2 border-white px-3 py-1"
								style={{ backgroundColor: data.tagBackgroundColor || "#f1f0fe" }}
							>
								<span 
									className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
									style={{ color: data.tagTextColor || "#6342EC" }}
								>
									{data?.heading?.tag || "FAQs"}
								</span>
							</div>
						)}
						<h3 
							className="ds-3 my-3 fw-bold"
							style={{ color: data.heading?.titleColor || "#111827" }}
						>
							{data?.heading?.title || "Frequently Asked Questions"}
						</h3>
						<p 
							className="fs-5 mb-0"
							style={{ color: data.heading?.descriptionColor || "#6E6E6E" }}
						>
							{data?.heading?.description || "Find answers to common questions about our services"}
						</p>
					</div>
					<div className="row align-items-center position-relative z-1">
						<div className="col-lg-6">
							<div className="accordion">
								{firstColumn.map((faq: any, index: number) => (
									<div key={`first-${index}-${key}`} className="mb-3 card p-3 border rounded-3">
										<div className="px-0 card-header border-0">
											<a 
												className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index+1 ? '' : ''}`} 
												onClick={() => handleActiveItem(index+1)}
											>
												<h6 className="m-0" dangerouslySetInnerHTML={{ __html: faq?.question || `Question ${index+1}` }}></h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index+1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0">
													{faq?.answer || "Answer to this question."}
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-2">
							<div className="accordion">
								{secondColumn.map((faq: any, index: number) => (
									<div key={`second-${index}-${key}`} className="mb-3 card p-3 border rounded-3">
										<div className="px-0 card-header border-0">
											<a 
												className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index+firstColumnCount+1 ? '' : ''}`} 
												onClick={() => handleActiveItem(index+firstColumnCount+1)}
											>
												<h6 className="m-0" dangerouslySetInnerHTML={{ __html: faq?.question || `Question ${index+firstColumnCount+1}` }}></h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index+firstColumnCount+1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0">
													{faq?.answer || "Answer to this question."}
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="ellipse-center position-absolute top-50 start-50 translate-middle z-0" />
				</div>
			</section>
		</>
	)
}
