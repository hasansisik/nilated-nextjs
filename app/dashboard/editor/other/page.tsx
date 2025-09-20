"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider, useEditor } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TextField,
  TextAreaField,
  LinkField,
  FormGroup,
  ImageUploadField,
  SectionTypeSelector,
  ToggleField,
  ColorField,
  RichTextField,
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image } from "lucide-react";
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";
import Contact1 from "@/components/sections/Contact1";
import Services2 from "@/components/sections/Services2";
import Services5 from "@/components/sections/Services5";
import Project2 from "@/components/sections/Project2";
import Content1 from "@/components/sections/Content1";
import Content2 from "@/components/sections/Content2";
import Content3 from "@/components/sections/Content3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOther, updateOther } from "@/redux/actions/otherActions";
import { AppDispatch } from "@/redux/store";

// Add CSS styles for toggle switches
const toggleStyles = `
  .toggle-checkbox:checked {
    right: 0;
    border-color: #6342EC;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #6342EC;
  }
  .toggle-checkbox {
    right: 0;
    transition: all 0.3s;
    left: 0;
  }
  .toggle-label {
    transition: all 0.3s;
  }
`;

// Other component type options
const otherTypes = [
  { value: "blog1", label: "Blog 1" },
  { value: "blog2", label: "Blog 2" },
  { value: "blog3", label: "Blog 3" },
  { value: "blog5", label: "Blog 5" },
  { value: "services2", label: "Services 2" },
  { value: "services3", label: "Services 3" },
  { value: "services5", label: "Services 5" },
  { value: "team1", label: "Team 1" },
  { value: "project2", label: "Project 2" },
  { value: "contact1", label: "Contact 1" },
  { value: "content1", label: "Content 1" },
  { value: "content2", label: "Content 2" },
  { value: "content3", label: "Content 3" },
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;

  const activeComponent = data.activeOther || "blog1";

  // Apply direct preview styles
  useEffect(() => {
    const style = document.createElement("style");
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
      {activeComponent === "blog1" ? (
        <Blog1 previewData={data} />
      ) : activeComponent === "blog2" ? (
        <Blog2 previewData={data} />
      ) : activeComponent === "blog3" ? (
        <Blog3 previewData={data} />
      ) : activeComponent === "blog5" ? (
        <Blog5 previewData={data} />
      ) : activeComponent === "services2" ? (
        <Services2 previewData={data} />
      ) : activeComponent === "services5" ? (
        <Services5 previewData={data} />
      ) : activeComponent === "project2" ? (
        <Project2 previewData={data} />
      ) : activeComponent === "content1" ? (
        <Content1 previewData={data} />
      ) : activeComponent === "content2" ? (
        <Content2 previewData={data} />
      ) : activeComponent === "content3" ? (
        <Content3 previewData={data} />
      ) : (
        <Contact1 previewData={data} />
      )}
    </div>
  );
};

export default function OtherEditor() {
  const router = useRouter();
  const [otherData, setOtherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);
  const dispatch = useDispatch<AppDispatch>();
  const { other, loading } = useSelector((state: RootState) => state.other);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Redux to fetch other data
        await dispatch(getOther());
      } catch (error) {
        console.error("Error fetching other data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Update local state when other data changes in Redux
  useEffect(() => {
    if (other) {
      setOtherData(other);
    }
  }, [other]);

  // Handler for changing component type
  const handleOtherTypeChange = (newType: string) => {
    if (!otherData) return;

    setOtherData({
      ...otherData,
      activeOther: newType,
    });
  };

  // Function to handle iframe load failures and success messages
  useEffect(() => {
    if (!otherData) return;

    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (
        event.data.type === "PREVIEW_READY" ||
        event.data.type === "PREVIEW_UPDATED"
      ) {
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
  }, [otherData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;

    const activeOther = data.activeOther || "blog1";

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
            label="Component Type"
            value={activeOther}
            options={otherTypes}
            onChange={handleOtherTypeChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeOther === "blog1" ? (
            <Blog1ContentForm data={data.blog1 || {}} />
          ) : activeOther === "blog2" ? (
            <Blog2ContentForm data={data.blog2 || {}} />
          ) : activeOther === "blog3" ? (
            <Blog3ContentForm data={data.blog3 || {}} />
          ) : activeOther === "blog5" ? (
            <Blog5ContentForm data={data.blog5 || {}} />
          ) : activeOther === "services2" ? (
            <Services2ContentForm data={data.services2 || {}} />
          ) : activeOther === "services3" ? (
            <Services3ContentForm data={data.services3 || {}} />
          ) : activeOther === "services5" ? (
            <Services5ContentForm data={data.services5 || {}} />
          ) : activeOther === "project2" ? (
            <Project2ContentForm data={data.project2 || {}} />
          ) : activeOther === "team1" ? (
            <Team1ContentForm data={data.team1 || {}} />
          ) : activeOther === "content1" ? (
            <Content1ContentForm data={data.content1 || {}} />
          ) : activeOther === "content2" ? (
            <Content2ContentForm data={data.content2 || {}} />
          ) : activeOther === "content3" ? (
            <Content3ContentForm data={data.content3 || {}} />
          ) : (
            <Contact1ContentForm data={data.contact1 || {}} />
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
          {activeOther === "blog1" ? (
            <Blog1MediaForm data={data.blog1 || {}} />
          ) : activeOther === "blog2" ? (
            <Blog2MediaForm data={data.blog2 || {}} />
          ) : activeOther === "blog3" ? (
            <Blog3MediaForm data={data.blog3 || {}} />
          ) : activeOther === "blog5" ? (
            <Blog5MediaForm data={data.blog5 || {}} />
          ) : activeOther === "services2" ? (
            <Services2MediaForm data={data.services2 || {}} />
          ) : activeOther === "services3" ? (
            <Services3MediaForm data={data.services3 || {}} />
          ) : activeOther === "services5" ? (
            <Services5MediaForm data={data.services5 || {}} />
          ) : activeOther === "project2" ? (
            <Project2MediaForm data={data.project2 || {}} />
          ) : activeOther === "team1" ? (
            <Team1MediaForm data={data.team1 || {}} />
          ) : activeOther === "content1" ? (
            <Content1MediaForm data={data.content1 || {}} />
          ) : activeOther === "content2" ? (
            <Content2MediaForm data={data.content2 || {}} />
          ) : activeOther === "content3" ? (
            <Content3MediaForm data={data.content3 || {}} />
          ) : (
            <Contact1MediaForm data={data.contact1 || {}} />
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
      apiEndpoint="/api/other"
      sectionType="other"
      uploadHandler={uploadImageToCloudinary}
      initialData={otherData}
      disableAutoSave={true}
      saveHandler={async (data) => {
        try {
          // Use Redux to update other data
          await dispatch(updateOther(data));
          return { success: true };
        } catch (error) {
          console.error("Error saving other data:", error);
          return { success: false, error: "Failed to save other data" };
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: toggleStyles }} />
      <EditorLayout
        title="Other Components Editor"
        sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
      >
        {useFallback ? (
          <DirectPreview data={otherData} />
        ) : (
          <SectionPreview previewUrl="/preview/other" paramName="otherData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Blog 1 Content Form
function Blog1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badgeVisible !== false}
          path="blog1.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={data?.badge || ""}
          path="blog1.badge"
          placeholder="e.g. From Blog"
        />
        <ColorField
          label="Badge Background Color"
          value={data?.badgeBackgroundColor || "#f1f0fe"}
          path="blog1.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={data?.badgeTextColor || "#6342EC"}
          path="blog1.badgeTextColor"
        />
      </FormGroup>

      <FormGroup title="Title & Subtitle">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="blog1.title"
          placeholder="Enter blog section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="blog1.titleColor"
        />
        <TextField
          label="Subtitle"
          value={data?.subtitle || ""}
          path="blog1.subtitle"
          placeholder="Enter section subtitle"
        />
        <ColorField
          label="Subtitle Color"
          value={data?.subtitleColor || "#6E6E6E"}
          path="blog1.subtitleColor"
        />
      </FormGroup>

      <FormGroup title="Links & Background">
        <LinkField
          label="See All Link"
          value={data?.seeAllLink || ""}
          path="blog1.seeAllLink"
        />
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="blog1.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Blog 2 Content Form
function Blog2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badgeVisible !== false}
          path="blog2.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={data?.badge || ""}
          path="blog2.badge"
          placeholder="e.g. From Blog"
        />
        <ColorField
          label="Badge Background Color"
          value={data?.badgeBackgroundColor || "#f1f0fe"}
          path="blog2.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={data?.badgeTextColor || "#6342EC"}
          path="blog2.badgeTextColor"
        />
      </FormGroup>

      <FormGroup title="Title & Subtitle">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="blog2.title"
          placeholder="Enter blog section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="blog2.titleColor"
        />
        <TextField
          label="Subtitle"
          value={data?.subtitle || ""}
          path="blog2.subtitle"
          placeholder="Enter section subtitle"
        />
        <ColorField
          label="Subtitle Color"
          value={data?.subtitleColor || "#6E6E6E"}
          path="blog2.subtitleColor"
        />
      </FormGroup>

      <FormGroup title="See All Button">
        <ToggleField
          label="Show See All Button"
          value={data?.seeAllButtonVisible !== false}
          path="blog2.seeAllButtonVisible"
        />
        <TextField
          label="Button Text"
          value={data?.seeAllLinkText || "See all articles"}
          path="blog2.seeAllLinkText"
        />
        <LinkField
          label="Button Link"
          value={data?.seeAllLink || ""}
          path="blog2.seeAllLink"
        />
        <ColorField
          label="Button Text Color"
          value={data?.seeAllButtonColor || "#111827"}
          path="blog2.seeAllButtonColor"
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="blog2.backgroundColor"
        />
        <ImageUploadField
          label="Background Line Image"
          value={data?.bgLine || ""}
          path="blog2.bgLine"
        />
      </FormGroup>
    </div>
  );
}

// Blog 3 Content Form
function Blog3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Title & Background">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="blog3.title"
          placeholder="Enter blog section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="blog3.titleColor"
        />
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="blog3.backgroundColor"
        />
        <ImageUploadField
          label="Background Line Image"
          value={data?.bgLine || ""}
          path="blog3.bgLine"
        />
      </FormGroup>
    </div>
  );
}

// Blog 5 Content Form
function Blog5ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Title & Subtitle">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="blog5.title"
          placeholder="Enter blog section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="blog5.titleColor"
        />
        <TextField
          label="Subtitle"
          value={data?.subtitle || ""}
          path="blog5.subtitle"
          placeholder="Enter section subtitle"
        />
        <ColorField
          label="Subtitle Color"
          value={data?.subtitleColor || "#6E6E6E"}
          path="blog5.subtitleColor"
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="blog5.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Services 2 Content Form
function Services2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <ToggleField
          label="Show Tag"
          value={data?.heading?.tagVisible !== false}
          path="services2.heading.tagVisible"
        />
        <TextField
          label="Tag"
          value={data?.heading?.tag || ""}
          path="services2.heading.tag"
          placeholder="e.g. What we offer"
        />
        <ColorField
          label="Tag Background Color"
          value={data?.heading?.tagBackgroundColor || "#f1f0fe"}
          path="services2.heading.tagBackgroundColor"
        />
        <ColorField
          label="Tag Text Color"
          value={data?.heading?.tagTextColor || "#6342EC"}
          path="services2.heading.tagTextColor"
        />
        
        <TextAreaField
          label="Title"
          value={data?.heading?.title || ""}
          path="services2.heading.title"
          placeholder="Enter section title with HTML formatting if needed"
        />
        <ColorField
          label="Title Color"
          value={data?.heading?.titleColor || "#111827"}
          path="services2.heading.titleColor"
        />
      </FormGroup>
      
      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="services2.backgroundColor"
        />
      </FormGroup>

      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttons?.primary?.visible !== false}
          path="services2.buttons.primary.visible"
        />
        <TextField
          label="Text"
          value={data?.buttons?.primary?.text || ""}
          path="services2.buttons.primary.text"
          placeholder="e.g. Explore Now"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.primary?.link || ""}
          path="services2.buttons.primary.link"
        />
        <TextField
          label="Button Class"
          value={data?.buttons?.primary?.btnClass || ""}
          path="services2.buttons.primary.btnClass"
          placeholder="e.g. btn-gradient"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.primary?.backgroundColor || "#6342EC"}
          path="services2.buttons.primary.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.primary?.textColor || "#FFFFFF"}
          path="services2.buttons.primary.textColor"
        />
      </FormGroup>
      
      <FormGroup title="Secondary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttons?.secondary?.visible !== false}
          path="services2.buttons.secondary.visible"
        />
        <TextField
          label="Text"
          value={data?.buttons?.secondary?.text || ""}
          path="services2.buttons.secondary.text"
          placeholder="e.g. Contact Us"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.secondary?.link || ""}
          path="services2.buttons.secondary.link"
        />
        <TextField
          label="Button Class"
          value={data?.buttons?.secondary?.btnClass || ""}
          path="services2.buttons.secondary.btnClass"
          placeholder="e.g. btn-outline-secondary"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.secondary?.backgroundColor || "transparent"}
          path="services2.buttons.secondary.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.secondary?.textColor || "#111827"}
          path="services2.buttons.secondary.textColor"
        />
      </FormGroup>
      
      <FormGroup title="Services">
        {(data?.services || []).map((service: any, index: number) => (
          <div key={index} className="p-3 bg-sidebar rounded-md space-y-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Service {index + 1}
            </div>
            <TextField
              label="Title"
              value={service.title || ""}
              path={`services2.services.${index}.title`}
              placeholder="e.g. Business Analytics"
            />
            <TextAreaField
              label="Description"
              value={service.description || ""}
              path={`services2.services.${index}.description`}
              placeholder="Enter service description"
            />
            <TextField
              label="Icon Background Color"
              value={service.iconBgColor || ""}
              path={`services2.services.${index}.iconBgColor`}
              placeholder="e.g. bg-primary-soft"
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}

// Contact 1 Content Form
function Contact1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badgeVisible !== false}
          path="contact1.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={data?.badge || ""}
          path="contact1.badge"
          placeholder="e.g. Get in Touch"
        />
        <ColorField
          label="Badge Background Color"
          value={data?.badgeColor || "rgba(99, 66, 236, 0.1)"}
          path="contact1.badgeColor"
        />
        <ColorField
          label="Badge Text Color"
          value={data?.badgeTextColor || "#6342EC"}
          path="contact1.badgeTextColor"
        />
      </FormGroup>

      <FormGroup title="Title & Description">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="contact1.title"
          placeholder="Enter contact section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="contact1.titleColor"
        />

        <TextAreaField
          label="Description"
          value={data?.description || ""}
          path="contact1.description"
          placeholder="Enter contact section description"
        />
        <ColorField
          label="Description Color"
          value={data?.descriptionColor || "#6E6E6E"}
          path="contact1.descriptionColor"
        />
      </FormGroup>

      <TextField
        label="Form Title"
        value={data?.formTitle || ""}
        path="contact1.formTitle"
        placeholder="e.g. Leave a message"
      />

      <TextField
        label="Chat Title"
        value={data?.chatTitle || ""}
        path="contact1.chatTitle"
        placeholder="e.g. Chat with us"
      />

      <TextField
        label="Chat Description"
        value={data?.chatDescription || ""}
        path="contact1.chatDescription"
        placeholder="Chat description text"
      />

      <LinkField
        label="WhatsApp Link"
        value={data?.whatsappLink || ""}
        path="contact1.whatsappLink"
      />

      <LinkField
        label="Viber Link"
        value={data?.viberLink || ""}
        path="contact1.viberLink"
      />

      <LinkField
        label="Messenger Link"
        value={data?.messengerLink || ""}
        path="contact1.messengerLink"
      />

      <FormGroup title="Email Section">
        <ToggleField
          label="Show Email Section"
          value={data?.showEmail !== false}
          path="contact1.showEmail"
        />

        <TextField
          label="Email Title"
          value={data?.emailTitle || ""}
          path="contact1.emailTitle"
          placeholder="e.g. Send us an email"
        />

        <TextField
          label="Email Description"
          value={data?.emailDescription || ""}
          path="contact1.emailDescription"
          placeholder="Email description text"
        />

        <TextField
          label="Support Email"
          value={data?.supportEmail || ""}
          path="contact1.supportEmail"
          placeholder="e.g. support@example.com"
        />
      </FormGroup>

      <FormGroup title="Phone Section">
        <ToggleField
          label="Show Phone Section"
          value={data?.showPhone !== false}
          path="contact1.showPhone"
        />

        <TextField
          label="Inquiry Title"
          value={data?.inquiryTitle || ""}
          path="contact1.inquiryTitle"
          placeholder="e.g. For more inquiry"
        />

        <TextField
          label="Inquiry Description"
          value={data?.inquiryDescription || ""}
          path="contact1.inquiryDescription"
          placeholder="Inquiry description text"
        />

        <TextField
          label="Phone Number"
          value={data?.phoneNumber || ""}
          path="contact1.phoneNumber"
          placeholder="e.g. +1 234 567 890"
        />
      </FormGroup>

      <FormGroup title="Address Section">
        <ToggleField
          label="Show Address Section"
          value={data?.showAddress !== false}
          path="contact1.showAddress"
        />

        <TextField
          label="Address Title"
          value={data?.addressTitle || ""}
          path="contact1.addressTitle"
          placeholder="e.g. Our Address"
        />

        <TextField
          label="Address Description"
          value={data?.addressDescription || ""}
          path="contact1.addressDescription"
          placeholder="Address description text"
        />

        <TextField
          label="Address"
          value={data?.address || ""}
          path="contact1.address"
          placeholder="e.g. 123 Main St, City, Country"
        />
      </FormGroup>

      <FormGroup title="Button">
        <ColorField
          label="Button Background Color"
          value={data?.buttonColor || "#6342EC"}
          path="contact1.buttonColor"
        />
        <ColorField
          label="Button Text Color"
          value={data?.buttonTextColor || "#FFFFFF"}
          path="contact1.buttonTextColor"
        />
      </FormGroup>
    </div>
  );
}

// Blog 1 Media Form
function Blog1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 2 Media Form
function Blog2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 3 Media Form
function Blog3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 5 Media Form
function Blog5MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Services 2 Media Form
function Services2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="services2.tagImage"
      />
      
      <ImageUploadField
        label="Background Image"
        value={data?.backgroundImage || ""}
        path="services2.backgroundImage"
      />
      
      <FormGroup title="Service Icons">
        {(data?.services || []).map((service: any, index: number) => (
          <div key={index} className="mb-3">
            <ImageUploadField
              label={`Service ${index + 1} Icon`}
              value={service.icon || ""}
              path={`services2.services.${index}.icon`}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}

// Contact 1 Media Form
function Contact1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Services">
        {(data?.services || []).map((service: string, index: number) => (
          <div key={index} className="mb-2">
            <TextField
              label={`Service ${index + 1}`}
              value={service || ""}
              path={`contact1.services.${index}`}
              placeholder="e.g. Research planning"
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}

// Services 5 Content Form
function Services5ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="services5.title"
        placeholder="Enter section title"
      />
      <ColorField
        label="Title Color"
        value={data?.titleColor || "#333333"}
        path="services5.titleColor"
      />

      <FormGroup title="Subtitle">
        <ToggleField
          label="Show Subtitle"
          value={data?.subtitleVisible !== false}
          path="services5.subtitleVisible"
        />
        <TextField
          label="Subtitle Text"
          value={data?.subtitle || ""}
          path="services5.subtitle"
          placeholder="e.g. What we offer"
        />
        <ColorField
          label="Subtitle Background Color"
          value={data?.subtitleBackgroundColor || "#f1f0fe"}
          path="services5.subtitleBackgroundColor"
        />
        <ColorField
          label="Subtitle Text Color"
          value={data?.subtitleTextColor || "#6342EC"}
          path="services5.subtitleTextColor"
        />
      </FormGroup>

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="services5.description"
        placeholder="Enter section description"
      />
      <ColorField
        label="Description Color"
        value={data?.descriptionColor || "#6E6E6E"}
        path="services5.descriptionColor"
      />

      <FormGroup title="Filter Buttons">
        <TextField
          label="All Filter Text"
          value={data?.filterAllText || "Hepsi"}
          path="services5.filterAllText"
          placeholder="e.g. All"
        />
        <ColorField
          label="Active Filter Button Color"
          value={data?.filterButtonColor || "#6342EC"}
          path="services5.filterButtonColor"
        />
        <ColorField
          label="Filter Button Text Color"
          value={data?.filterButtonTextColor || "#FFFFFF"}
          path="services5.filterButtonTextColor"
        />
      </FormGroup>

      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Button"
          value={data?.buttonVisible !== false}
          path="services5.buttonVisible"
        />
        <TextField
          label="Button Text"
          value={data?.buttonText || ""}
          path="services5.buttonText"
          placeholder="e.g. Get Free Quote"
        />
        <LinkField
          label="Button Link"
          value={data?.buttonLink || ""}
          path="services5.buttonLink"
        />
        <ColorField
          label="Button Background Color"
          value={data?.buttonColor || "#6342EC"}
          path="services5.buttonColor"
        />
        <ColorField
          label="Button Text Color"
          value={data?.buttonTextColor || "#FFFFFF"}
          path="services5.buttonTextColor"
        />
      </FormGroup>

      <FormGroup title="Secondary Link">
        <ToggleField
          label="Show Link"
          value={data?.linkVisible !== false}
          path="services5.linkVisible"
        />
        <TextField
          label="Link Text"
          value={data?.linkText || ""}
          path="services5.linkText"
          placeholder="e.g. How We Work"
        />
        <LinkField
          label="Link URL"
          value={data?.linkUrl || ""}
          path="services5.linkUrl"
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="services5.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Project 2 Content Form
function Project2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="project2.title"
        placeholder="Enter section title"
      />
      <ColorField
        label="Title Color"
        value={data?.titleColor || "#333333"}
        path="project2.titleColor"
      />

      <FormGroup title="Subtitle">
        <ToggleField
          label="Show Subtitle"
          value={data?.subtitleVisible !== false}
          path="project2.subtitleVisible"
        />
        <TextField
          label="Subtitle Text"
          value={data?.subtitle || ""}
          path="project2.subtitle"
          placeholder="e.g. Recent work"
        />
        <ColorField
          label="Subtitle Background Color"
          value={data?.subtitleBackgroundColor || "rgba(99, 66, 236, 0.1)"}
          path="project2.subtitleBackgroundColor"
        />
        <ColorField
          label="Subtitle Text Color"
          value={data?.subtitleTextColor || "#6342EC"}
          path="project2.subtitleTextColor"
        />
      </FormGroup>

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="project2.description"
        placeholder="Enter section description"
      />
      <ColorField
        label="Description Color"
        value={data?.descriptionColor || "#6E6E6E"}
        path="project2.descriptionColor"
      />

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#f8f9fa"}
          path="project2.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Services 5 Media Form
function Services5MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Services images are managed from a separate source.
      </div>
    </div>
  );
}

// Project 2 Media Form
function Project2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Project images are managed from a separate source.
      </div>
    </div>
  );
}

// Services 3 Content Form
function Services3ContentForm({ data }: { data: any }) {
  const [slideServices, setSlideServices] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any>(data);
  const { updateData } = useEditor();
  
  useEffect(() => {
    // When data changes, update our local state
    setLocalData(data);
    if (data.slideServices && Array.isArray(data.slideServices)) {
      // Convert any CSS class-based bg colors to hex values
      const servicesWithHexColors = data.slideServices.map((service: any) => {
        const updatedService = { ...service };
        // Convert CSS class to hex color if needed
        if (service.iconBgColor && service.iconBgColor.startsWith('bg-')) {
          updatedService.iconBgColor = getColorFromClass(service.iconBgColor);
        }
        return updatedService;
      });
      setSlideServices(servicesWithHexColors);
    }
  }, [data]);
  
  // Convert CSS class to hex color
  const getColorFromClass = (cssClass: string): string => {
    switch(cssClass) {
      case 'bg-primary-soft': return '#e9e3ff';
      case 'bg-success-soft': return '#d1f5ea';
      case 'bg-warning-soft': return '#fff5d3';
      case 'bg-info-soft': return '#d9f2ff';
      case 'bg-danger-soft': return '#fee7e7';
      case 'bg-secondary-soft': return '#e9ecef';
      default: return '#f1f0fe';
    }
  };
  
  // Get CSS class from hex color (for display only)
  const getClassNameForColor = (hexColor: string): string | null => {
    const colorMap: {[key: string]: string} = {
      '#e9e3ff': 'primary',
      '#d1f5ea': 'success',
      '#fff5d3': 'warning',
      '#d9f2ff': 'info',
      '#fee7e7': 'danger',
      '#e9ecef': 'secondary'
    };
    
    // Find the closest matching color
    const closestColor = Object.keys(colorMap).find(key => 
      key.toLowerCase() === hexColor.toLowerCase()
    );
    
    return closestColor ? colorMap[closestColor] : null;
  };
  
  const handleAddService = () => {
    // Create a new service with default values
    const newService = {
      icon: "/assets/imgs/service-3/icon-1.svg",
      title: "New Service",
      description: "Service description goes here.",
      iconBgColor: "#e9e3ff", // Primary soft color
      link: "#"
    };
    
    const updatedServices = [...slideServices, newService];
    setSlideServices(updatedServices);
    
    // Update the services3 section with the new services array
    const updatedServices3 = {
      ...localData,
      slideServices: updatedServices
    };
    updateData('services3', updatedServices3);
  };
  
  const handleRemoveService = (index: number) => {
    if (slideServices.length <= 1) {
      alert("You must keep at least one service.");
      return;
    }
    
    // Confirm before removing
    if (confirm("Are you sure you want to remove this service?")) {
      const updatedServices = [...slideServices];
      updatedServices.splice(index, 1);
      setSlideServices(updatedServices);
      
      // Update the services3 section with the new services array
      const updatedServices3 = {
        ...localData,
        slideServices: updatedServices
      };
      updateData('services3', updatedServices3);
    }
  };
  
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={localData?.badgeVisible !== false}
          path="services3.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={localData?.badge || ""}
          path="services3.badge"
          placeholder="e.g. What we offers"
        />
        <ColorField
          label="Badge Background Color"
          value={localData?.badgeBackgroundColor || "#f1f0fe"}
          path="services3.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={localData?.badgeTextColor || "#6342EC"}
          path="services3.badgeTextColor"
        />
      </FormGroup>

      <FormGroup title="Title & Background">
        <TextAreaField
          label="Title"
          value={localData?.title || ""}
          path="services3.title"
          placeholder="Enter title with HTML formatting if needed"
        />
        <ColorField
          label="Title Color"
          value={localData?.titleColor || "#111827"}
          path="services3.titleColor"
        />
        <ColorField
          label="Background Color"
          value={localData?.backgroundColor || "#ffffff"}
          path="services3.backgroundColor"
        />
      </FormGroup>

      <FormGroup title="Slider Settings">
        <TextField
          label="Slide Delay (ms)"
          value={localData?.slideDelay?.toString() || "4000"}
          path="services3.slideDelay"
          placeholder="Delay between slides in milliseconds"
        />
        <ToggleField
          label="Show Navigation Buttons"
          value={localData?.showNavigation !== false}
          path="services3.showNavigation"
        />
        <ColorField
          label="Navigation Button Color"
          value={localData?.navButtonColor || "#ffffff"}
          path="services3.navButtonColor"
        />
      </FormGroup>

      <FormGroup title="Service Cards">
        {slideServices.map((service, index) => (
          <div key={index} className="p-3 bg-sidebar rounded-md space-y-3 mb-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-700">
                Service {index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <TextField
              label="Title"
              value={service.title || ""}
              path={`services3.slideServices.${index}.title`}
              placeholder="e.g. IT Consulting"
            />
            <TextAreaField
              label="Description"
              value={service.description || ""}
              path={`services3.slideServices.${index}.description`}
              placeholder="Enter service description"
            />
            <ColorField
              label="Icon Background Color"
              value={service.iconBgColor || "#f1f0fe"}
              path={`services3.slideServices.${index}.iconBgColor`}
            />

            <ImageUploadField
              label="Icon"
              value={service.icon || ""}
              path={`services3.slideServices.${index}.icon`}
              placeholder="Service icon path"
            />
            <LinkField
              label="Link URL"
              value={service.link || ""}
              path={`services3.slideServices.${index}.link`}
              placeholder="e.g. /services/consulting"
            />
          </div>
        ))}
        
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
            onClick={handleAddService}
          >
            Add Service
          </button>
          {slideServices.length > 1 && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              onClick={() => handleRemoveService(slideServices.length - 1)}
            >
              Remove Last Service
            </button>
          )}
        </div>
      </FormGroup>
    </div>
  );
}

