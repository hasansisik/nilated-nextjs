"use client"
import Link from "next/link"
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllHizmetler } from "@/redux/actions/hizmetActions"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"
import { Loader2 } from "lucide-react"

interface Project2Props {
	previewData?: any;
}

// Function to convert title to slug
const slugify = (text: string) => {
	// Turkish character mapping
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'C',
		'ğ': 'g', 'Ğ': 'G',
		'ı': 'i', 'İ': 'I',
		'ö': 'o', 'Ö': 'O',
		'ş': 's', 'Ş': 'S',
		'ü': 'u', 'Ü': 'U'
	};
	
	// Replace Turkish characters
	let result = text.toString();
	for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
		result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
	}
	
	return result
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

export default function Project2({ previewData }: Project2Props) {
	const [data, setData] = useState<any>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { hizmetler, loading: hizmetlerLoading, error } = useSelector((state: RootState) => state.hizmet);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	useEffect(() => {
		// Fetch hizmetler if not provided
		dispatch(getAllHizmetler());
		
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [dispatch, previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.project2) {
			setData(previewData.project2);
		} 
		// Otherwise use Redux data
		else if (other && other.project2) {
			setData(other.project2);
		}
	}, [previewData, other]);
	
	if (hizmetlerLoading || otherLoading || !data) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		);
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#f8f9fa"
	};

	const titleStyle = {
		color: data.titleColor || "#333333"
	};

	const descriptionStyle = {
		color: data.descriptionColor || "#6E6E6E"
	};

	const subtitleStyle = {
		backgroundColor: data.subtitleVisible !== false ? `${data.subtitleBackgroundColor || "rgba(99, 66, 236, 0.1)"} !important` : "transparent",
		color: data.subtitleTextColor || "#6342EC"
	};

	const swiperOptions = {
		slidesPerView: 3,
		spaceBetween: 20,
		slidesPerGroup: 1,
		centeredSlides: false,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		breakpoints: {
			1200: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 1,
			},
			0: {
				slidesPerView: 1,
			},
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
		},
	}

	return (
		<>
			<section className="section-project-2 pt-120 pb-8" style={sectionStyle}>
				<div className="container">
					<div className="row mb-8">
						<div className="col-lg-6">
							{data.subtitleVisible !== false && (
								<div className="d-flex align-items-center justify-text-center border border-2 border-white d-inline-flex rounded-pill px-3 py-1" style={{
									backgroundColor: data.subtitleBackgroundColor || "rgba(99, 66, 236, 0.1)",
									color: data.subtitleTextColor || "#6342EC"
								}}>
									<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data.subtitle}</span>
								</div>
							)}
							<h3 className="ds-3 mt-3 mb-3" style={titleStyle}>{data.title}</h3>
							<p className="fs-5 fw-medium" style={descriptionStyle}>{data.description}</p>
						</div>
						<div className="col-lg-2 col-md-3 col-6 ms-auto align-self-end mb-lg-7 mt-lg-0 mt-4">
							<div className="position-relative z-0">
								<div className="swiper-button-prev shadow bg-white ms-lg-7">
									<i className="bi bi-arrow-left" />
								</div>
								<div className="swiper-button-next shadow bg-white">
									<i className="bi bi-arrow-right" />
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<Swiper {...swiperOptions}
							className="swiper slider-1 pt-2 pb-8"
							modules={[Keyboard, Autoplay, Pagination, Navigation]}
						>
							<div className="swiper-wrapper">
								{hizmetler && hizmetler.map((project) => (
									<SwiperSlide key={project._id || project.id} className="swiper-slide">
										<div className="text-center">
											<div className="zoom-img position-relative d-inline-block z-1" style={{ height: '480px', width: '100%' }}>
												<div className="rounded-3 fix" style={{ height: '480px', overflow: 'hidden' }}>
													<img 
														className="img-fluid w-100 h-100" 
														src={project.image} 
														alt="infinia" 
														style={{ objectFit: 'cover', objectPosition: 'center' }}
													/>
												</div>
												<Link href={`/${slugify(project.title)}`} className="card-team text-start rounded-3 position-absolute bottom-0 start-0 end-0 z-1 backdrop-filter w-auto p-4 m-4 hover-up">
													<p className="text-900">
														{(project.fullDescription || project.description)?.length > 125 
															? `${(project.fullDescription || project.description).substring(0, 125)}...` 
															: (project.fullDescription || project.description)
														}
													</p>
												</Link>
												<Link href={`/${slugify(project.title)}`} className="badge text-primary bg-white px-3 py-2 rounded-pill m-4 fs-7 position-absolute top-0 end-0 z-1">{project.tag || 'Hizmetler'}</Link>
											</div>
										</div>
									</SwiperSlide>
								))}
							</div>
						</Swiper>
					</div>
				</div>
			</section>
		</>
	)
}
