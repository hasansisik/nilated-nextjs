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

export default function Footer4(props: FooterProps = {}) {
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
		contactItems: data.contactItems || {
			address: "0811 Erdman Prairie, Joaville CA",
			phone: "+01 (24) 568 900",
			email: "contact@infinia.com",
			hours: "Mon-Fri: 9am-5pm"
		},
		privacyLinks: Array.isArray(data.privacyLinks) ? data.privacyLinks : [],
		appLinks: Array.isArray(data.appLinks) ? data.appLinks : [],
		showPrivacyLinks: data.showPrivacyLinks || false,
		showAppLinks: data.showAppLinks || false,
		showSocialLinks: data.showSocialLinks !== false
	};

	return (
		<>
			<footer>
				<div className=" position-relative d-none d-md-flex">
					<div className="col-6 bg-primary py-md-6" />
					<div className="col-6 bg-primary-dark py-md-6" />
					<div className="container position-absolute top-50 start-50 translate-middle">
						<div className="row">
							<div className="col-6 d-lg-flex gap-5">
								<Link href="/#" className="d-flex mb-lg-0 mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M4.75 6.75L9.25 4.75V17.25L4.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.75 6.75L19.25 4.75V17.25L14.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.75 6.75L9.25 4.75V17.25L14.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{safeData.contactItems.address}</p>
								</Link>
								<Link href="/#" className="d-flex mb-lg-0 mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{safeData.contactItems.phone}</p>
								</Link>
							</div>
							<div className="col-6 d-lg-flex justify-content-end gap-5">
								<Link href="/#" className="d-flex mb-lg-0 mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M5.5 6.5L12 12.25L18.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{safeData.contactItems.email}</p>
								</Link>
								<Link href="/#" className="d-flex mb-lg-0 mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M12 8V12L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<circle cx={12} cy={12} r="7.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{safeData.contactItems.hours}</p>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="section-footer">
					<div className="container-fluid bg-6">
						<div className="container position-relative z-2">
							<div className="row py-90">
								<div className="col-lg-4 pe-10">
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
									<p className="text-white fw-medium mt-3 mb-6 opacity-50">{safeData.description}</p>
									{safeData.showSocialLinks && safeData.socialLinks.length > 0 && (
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
									)}
								</div>
								<div className="col-lg-8">
									<div className="row">
										{safeData.columns.length > 0 ? (
											safeData.columns.map((column: any, colIndex: number) => (
												<div key={column._id || `column-${colIndex}`} className="col-lg-3 col-md-4 col-6">
													<h3 className="text-white opacity-50 fs-6 fw-black text-uppercase pb-3 pt-5 pt-lg-0">{column.title}</h3>
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
										{safeData.showAppLinks && (
											<div className="col-lg-6 pt-5 pt-lg-0">
												<p className="text-white fw-black opacity-50 text-uppercase">App &amp; Payment</p>
												<p className="text-white fw-medium mt-3 mb-4 opacity-50">Download our Apps and get
													extra 15% discount on your first order…!</p>
												{safeData.appLinks.length > 0 ? (
													<>
														<div className="d-flex flex-wrap gap-2">
															{safeData.appLinks.slice(0, 2).map((app: any, index: number) => (
																<Link key={`app-${index}`} href={app.link || "#"}>
																	<img className="mb-2" src={app.image} alt={app.alt} />
																</Link>
															))}
														</div>
														<div className="d-flex flex-wrap gap-2">
															{safeData.appLinks.slice(2, 4).map((app: any, index: number) => (
																<Link key={`payment-${index}`} href={app.link || "#"}>
																	<img className="mb-2" src={app.image} alt={app.alt} />
																</Link>
															))}
														</div>
													</>
												) : (
													<div className="text-white opacity-50 mb-4">
														No app and payment links available
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="row text-center py-4 border-top border-white border-opacity-10">
								<div 
									className="text-white opacity-50 copyright-content"
									dangerouslySetInnerHTML={{ __html: safeData.copyright }}
									style={{
										'--copyright-link-color': '#ffffff',
										'--copyright-link-opacity': '0.8'
									} as React.CSSProperties}
								/>
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