// Team 1 Content Form
function Team1ContentForm({ data }: { data: any }) {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any>(data);
  const { updateData } = useEditor();
  
  useEffect(() => {
    // When data changes, update our local state
    setLocalData(data);
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
      setTeamMembers([...data.teamMembers]);
    }
  }, [data]);
  
  // Handle local state changes
  const handleLocalDataChange = (field: string, value: any) => {
    setLocalData((prev: any) => {
      return { ...prev, [field]: value };
    });
  };
  
  const handleAddTeamMember = () => {
    // Create a new team member with default values
    const newMember = {
      image: "/assets/imgs/team-1/avatar-1.png",
      link: "#"
    };
    
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    
    // Update the team1 section with the new members array
    const updatedTeam1 = {
      ...localData,
      teamMembers: updatedMembers
    };
    updateData('team1', updatedTeam1);
  };
  
  const handleRemoveTeamMember = (index: number) => {
    if (teamMembers.length <= 1) {
      alert("You must keep at least one team member.");
      return;
    }
    
    // Confirm before removing
    if (confirm("Are you sure you want to remove this team member?")) {
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);
      
      // Update the team1 section with the new members array
      const updatedTeam1 = {
        ...localData,
        teamMembers: updatedMembers
      };
      updateData('team1', updatedTeam1);
    }
  };
  
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={localData?.badgeVisible !== false}
          path="team1.badgeVisible"
        />
        <TextField
          label="Badge Text"
          value={localData?.badge || ""}
          path="team1.badge"
          placeholder="e.g. OUR TEAM MEMBERS"
        />
        <ColorField
          label="Badge Background Color"
          value={localData?.badgeBackgroundColor || "#f1f0fe"}
          path="team1.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={localData?.badgeTextColor || "#6342EC"}
          path="team1.badgeTextColor"
        />
      </FormGroup>

      <FormGroup title="Title & Description">
        <TextField
          label="Title"
          value={localData?.title || ""}
          path="team1.title"
          placeholder="e.g. Meet Our Team"
        />
        <ColorField
          label="Title Color"
          value={localData?.titleColor || "#111827"}
          path="team1.titleColor"
        />
        <TextAreaField
          label="Description"
          value={localData?.description || ""}
          path="team1.description"
          placeholder="Enter description with HTML formatting if needed"
        />
        <ColorField
          label="Description Color"
          value={localData?.descriptionColor || "#6E6E6E"}
          path="team1.descriptionColor"
        />
      </FormGroup>

      <FormGroup title="Background Settings">
        <ColorField
          label="Background Color"
          value={localData?.backgroundColor || "#ffffff"}
          path="team1.backgroundColor"
        />
        <ToggleField
          label="Show Background Line"
          value={localData?.showBgLine !== false}
          path="team1.showBgLine"
        />
        <ImageUploadField
          label="Background Line Image"
          value={localData?.bgLine || ""}
          path="team1.bgLine"
        />
        <ToggleField
          label="Show Rotating Elements"
          value={localData?.showRotatingElements !== false}
          path="team1.showRotatingElements"
        />
      </FormGroup>

      <FormGroup title="Team Members">
        {teamMembers.map((member, index) => (
          <div key={index} className="p-3 bg-sidebar rounded-md space-y-3 mb-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-700">
                Team Member {index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTeamMember(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="mb-3">
              <ImageUploadField
                label="Photo"
                value={member.image || ""}
                path={`team1.teamMembers.${index}.image`}
                placeholder="Team member photo path"
              />
            </div>
            <div className="mb-3">
              <LinkField
                label="Profile Link"
                value={member.link || ""}
                path={`team1.teamMembers.${index}.link`}
                placeholder="e.g. /team/john-doe"
              />
            </div>
          </div>
        ))}
        
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
            onClick={handleAddTeamMember}
          >
            Add Team Member
          </button>
          {teamMembers.length > 1 && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              onClick={() => handleRemoveTeamMember(teamMembers.length - 1)}
            >
              Remove Last Member
            </button>
          )}
        </div>
      </FormGroup>
    </div>
  );
}

