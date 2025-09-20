import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getFooter } from '@/redux/actions/footerActions'

// Define the interface for component props
interface FooterProps {
	logo?: {
		src: string;
		alt: string;
		text: string;
	};
	copyright?: string;
	description?: string;
	socialLinks?: any[];
	columns?: any[];
	contactItems?: {
		address: string;
		phone: string;
		email: string;
		hours: string;
	};
	showPrivacyLinks?: boolean;
	privacyLinks?: any[];
	showAppLinks?: boolean;
	appLinks?: any[];
	showInstagram?: boolean;
	showSocialLinks?: boolean;
	instagramPosts?: any[];
}

export default function Footer3(props: FooterProps = {}) {
	const dispatch = useDispatch();
	const { footer } = useSelector((state: RootState) => state.footer);
	const [data, setData] = useState<any>(null)

	// Fetch footer data only once when component mounts if not provided via props
	useEffect(() => {
		if (Object.keys(props).length === 0) {
			dispatch(getFooter() as any);
		}
	}, []);

	// Update local state when props or footer data from Redux change
	useEffect(() => {
		// If props are provided (from editor/preview), use them
		if (Object.keys(props).length > 0) {
			setData(props);
		} 
		// Otherwise use data from Redux store
		else if (footer) {
			setData(footer);
		}
	}, [props, footer])

	if (!data) {
		return <footer className="loading">Yükleniyor...oter...</footer>
	}

	// Ensure data has all required properties with fallbacks
	const safeData = {
		logo: data.logo || { src: "/assets/imgs/logo/logo-white.svg", alt: "logo", text: "Logo" },
		copyright: data.copyright || "Copyright © 2024. All Rights Reserved",
		description: data.description || "",
		socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
		columns: Array.isArray(data.columns) ? data.columns : [],
		privacyLinks: Array.isArray(data.privacyLinks) ? data.privacyLinks : [],
		appLinks: Array.isArray(data.appLinks) ? data.appLinks : [],
		showPrivacyLinks: data.showPrivacyLinks || false,
		showAppLinks: data.showAppLinks || false,
		showSocialLinks: data.showSocialLinks !== false
	};

	return (
		<>
			<footer>
				<div className="section-footer">
					<div className="container-fluid bgft-1">
						<div className=" container position-relative z-2">
							<div className="d-flex py-4 border-bottom border-white border-opacity-10 justify-content-between align-items-center">
								<div>
									<Link href="/">
										<img 
											src={safeData.logo.src} 
											alt={safeData.logo.alt} 
											style={{ 
												width: '120px', 
												height: '40px', 
												objectFit: 'contain'
											}} 
										/>
									</Link>
								</div>
								{safeData.showSocialLinks && safeData.socialLinks.length > 0 && (
									<div>
										<div className="d-flex social-icons">
											{safeData.socialLinks.map((social: any, index: number) => (
												<Link key={social._id || `social-${index}`} href={social.link || "#"} className="text-white border border-end-0 border-light border-opacity-10 icon-shape icon-md">
													{social.name === "Facebook" && (
														<svg xmlns="http://www.w3.org/2000/svg" width={10} height={17} viewBox="0 0 10 17" fill="none">
															<path d="M8.84863 9.20312H6.5415V16.0938H3.46533V9.20312H0.942871V6.37305H3.46533V4.18896C3.46533 1.72803 4.94189 0.34375 7.1875 0.34375C8.26416 0.34375 9.40234 0.559082 9.40234 0.559082V2.98926H8.14111C6.91064 2.98926 6.5415 3.72754 6.5415 4.52734V6.37305H9.2793L8.84863 9.20312Z" fill="white" />
														</svg>
													)}
													{social.name === "Twitter" && <i className="bi bi-twitter-x" />}
													{social.name === "LinkedIn" && <i className="bi bi-linkedin" />}
													{social.name === "Instagram" && <i className="bi bi-instagram" />}
													{social.name === "YouTube" && <i className="bi bi-youtube" />}
													{social.name === "Pinterest" && <i className="bi bi-pinterest" />}
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
							<div className="row py-90">
								{safeData.columns.length > 0 ? (
									safeData.columns.map((column: any, colIndex: number) => (
										<div key={column._id || `column-${colIndex}`} className="col-lg-3 col-md-6 col-6">
											<h3 className="text-white opacity-50 fs-6 fw-black text-uppercase pb-3 pt-lg-0 pt-5">{column.title}</h3>
											<div className="d-flex flex-column align-items-start">
												{Array.isArray(column.links) && column.links.map((link: any, linkIndex: number) => (
													<Link 
														key={link._id || `link-${colIndex}-${linkIndex}`} 
														className="hover-effect text-white mb-2 fw-medium fs-6" 
														href={link.link || "#"}
													>
														{link.name}
													</Link>
												))}
											</div>
										</div>
									))
								) : (
									<div className="col-12 text-center text-white opacity-50 py-2">
										No menu columns available
									</div>
								)}
							</div>
							{safeData.showAppLinks && (
								<div className="row">
									<div className="col-lg-12">
										<h3 className="text-white opacity-50 fs-6 fw-black text-uppercase mb-5 mt-5">apps & payment</h3>
										{safeData.appLinks.length > 0 ? (
											<div className="d-flex flex-column flex-md-row">
												<div className="me-md-5 mb-5 mb-md-0">
													<p className="text-white fw-bold fs-3 mb-2">On your mobile</p>
													<p className="text-white opacity-75 mb-4">Download our Apps and get extra 15% discount<br /> on your first order…!</p>
													<div className="d-flex">
														{safeData.appLinks[0] && (
															<Link href={safeData.appLinks[0].link || "#"} className="me-2 hover-up">
																<img src={safeData.appLinks[0].image} alt={safeData.appLinks[0].alt} />
															</Link>
														)}
														{safeData.appLinks[1] && (
															<Link href={safeData.appLinks[1].link || "#"} className="hover-up">
																<img src={safeData.appLinks[1].image} alt={safeData.appLinks[1].alt} />
															</Link>
														)}
													</div>
												</div>
												<div>
													<p className="text-white fw-bold fs-3 mb-2">100% Secure</p>
													<p className="text-white opacity-75 mb-4">We ensure secure payment with PEV</p>
													<div className="d-flex pb-50 flex-wrap">
														{safeData.appLinks.slice(2).map((payment: any, index: number) => (
															<Link key={`payment-${index}`} href={payment.link || "#"} className="me-2 mb-2 hover-up">
																<img src={payment.image} alt={payment.alt} />
															</Link>
														))}
													</div>
												</div>
											</div>
										) : (
											<div className="text-white opacity-50 mb-4">
												No app and payment links available
											</div>
										)}
									</div>
								</div>
							)}
							<div className="row">
								<div className="d-flex flex-md-row flex-column align-items-center justify-content-between bg-transparent py-4 border-top border-opacity-10">
									<div 
										className="text-white opacity-50 mb-3 mb-md-0 copyright-content"
										dangerouslySetInnerHTML={{ __html: safeData.copyright }}
										style={{
											'--copyright-link-color': '#ffffff',
											'--copyright-link-opacity': '0.8'
										} as React.CSSProperties}
									/>
									{safeData.showPrivacyLinks && (
										<div className="d-flex">
											{safeData.privacyLinks.length > 0 ? (
												safeData.privacyLinks.map((link: any, index: number) => (
													<Link key={link._id || `privacy-${index}`} href={link.link || "#"} className="link-hover-primary-light text-white me-3">
														{link.name}
													</Link>
												))
											) : (
												<span className="text-white opacity-50">No privacy links available</span>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
			{/* Copyright content styling */}
			<style jsx global>{`
				.copyright-content {
					position: relative;
					z-index: 10;
				}
				
				.copyright-content a {
					color: var(--copyright-link-color, #ffffff) !important;
					opacity: var(--copyright-link-opacity, 0.8);
					text-decoration: underline;
					transition: opacity 0.3s ease;
					cursor: pointer;
					pointer-events: auto;
					position: relative;
					z-index: 11;
					display: inline;
				}
				
				.copyright-content a:hover {
					opacity: 1 !important;
					text-decoration: underline;
				}
				
				.copyright-content a:active {
					opacity: 0.9 !important;
				}
				
				.copyright-content strong {
					font-weight: 600;
					color: inherit;
				}
				
				.copyright-content em {
					font-style: italic;
					color: inherit;
				}
				
				.copyright-content p {
					margin: 0;
					color: inherit;
				}
				
				.copyright-content * {
					color: inherit !important;
				}
			`}</style>
		</>
	)
}
