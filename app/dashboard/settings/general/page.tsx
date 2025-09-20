"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import {
  AlertCircle,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  CloudCog,
  Globe,
  Save,
  Moon,
  Sun,
  MessageCircle,
  CreditCard,
  Cookie,
  Phone
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { useThemeConfig } from "@/lib/store/themeConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getGeneral, updateGeneral } from "@/redux/actions/generalActions";
import { AppDispatch } from "@/redux/store";

export default function SiteSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const { headerStyle, footerStyle, setHeaderStyle, setFooterStyle } = useThemeConfig();
  const dispatch = useDispatch<AppDispatch>();
  const { general, loading, success } = useSelector((state: RootState) => state.general);

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Infinia",
    siteDescription: "Multi-purpose Bootstrap 5 Template",
    favicon: "",
    primaryColor: "#0088cc",
    secondaryColor: "#f7f7f7",
    accentColor: "#fd4a36",
    textColor: "#333333",
    darkPrimaryColor: "#1a1a1a",
    darkSecondaryColor: "#2d2d2d",
    darkAccentColor: "#fd4a36",
    darkTextColor: "#f5f5f5",
    theme: {
      headerStyle: 1,
      footerStyle: 1
    },
    cloudinary: {
      cloudName: "",
      apiKey: "",
      apiSecret: ""
    },
    iyzico: {
      apiKey: "",
      secretKey: "",
      uri: ""
    },
          whatsapp: {
        enabled: false,
        phoneNumber: "",
        message: ""
      },
      phone: {
        enabled: true,
        phoneNumber: "+905555555555"
      },
    cookieConsent: {
      enabled: true,
      title: "Gizliliğinize değer veriyoruz",
      description: "Çerezler ile deneyiminizi iyileştiriyoruz. \"Tümünü Kabul Et\" seçeneğine tıklayarak, çerezlerin kullanımına izin vermiş olursunuz.",
      modalTitle: "Çerez Tercihlerini Özelleştir",
      modalDescription: "Gezinmenize yardımcı olmak ve belirli işlevleri gerçekleştirmek için çerezleri kullanıyoruz.",
      necessaryTitle: "Gerekli",
      necessaryDescription: "Gerekli çerezler, güvenli giriş yapma veya tercih ayarlarınızı düzenleme gibi bu sitenin temel özelliklerini etkinleştirmek için gereklidir.",
      functionalTitle: "İşlevsel",
      functionalDescription: "İşlevsel çerezler, web sitesi içeriğini sosyal medya platformlarında paylaşma ve diğer üçüncü taraf özellikleri sağlar.",
      analyticsTitle: "Analitik",
      analyticsDescription: "Analitik çerezler, ziyaretçilerin nasıl gezindiğini anlamamıza yardımcı olur ve site performansı hakkında bilgi sağlar.",
      performanceTitle: "Performans",
      performanceDescription: "Performans çerezleri, web sitesinin performans ölçümlerini anlayarak kullanıcı deneyimini iyileştirmemize yardımcı olur.",
      moreInfoText: "Daha fazla göster",
      acceptAllText: "Tümünü Kabul Et",
      rejectAllText: "Tümünü Reddet",
      customizeText: "Özelleştir",
      savePreferencesText: "Tercihlerimi Kaydet",
      alwaysActiveText: "Aktif",
      iconColor: "#000000",
      buttonBgColor: "#cccccc",
      position: "bottom-left"
    },
    premium: {
      price: "",
      currency: "TL",
      ctaText: "HEMEN KATILIN",
      yearlyPriceText: "Üyelik ücreti yıllık 3.600 TL olarak belirlenmiştir.",
      description: "",
      features: [] as string[],
      leftTitle: "Bir defa yap, hep sat!",
      leftSubtitle: "Türkiye'nin en yetenekli yaratıcılarının bir araya geldiği Komünite'ye katılın!",
      rightTitle: "Komünite'ye üye olduğunuzda:"
    }
  });

  // Load general settings from API on component mount
  useEffect(() => {
    dispatch(getGeneral());
  }, [dispatch]);

  // Update local state when general settings are loaded
  useEffect(() => {
    if (general) {
      setSiteSettings({
        siteName: general.siteName || siteSettings.siteName,
        siteDescription: general.siteDescription || siteSettings.siteDescription,
        favicon: general.favicon || siteSettings.favicon,
        primaryColor: general.colors?.primaryColor || siteSettings.primaryColor,
        secondaryColor: general.colors?.secondaryColor || siteSettings.secondaryColor,
        accentColor: general.colors?.accentColor || siteSettings.accentColor,
        textColor: general.colors?.textColor || siteSettings.textColor,
        darkPrimaryColor: general.colors?.darkPrimaryColor || siteSettings.darkPrimaryColor,
        darkSecondaryColor: general.colors?.darkSecondaryColor || siteSettings.darkSecondaryColor,
        darkAccentColor: general.colors?.darkAccentColor || siteSettings.darkAccentColor,
        darkTextColor: general.colors?.darkTextColor || siteSettings.darkTextColor,
        theme: {
          headerStyle: general.theme?.headerStyle || headerStyle || 1,
          footerStyle: general.theme?.footerStyle || footerStyle || 1
        },
        cloudinary: {
          cloudName: general.cloudinary?.cloudName || siteSettings.cloudinary.cloudName,
          apiKey: general.cloudinary?.apiKey || siteSettings.cloudinary.apiKey,
          apiSecret: general.cloudinary?.apiSecret || siteSettings.cloudinary.apiSecret
        },
        iyzico: {
          apiKey: general.iyzico?.apiKey || siteSettings.iyzico.apiKey,
          secretKey: general.iyzico?.secretKey || siteSettings.iyzico.secretKey,
          uri: general.iyzico?.uri || siteSettings.iyzico.uri
        },
        whatsapp: {
          enabled: general.whatsapp?.enabled !== undefined ? general.whatsapp.enabled : siteSettings.whatsapp.enabled,
          phoneNumber: general.whatsapp?.phoneNumber || siteSettings.whatsapp.phoneNumber,
          message: general.whatsapp?.message || siteSettings.whatsapp.message
        },
        phone: {
          enabled: general.phone?.enabled !== undefined ? general.phone.enabled : siteSettings.phone.enabled,
          phoneNumber: general.phone?.phoneNumber || siteSettings.phone.phoneNumber
        },
        cookieConsent: {
          enabled: general.cookieConsent?.enabled !== undefined ? general.cookieConsent.enabled : siteSettings.cookieConsent.enabled,
          title: general.cookieConsent?.title || siteSettings.cookieConsent.title,
          description: general.cookieConsent?.description || siteSettings.cookieConsent.description,
          modalTitle: general.cookieConsent?.modalTitle || siteSettings.cookieConsent.modalTitle,
          modalDescription: general.cookieConsent?.modalDescription || siteSettings.cookieConsent.modalDescription,
          necessaryTitle: general.cookieConsent?.necessaryTitle || siteSettings.cookieConsent.necessaryTitle,
          necessaryDescription: general.cookieConsent?.necessaryDescription || siteSettings.cookieConsent.necessaryDescription,
          functionalTitle: general.cookieConsent?.functionalTitle || siteSettings.cookieConsent.functionalTitle,
          functionalDescription: general.cookieConsent?.functionalDescription || siteSettings.cookieConsent.functionalDescription,
          analyticsTitle: general.cookieConsent?.analyticsTitle || siteSettings.cookieConsent.analyticsTitle,
          analyticsDescription: general.cookieConsent?.analyticsDescription || siteSettings.cookieConsent.analyticsDescription,
          performanceTitle: general.cookieConsent?.performanceTitle || siteSettings.cookieConsent.performanceTitle,
          performanceDescription: general.cookieConsent?.performanceDescription || siteSettings.cookieConsent.performanceDescription,
          moreInfoText: general.cookieConsent?.moreInfoText || siteSettings.cookieConsent.moreInfoText,
          acceptAllText: general.cookieConsent?.acceptAllText || siteSettings.cookieConsent.acceptAllText,
          rejectAllText: general.cookieConsent?.rejectAllText || siteSettings.cookieConsent.rejectAllText,
          customizeText: general.cookieConsent?.customizeText || siteSettings.cookieConsent.customizeText,
          savePreferencesText: general.cookieConsent?.savePreferencesText || siteSettings.cookieConsent.savePreferencesText,
          alwaysActiveText: general.cookieConsent?.alwaysActiveText || siteSettings.cookieConsent.alwaysActiveText,
          iconColor: general.cookieConsent?.iconColor || siteSettings.cookieConsent.iconColor,
          buttonBgColor: general.cookieConsent?.buttonBgColor || siteSettings.cookieConsent.buttonBgColor,
          position: general.cookieConsent?.position || siteSettings.cookieConsent.position
        },
        premium: {
          price: general.premium?.price || siteSettings.premium.price,
          currency: general.premium?.currency || siteSettings.premium.currency,
          ctaText: general.premium?.ctaText || siteSettings.premium.ctaText,
          yearlyPriceText: general.premium?.yearlyPriceText || siteSettings.premium.yearlyPriceText,
          description: general.premium?.description || siteSettings.premium.description,
          features: general.premium?.features || siteSettings.premium.features,
          leftTitle: general.premium?.leftTitle || siteSettings.premium.leftTitle,
          leftSubtitle: general.premium?.leftSubtitle || siteSettings.premium.leftSubtitle,
          rightTitle: general.premium?.rightTitle || siteSettings.premium.rightTitle
        }
      });

      // Also update the global theme state
      if (general.theme?.headerStyle) {
        setHeaderStyle(general.theme.headerStyle);
      }
      if (general.theme?.footerStyle) {
        setFooterStyle(general.theme.footerStyle);
      }
    }
  }, [general]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("cloudinary.")) {
      const cloudinaryField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        cloudinary: {
          ...siteSettings.cloudinary,
          [cloudinaryField]: value
        }
      });
    } else if (name.startsWith("iyzico.")) {
      const iyzicoField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        iyzico: {
          ...siteSettings.iyzico,
          [iyzicoField]: value
        }
      });
    } else if (name.startsWith("whatsapp.")) {
      const whatsappField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        whatsapp: {
          ...siteSettings.whatsapp,
          [whatsappField]: value
        }
      });
    } else if (name.startsWith("phone.")) {
      const phoneField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        phone: {
          ...siteSettings.phone,
          [phoneField]: value
        }
      });
    } else if (name.startsWith("cookieConsent.")) {
      const cookieField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        cookieConsent: {
          ...siteSettings.cookieConsent,
          [cookieField]: value
        }
      });
    } else if (name.startsWith("premium.features.")) {
      const featureIndex = parseInt(name.split(".")[2]);
      const newFeatures = [...(siteSettings.premium?.features || [])];
      newFeatures[featureIndex] = value;
      setSiteSettings({
        ...siteSettings,
        premium: {
          ...siteSettings.premium,
          features: newFeatures
        }
      });
    } else if (name.startsWith("premium.")) {
      const premiumField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        premium: {
          ...siteSettings.premium,
          [premiumField]: value
        }
      });
    } else {
      setSiteSettings({
        ...siteSettings,
        [name]: value
      });
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFaviconUploading(true);
    
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setSiteSettings({
        ...siteSettings,
        favicon: imageUrl
      });
      toast.success("Favicon uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload favicon. Please try again.");
      console.error("Error uploading favicon:", error);
    } finally {
      setFaviconUploading(false);
    }
  };

  const handleWhatsappToggle = (enabled: boolean) => {
    setSiteSettings({
      ...siteSettings,
      whatsapp: {
        ...siteSettings.whatsapp,
        enabled
      }
    });
  };

  const handlePhoneToggle = (enabled: boolean) => {
    setSiteSettings({
      ...siteSettings,
      phone: {
        ...siteSettings.phone,
        enabled
      }
    });
  };

  const handleCookieConsentToggle = (enabled: boolean) => {
    setSiteSettings({
      ...siteSettings,
      cookieConsent: {
        ...siteSettings.cookieConsent,
        enabled
      }
    });
  };

  const handleCookiePositionChange = (position: 'bottom-left' | 'bottom-right') => {
    setSiteSettings({
      ...siteSettings,
      cookieConsent: {
        ...siteSettings.cookieConsent,
        position
      }
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Convert the site settings to the format expected by the API
      const payload = {
        siteName: siteSettings.siteName,
        siteDescription: siteSettings.siteDescription,
        favicon: siteSettings.favicon,
        cloudinary: {
          cloudName: siteSettings.cloudinary.cloudName,
          apiKey: siteSettings.cloudinary.apiKey,
          apiSecret: siteSettings.cloudinary.apiSecret
        },
        iyzico: {
          apiKey: siteSettings.iyzico.apiKey,
          secretKey: siteSettings.iyzico.secretKey,
          uri: siteSettings.iyzico.uri
        },
        whatsapp: {
          enabled: siteSettings.whatsapp.enabled,
          phoneNumber: siteSettings.whatsapp.phoneNumber,
          message: siteSettings.whatsapp.message
        },
        phone: {
          enabled: siteSettings.phone.enabled,
          phoneNumber: siteSettings.phone.phoneNumber
        },
        theme: {
          headerStyle: siteSettings.theme.headerStyle,
          footerStyle: siteSettings.theme.footerStyle
        },
        colors: {
          primaryColor: siteSettings.primaryColor,
          secondaryColor: siteSettings.secondaryColor,
          accentColor: siteSettings.accentColor,
          textColor: siteSettings.textColor,
          darkPrimaryColor: siteSettings.darkPrimaryColor,
          darkSecondaryColor: siteSettings.darkSecondaryColor,
          darkAccentColor: siteSettings.darkAccentColor,
          darkTextColor: siteSettings.darkTextColor
        },
        cookieConsent: {
          enabled: siteSettings.cookieConsent.enabled,
          title: siteSettings.cookieConsent.title,
          description: siteSettings.cookieConsent.description,
          modalTitle: siteSettings.cookieConsent.modalTitle,
          modalDescription: siteSettings.cookieConsent.modalDescription,
          necessaryTitle: siteSettings.cookieConsent.necessaryTitle,
          necessaryDescription: siteSettings.cookieConsent.necessaryDescription,
          functionalTitle: siteSettings.cookieConsent.functionalTitle,
          functionalDescription: siteSettings.cookieConsent.functionalDescription,
          analyticsTitle: siteSettings.cookieConsent.analyticsTitle,
          analyticsDescription: siteSettings.cookieConsent.analyticsDescription,
          performanceTitle: siteSettings.cookieConsent.performanceTitle,
          performanceDescription: siteSettings.cookieConsent.performanceDescription,
          moreInfoText: siteSettings.cookieConsent.moreInfoText,
          acceptAllText: siteSettings.cookieConsent.acceptAllText,
          rejectAllText: siteSettings.cookieConsent.rejectAllText,
          customizeText: siteSettings.cookieConsent.customizeText,
          savePreferencesText: siteSettings.cookieConsent.savePreferencesText,
          alwaysActiveText: siteSettings.cookieConsent.alwaysActiveText,
          iconColor: siteSettings.cookieConsent.iconColor,
          buttonBgColor: siteSettings.cookieConsent.buttonBgColor,
          position: siteSettings.cookieConsent.position as 'bottom-left' | 'bottom-right'
        },
        premium: {
          price: parseInt(siteSettings.premium.price) || 0,
          currency: siteSettings.premium.currency,
          ctaText: siteSettings.premium.ctaText,
          yearlyPriceText: siteSettings.premium.yearlyPriceText,
          description: siteSettings.premium.description,
          features: siteSettings.premium.features,
          leftTitle: siteSettings.premium.leftTitle,
          leftSubtitle: siteSettings.premium.leftSubtitle,
          rightTitle: siteSettings.premium.rightTitle
        }
      };

      // Update the settings using Redux
      await dispatch(updateGeneral(payload));
      
      // Apply the theme changes to the site
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
      document.documentElement.style.setProperty('--text-color', siteSettings.textColor);
      document.documentElement.style.setProperty('--dark-primary-color', siteSettings.darkPrimaryColor);
      document.documentElement.style.setProperty('--dark-secondary-color', siteSettings.darkSecondaryColor);
      document.documentElement.style.setProperty('--dark-accent-color', siteSettings.darkAccentColor);
      document.documentElement.style.setProperty('--dark-text-color', siteSettings.darkTextColor);
      
      toast.success("Site settings saved successfully!", {
        description: "Your settings have been updated. Header and footer styles will be applied to the entire site."
      });
    } catch (error) {
      toast.error("Failed to save settings. Please try again.", {
        description: "An error occurred while saving your changes."
      });
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeStyleChange = (type: 'headerStyle' | 'footerStyle', value: number) => {
    // Update local state
    setSiteSettings({
      ...siteSettings,
      theme: {
        ...siteSettings.theme,
        [type]: value
      }
    });
    
    // Update global client state for immediate preview
    if (type === 'headerStyle') {
      setHeaderStyle(value);
    } else {
      setFooterStyle(value);
    }
    
    // Show success toast
    toast.success(`${type === 'headerStyle' ? 'Header' : 'Footer'} style updated`, {
      description: `Global style changed to option ${value}`
    });
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Site Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button
            className="bg-black hover:bg-gray-800 text-white"
            size="sm"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Toaster richColors position="top-right" />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Site Settings</CardTitle>
            <CardDescription>
              Customize your site's appearance and functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-9 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Media</span>
                </TabsTrigger>
                <TabsTrigger value="premium" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Premium</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <CloudCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="iyzico" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">İyzico</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Telefon</span>
                </TabsTrigger>
                <TabsTrigger value="cookies" className="flex items-center gap-2">
                  <Cookie className="h-4 w-4" />
                  <span className="hidden sm:inline">Çerezler</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      placeholder="Enter site name"
                      value={siteSettings.siteName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      name="siteUrl"
                      placeholder="https://example.com"
                      defaultValue={typeof window !== 'undefined' ? window.location.origin : ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    placeholder="Brief description of your site"
                    rows={3}
                    value={siteSettings.siteDescription}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">Used for SEO and meta descriptions</p>
                </div>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-medium">Light Mode</h3>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="text"
                        value={siteSettings.primaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="text"
                        value={siteSettings.secondaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.accentColor }}
                      />
                      <Input
                        id="accentColor"
                        name="accentColor"
                        type="text"
                        value={siteSettings.accentColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.textColor }}
                      />
                      <Input
                        id="textColor"
                        name="textColor"
                        type="text"
                        value={siteSettings.textColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center gap-2 mb-6">
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-medium">Dark Mode</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="darkPrimaryColor">Primary Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkPrimaryColor }}
                      />
                      <Input
                        id="darkPrimaryColor"
                        name="darkPrimaryColor"
                        type="text"
                        value={siteSettings.darkPrimaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="darkSecondaryColor">Secondary Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkSecondaryColor }}
                      />
                      <Input
                        id="darkSecondaryColor"
                        name="darkSecondaryColor"
                        type="text"
                        value={siteSettings.darkSecondaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="darkAccentColor">Accent Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkAccentColor }}
                      />
                      <Input
                        id="darkAccentColor"
                        name="darkAccentColor"
                        type="text"
                        value={siteSettings.darkAccentColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="darkTextColor">Text Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkTextColor }}
                      />
                      <Input
                        id="darkTextColor"
                        name="darkTextColor"
                        type="text"
                        value={siteSettings.darkTextColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/40 mt-6">
                  <p className="text-sm mb-2">Preview</p>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="flex flex-col items-center p-3 gap-2 rounded-md" style={{ backgroundColor: siteSettings.primaryColor }}>
                      <div className="h-8 w-24 rounded-md" style={{ backgroundColor: siteSettings.secondaryColor }}></div>
                      <div className="h-4 w-16 rounded-md" style={{ backgroundColor: siteSettings.accentColor }}></div>
                    </div>
                    <div className="flex flex-col items-center p-3 gap-2 rounded-md" style={{ backgroundColor: siteSettings.darkPrimaryColor }}>
                      <div className="h-8 w-24 rounded-md" style={{ backgroundColor: siteSettings.darkSecondaryColor }}></div>
                      <div className="h-4 w-16 rounded-md" style={{ backgroundColor: siteSettings.darkAccentColor }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="headerStyle">Default Header Style</Label>
                    <select 
                      id="headerStyle"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={siteSettings.theme.headerStyle}
                      onChange={(e) => handleThemeStyleChange('headerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={`header-${num}`} value={num}>Header Style {num}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">This will be the default header style for all pages.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="footerStyle">Default Footer Style</Label>
                    <select 
                      id="footerStyle"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={siteSettings.theme.footerStyle}
                      onChange={(e) => handleThemeStyleChange('footerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={`footer-${num}`} value={num}>Footer Style {num}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">This will be the default footer style for all pages.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Media Settings */}
              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 border rounded-md flex items-center justify-center overflow-hidden bg-slate-50">
                        {siteSettings.favicon ? (
                          <img
                            src={siteSettings.favicon}
                            alt="Favicon"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label 
                          htmlFor="favicon-upload" 
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {faviconUploading ? "Uploading..." : "Upload Favicon"}
                        </Label>
                        <Input
                          id="favicon-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFaviconUpload}
                          disabled={faviconUploading}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended size: 32x32px or 64x64px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Premium Settings */}
              <TabsContent value="premium" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Premium Üyelik Ayarları</h3>
                  <p className="text-sm mb-4">
                    Premium üyelik fiyatı ve özelliklerini yapılandırın
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="premiumPrice">Premium Fiyatı</Label>
                        <Input
                          id="premiumPrice"
                          name="premium.price"
                          type="number"
                          placeholder="3600"
                          value={siteSettings.premium?.price || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="premiumCurrency">Para Birimi</Label>
                        <Input
                          id="premiumCurrency"
                          name="premium.currency"
                          placeholder="TL"
                          value={siteSettings.premium?.currency || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumCtaText">Buton Metni</Label>
                      <Input
                        id="premiumCtaText"
                        name="premium.ctaText"
                        placeholder="HEMEN KATILIN"
                        value={siteSettings.premium?.ctaText || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    

                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumYearlyText">Yıllık Fiyat Açıklaması</Label>
                      <Input
                        id="premiumYearlyText"
                        name="premium.yearlyPriceText"
                        placeholder="Üyelik ücreti yıllık 3.600 TL olarak belirlenmiştir."
                        value={siteSettings.premium?.yearlyPriceText || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumDescription">Detaylı Açıklama</Label>
                      <Textarea
                        id="premiumDescription"
                        name="premium.description"
                        placeholder="Premium üyelik hakkında detaylı açıklama"
                        rows={3}
                        value={siteSettings.premium?.description || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumLeftTitle">Sol Taraf Ana Başlık</Label>
                      <Input
                        id="premiumLeftTitle"
                        name="premium.leftTitle"
                        placeholder="Bir defa yap, hep sat!"
                        value={siteSettings.premium?.leftTitle || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumLeftSubtitle">Sol Taraf Alt Başlık</Label>
                      <Textarea
                        id="premiumLeftSubtitle"
                        name="premium.leftSubtitle"
                        placeholder="Türkiye'nin en yetenekli yaratıcılarının bir araya geldiği Komünite'ye katılın!"
                        rows={2}
                        value={siteSettings.premium?.leftSubtitle || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="premiumRightTitle">Sağ Taraf Başlık</Label>
                      <Input
                        id="premiumRightTitle"
                        name="premium.rightTitle"
                        placeholder="Komünite'ye üye olduğunuzda:"
                        value={siteSettings.premium?.rightTitle || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Premium Özellikler</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Her satıra bir özellik yazın. Özellik eklemek için "Özellik Ekle" butonunu kullanın.
                      </p>
                      
                      {(siteSettings.premium?.features || []).map((feature: string, index: number) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            name={`premium.features.${index}`}
                            value={feature}
                            onChange={handleInputChange}
                            placeholder={`Özellik ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = siteSettings.premium?.features?.filter((_, i) => i !== index) || [];
                              setSiteSettings({
                                ...siteSettings,
                                premium: {
                                  ...siteSettings.premium,
                                  features: newFeatures
                                }
                              });
                            }}
                          >
                            Kaldır
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = [...(siteSettings.premium?.features || []), ""];
                          setSiteSettings({
                            ...siteSettings,
                            premium: {
                              ...siteSettings.premium,
                              features: newFeatures
                            }
                          });
                        }}
                      >
                        Özellik Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Cloudinary Integration</h3>
                  <p className="text-sm mb-4">
                    Configure your Cloudinary account to handle media uploads
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cloudName">Cloud Name</Label>
                      <Input
                        id="cloudName"
                        name="cloudinary.cloudName"
                        placeholder="Enter Cloudinary cloud name"
                        value={siteSettings.cloudinary.cloudName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                          id="apiKey"
                          name="cloudinary.apiKey"
                          placeholder="Enter API key"
                          value={siteSettings.cloudinary.apiKey}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="apiSecret">API Secret</Label>
                        <Input
                          id="apiSecret"
                          name="cloudinary.apiSecret"
                          type="password"
                          placeholder="Enter API secret"
                          value={siteSettings.cloudinary.apiSecret}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 border-muted border p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <h4 className="font-medium">Security Notice</h4>
                      </div>
                      <p className="text-sm">
                        API credentials are stored securely in our database. Never expose these values in client-side code.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* iyzico Settings Tab */}
              <TabsContent value="iyzico" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">İyzico Payment Integration</h3>
                  <p className="text-sm mb-4">
                    Configure your İyzico account for payment processing
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="iyzicoApiKey">API Key</Label>
                      <Input
                        id="iyzicoApiKey"
                        name="iyzico.apiKey"
                        placeholder="Enter İyzico API Key"
                        value={siteSettings.iyzico.apiKey}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iyzicoSecretKey">Secret Key</Label>
                      <Input
                        id="iyzicoSecretKey"
                        name="iyzico.secretKey"
                        type="password"
                        placeholder="Enter İyzico Secret Key"
                        value={siteSettings.iyzico.secretKey}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iyzicoUri">API URI</Label>
                      <Input
                        id="iyzicoUri"
                        name="iyzico.uri"
                        placeholder="Enter İyzico API URI (e.g. https://sandbox-api.iyzipay.com)"
                        value={siteSettings.iyzico.uri}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Default: https://sandbox-api.iyzipay.com</p>
                    </div>
                    
                    <div className="bg-muted/50 border-muted border p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <h4 className="font-medium">Security Notice</h4>
                      </div>
                      <p className="text-sm">
                        API credentials are stored securely in our database. Never expose these values in client-side code.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* WhatsApp Settings */}
              <TabsContent value="whatsapp" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">WhatsApp Support Button</h3>
                  <p className="text-sm mb-4">
                    Configure the WhatsApp support button that appears on your website
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsapp-enabled" className="text-base">Enable WhatsApp Support</Label>
                        <p className="text-sm text-muted-foreground">Show a WhatsApp support button on your website</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="whatsapp-enabled"
                          checked={siteSettings.whatsapp.enabled}
                          onChange={(e) => handleWhatsappToggle(e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <Label htmlFor="whatsapp-enabled" className="cursor-pointer">
                          {siteSettings.whatsapp.enabled ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsappPhone">WhatsApp Phone Number</Label>
                      <Input
                        id="whatsappPhone"
                        name="whatsapp.phoneNumber"
                        placeholder="Enter phone number with country code (e.g. +1234567890)"
                        value={siteSettings.whatsapp.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Include the country code with + symbol</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsappMessage">Default Message</Label>
                      <Textarea
                        id="whatsappMessage"
                        name="whatsapp.message"
                        placeholder="Hello, I would like to inquire about your services."
                        rows={3}
                        value={siteSettings.whatsapp.message}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">This message will be pre-filled when users click the WhatsApp button</p>
                    </div>
                    
                    <div className="bg-green-50 border-green-200 border p-4 rounded-md mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-700">Preview</h4>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">WhatsApp Support</p>
                          <p className="text-sm text-muted-foreground">{siteSettings.whatsapp.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-md mt-3 text-sm border">
                        {siteSettings.whatsapp.message}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Phone Settings */}
              <TabsContent value="phone" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Telefon Arama Butonu</h3>
                  <p className="text-sm mb-4">
                    Web sitenizde görünen telefon arama butonunu yapılandırın
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="phone-enabled" className="text-base">Telefon Butonunu Etkinleştir</Label>
                        <p className="text-sm text-muted-foreground">Web sitenizde telefon arama butonu göster</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="phone-enabled"
                          checked={siteSettings.phone.enabled}
                          onChange={(e) => handlePhoneToggle(e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <Label htmlFor="phone-enabled" className="cursor-pointer">
                          {siteSettings.phone.enabled ? "Etkin" : "Devre Dışı"}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                      <Input
                        id="phoneNumber"
                        name="phone.phoneNumber"
                        placeholder="Telefon numarasını giriniz (örn: +905555555555)"
                        value={siteSettings.phone.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Ülke kodu ile birlikte + işareti ile başlayın</p>
                    </div>
                    
                    <div className="bg-green-50 border-green-200 border p-4 rounded-md mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-700">Önizleme</h4>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Telefon Arama</p>
                          <p className="text-sm text-muted-foreground">{siteSettings.phone.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Cookie Consent Settings */}
              <TabsContent value="cookies" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Çerez İzni Ayarları</h3>
                  <p className="text-sm mb-4">
                    Web sitenizde görünen çerez izni bildirimi ve ayarlarını yapılandırın
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="cookie-enabled" className="text-base">Çerez İzin Bildirimini Etkinleştir</Label>
                        <p className="text-sm text-muted-foreground">Web sitenizde çerez izni bildirimini göster</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="cookie-enabled"
                          checked={siteSettings.cookieConsent.enabled}
                          onChange={(e) => handleCookieConsentToggle(e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <Label htmlFor="cookie-enabled" className="cursor-pointer">
                          {siteSettings.cookieConsent.enabled ? "Etkin" : "Devre Dışı"}
                        </Label>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cookiePosition">İkon Konumu</Label>
                        <select
                          id="cookiePosition"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={siteSettings.cookieConsent.position}
                          onChange={(e) => handleCookiePositionChange(e.target.value as 'bottom-left' | 'bottom-right')}
                        >
                          <option value="bottom-left">Sol Alt</option>
                          <option value="bottom-right">Sağ Alt</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cookieIconColor">İkon Rengi</Label>
                        <div className="flex gap-2">
                          <div
                            className="h-10 w-10 rounded-md border"
                            style={{ backgroundColor: siteSettings.cookieConsent.iconColor }}
                          />
                          <Input
                            id="cookieIconColor"
                            name="cookieConsent.iconColor"
                            type="text"
                            value={siteSettings.cookieConsent.iconColor}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieButtonBgColor">İkon Arka Plan Rengi</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: siteSettings.cookieConsent.buttonBgColor }}
                        />
                        <Input
                          id="cookieButtonBgColor"
                          name="cookieConsent.buttonBgColor"
                          type="text"
                          value={siteSettings.cookieConsent.buttonBgColor}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="cookieTitle">Başlık</Label>
                      <Input
                        id="cookieTitle"
                        name="cookieConsent.title"
                        placeholder="Çerez izni başlığı"
                        value={siteSettings.cookieConsent.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieDescription">Açıklama</Label>
                      <Textarea
                        id="cookieDescription"
                        name="cookieConsent.description"
                        placeholder="Çerez izni açıklaması"
                        rows={3}
                        value={siteSettings.cookieConsent.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="cookieAcceptAllText">Tümünü Kabul Et Metni</Label>
                        <Input
                          id="cookieAcceptAllText"
                          name="cookieConsent.acceptAllText"
                          value={siteSettings.cookieConsent.acceptAllText}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cookieRejectAllText">Tümünü Reddet Metni</Label>
                        <Input
                          id="cookieRejectAllText"
                          name="cookieConsent.rejectAllText"
                          value={siteSettings.cookieConsent.rejectAllText}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cookieCustomizeText">Özelleştir Metni</Label>
                        <Input
                          id="cookieCustomizeText"
                          name="cookieConsent.customizeText"
                          value={siteSettings.cookieConsent.customizeText}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="cookieModalTitle">Modal Başlığı</Label>
                      <Input
                        id="cookieModalTitle"
                        name="cookieConsent.modalTitle"
                        value={siteSettings.cookieConsent.modalTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieModalDescription">Modal Açıklaması</Label>
                      <Textarea
                        id="cookieModalDescription"
                        name="cookieConsent.modalDescription"
                        rows={2}
                        value={siteSettings.cookieConsent.modalDescription}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cookieSavePreferencesText">Tercihleri Kaydet Metni</Label>
                        <Input
                          id="cookieSavePreferencesText"
                          name="cookieConsent.savePreferencesText"
                          value={siteSettings.cookieConsent.savePreferencesText}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cookieMoreInfoText">Daha Fazla Göster Metni</Label>
                        <Input
                          id="cookieMoreInfoText"
                          name="cookieConsent.moreInfoText"
                          value={siteSettings.cookieConsent.moreInfoText}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <h4 className="font-medium">Çerez Kategorileri</h4>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cookieNecessaryTitle">Gerekli Başlık</Label>
                        <Input
                          id="cookieNecessaryTitle"
                          name="cookieConsent.necessaryTitle"
                          value={siteSettings.cookieConsent.necessaryTitle}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cookieAlwaysActiveText">Her Zaman Aktif Metni</Label>
                        <Input
                          id="cookieAlwaysActiveText"
                          name="cookieConsent.alwaysActiveText"
                          value={siteSettings.cookieConsent.alwaysActiveText}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieNecessaryDescription">Gerekli Açıklama</Label>
                      <Textarea
                        id="cookieNecessaryDescription"
                        name="cookieConsent.necessaryDescription"
                        rows={2}
                        value={siteSettings.cookieConsent.necessaryDescription}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieFunctionalTitle">İşlevsel Başlık</Label>
                      <Input
                        id="cookieFunctionalTitle"
                        name="cookieConsent.functionalTitle"
                        value={siteSettings.cookieConsent.functionalTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieFunctionalDescription">İşlevsel Açıklama</Label>
                      <Textarea
                        id="cookieFunctionalDescription"
                        name="cookieConsent.functionalDescription"
                        rows={2}
                        value={siteSettings.cookieConsent.functionalDescription}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieAnalyticsTitle">Analitik Başlık</Label>
                      <Input
                        id="cookieAnalyticsTitle"
                        name="cookieConsent.analyticsTitle"
                        value={siteSettings.cookieConsent.analyticsTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookieAnalyticsDescription">Analitik Açıklama</Label>
                      <Textarea
                        id="cookieAnalyticsDescription"
                        name="cookieConsent.analyticsDescription"
                        rows={2}
                        value={siteSettings.cookieConsent.analyticsDescription}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookiePerformanceTitle">Performans Başlık</Label>
                      <Input
                        id="cookiePerformanceTitle"
                        name="cookieConsent.performanceTitle"
                        value={siteSettings.cookieConsent.performanceTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookiePerformanceDescription">Performans Açıklama</Label>
                      <Textarea
                        id="cookiePerformanceDescription"
                        name="cookieConsent.performanceDescription"
                        rows={2}
                        value={siteSettings.cookieConsent.performanceDescription}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="bg-blue-50 border-blue-200 border p-4 rounded-md mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Cookie className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-700">Önizleme</h4>
                      </div>
                      
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="bg-white p-4 rounded-md border shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Cookie className="h-4 w-4 text-blue-600" />
                            <p className="font-medium">{siteSettings.cookieConsent.title}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{siteSettings.cookieConsent.description}</p>
                          <div className="flex gap-2">
                            <div className="px-3 py-1 text-xs border rounded">{siteSettings.cookieConsent.customizeText}</div>
                            <div className="px-3 py-1 text-xs border rounded">{siteSettings.cookieConsent.rejectAllText}</div>
                            <div className="px-3 py-1 text-xs text-white bg-blue-600 rounded">{siteSettings.cookieConsent.acceptAllText}</div>
                          </div>
                        </div>
                        
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mt-2"
                          style={{ 
                            backgroundColor: siteSettings.cookieConsent.buttonBgColor,
                            alignSelf: siteSettings.cookieConsent.position === 'bottom-right' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <Cookie className="w-6 h-6" style={{ color: siteSettings.cookieConsent.iconColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 