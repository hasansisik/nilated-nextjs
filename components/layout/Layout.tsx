'use client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from "react"
import PhoneButton from '../elements/BackToTop'
import Breadcrumb from './Breadcrumb'
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Footer3 from './footer/Footer3'
import Footer4 from './footer/Footer4'
import Header1 from "./header/Header1"
import Header2 from './header/Header2'
import Header3 from './header/Header3'
import Header4 from './header/Header4'
import Header5 from './header/Header5'
import { useThemeConfig } from '@/lib/store/themeConfig'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface LayoutProps {
	headerStyle?: Number
	footerStyle?: Number
	children?: React.ReactNode
	breadcrumbTitle?: string
	useGlobalTheme?: boolean
	usePersistedTheme?: boolean
}


export default function Layout({ headerStyle: propHeaderStyle, footerStyle: propFooterStyle, breadcrumbTitle, children, useGlobalTheme = true, usePersistedTheme = false }: LayoutProps) {
	const { headerStyle: clientHeaderStyle, footerStyle: clientFooterStyle, setHeaderStyle, setFooterStyle } = useThemeConfig()
	const generalState = useSelector((state: RootState) => state.general)
	
	// Initialize header and footer styles based on props or global client state
	const [finalHeaderStyle, setFinalHeaderStyle] = useState<Number | undefined>(
		useGlobalTheme ? clientHeaderStyle : propHeaderStyle
	)
	const [finalFooterStyle, setFinalFooterStyle] = useState<Number | undefined>(
		useGlobalTheme ? clientFooterStyle : propFooterStyle
	)

	// Update from persisted Redux state if available and usePersistedTheme is true
	useEffect(() => {
		
		if (usePersistedTheme && generalState && generalState.general) {
			const { general } = generalState;
			
			if (general.theme?.headerStyle) {
				setFinalHeaderStyle(general.theme.headerStyle);
				// Update client state to keep it in sync
				if (useGlobalTheme) {
					setHeaderStyle(general.theme.headerStyle);
				}
			}
			
			if (general.theme?.footerStyle) {
				setFinalFooterStyle(general.theme.footerStyle);
				// Update client state to keep it in sync
				if (useGlobalTheme) {
					setFooterStyle(general.theme.footerStyle);
				}
			}
		}
	}, [generalState, usePersistedTheme, useGlobalTheme, setHeaderStyle, setFooterStyle])

	// Update final styles when client state changes (for real-time updates)
	useEffect(() => {
		if (useGlobalTheme) {
			setFinalHeaderStyle(clientHeaderStyle);
			setFinalFooterStyle(clientFooterStyle);
		}
	}, [clientHeaderStyle, clientFooterStyle, useGlobalTheme])


	const [scroll, setScroll] = useState<boolean>(false)
	const [hideHeader, setHideHeader] = useState<boolean>(false)
	const [lastScrollY, setLastScrollY] = useState<number>(0)
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState<boolean>(false)
	const handleMobileMenu = (): void => {
		setMobileMenu(!isMobileMenu)
		!isMobileMenu ? document.body.classList.add("mobile-menu-active") : document.body.classList.remove("mobile-menu-active")
	}

	// Search
	const [isSearch, setSearch] = useState<boolean>(false)
	const handleSearch = (): void => setSearch(!isSearch)

	// OffCanvas
	const [isOffCanvas, setOffCanvas] = useState<boolean>(false)
	const handleOffCanvas = (): void => setOffCanvas(!isOffCanvas)

	useEffect(() => {
		const WOW: any = require('wowjs');
		(window as any).wow = new WOW.WOW({
			live: false
		});

		// Initialize WOW.js
		(window as any).wow.init()

		AOS.init()

		const handleScroll = (): void => {
			const currentScrollY = window.scrollY
			const scrollCheck: boolean = currentScrollY > 100
			
			// Set scroll state for navbar-stick class
			if (scrollCheck !== scroll) {
				setScroll(scrollCheck)
			}
			
			// Hide header when scrolling down, show when scrolling up
			if (currentScrollY > lastScrollY && currentScrollY > 150) {
				setHideHeader(true) // Hide when scrolling down
			} else {
				setHideHeader(false) // Show when scrolling up or at top
			}
			
			setLastScrollY(currentScrollY)
		}

		document.addEventListener("scroll", handleScroll)

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scroll, lastScrollY])
	return (
		<><div id="top" />
			{!finalHeaderStyle && <Header5 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} />}
			{finalHeaderStyle == 1 ? <Header1 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} /> : null}
			{finalHeaderStyle == 2 ? <Header2 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} /> : null}
			{finalHeaderStyle == 3 ? <Header3 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} /> : null}
			{finalHeaderStyle == 4 ? <Header4 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} /> : null}
			{finalHeaderStyle == 5 ? <Header5 scroll={scroll} hideHeader={hideHeader} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} isOffCanvas={isOffCanvas} handleOffCanvas={handleOffCanvas} /> : null}


			<main>
				{breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

				{children}
			</main>

			{!finalFooterStyle && < Footer1 />}
			{finalFooterStyle == 1 ? < Footer1 /> : null}
			{finalFooterStyle == 2 ? < Footer2 /> : null}
			{finalFooterStyle == 3 ? < Footer3 /> : null}
			{finalFooterStyle == 4 ? < Footer4 /> : null}

			<PhoneButton />
		</>
	)
}