// Services 3 Media Form
function Services3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Service Icons">
        {(data?.slideServices || []).map((service: any, index: number) => (
          <div key={index} className="mb-3">
            <ImageUploadField
              label={`Service ${index + 1} Icon`}
              value={service.icon || ""}
              path={`services3.slideServices.${index}.icon`}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}

// Team 1 Media Form
function Team1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Background Line Image"
        value={data?.bgLine || ""}
        path="team1.bgLine"
      />
      
      <FormGroup title="Team Member Photos">
        {(data?.teamMembers || []).map((member: any, index: number) => (
          <div key={index} className="mb-3">
            <ImageUploadField
              label={`Team Member ${index + 1} Photo`}
              value={member.image || ""}
              path={`team1.teamMembers.${index}.image`}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}

// Content 1 Content Form
function Content1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Section Title">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="content1.title"
          placeholder="Enter section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="content1.titleColor"
        />
      </FormGroup>

      <FormGroup title="Content">
        <RichTextField
          label="HTML Content"
          value={data?.content || ""}
          path="content1.content"
          placeholder="Enter your content here..."
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="content1.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Content 1 Media Form
function Content1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Images can be added directly in the content editor using the rich text editor.
      </div>
    </div>
  );
}

// Content 2 Content Form
function Content2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Section Title">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="content2.title"
          placeholder="Enter section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="content2.titleColor"
        />
      </FormGroup>

      <FormGroup title="Content">
        <RichTextField
          label="HTML Content"
          value={data?.content || ""}
          path="content2.content"
          placeholder="Enter your content here..."
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#f8f9fa"}
          path="content2.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Content 2 Media Form
function Content2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Images can be added directly in the content editor using the rich text editor.
      </div>
    </div>
  );
}

// Content 3 Content Form
function Content3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Section Title">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="content3.title"
          placeholder="Enter section title"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#111827"}
          path="content3.titleColor"
        />
      </FormGroup>

      <FormGroup title="Content">
        <RichTextField
          label="HTML Content"
          value={data?.content || ""}
          path="content3.content"
          placeholder="Enter your content here..."
        />
      </FormGroup>

      <FormGroup title="Background">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || "#ffffff"}
          path="content3.backgroundColor"
        />
      </FormGroup>
    </div>
  );
}

// Content 3 Media Form
function Content3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Images can be added directly in the content editor using the rich text editor.
      </div>
    </div>
  );
}
