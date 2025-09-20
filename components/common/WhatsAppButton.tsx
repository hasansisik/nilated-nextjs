'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getGeneral } from '@/redux/actions/generalActions'

const WhatsAppButton = () => {
  const dispatch = useDispatch()
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: false,
    phoneNumber: '',
    message: ''
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
    if (general && general.whatsapp) {
      setWhatsappConfig({
        enabled: general.whatsapp.enabled !== undefined ? general.whatsapp.enabled : false,
        phoneNumber: general.whatsapp.phoneNumber || '',
        message: general.whatsapp.message || ''
      })
    }
  }, [general])

  // Don't render anything if disabled or no phone number
  if (!whatsappConfig.enabled || !whatsappConfig.phoneNumber) return null

  const handleWhatsAppClick = () => {
    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-header-active')
    if (mobileMenu && mobileMenu.classList.contains('sidebar-visible')) {
      mobileMenu.classList.remove('sidebar-visible')
    }

    const encodedMessage = encodeURIComponent(whatsappConfig.message)
    const whatsappUrl = `https://wa.me/${whatsappConfig.phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-lg"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  )
}

export default WhatsAppButton 