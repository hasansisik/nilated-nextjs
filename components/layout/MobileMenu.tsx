'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getHeader } from '@/redux/actions/headerActions'

interface DropdownChild {
  _id: string;
  title: string;
  link: string;
  order: number;
}

interface DropdownMenu {
  _id: string;
  title: string;
  children: DropdownChild[];
  order: number;
}

interface MobileMenuProps {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  menuItems?: any[];
  dropdownMenus?: DropdownMenu[];
  socialLinks?: any[];
}

export default function MobileMenu({ isMobileMenu, handleMobileMenu, menuItems = [], dropdownMenus = [], socialLinks = [] }: MobileMenuProps) {
	const [isAccordion, setIsAccordion] = useState<number | null>(null)
	const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null)
	const dispatch = useDispatch()
	const { header } = useSelector((state: RootState) => state.header)

	// Fetch header data once when component mounts if not already available
	useEffect(() => {
		if (!header || !header.mainMenu) {
			dispatch(getHeader() as any)
		}
	}, [])

	const handleAccordion = (key: number) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	const handleDropdownToggle = (dropdownId: string) => {
		setIsDropdownOpen(prevState => prevState === dropdownId ? null : dropdownId)
	}

	const handleMenuItemClick = () => {
		// Close the mobile menu when a menu item is clicked
		handleMobileMenu()
	}

	return (
		<>
			{/* Mobile Menu Styles */}
			<style jsx>{`
				.mobile-menu .has-dropdown .dropdown-toggle {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 12px 0;
					text-decoration: none;
					color: inherit;
					border-bottom: 1px solid #eee;
					width: 100%;
				}
				
				.mobile-menu .has-dropdown .dropdown-toggle .dropdown-title {
					flex: 1;
					font-weight: normal;
				}
				
				.mobile-menu .has-dropdown .dropdown-toggle .dropdown-icon {
					transition: transform 0.3s ease;
					margin-left: auto;
					flex-shrink: 0;
				}
				
				.mobile-menu .has-dropdown .dropdown-toggle.active .dropdown-icon {
					transform: rotate(180deg);
				}
				
				.mobile-menu .has-dropdown .dropdown {
					padding-left: 20px;
					background-color: transparent;
					border-radius: 0;
					margin: 0;
					overflow: hidden;
					animation: slideDown 0.3s ease;
				}
				
				.mobile-menu .has-dropdown .dropdown li {
					border-bottom: 1px solid #eee;
				}
				
				.mobile-menu .has-dropdown .dropdown li:last-child {
					border-bottom: none;
				}
				
				.mobile-menu .has-dropdown .dropdown li a {
					padding: 12px 0;
					display: block;
					color: inherit;
					text-decoration: none;
					font-size: inherit;
					font-weight: inherit;
				}
				
				.mobile-menu .has-dropdown .dropdown li a:hover {
					color: #007bff;
				}
				
				@keyframes slideDown {
					from {
						opacity: 0;
						max-height: 0;
					}
					to {
						opacity: 1;
						max-height: 200px;
					}
				}
			`}</style>
			
			{/* Offcanvas search */}
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? 'sidebar-visible' : ''}`}>
				<div className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo">
						<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
							<img 
								src={header?.logo?.src || "/assets/imgs/template/favicon.svg"} 
								alt={header?.logo?.alt || "Logo"}
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{header?.logo?.text || ""}</span>
						</Link>
						<div 
							className={`burger-icon burger-icon-white border rounded-3 ${isMobileMenu ? 'burger-close' : ''}`} 
							onClick={handleMobileMenu}
							style={{ 
								backgroundColor: header?.mobileMenuButtonColor || 'transparent' 
							}}
						>
							<span className="burger-icon-top" />
							<span className="burger-icon-mid" />
							<span className="burger-icon-bottom" />
						</div>
					</div>
					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading ps-0">
										{/* Main Menu Items */}
										{menuItems && menuItems.length > 0 ? menuItems.map((item: any, index: number) => (
											<li key={item._id || index}>
												<Link href={item.link} onClick={handleMenuItemClick}>{item.name}</Link>
											</li>
										)) : header?.mainMenu?.map((item: any, index: number) => (
											<li key={item._id || index}>
												<Link href={item.link} onClick={handleMenuItemClick}>{item.name}</Link>
											</li>
										))}
										
										{/* Dropdown Menus */}
										{dropdownMenus && dropdownMenus.length > 0 ? dropdownMenus.map((dropdown: DropdownMenu, index: number) => (
											<li key={dropdown._id || `dropdown-${index}`} className="has-dropdown">
												<Link 
													href="#" 
													onClick={(e) => {
														e.preventDefault();
														handleDropdownToggle(dropdown._id);
													}}
													className={`dropdown-toggle ${isDropdownOpen === dropdown._id ? 'active' : ''}`}
												>
													<span className="dropdown-title">{dropdown.title}</span>
	
												</Link>
												{isDropdownOpen === dropdown._id && (
													<ul className="dropdown">
														{dropdown.children.map((child: DropdownChild, childIndex: number) => (
															<li key={child._id || `child-${childIndex}`}>
																<Link href={child.link} onClick={handleMenuItemClick}>
																	{child.title}
																</Link>
															</li>
														))}
													</ul>
												)}
											</li>
										)) : header?.dropdownMenus?.map((dropdown: DropdownMenu, index: number) => (
											<li key={dropdown._id || `dropdown-${index}`} className="has-dropdown">
												<Link 
													href="#" 
													onClick={(e) => {
														e.preventDefault();
														handleDropdownToggle(dropdown._id);
													}}
													className={`dropdown-toggle ${isDropdownOpen === dropdown._id ? 'active' : ''}`}
												>
													<span className="dropdown-title">{dropdown.title}</span>
													<span className="dropdown-icon">
														<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
															<path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
														</svg>
													</span>
												</Link>
												{isDropdownOpen === dropdown._id && (
													<ul className="dropdown">
														{dropdown.children.map((child: DropdownChild, childIndex: number) => (
															<li key={child._id || `child-${childIndex}`}>
																<Link href={child.link} onClick={handleMenuItemClick}>
																	{child.title}
																</Link>
															</li>
														))}
													</ul>
												)}
											</li>
										))}
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
