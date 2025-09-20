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

export default function Footer1(props: FooterProps = {}) {
	const dispatch = useDispatch();
	const { footer } = useSelector((state: RootState) => state.footer);
	const [data, setData] = useState<any>(null);

	// Fetch footer data only if it's not already available
	useEffect(() => {
		if (Object.keys(props).length === 0 && !footer) {
			dispatch(getFooter() as any);
		}
	}, [dispatch, footer, props]);

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
	}, [props, footer]);

	// Default minimal footer data for when loading
	const defaultFooter = {
		logo: { src: "/assets/imgs/logo/logo-white.svg", alt: "logo", text: "Logo" },
		copyright: "Copyright © 2024. All Rights Reserved",
		description: "",
		socialLinks: [],
		columns: [],
		showSocialLinks: false
	};

	// Use available data or default placeholder
	const footerData = data || defaultFooter;

	return (
		<>
			<footer>
				<div className="section-footer position-relative">
					<div className="container-fluid bgft-1">
						<div className="container position-relative z-2">
							<div className="row py-90">
								<div className="col-lg-4 pe-10" data-aos="fade-zoom-in" data-aos-delay={100}>
									<Link href="/">
										<img 
											src={footerData.logo.src} 
											alt={footerData.logo.alt} 
											style={{ 
												width: '120px', 
												height: '40px', 
												objectFit: 'contain'
											}} 
										/>
									</Link>
									<p className="text-white fw-medium mt-3 mb-6 opacity-50">{footerData.description}</p>
									{footerData.showSocialLinks && footerData.socialLinks.length > 0 && (
										<div className="d-flex social-icons">
											{footerData.socialLinks.map((social: any, index: number) => (
												<Link key={social._id || index} href={social.link || "#"} className="text-white border border-end-0 border-light border-opacity-10 icon-shape icon-md">
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
									)}
								</div>
								<div className="col-lg-8">
									<div className="row justify-content-center">
										{footerData.columns.length > 0 ? (
											footerData.columns.map((column: any, colIndex: number) => {
												// Content-based column sizing
												const columnCount = footerData.columns.length;
												let colClass = "col-auto"; // Auto width based on content
												
												// Special handling for specific columns
												if (column.title === "HİZMETLER") {
													colClass = "col-lg-5 col-md-6 col-12"; // Wider for services
												} else if (column.title === "POLİTİKALAR") {
													colClass = "col-lg-3 col-md-6 col-12"; // Narrower for policies
												} else {
													// Default sizing for other columns
													if (columnCount === 1) {
														colClass = "col-lg-12 col-md-12 col-12";
													} else if (columnCount === 2) {
														colClass = "col-lg-6 col-md-6 col-12";
													} else if (columnCount === 3) {
														colClass = "col-lg-4 col-md-6 col-12";
													} else {
														colClass = "col-lg-3 col-md-6 col-12";
													}
												}
												
												return (
													<div key={column._id || `column-${colIndex}`} className={colClass} data-aos="fade-zoom-in" data-aos-delay={200 + (colIndex * 100)}>
													<h3 className="text-white opacity-50 fs-6 fw-black text-uppercase pb-3 pt-5">{column.title}</h3>
													<div className="d-flex flex-column align-items-start">
														{Array.isArray(column.links) && column.links.map((link: any, linkIndex: number) => (
															<Link 
																key={link._id || `link-${colIndex}-${linkIndex}`} 
																	className="hover-effect text-white mb-2 fw-medium" 
																href={link.link || "#"}
																	style={{ 
																		whiteSpace: 'nowrap',
																		display: 'block',
																		fontSize: '0.85rem',
																		lineHeight: '1.4'
																	}}
															>
																{link.name}
															</Link>
														))}
													</div>
												</div>
												);
											})
										) : (
											<div className="col-12 opacity-0">
												{/* Empty space instead of "No menu columns found" text */}
												&nbsp;
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="row text-center py-4 border-top border-white border-opacity-10">
								<div 
									className="text-white opacity-50 copyright-content" 
									data-aos="fade-zoom-in" 
									data-aos-delay={200}
									dangerouslySetInnerHTML={{ __html: footerData.copyright }}
									style={{
										'--copyright-link-color': '#ffffff',
										'--copyright-link-opacity': '0.8'
									} as React.CSSProperties}
								/>
							</div>
						</div>
					</div>
					<div className="position-absolute top-0 start-50 translate-middle-x z-0">
						<img src="/assets/imgs/footer-1/line-bg.png" alt="infinia" />
					</div>
					<div className="position-absolute top-0 start-0 z-0">
						<img src="/assets/imgs/footer-1/ellipse-left.png" alt="infinia" />
					</div>
					<div className="position-absolute top-0 end-0 z-0">
						<img src="/assets/imgs/footer-1/ellipse-right.png" alt="infinia" />
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
