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

export default function Header4({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
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
			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 z-9 header-4 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`, 
						bottom: `${scroll ? "auto" : "0"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container">
						<Link className="navbar-brand d-flex main-logo align-items-center  gap-3" href="/">
							<img 
								src={header.logo.src} 
								alt={header.logo.alt} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{header.logo.text}</span>
						</Link>
						<Menu menuItems={header.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							{header.showDarkModeToggle && <ThemeSwitch />}
							
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
							
							<a className="menu-tigger bg-primary icon-shape icon-md rounded-2 d-none d-md-flex cursor-pointer ms-2" onClick={handleOffCanvas}>
								<img src="assets/imgs/logo/icon-menu.svg" alt="infinia" />
							</a>
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
