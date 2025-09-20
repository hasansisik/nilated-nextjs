"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from "axios";
import { server } from "@/config";

interface ServiceItem {
	icon: string;
	title: string;
	description: string;
	iconBgColor?: string;
	link?: string;
}

export default function Services3({ previewData }: { previewData?: any }) {
	const [servicesData, setServicesData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Fetch services data from server if not provided as props
	useEffect(() => {
		const fetchServicesData = async () => {
			if (previewData) {
				setServicesData(previewData);
				setLoading(false);
				return;
			}

			try {
				const { data } = await axios.get(`${server}/other`);
				setServicesData(data.other);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching services data:", error);
				setLoading(false);
			}
		};

		fetchServicesData();
	}, [previewData]);

	if (loading) {
		return <div className="py-5 text-center">Yükleniyor...rvices information...</div>;
	}
	
	// Get services3 data with fallback to default values if not provided
	const data = servicesData?.services3 || {};
	
	// Destructure properties with fallbacks
	const {
		badge = "What we offers",
		badgeVisible = true,
		badgeBackgroundColor = "#f1f0fe",
		badgeTextColor = "#6342EC",
		title = "The Leading <span class=\"fw-bold\">IT Solutions <br class=\"d-lg-block d-none\" /> Company</span> For You",
		titleColor = "#111827",
		backgroundColor = "#ffffff",
		slideDelay = 4000,
		slideServices = [
			{
				icon: "/assets/imgs/service-3/icon-1.svg",
				title: "IT Consulting",
				description: "Beauis utter enim amet lacus ornare ullamcorper Praesent neque purus rhoncus.",
				iconBgColor: "#e9e3ff",
				link: "#"
			},
			{
				icon: "/assets/imgs/service-3/icon-2.svg",
				title: "Network Design",
				description: "Beauis utter enim amet lacus ornare ullamcorper Praesent neque purus rhoncus.",
				iconBgColor: "#d1f5ea",
				link: "#"
			},
			{
				icon: "/assets/imgs/service-3/icon-3.svg",
				title: "Software Dev",
				description: "Beauis utter enim amet lacus ornare ullamcorper Praesent neque purus rhoncus.",
				iconBgColor: "#fff5d3",
				link: "#"
			},
			{
				icon: "/assets/imgs/service-3/icon-4.svg",
				title: "IT Training",
				description: "Beauis utter enim amet lacus ornare ullamcorper Praesent neque purus rhoncus.",
				iconBgColor: "#d9f2ff",
				link: "#"
			}
		],
		showNavigation = true,
		navButtonColor = "#ffffff"
	} = data;

	// Create styles for dynamic theming
	const sectionStyle = {
		backgroundColor: backgroundColor,
	};

	const badgeStyle = {
		backgroundColor: badgeBackgroundColor,
	};

	const badgeTextStyle = {
		color: badgeTextColor,
	};

	const titleStyle = {
		color: titleColor,
	};

	const navButtonStyle = {
		backgroundColor: navButtonColor,
	};

	const getIconStyle = (service: ServiceItem) => {
		return {
			backgroundColor: service.iconBgColor || '#f1f0fe'
		};
	};

	const swiperOptions = {
		slidesPerView: 4,
		spaceBetween: 30,
		slidesPerGroup: 1,
		centeredSlides: false,
		loop: true,
		autoplay: {
			delay: slideDelay,
		},
		breakpoints: {
			1200: {
				slidesPerView: 4,
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
	}

	return (
		<>
			<section className="section-services-3 py-5" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						{badgeVisible && (
							<div 
								className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" 
								data-aos="zoom-in" 
								data-aos-delay={100}
								style={badgeStyle}
							>
								<span 
									className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase"
									style={badgeTextStyle}
								>
									{badge}
								</span>
							</div>
						)}
						<h3 
							className="ds-3 my-3 fw-regular" 
							style={titleStyle}
							dangerouslySetInnerHTML={{ __html: title }}
						/>
					</div>
					<div className="row mt-6 position-relative">
						<Swiper {...swiperOptions}
							className="swiper slider-2 px-1"
							modules={[Keyboard, Autoplay, Pagination, Navigation]}
						>
							<div className="swiper-wrapper">
								{slideServices.map((service: ServiceItem, index: number) => (
									<SwiperSlide className="swiper-slide" key={index}>
										<div className="card-service-4 position-relative bg-white p-6 border rounded-3 text-center shadow-1 hover-up mt-2">
											<div 
												className="icon-flip position-relative icon-shape icon-xxl rounded-3 me-5"
												style={getIconStyle(service)}
											>
												<div className="icon">
													<img src={service.icon} alt={service.title} />
												</div>
											</div>
											<h5 className="my-3">{service.title}</h5>
											<p className="mb-4">{service.description}</p>
											{service.link && (
												<div className="mt-2 mb-2">
													<Link href={service.link} className="btn btn-sm btn-outline-primary">
														Learn More
													</Link>
												</div>
											)}
										</div>
									</SwiperSlide>
								))}
							</div>
						</Swiper>
						{showNavigation && (
							<>
								<div className="swiper-button-prev d-none d-lg-flex shadow-2 position-absolute top-50 translate-middle-y ms-lg-7" style={navButtonStyle}>
									<i className="bi bi-arrow-left" />
								</div>
								<div className="swiper-button-next d-none d-lg-flex shadow-2 position-absolute top-50 translate-middle-y" style={navButtonStyle}>
									<i className="bi bi-arrow-right" />
								</div>
							</>
						)}
					</div>
				</div>
			</section>
		</>
	)
}
