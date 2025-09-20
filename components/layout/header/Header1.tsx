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

export default function Header1({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const dispatch = useDispatch();
	const { header } = useSelector((state: RootState) => state.header);
	const { user } = useSelector((state: RootState) => state.user);

	// Only fetch data if not already available
	useEffect(() => {
		if (!header) {
			dispatch(getHeader() as any);
		}
		if (!user?._id) {
			dispatch(getMyProfile() as any);
		}
	}, [dispatch, header, user])

	// Default header data when loading
	const defaultHeader = {
		logo: {
			src: "/assets/imgs/logo/logo.svg",
			alt: "Logo",
			text: ""
		},
		mainMenu: [],
		showDarkModeToggle: false,
		showActionButton: false,
		links: {
			freeTrialLink: {
				href: "#",
				text: "Get Started"
			}
		},
		buttonColor: "#3b71fe",
		buttonTextColor: "#ffffff",
		mobileMenuButtonColor: "transparent",
		socialLinks: []
	};

	// Use header data if available, otherwise use default
	const headerData = header || defaultHeader;

	return (
		<>
			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 z-9 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container">
						<Link className="navbar-brand d-flex main-logo align-items-center  gap-3" href="/">
							<img 
								src={headerData.logo.src} 
								alt={headerData.logo.alt} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{headerData.logo.text}</span>
						</Link>
						<Menu menuItems={headerData.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							{headerData.showDarkModeToggle && <ThemeSwitch />}
							
							{/* Profil Butonu - Kullanıcı giriş yapmışsa göster */}
							{user?._id && (
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
							)}
							
							{headerData.showActionButton && (
								<Link 
									href={headerData.links.freeTrialLink.href} 
									className="btn d-none d-md-block ms-2"
									style={{
										backgroundColor: headerData.buttonColor,
										color: headerData.buttonTextColor
									}}
								>
									{headerData.links.freeTrialLink.text}
								</Link>
							)}
							<div 
								className="burger-icon burger-icon-white border rounded-3" 
								onClick={handleMobileMenu}
								style={{ backgroundColor: headerData.mobileMenuButtonColor }}
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
					menuItems={headerData.mainMenu}
					socialLinks={headerData.socialLinks} 
				/>
			</header>
		</>
	)
}
