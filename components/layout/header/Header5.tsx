import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import Menu from '../Menu'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getHeader } from '@/redux/actions/headerActions'
import { getMyProfile } from '@/redux/actions/userActions'
import { User } from 'lucide-react'

export default function Header5({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const dispatch = useDispatch();
	const { header, loading } = useSelector((state: RootState) => state.header);
	const { user } = useSelector((state: RootState) => state.user);

	// Always fetch header data when component mounts
	useEffect(() => {
		dispatch(getHeader() as any);
		dispatch(getMyProfile() as any);
	}, [dispatch]) // Dependency on dispatch ensures this runs only when dispatch changes (effectively once)

	// Display loading state while header data is being fetched
	if (loading || !header) {
		return 
	}

	return (
		<>
			<div className="top-bar position-relative ">
				<div className="container-fluid" style={{ backgroundColor: header.topBarColor || '#3b71fe', color: header.topBarTextColor || '#ffffff' }}>
					<div className="container-fluid py-2 px-8">
						<div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
							<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
								{header.topBarItems && header.topBarItems.map((item: any, index: number) => {
									if (item.name === "Email" && item.content) {
										return (
											<a href={`mailto:${item.content}`} className="pe-4 d-none d-md-flex" key={index} style={{ color: header.topBarTextColor || '#ffffff' }}>
												<svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
													<path d="M3.9585 6.95834C3.9585 6.03786 4.70469 5.29167 5.62516 5.29167H14.3752C15.2957 5.29167 16.0418 6.03786 16.0418 6.95834V14.0417C16.0418 14.9622 15.2957 15.7083 14.3752 15.7083H5.62516C4.70469 15.7083 3.9585 14.9622 3.9585 14.0417V6.95834Z" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M4.5835 5.91667L10.0002 10.7083L15.4168 5.91667" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
												<span className="ps-1 fs-7">{item.content}</span>
											</a>
										)
									}
									if (item.name === "Address" && item.content) {
										return (
											<div className="location d-flex align-items-center" key={index} style={{ color: header.topBarTextColor || '#ffffff' }}>
												<svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
													<path d="M5.62516 16.5418H14.3751C15.2956 16.5418 16.0418 15.7957 16.0418 14.8752V8.6252L10.0001 4.45853L3.9585 8.6252V14.8752C3.9585 15.7957 4.7047 16.5418 5.62516 16.5418Z" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8.12476 13.6244C8.12476 12.7039 8.87098 11.9577 9.7914 11.9577H10.2081C11.1286 11.9577 11.8747 12.7039 11.8747 13.6244V16.5411H8.12476V13.6244Z" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
												<span className="ps-1 fs-7">{item.content}</span>
											</div>
										)
									}
									return null;
								})}
							</div>
							<div className="d-flex justify-content-center justify-content-lg-end align-items-center">
								<svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
									<path d="M10.0002 16.5417C13.3369 16.5417 16.0418 13.8367 16.0418 10.5C16.0418 7.16327 13.3369 4.45833 10.0002 4.45833C6.66344 4.45833 3.9585 7.16327 3.9585 10.5C3.9585 13.8367 6.66344 16.5417 10.0002 16.5417Z" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" />
									<path d="M10 7.16667V10.5L11.6667 12.1667" stroke={header.topBarTextColor || '#ffffff'} strokeWidth="1.5" />
								</svg>
								<span className="pe-3 ps-1 fs-7">{header.workingHours || "Mon-Fri: 10:00am - 09:00pm"}</span>
								{header.socialLinks && header.socialLinks.map((item: any, index: number) => {
									const socialIcons: { [key: string]: JSX.Element } = {
										Facebook: (
											<svg xmlns="http://www.w3.org/2000/svg" width={9} height={17} viewBox="0 0 9 17" fill="none">
												<path d="M8.22314 9.20334H5.91602V16.094H2.83984V9.20334H0.317383V6.37326H2.83984V4.18918C2.83984 1.72824 4.31641 0.343964 6.56201 0.343964C7.63867 0.343964 8.77686 0.559296 8.77686 0.559296V2.98947H7.51562C6.28516 2.98947 5.91602 3.72775 5.91602 4.52756V6.37326H8.65381L8.22314 9.20334Z" fill={header.topBarTextColor || '#ffffff'} />
											</svg>
										),
										Twitter: (
											<svg xmlns="http://www.w3.org/2000/svg" width={15} height={14} viewBox="0 0 15 14" fill="none">
												<path d="M11.2163 0.820312H13.3696L8.63232 6.26514L14.231 13.6172H9.86279L6.41748 9.15674L2.51074 13.6172H0.32666L5.40234 7.83398L0.0498047 0.820312H4.54102L7.61719 4.91162L11.2163 0.820312ZM10.4473 12.3252H11.647L3.89502 2.05078H2.60303L10.4473 12.3252Z" fill={header.topBarTextColor || '#ffffff'} />
											</svg>
										),
										LinkedIn: (
											<svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" fill="none">
												<path d="M13.7188 0.328537C14.2417 0.328537 14.7031 0.789963 14.7031 1.34367V13.1254C14.7031 13.6791 14.2417 14.1098 13.7188 14.1098H1.87549C1.35254 14.1098 0.921875 13.6791 0.921875 13.1254V1.34367C0.921875 0.789963 1.35254 0.328537 1.87549 0.328537H13.7188ZM5.07471 12.141V5.58879H3.04443V12.141H5.07471ZM4.05957 4.66594C4.70557 4.66594 5.22852 4.14299 5.22852 3.49699C5.22852 2.851 4.70557 2.29729 4.05957 2.29729C3.38281 2.29729 2.85986 2.851 2.85986 3.49699C2.85986 4.14299 3.38281 4.66594 4.05957 4.66594ZM12.7344 12.141V8.54192C12.7344 6.7885 12.3345 5.40422 10.2734 5.40422C9.28906 5.40422 8.6123 5.95793 8.33545 6.48088H8.30469V5.58879H6.3667V12.141H8.39697V8.91106C8.39697 8.04973 8.55078 7.21916 9.62744 7.21916C10.6733 7.21916 10.6733 8.20354 10.6733 8.94182V12.141H12.7344Z" fill={header.topBarTextColor || '#ffffff'} />
											</svg>
										),
										Behance: (
											<svg xmlns="http://www.w3.org/2000/svg" width={19} height={12} viewBox="0 0 19 12" fill="none">
												<path d="M7.65234 5.66483C8.9751 6.03397 9.62109 7.0491 9.62109 8.40262C9.62109 10.6175 7.77539 11.5711 5.77588 11.5711H0.515625V0.681427H5.65283C7.49854 0.681427 9.12891 1.20438 9.12891 3.38846C9.12891 4.46512 8.60596 5.17264 7.65234 5.66483ZM2.88428 2.52713V5.08035H5.31445C6.17578 5.08035 6.79102 4.71121 6.79102 3.78836C6.79102 2.77322 6.02197 2.52713 5.16064 2.52713H2.88428ZM5.46826 9.72537C6.42188 9.72537 7.22168 9.38699 7.22168 8.27957C7.22168 7.17215 6.57568 6.71072 5.49902 6.71072H2.88428V9.72537H5.46826ZM16.481 2.3118V1.23514H12.082V2.3118H16.481ZM18.2344 7.75662C18.2344 7.87967 18.2036 8.03348 18.2036 8.15652H12.5127C12.5127 9.41776 13.1895 10.156 14.4507 10.156C15.0967 10.156 15.958 9.81766 16.1733 9.1409H18.0806C17.4961 10.9251 16.2656 11.7864 14.3892 11.7864C11.8975 11.7864 10.3286 10.0945 10.3286 7.63358C10.3286 5.26492 11.959 3.44998 14.3892 3.44998C16.8501 3.44998 18.2344 5.41873 18.2344 7.75662ZM12.5127 6.77225H16.0503C15.958 5.72635 15.4043 5.11111 14.2969 5.11111C13.2817 5.11111 12.5742 5.75711 12.5127 6.77225Z" fill={header.topBarTextColor || '#ffffff'} />
											</svg>
										),
										Instagram: (
											<svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" fill="none">
												<path d="M7.5 0.328125C9.53711 0.328125 9.80566 0.328125 10.5791 0.359375C11.3418 0.390625 11.8223 0.515625 12.2402 0.703125C12.6797 0.890625 13.0342 1.14062 13.3887 1.50391C13.7324 1.85841 14.0137 2.29297 14.1855 2.76953C14.3623 3.17871 14.4980 3.6709 14.5293 4.4209C14.5605 5.2041 14.5605 5.46387 14.5605 7.5127C14.5605 9.55273 14.5605 9.82129 14.5293 10.5947C14.498 11.3574 14.373 11.8379 14.1855 12.2559C14.0146 12.7331 13.7324 13.1676 13.3887 13.5215C13.0342 13.8652 12.5996 14.1465 12.2402 14.3184C11.8223 14.4951 11.3301 14.6309 10.5791 14.6621C9.7959 14.6934 9.53613 14.6934 7.5 14.6934C5.45996 14.6934 5.1914 14.6934 4.41797 14.6621C3.6543 14.6309 3.17383 14.5059 2.75586 14.3184C2.3793 14.1475 1.94473 13.8652 1.5918 13.5215C1.24805 13.167 0.966797 12.7324 0.794922 12.2559C0.619141 11.8379 0.482422 11.3457 0.451172 10.5947C0.419922 9.8115 0.419922 9.55176 0.419922 7.5127C0.419922 5.47266 0.419922 5.2041 0.451172 4.43066C0.482422 3.66699 0.607422 3.18652 0.794922 2.76855C0.966797 2.29199 1.24805 1.85741 1.5918 1.50391C1.9375 1.16016 2.37207 0.878906 2.75586 0.707031C3.17383 0.53125 3.65527 0.394531 4.41797 0.363281C5.1914 0.332031 5.45117 0.332031 7.5 0.332031M7.5 0.328125C5.44043 0.328125 5.15234 0.328125 4.36719 0.359375C3.58203 0.390625 3.02051 0.515625 2.53125 0.695312C2.01953 0.886719 1.57617 1.15479 1.13281 1.59815C0.689453 2.0415 0.421875 2.48485 0.230469 2.99658C0.050781 3.47705 -0.0849609 4.05029 -0.116211 4.83544C-0.147461 5.62939 -0.147461 5.91747 -0.147461 7.97705C-0.147461 10.0366 -0.147461 10.3247 -0.116211 11.1099C-0.0849609 11.895 0.0390625 12.4565 0.230469 12.9458C0.421875 13.4575 0.689453 13.9009 1.13281 14.3442C1.57617 14.7876 2.01953 15.0674 2.53125 15.2471C3.01172 15.4268 3.58496 15.5626 4.36719 15.5939C5.15234 15.6251 5.44043 15.6251 7.5 15.6251C9.55957 15.6251 9.84766 15.6251 10.6328 15.5939C11.418 15.5626 11.9795 15.4377 12.4688 15.2471C12.9805 15.0674 13.4238 14.7876 13.8672 14.3442C14.3105 13.9009 14.5781 13.4575 14.7695 12.9458C14.9492 12.4653 15.085 11.8921 15.1162 11.1099C15.1475 10.3247 15.1475 10.0366 15.1475 7.97705C15.1475 5.91747 15.1475 5.62939 15.1162 4.84424C15.085 4.05908 14.9609 3.49756 14.7695 3.00829C14.5664 2.46631 14.2588 1.97705 13.8555 1.59815C13.4766 1.19385 13.0117 0.883789 12.4688 0.695312C11.9883 0.515625 11.4141 0.379883 10.6328 0.359375C9.84766 0.328125 9.55957 0.328125 7.5 0.328125Z" fill={header.topBarTextColor || '#ffffff'} />
												<path d="M7.5 3.65918C5.375 3.65918 3.67188 5.36231 3.67188 7.4873C3.67188 9.6123 5.375 11.3154 7.5 11.3154C9.625 11.3154 11.3281 9.6123 11.3281 7.4873C11.3281 5.36231 9.625 3.65918 7.5 3.65918ZM7.5 10.0029C6.0791 10.0029 4.98438 8.9082 4.98438 7.4873C4.98438 6.0664 6.0791 4.97168 7.5 4.97168C8.9209 4.97168 10.0156 6.0664 10.0156 7.4873C10.0156 8.9082 8.9209 10.0029 7.5 10.0029Z" fill={header.topBarTextColor || '#ffffff'} />
												<path d="M11.4653 4.4209C11.9786 4.4209 12.3946 4.00492 12.3946 3.49158C12.3946 2.97824 11.9786 2.56226 11.4653 2.56226C10.9519 2.56226 10.5359 2.97824 10.5359 3.49158C10.5359 4.00492 10.9519 4.4209 11.4653 4.4209Z" fill={header.topBarTextColor || '#ffffff'} />
											</svg>
										)
									};

									if (socialIcons[item.name]) {
										return (
											<a href={item.link} className="icon-shape icon-md" style={{ color: header.topBarTextColor || '#ffffff' }} key={index}>
												{socialIcons[item.name]}
											</a>
										)
									}
									return null;
								})}
							</div>
						</div>
					</div>
				</div>
			</div>

			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 border-bottom z-5 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`, 
						bottom: `${scroll ? "auto" : "0"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container-fluid px-lg-8">
						<Link className="navbar-brand d-flex main-logo align-items-center gap-3" href="/">
							<img 
								src={header.logo.src} 
								alt={header.logo.alt} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain',
								}} 
							/>
							<span>{header.logo.text}</span>
						</Link>
						<Menu menuItems={header.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							<div className="d-lg-flex align-items-center pe-8 d-none">
								{header.topBarItems && header.topBarItems.map((item: any, index: number) => {
									if (item.name === "Phone" && item.content) {
										return (
											<div key={index} className="d-flex flex-row align-items-center" >
												<a href={`tel:${item.content.replace(/\s+/g, '')}`} 
													className="icon-shape icon-lg rounded-circle mx-3"
													style={{ 
														backgroundColor: header.phoneIconBgColor || '#3b71fe'
													}}
												>
													<svg className="d-block" xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 25 25" fill="none">
														<path 
															d="M9.39286 5.25H6.56818C5.84017 5.25 5.25 5.84017 5.25 6.56818C5.25 13.8483 11.1517 19.75 18.4318 19.75C19.1598 19.75 19.75 19.1598 19.75 18.4318V15.6071L16.6429 13.5357L15.0317 15.1468C14.7519 15.4267 14.3337 15.5137 13.9821 15.3321C13.3858 15.024 12.4181 14.4452 11.4643 13.5357C10.4877 12.6045 9.91548 11.6011 9.62829 10.994C9.46734 10.6537 9.56052 10.2609 9.82669 9.99474L11.4643 8.35714L9.39286 5.25Z" 
															stroke={header.phoneIconColor || "#ffffff"}
															strokeWidth="1.5" 
															strokeLinecap="round" 
															strokeLinejoin="round" 
														/>
													</svg>
												</a>
												<div >
													<p className="mb-0 text-500 fs-8">{header.phoneQuestionText || "Have Any Questions?"}</p>
													<p className="mb-0 text-900 fw-bold">{item.content}</p>
												</div>
											</div>
										)
									}
									return null;
								})}
							</div>
							{header.showDarkModeToggle && <ThemeSwitch />}
							
							{/* Kullanıcı durumuna göre button'ları göster */}
							{user?._id ? (
								/* Kullanıcı giriş yapmışsa profil butonu göster */
								<Link 
									href="/profile" 
									className="ms-2 d-flex align-items-center justify-content-center bg-white rounded icon-shape border icon-md"
									style={{
										width: '32px',
										height: '32px',
										color: '#111827'
									}}
								>
									<User size={18} />
								</Link>
							) : (
								/* Kullanıcı giriş yapmamışsa action button'ları göster */
								<>
									{header.showActionButton && (
										<Link 
											href={header.links.freeTrialLink.href} 
											className="btn d-none d-md-block ms-2 "
											style={{
												backgroundColor: header.buttonColor || "#3b71fe",
												color: header.buttonTextColor || "#ffffff"
											}}
										>
											{header.links.freeTrialLink.text}
											
										</Link>
									)}
									
									{header.showSecondActionButton && (
										<Link 
											href={header.secondActionButtonLink || header.links?.secondActionButton?.href || "/register"} 
											className="btn d-none d-md-block ms-2 "
											style={{
												backgroundColor: header.secondButtonColor || "#ffffff",
												color: header.secondButtonTextColor || "#3b71fe",
												border: `1px solid ${header.secondButtonBorderColor || "#3b71fe"}`
											}}
										>
											{header.secondActionButtonText || header.links?.secondActionButton?.text || "Kayıt Ol"}
											
										</Link>
									)}
								</>
							)}
							<div 
								className="burger-icon burger-icon-white border rounded-3" 
								onClick={handleMobileMenu}
								style={{ backgroundColor: header.mobileMenuButtonColor || 'transparent' }}
							>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</nav>
				
				<OffCanvas handleOffCanvas={handleOffCanvas} isOffCanvas={isOffCanvas} />
				<Search isSearch={isSearch} handleSearch={handleSearch} />
				<MobileMenu 
					handleMobileMenu={handleMobileMenu} 
					isMobileMenu={isMobileMenu} 
					menuItems={header.mainMenu}
					socialLinks={header.socialLinks} 
				/>
			</header>

		</>
	)
}
