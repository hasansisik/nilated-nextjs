"use client"
import Marquee from "react-fast-marquee";
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getHero } from "@/redux/actions/heroActions"
import { AppDispatch } from "@/redux/store"

interface Hero3Props {
	previewData?: any;
}

export default function Hero3({ previewData }: Hero3Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { hero, loading } = useSelector((state: RootState) => state.hero)

	useEffect(() => {
		// Add styles for rotation animation
		const style = document.createElement('style');
		style.innerHTML = `
			.rotateme {
				animation: rotate 10s linear infinite;
			}
			@keyframes rotate {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}
		`;
		document.head.appendChild(style);
		
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	useEffect(() => {
		// Always trigger getHero() on component mount
		dispatch(getHero())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.hero3) {
			setData(previewData.hero3)
		} 
		// Otherwise use Redux data
		else if (hero && hero.hero3) {
			setData(hero.hero3)
		}
	}, [previewData, hero])

	// If data is still loading, show a loading indicator
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

	// Parse description to add line break if needed
	const descriptionWithBreak = () => {
		if (!data?.description) return "Access top-tier group mentoring plans and <br />exclusive professional benefits for your team.";
		
		// If description already has <br>, return as is
		if (data.description.includes("<br />")) return data.description;
		
		// Otherwise, try to split it at a natural point
		const words = data.description.split(" ");
		if (words.length > 6) {
			const firstPart = words.slice(0, Math.ceil(words.length/2)).join(" ");
			const secondPart = words.slice(Math.ceil(words.length/2)).join(" ");
			return `${firstPart} <br />${secondPart}`;
		}
		return data.description;
	}

	// Define image style constraints
	const avatarImageStyle = {
		width: '57px',
		height: '57px',
		objectFit: 'cover' as 'cover'
	};

	const avatarIconStyle = {
		width: '69px',
		height: '69px',
		objectFit: 'contain' as 'contain'
	};

	const gridImageStyle = {
		width: '100%',
		height: 'auto',
		maxHeight: '333px',
		objectFit: 'cover' as 'cover'
	};

	return (
		<>
			<section className="section-hero-3 position-relative fix pt-5">
				<div className="container">
					<div className="row position-relative">
						<div className="col-lg-6 position-relative z-1 mb-5 mb-lg-0">
							<div className="text-start">
								{data?.badge?.visible !== false && (
									<div className="border-linear-1 rounded-pill d-inline-block mb-3" style={{borderColor: data?.badge?.borderColor || ''}}>
										<div className="rounded-pill fw-medium position-relative z-2 px-4 py-2" style={{
											backgroundColor: data?.badge?.backgroundColor || '#FFFFFF',
											background: data?.badge?.backgroundColor || '#FFFFFF',
											color: data?.badge?.textColor || '#6342EC'
										}}>
											{data?.badge?.text || "🚀 Free Lifetime Update"}
										</div>
									</div>
								)}
								<div className="d-flex align-items-center">
									<h3 className="ds-3 my-3 me-4 lh-1">
										{data?.title?.part1 || "Elevate your"}
									</h3>
									<div className="mt-3 d-none d-md-flex">
										{data?.avatarsVisible !== false && data?.avatars?.map((avatar: any, index: number) => (
											avatar.visible !== false && (
												<div key={index} className={`avt-hero ${index === 2 ? 'icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle' : ''}`}>
													{index !== 2 ? (
														<img 
															className="icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle" 
															src={avatar?.image || ""} 
															alt={avatar?.alt || "infinia"} 
															style={{
																...avatarImageStyle,
																borderColor: avatar?.borderColor || '', 
																backgroundColor: avatar?.backgroundColor || ''
															}} 
														/>
													) : (
														<img 
															src={avatar?.image || "/assets/imgs/hero-3/icon.svg"} 
															alt={avatar?.alt || "infinia"} 
															style={avatarIconStyle}
														/>
													)}
												</div>
											)
										)) || []}
									</div>
								</div>
								<h3 className="ds-3 lh-1 m-0">
									{data?.title?.part2 || "brand with Infinia."}
								</h3>
								<p className="fs-5 text-900 my-6" dangerouslySetInnerHTML={{ __html: descriptionWithBreak() }}>
								</p>
								<div className="d-flex flex-wrap gap-3">
									{data?.button?.visible !== false && (
										<Link 
											href={data?.button?.link || "#"} 
											className="btn btn-gradient d-flex align-items-center justify-content-between" 
											style={{
												backgroundColor: data?.button?.backgroundColor || '#6342EC',
												backgroundImage: data?.button?.backgroundColor ? 'none' : 'linear-gradient(90deg, #6342EC 0%, #8B6FE7 100%)',
												color: data?.button?.textColor || '#FFFFFF'
											}}
										>
											<span>{data?.button?.text || "Get Free Quote"}</span>
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke={data?.button?.iconColor || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-white" d="M17 7L6.75 17.25" stroke={data?.button?.iconColor || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									)}
									{data?.buttons?.secondary?.visible !== false && (
										<Link 
											href={data?.buttons?.secondary?.link || "#"} 
											className="btn" 
											style={{
												backgroundColor: data?.buttons?.secondary?.backgroundColor || 'transparent',
												color: data?.buttons?.secondary?.textColor || '#111827',
												border: `1px solid ${data?.buttons?.secondary?.borderColor || '#d1d5db'}`
											}}
										>
											{data?.buttons?.secondary?.text || "Learn More"}
										</Link>
									)}
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-5 mt-lg-0">
							<div className="row">
								<div className="col-6 align-self-end">
									<div className="border-5 border-white border rounded-4 mb-4 d-block d-xl-none">
										<img 
											className="rounded-4" 
											src={data?.images?.image4 || "/assets/imgs/hero-3/img-4.png"} 
											alt="infinia" 
											style={gridImageStyle}
										/>
									</div>
									<div className="border-5 border-white border rounded-4">
										<img 
											className="rounded-4" 
											src={data?.images?.image3 || "/assets/imgs/hero-3/img-3.png"} 
											alt="infinia" 
											style={gridImageStyle}
										/>
									</div>
								</div>
								<div className="col-6 align-self-end">
									<div className="border-5 border-white border rounded-4 mb-4">
										<img 
											className="rounded-4" 
											src={data?.images?.image1 || "/assets/imgs/hero-3/img-1.png"} 
											alt="infinia" 
											style={gridImageStyle}
										/>
									</div>
									<div className="border-5 border-white border rounded-4">
										<img 
											className="rounded-4" 
											src={data?.images?.image2 || "/assets/imgs/hero-3/img-2.png"} 
											alt="infinia" 
											style={gridImageStyle}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
