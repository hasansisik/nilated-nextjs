"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  TextField,
  TextAreaField,
  LinkField,
  FormGroup,
  ImageUploadField,
  SectionTypeSelector,
  ToggleField,
  ColorField
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image } from "lucide-react";
import Cta4 from "@/components/sections/Cta4";
import Cta3 from "@/components/sections/Cta3";
import Cta1 from "@/components/sections/Cta1";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getCta, updateCta } from "@/redux/actions/ctaActions";
import { AppDispatch } from "@/redux/store";

// CTA type options
const ctaTypes = [
  { value: "cta1", label: "CTA 1" },
  { value: "cta3", label: "CTA 3" },
  { value: "cta4", label: "CTA 4" }
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;
  
  const activeComponent = data.activeCta || "cta4";
  
  // Apply direct preview styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .preview-container {
        transform: scale(0.8);
        transform-origin: top center;
        height: 100%;
        overflow: auto;
      }
      .py-5 {
        padding: 80px 0;
      }
      .editor-preview {
        overflow: auto;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="preview-container editor-preview">
      {activeComponent === "cta1" ? (
        <Cta1 previewData={data} />
      ) : activeComponent === "cta4" ? (
        <Cta4 previewData={data} />
      ) : (
        <Cta3 previewData={data} />
      )}
    </div>
  );
};

export default function CtaEditor() {
  const router = useRouter();
  const [ctaData, setCtaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);
  const dispatch = useDispatch<AppDispatch>();
  const { cta, loading } = useSelector((state: RootState) => state.cta);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Redux to fetch CTA data
        await dispatch(getCta());
    } catch (error) {
        console.error("Error fetching CTA data:", error);
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Update local state when CTA data changes in Redux
  useEffect(() => {
    if (cta) {
      setCtaData(cta);
    }
  }, [cta]);

  // Handler for changing CTA type
  const handleCtaTypeChange = (newType: string) => {
    if (!ctaData) return;
    
    setCtaData({
      ...ctaData,
      activeCta: newType
    });
  };

  // Function to handle iframe load failures
  useEffect(() => {
    if (!ctaData) return;
    
    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      if (event.data.type === "PREVIEW_READY" || event.data.type === "PREVIEW_UPDATED") {
        // Reset attempts and make sure we're using iframe
        iframeLoadAttempts.current = 0;
        setUseFallback(false);
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    // Set a timeout to check if iframe loads properly
    const timeoutId = setTimeout(() => {
      iframeLoadAttempts.current += 1;
      
      if (iframeLoadAttempts.current >= 3) {
        setUseFallback(true);
      }
    }, 3000);
    
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
    };
  }, [ctaData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;
    
    const activeCta = data.activeCta || "cta4";

    return (
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid grid-cols-4 m-2">
          <TabsTrigger value="layout" className="px-2">
            <Layout className="h-4 w-4" />
                </TabsTrigger>
          <TabsTrigger value="content" className="px-2">
            <Type className="h-4 w-4" />
                </TabsTrigger>
          <TabsTrigger value="style" className="px-2">
            <Settings className="h-4 w-4" />
                </TabsTrigger>
          <TabsTrigger value="media" className="px-2">
            <Image className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

        {/* Layout Tab */}
        <TabsContent value="layout" className="m-0 p-3 border-t">
          <SectionTypeSelector
            label="CTA Type"
            value={activeCta}
            options={ctaTypes}
            onChange={handleCtaTypeChange}
          />
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeCta === "cta1" ? (
            <Cta1ContentForm data={data.cta1 || {}} />
          ) : activeCta === "cta4" ? (
            <Cta4ContentForm data={data.cta4 || {}} />
          ) : (
            <Cta3ContentForm data={data.cta3 || {}} />
          )}
        </TabsContent>
        
        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t">
          <div className="text-xs text-gray-500">
            Style options will be implemented in future updates.
                        </div>
              </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t">
          {activeCta === "cta1" ? (
            <Cta1MediaForm data={data.cta1 || {}} />
          ) : activeCta === "cta4" ? (
            <Cta4MediaForm data={data.cta4 || {}} />
          ) : (
            <Cta3MediaForm data={data.cta3 || {}} />
          )}
              </TabsContent>
      </Tabs>
    );
  };

  // If still loading, return empty div
  if (isLoading || loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/cta"
      sectionType="cta"
      uploadHandler={uploadImageToCloudinary}
      initialData={ctaData}
      disableAutoSave={true}
      saveHandler={async (data) => {
        try {
          // Use Redux to update CTA data
          await dispatch(updateCta(data));
          return { success: true };
        } catch (error) {
          console.error("Error saving CTA data:", error);
          return { success: false, error: "Failed to save CTA data" };
        }
      }}
    >
      <EditorLayout
        title="CTA Editor"
        sidebarContent={
          <EditorSidebar>
            {renderSidebarContent}
          </EditorSidebar>
        }
      >
        {useFallback ? (
          <DirectPreview data={ctaData} />
        ) : (
          <SectionPreview previewUrl="/preview/cta" paramName="ctaData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// CTA 4 Content Form
function Cta4ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <ToggleField
          label="Show Heading"
          value={data?.heading?.visible !== false}
          path="cta4.heading.visible"
        />
        <TextField
          label="Small Heading"
          value={data?.heading?.small || ""}
          path="cta4.heading.small"
          placeholder="e.g. What We Do"
        />
        <ColorField
          label="Small Heading Color"
          value={data?.heading?.smallColor || "#6342EC"}
          path="cta4.heading.smallColor"
        />
        <TextField
          label="Title"
          value={data?.heading?.title || ""}
          path="cta4.heading.title"
          placeholder="e.g. Custom Services For Your Business"
        />
        <ColorField
          label="Title Color"
          value={data?.heading?.titleColor || "#111827"}
          path="cta4.heading.titleColor"
        />
      </FormGroup>
      
      <FormGroup title="Descriptions">
        <TextAreaField
          label="Description 1"
          value={data?.description || ""}
          path="cta4.description"
          placeholder="Enter first description"
        />
        <TextAreaField
          label="Description 2 (Optional)"
          value={data?.description2 || ""}
          path="cta4.description2"
          placeholder="Enter second description (optional - will appear on new line)"
        />
      </FormGroup>
      
      <FormGroup title="Features">
        <TextField
          label="Feature 1"
          value={data?.features?.[0] || ""}
          path="cta4.features.0"
          placeholder="e.g. Creative Ideas"
        />
        <TextField
          label="Feature 2"
          value={data?.features?.[1] || ""}
          path="cta4.features.1"
          placeholder="e.g. Web Development"
        />
        <TextField
          label="Feature 3"
          value={data?.features?.[2] || ""}
          path="cta4.features.2"
          placeholder="e.g. Digital Marketing"
        />
        <TextField
          label="Feature 4"
          value={data?.features?.[3] || ""}
          path="cta4.features.3"
          placeholder="e.g. App Development"
        />
      </FormGroup>
      
      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttons?.primary?.visible !== false}
          path="cta4.buttons.primary.visible"
        />
        <TextField
          label="Text"
          value={data?.buttons?.primary?.text || ""}
          path="cta4.buttons.primary.text"
          placeholder="e.g. Get Free Quote"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.primary?.link || ""}
          path="cta4.buttons.primary.link"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.primary?.backgroundColor || ""}
          path="cta4.buttons.primary.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.primary?.textColor || "#FFFFFF"}
          path="cta4.buttons.primary.textColor"
        />
      </FormGroup>
      
      <FormGroup title="Secondary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttons?.secondary?.visible !== false}
          path="cta4.buttons.secondary.visible"
        />
        <TextField
          label="Text"
          value={data?.buttons?.secondary?.text || ""}
          path="cta4.buttons.secondary.text"
          placeholder="e.g. How We Work"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.secondary?.link || ""}
          path="cta4.buttons.secondary.link"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.secondary?.backgroundColor || "transparent"}
          path="cta4.buttons.secondary.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.secondary?.textColor || ""}
          path="cta4.buttons.secondary.textColor"
        />
      </FormGroup>
      
      <FormGroup title="Video Settings">
        <TextField
          label="Button Text"
          value={data?.videoGuide?.buttonText || ""}
          path="cta4.videoGuide.buttonText"
          placeholder="e.g. Video"
        />
        <TextField
          label="Video ID"
          value={data?.videoGuide?.videoId || ""}
          path="cta4.videoGuide.videoId"
          placeholder="e.g. YouTube"
        />
      </FormGroup>
    </div>
  );
}

