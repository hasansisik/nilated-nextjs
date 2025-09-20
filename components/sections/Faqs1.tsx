"use client"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFaq } from "@/redux/actions/faqActions"
import { AppDispatch } from "@/redux/store"

interface Faqs1Props {
	previewData?: any;
}

export default function Faqs1({ previewData }: Faqs1Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { faq, loading } = useSelector((state: RootState) => state.faq)
	
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0);

	const handleActiveItem = (index: any) => {
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
		if (previewData && previewData.faqs1) {
			setData(previewData.faqs1);
		} 
		// Otherwise use Redux data
		else if (faq && faq.faqs1) {
			setData(faq.faqs1);
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

	// Image style constraints
	const mainImageStyle = {
		width: '100%',
		height: 'auto',
		maxWidth: '583px',
		maxHeight: '789px',
		objectFit: 'cover' as 'cover'
	};

	const iconImageStyle = {
		width: '48px',
		height: '48px',
		objectFit: 'contain' as 'contain'
	};

	const backgroundImageStyle = {
		width: 'auto',
		height: 'auto',
		maxWidth: '1377px',
		maxHeight: '979px'
	};

	return (
		<>
			<section className="section-faqs-1 py-5 position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<div className="text-start position-relative d-inline-block mb-lg-0 mb-5">
								<img 
									className="rounded-4" 
									src={data.mainImage || "/assets/imgs/faqs-1/img-1.png"} 
									alt="infinia" 
									style={mainImageStyle}
								/>
								<div className="px-0 card-team rounded-4 position-absolute bottom-0 start-0 end-0 z-1 backdrop-filter w-auto px-5 py-8 m-5">
									{data.supportItems && data.supportItems.map((item: any, index: number) => (
										<div key={index} className="d-flex flex-column flex-md-row align-items-start gap-3 mb-4" data-aos="fade-zoom-in" data-aos-delay={index * 100}>
											<img 
												src={item.icon || `/assets/imgs/faqs-1/icon-${index + 1}.png`} 
												alt="infinia" 
												style={iconImageStyle}
											/>
											<div>
												<h6 className="m-0">{item.title}</h6>
												<p className="m-0">{item.description}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-5">
							<h3 className="ds-3" data-aos="fade-up" data-aos-delay={0} style={{ color: data.heading?.titleColor || "#111827" }}>
								{data.heading?.title || "Frequently Asked Questions"}
							</h3>
							<p className="fs-5 my-4" data-aos="fade-up" data-aos-delay={0} style={{ color: data.heading?.descriptionColor || "#6E6E6E" }}>
								{data.heading?.description || "Find the answers to all of our most frequently asked questions"}
							</p>
							<div className="accordion">
								{data.questions && data.questions.map((faq: any, index: number) => (
									<div key={index} className="px-0 card p-3 border-0 border-bottom bg-transparent rounded-0" data-aos="fade-up" data-aos-delay={0}>
										<div className="px-0 card-header border-0">
											<a className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index+1 ? '' : ''}`} onClick={() => handleActiveItem(index+1)}>
												<span 
													className="icon-shape icon-xs fs-7 rounded-circle d-none d-md-block me-3 text-white"
													style={{ 
														backgroundColor: data.numberColor || "#6342EC",
														color: data.numberBgColor || "#ffffff"
													}}
												>
													{index+1}
												</span>
												<h6 className="m-0">{faq.question}</h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index+1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0">{faq.answer}</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<img 
					className="position-absolute top-0 end-0 z-0" 
					src={data.backgroundImage || "/assets/imgs/faqs-1/img-bg-line.png"} 
					alt="infinia" 
					style={backgroundImageStyle}
				/>
			</section>
		</>
	)
}
