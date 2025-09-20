"use client"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFaq } from "@/redux/actions/faqActions"
import { AppDispatch } from "@/redux/store"

interface Faqs3Props {
	previewData?: any;
}

export default function Faqs3({ previewData }: Faqs3Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { faq, loading } = useSelector((state: RootState) => state.faq)
	
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0);

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	// Always fetch FAQ data when component mounts
	useEffect(() => {
		dispatch(getFaq())
	}, [dispatch])

	useEffect(() => {
		setKey(prevKey => prevKey + 1);
	}, [previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.faqs3) {
			setData(previewData.faqs3);
		} 
		// Otherwise use Redux data
		else if (faq && faq.faqs3) {
			setData(faq.faqs3);
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

	// Primary button styles
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
			<section className="section-faqs-1 py-5 position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<div className="text-start">
								{data.tagVisible !== false && (
									<div 
										className="d-flex align-items-center position-relative z-2 justify-content-center d-inline-flex rounded-pill border border-2 border-white px-3 py-1"
										style={{ backgroundColor: data.tagBackgroundColor || "#f1f0fe" }}
									>
										<span 
											className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
											style={{ color: data.tagTextColor || "#6342EC" }}
										>
											{data?.heading?.tag || "Frequently Asked Questions"}
										</span>
									</div>
								)}
								<h3 
									className="ds-3 my-3 fw-bold" 
									dangerouslySetInnerHTML={{ __html: data?.heading?.title || "Got questions? <br />We've got answers" }}
									style={{ color: data.heading?.titleColor || "#111827" }}
								></h3>
								{data.descriptionVisible !== false && (
									<div className="position-relative d-inline-block mt-3 mb-6">
										{data?.leftImagesVisible !== false && (
											<>
												<img src={data?.leftImage1 || "/assets/imgs/faqs-3/img-1.png"} alt="" className=" rounded-pill border border-3 border-white" />
												<img src={data?.leftImage2 || "/assets/imgs/faqs-3/img-2.png"} alt="" className="position-absolute z-1 top-0 start-50 mt-3 rounded-pill border border-3 border-white" />
											</>
										)}
									</div>
								)}
								{data.descriptionVisible !== false && (
									<p 
										className="fs-5 mb-0" 
										dangerouslySetInnerHTML={{ __html: data?.description || "Quick answers to questions you may have. <br />Can't find what you're looking for? Get in touch with us." }}
										style={{ color: data.heading?.descriptionColor || "#6E6E6E" }}
									></p>
								)}
								<div className="d-flex align-items-center mt-5">
									{data.buttons?.primary?.visible !== false && (
										<Link 
											href={data?.buttons?.primary?.link || "#"} 
											className="btn btn-gradient d-flex align-items-center"
											style={getPrimaryButtonStyles()}
										>
											{data?.buttons?.primary?.text || "Get in touch"}
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									)}
									{data.buttons?.secondary?.visible !== false && (
										<Link 
											href={data?.buttons?.secondary?.link || "#"} 
											className="ms-5 fw-bold"
											style={{ color: data.buttons?.secondary?.textColor || "#111827" }}
										>
											{data?.buttons?.secondary?.text || "Help Center"}
										</Link>
									)}
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-8">
							<div className="accordion">
								{data?.questions?.map((item: any, index: number) => (
									<div key={index} className="mb-3 card p-3 border rounded-3">
										<div className="px-0 card-header border-0">
											<a className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index + 1 ? '' : ''}`} 
											   onClick={() => handleActiveItem(index + 1)}>
												<h6 className="m-0" dangerouslySetInnerHTML={{ __html: item?.question || `Question ${index + 1}` }}></h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index + 1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0" dangerouslySetInnerHTML={{ __html: item?.answer || "Answer goes here" }}></p>
											</div>
										)}
									</div>
								)) || (
									<>
										<div className="mb-3 card p-3 border rounded-3">
											<div className="px-0 card-header border-0">
												<a className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 1 ? '' : ''}`} 
												   onClick={() => handleActiveItem(1)}>
													<h6 className="m-0">What are the key benefits of using <span className="text-primary">Infinia System</span></h6>
													<span className="ms-auto arrow me-2">
														<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											{activeItem === 1 && (
												<div className="card-body px-0 mt-2">
													<p className="text-black-50 mb-0">We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.</p>
												</div>
											)}
										</div>
										<div className="mb-3 card p-3 border rounded-3">
											<div className="px-0 card-header border-0">
												<a className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 2 ? '' : ''}`} 
												   onClick={() => handleActiveItem(2)}>
													<h6 className="m-0">What features does <span className="text-primary">Infinia</span> offer?</h6>
													<span className="ms-auto arrow me-2">
														<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											{activeItem === 2 && (
												<div className="card-body px-0 mt-2">
													<p className="text-black-50 mb-0">We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.</p>
												</div>
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="ellipse-24 position-absolute" />
				<div className="ellipse-27 position-absolute" />
			</section>
		</>
	)
}
