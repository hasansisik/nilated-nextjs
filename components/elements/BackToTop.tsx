'use client'
import { useEffect, useState } from "react"
import { Phone } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getGeneral } from '@/redux/actions/generalActions'

const PhoneButton = () => {
	const dispatch = useDispatch()
	const [phoneConfig, setPhoneConfig] = useState({
		enabled: true, // Varsayılan olarak aktif
		phoneNumber: '+90 532 123 45 67' // Örnek telefon numarası
	})

	// Get general settings from Redux store
	const { general, loading } = useSelector((state: RootState) => state.general)

	// Fetch general settings if not already loaded
	useEffect(() => {
		if (!general && !loading) {
			dispatch(getGeneral() as any)
		}
	}, [dispatch, general, loading])

	useEffect(() => {
		if (general && general.phone) {
			setPhoneConfig({
				enabled: general.phone.enabled !== undefined ? general.phone.enabled : true,
				phoneNumber: general.phone.phoneNumber || '+90 532 123 45 67'
			})
		}
	}, [general])

	// Don't render anything if disabled or no phone number
	if (!phoneConfig.enabled || !phoneConfig.phoneNumber) return null

	const handlePhoneClick = () => {
		// Close mobile menu if open
		const mobileMenu = document.querySelector('.mobile-header-active')
		if (mobileMenu && mobileMenu.classList.contains('sidebar-visible')) {
			mobileMenu.classList.remove('sidebar-visible')
		}

		// Clean phone number and create tel: link
		const cleanPhoneNumber = phoneConfig.phoneNumber.replace(/[^\d+]/g, '')
		window.open(`tel:${cleanPhoneNumber}`, '_self')
	}

	return (
		<button
			onClick={handlePhoneClick}
			className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg"
			aria-label="Telefon ile Ara"
		>
			<Phone className="w-7 h-7 text-white" />
		</button>
	)
}

export default PhoneButton
