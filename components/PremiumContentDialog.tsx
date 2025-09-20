"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getMyProfile } from "@/redux/actions/userActions";
import { getGeneral } from "@/redux/actions/generalActions";
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const PremiumContentDialog = ({
  isOpen,
  onClose,
  title = "Premium İçerik",
}: PremiumContentDialogProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { general } = useSelector((state: RootState) => state.general);

  // Load user profile and general settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getMyProfile());
      dispatch(getGeneral());
    }
  }, [dispatch, isOpen]);

  // Premium user check - exact comparison
  const isPremiumUser = isAuthenticated && user?.isPremium === true;

  // Close dialog if user is premium
  if (isPremiumUser) {
    if (isOpen) {
      onClose();
    }
    return null;
  }

  const handleCheckout = () => {
    onClose();
    router.push("/odeme");
  };

  // Dynamic premium configuration with fallbacks
  const premiumConfig = {
    price: general?.premium?.price || 3600,
    currency: general?.premium?.currency || "TL",
    features: general?.premium?.features || [
      "Her ay kapsamını genişlettiğimiz eğitim içeriklerine",
      "Türkiye'nin en büyük yaratıcı topluluğuna erişime",
      "Katma Değer Fonu'na başvurma hakkına"
    ],
    ctaText: general?.premium?.ctaText || "HEMEN KATILIN",
    yearlyPriceText: general?.premium?.yearlyPriceText || "Üyelik ücreti yıllık 3.600 TL olarak belirlenmiştir.",
    description: general?.premium?.description || "Komünite, sunduğu eğitimler, birlikte çalıştığı uzmanlar, sunduğu topluluk öğrenimi fırsatı, üyelerine sağladığı her türlü içerik ve indirimlerden dolayı sadece yıllık olarak ücretlendirilmektedir.",
    leftTitle: general?.premium?.leftTitle || "Bir defa yap, hep sat!",
    leftSubtitle: general?.premium?.leftSubtitle || "Türkiye'nin en yetenekli yaratıcılarının bir araya geldiği Komünite'ye katılın!",
    rightTitle: general?.premium?.rightTitle || "Komünite'ye üye olduğunuzda:"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[85vw] max-w-none h-[75vh] p-0 gap-0 border-0 bg-transparent overflow-hidden"
        style={{ maxHeight: "75vh", maxWidth: "70vw" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
          {/* Left side - Orange gradient background */}
          <div className="bg-gradient-to-br from-orange-300 to-orange-500 p-8 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="space-y-4 z-10 max-w-lg">
              {premiumConfig.leftTitle && (
                <h1 className="text-2xl font-bold leading-tight text-black">
                  {premiumConfig.leftTitle}
                </h1>
              )}

              {premiumConfig.leftSubtitle && (
                <div className="space-y-3 text-sm leading-relaxed">
                  <p className="text-black">
                    {premiumConfig.leftSubtitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - White background */}
          <div className="bg-white p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {premiumConfig.rightTitle && (
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {premiumConfig.rightTitle}
                </h2>
              )}

              {premiumConfig.features && premiumConfig.features.length > 0 && (
                <div className="space-y-2 mb-5">
                  {premiumConfig.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <span className="text-gray-500 mr-2 mt-1 text-sm">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-sm rounded-2xl mb-3"
              >
                {premiumConfig.ctaText}
              </Button>

              <div className="text-center space-y-2">
                {premiumConfig.yearlyPriceText && (
                  <p className="text-sm font-bold text-gray-900">
                    {premiumConfig.yearlyPriceText}
                  </p>
                )}
                
                {premiumConfig.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {premiumConfig.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumContentDialog;
