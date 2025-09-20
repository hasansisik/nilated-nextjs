"use client";

import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PhoneButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { general } = useSelector((state: RootState) => state.general);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render if phone is disabled or no phone number
  if (!general?.phone?.enabled || !general?.phone?.phoneNumber) {
    return null;
  }

  const handleCall = () => {
    window.open(`tel:${general.phone.phoneNumber}`, '_self');
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleCall}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="Telefon ile ara"
          >
            <Phone className="w-7 h-7 text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default PhoneButton; 