// CTA 3 Content Form
function Cta3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Tag & Title">
        <ToggleField
          label="Show Tag"
          value={data?.tagVisible !== false}
          path="cta3.tagVisible"
        />
        <TextField
          label="Tag Text"
          value={data?.tag || ""}
          path="cta3.tag"
          placeholder="e.g. Our History"
        />
        <ColorField
          label="Tag Background Color"
          value={data?.tagBackgroundColor || "#f1f0fe"}
          path="cta3.tagBackgroundColor"
        />
        <ColorField
          label="Tag Text Color"
          value={data?.tagTextColor || "#6342EC"}
          path="cta3.tagTextColor"
        />
        <TextField
          label="Title"
          value={data?.title || ""}
          path="cta3.title"
          placeholder="e.g. A Journey of Innovation and Growth"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="cta3.titleColor"
        />
        <TextField
          label="Subtitle"
          value={data?.subtitle || ""}
          path="cta3.subtitle"
          placeholder="e.g. Loved By Developers Trusted By Enterprises"
        />
        <ColorField
          label="Subtitle Color"
          value={data?.subtitleColor || "#6E6E6E"}
          path="cta3.subtitleColor"
        />
      </FormGroup>
      
      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="cta3.description"
        placeholder="Enter detailed description"
      />
      <ColorField
        label="Description Color"
        value={data?.descriptionColor || "#111827"}
        path="cta3.descriptionColor"
      />
      
      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttons?.primary?.visible !== false}
          path="cta3.buttons.primary.visible"
        />
        <TextField
          label="Text"
          value={data?.buttons?.primary?.text || ""}
          path="cta3.buttons.primary.text"
          placeholder="e.g. Get Started"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.primary?.link || ""}
          path="cta3.buttons.primary.link"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.primary?.backgroundColor || ""}
          path="cta3.buttons.primary.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.primary?.textColor || "#FFFFFF"}
          path="cta3.buttons.primary.textColor"
        />
      </FormGroup>
    </div>
  );
}

// CTA 4 Media Form
function Cta4MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Video Image"
        value={data?.videoGuide?.image || ""}
        path="cta4.videoGuide.image"
      />
      
      <ImageUploadField
        label="Vector Image"
        value={data?.vector?.image || ""}
        path="cta4.vector.image"
      />
    </div>
  );
}

// CTA 3 Media Form
function Cta3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="cta3.tagImage"
      />
    </div>
  );
}

// CTA 1 Content Form
function Cta1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge & Title">
        <ToggleField
          label="Show Badge"
          value={data?.badgeVisible !== false}
          path="cta1.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={data?.badge || ""}
          path="cta1.badge"
          placeholder="e.g. About Us"
        />
        <ColorField
          label="Badge Background Color"
          value={data?.badgeBackgroundColor || "#f1f0fe"}
          path="cta1.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={data?.badgeTextColor || "#6342EC"}
          path="cta1.badgeTextColor"
        />
        <TextAreaField
          label="Title (HTML)"
          value={data?.title || ""}
          path="cta1.title"
          placeholder="Enter title with HTML formatting"
        />
      </FormGroup>
      
      <FormGroup title="Social Media">
        <TextField
          label="Social Label"
          value={data?.socialLabel || ""}
          path="cta1.socialLabel"
          placeholder="e.g. Follow us:"
        />
      </FormGroup>
      
      <FormGroup title="Buttons">
        <ToggleField
          label="Show Primary Button"
          value={data?.buttons?.primary?.visible !== false}
          path="cta1.buttons.primary.visible"
        />
        <TextField
          label="Primary Button Text"
          value={data?.buttons?.primary?.text || ""}
          path="cta1.buttons.primary.text"
          placeholder="e.g. Contact Us"
        />
        <LinkField
          label="Primary Button Link"
          value={data?.buttons?.primary?.link || ""}
          path="cta1.buttons.primary.link"
        />
        <ColorField
          label="Primary Button Background"
          value={data?.buttons?.primary?.backgroundColor || ""}
          path="cta1.buttons.primary.backgroundColor"
        />
        <ColorField
          label="Primary Button Text Color"
          value={data?.buttons?.primary?.textColor || "#FFFFFF"}
          path="cta1.buttons.primary.textColor"
        />
        
        <div className="mt-4"></div>
        
        <ToggleField
          label="Show Secondary Button"
          value={data?.buttons?.secondary?.visible !== false}
          path="cta1.buttons.secondary.visible"
        />
        <TextField
          label="Secondary Button Text"
          value={data?.buttons?.secondary?.text || ""}
          path="cta1.buttons.secondary.text"
          placeholder="e.g. Learn More"
        />
        <LinkField
          label="Secondary Button Link"
          value={data?.buttons?.secondary?.link || ""}
          path="cta1.buttons.secondary.link"
        />
        <ColorField
          label="Secondary Button Background"
          value={data?.buttons?.secondary?.backgroundColor || "transparent"}
          path="cta1.buttons.secondary.backgroundColor"
        />
        <ColorField
          label="Secondary Button Text Color"
          value={data?.buttons?.secondary?.textColor || ""}
          path="cta1.buttons.secondary.textColor"
        />
      </FormGroup>
    </div>
  );
}

// CTA 1 Media Form
function Cta1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="cta1.tagImage"
      />
      
      <FormGroup title="Stars">
        <ImageUploadField
          label="Star 1"
          value={data?.star1 || ""}
          path="cta1.star1"
        />
        
        <ImageUploadField
          label="Star 2"
          value={data?.star2 || ""}
          path="cta1.star2"
        />
      </FormGroup>
      
      <ImageUploadField
        label="Background Ellipse"
        value={data?.bgEllipse || ""}
        path="cta1.bgEllipse"
      />
      
      <FormGroup title="Team Images">
        <p className="text-xs text-gray-500 mb-3">
          You can add up to 5 team member images. The first and last images will only be shown on larger screens.
        </p>
        
        {(data?.images || []).map((image: any, index: number) => (
          <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-md mb-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Image {index + 1}</Label>
              {/* Could add delete functionality here if needed */}
            </div>
            <ImageUploadField
              label="Image URL"
              value={image?.src || ""}
              path={`cta1.images.${index}.src`}
            />
            <TextField
              label="Alt Text"
              value={image?.alt || ""}
              path={`cta1.images.${index}.alt`}
              placeholder="e.g. Team member 1"
            />
          </div>
        ))}
      </FormGroup>
      
      <FormGroup title="Social Media Icons">
        <p className="text-xs text-gray-500 mb-3">
          Manage social media links and icons in the Settings tab.
        </p>
      </FormGroup>
    </div>
  );
}
