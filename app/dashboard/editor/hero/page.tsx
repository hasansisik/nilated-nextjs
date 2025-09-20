"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
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
  ImagePreview,
  SectionTypeSelector,
  ColorField,
  ToggleField,
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image } from "lucide-react";
import Hero1 from "@/components/sections/Hero1";
import Hero3 from "@/components/sections/Hero3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getHero, updateHero } from "@/redux/actions/heroActions";
import { AppDispatch } from "@/redux/store";

// Hero type options
const heroTypes = [
  { value: "hero1", label: "Hero 1" },
  { value: "hero2", label: "Hero 2" },
  { value: "hero3", label: "Hero 3" },
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;

  const activeComponent = data.activeHero || "hero1";

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
      {activeComponent === "hero1" ? (
        <Hero1 previewData={data} />
      ) : (
        <Hero3 previewData={data} />
      )}
    </div>
  );
};

export default function HeroEditor() {
  const router = useRouter();
  const [heroData, setHeroData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);
  const dispatch = useDispatch<AppDispatch>();
  const { hero, loading } = useSelector((state: RootState) => state.hero);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Redux to fetch hero data
        await dispatch(getHero());
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Update local state when hero data changes in Redux
  useEffect(() => {
    if (hero) {
      setHeroData(hero);
    }
  }, [hero]);

  // Handler for changing hero type
  const handleHeroTypeChange = (newType: string) => {
    if (!heroData) return;

    setHeroData({
      ...heroData,
      activeHero: newType,
    });
  };

  // Function to handle iframe load failures and success messages
  useEffect(() => {
    if (!heroData) return;

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
  }, [heroData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;

    const activeHero = data.activeHero || "hero1";

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
            label="Hero Type"
            value={activeHero}
            options={heroTypes}
            onChange={handleHeroTypeChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeHero === "hero1" ? (
            <Hero1ContentForm data={data.hero1 || {}} />
          ) : activeHero === "hero2" ? (
            <Hero2ContentForm data={data.hero2 || {}} />
          ) : (
            <Hero3ContentForm data={data.hero3 || {}} />
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
          {activeHero === "hero1" ? (
            <Hero1MediaForm data={data.hero1 || {}} />
          ) : activeHero === "hero2" ? (
            <Hero2MediaForm data={data.hero2 || {}} />
          ) : (
            <Hero3MediaForm data={data.hero3 || {}} />
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
      apiEndpoint="/api/hero"
      sectionType="hero"
      uploadHandler={uploadImageToCloudinary}
      initialData={heroData}
      disableAutoSave={true}
      saveHandler={async (data) => {
        try {
          // Use Redux to update hero data
          await dispatch(updateHero(data));
          return { success: true };
        } catch (error) {
          console.error("Error saving hero data:", error);
          return { success: false, error: "Failed to save hero data" };
        }
      }}
    >
      <EditorLayout
        title="Hero Editor"
        sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
      >
        {useFallback ? (
          <DirectPreview data={heroData} />
        ) : (
          <SectionPreview previewUrl="/preview/hero" paramName="heroData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Hero 1 Content Form
function Hero1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badge?.visible !== false}
          path="hero1.badge.visible"
        />
        <TextField
          label="Label"
          value={data?.badge?.label || ""}
          path="hero1.badge.label"
          placeholder="e.g. New, Hot"
        />
        <TextField
          label="Text"
          value={data?.badge?.text || ""}
          path="hero1.badge.text"
          placeholder="e.g. Free Lifetime Update"
        />
        <LinkField
          label="Link"
          value={data?.badge?.link || ""}
          path="hero1.badge.link"
        />
        <ColorField
          label="Background Color"
          value={data?.badge?.backgroundColor || ""}
          path="hero1.badge.backgroundColor"
        />
        <ColorField
          label="Label Background Color"
          value={data?.badge?.labelBgColor || "#6342EC"}
          path="hero1.badge.labelBgColor"
        />
        <ColorField
          label="Label Text Color"
          value={data?.badge?.labelTextColor || "#FFFFFF"}
          path="hero1.badge.labelTextColor"
        />
        <ColorField
          label="Text Color"
          value={data?.badge?.textColor || "#6342EC"}
          path="hero1.badge.textColor"
        />
        <ColorField
          label="Icon Color"
          value={data?.badge?.iconColor || "#6342EC"}
          path="hero1.badge.iconColor"
        />
      </FormGroup>

      <TextField
        label="Title"
        value={data?.title || ""}
        path="hero1.title"
        placeholder="Enter hero title"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="hero1.description"
        placeholder="Enter hero description"
      />

      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Primary Button"
          value={data?.primaryButton?.visible !== false}
          path="hero1.primaryButton.visible"
        />
        <TextField
          label="Text"
          value={data?.primaryButton?.text || ""}
          path="hero1.primaryButton.text"
          placeholder="e.g. Get Started"
        />
        <LinkField
          label="Link"
          value={data?.primaryButton?.link || ""}
          path="hero1.primaryButton.link"
        />
        <ColorField
          label="Background Color"
          value={data?.primaryButton?.backgroundColor || ""}
          path="hero1.primaryButton.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.primaryButton?.textColor || "#FFFFFF"}
          path="hero1.primaryButton.textColor"
        />
        <ColorField
          label="Icon Color"
          value={data?.primaryButton?.iconColor || "#FFFFFF"}
          path="hero1.primaryButton.iconColor"
        />
      </FormGroup>

      <FormGroup title="Secondary Button">
        <ToggleField
          label="Show Secondary Button"
          value={data?.secondaryButton?.visible !== false}
          path="hero1.secondaryButton.visible"
        />
        <TextField
          label="Text"
          value={data?.secondaryButton?.text || ""}
          path="hero1.secondaryButton.text"
          placeholder="e.g. Contact Sales"
        />
        <LinkField
          label="Link"
          value={data?.secondaryButton?.link || ""}
          path="hero1.secondaryButton.link"
        />
        <ColorField
          label="Background Color"
          value={data?.secondaryButton?.backgroundColor || "transparent"}
          path="hero1.secondaryButton.backgroundColor"
        />
        <ColorField
          label="Border Color"
          value={data?.secondaryButton?.borderColor || ""}
          path="hero1.secondaryButton.borderColor"
        />
        <ColorField
          label="Text Color"
          value={data?.secondaryButton?.textColor || ""}
          path="hero1.secondaryButton.textColor"
        />
        <ColorField
          label="Icon Color"
          value={data?.secondaryButton?.iconColor || "#111827"}
          path="hero1.secondaryButton.iconColor"
        />
      </FormGroup>

      <FormGroup title="Card Settings">
        <ToggleField
          label="Show Card"
          value={data?.card?.visible !== false}
          path="hero1.card.visible"
        />
        <TextField
          label="Card Title"
          value={data?.card?.title || ""}
          path="hero1.card.title"
          placeholder="e.g. Join Our Community"
        />
        <TextField
          label="Card Description"
          value={data?.card?.description || ""}
          path="hero1.card.description"
          placeholder="e.g. Over 2,500+ happy customers"
        />
        <ColorField
          label="Card Background"
          value={data?.card?.backgroundColor || ""}
          path="hero1.card.backgroundColor"
        />
        <ColorField
          label="Title Color"
          value={data?.card?.titleColor || ""}
          path="hero1.card.titleColor"
        />
        <ColorField
          label="Description Color"
          value={data?.card?.descriptionColor || ""}
          path="hero1.card.descriptionColor"
        />
        <FormGroup title="Card Button" className="ml-4 mt-2">
          <TextField
            label="Button Label"
            value={data?.card?.button?.label || ""}
            path="hero1.card.button.label"
            placeholder="e.g. Get"
          />
          <TextField
            label="Button Text"
            value={data?.card?.button?.text || ""}
            path="hero1.card.button.text"
            placeholder="e.g. Free Update"
          />
          <LinkField
            label="Button Link"
            value={data?.card?.button?.link || ""}
            path="hero1.card.button.link"
          />
          <ColorField
            label="Button Background"
            value={data?.card?.button?.backgroundColor || "#FFFFFF"}
            path="hero1.card.button.backgroundColor"
          />
          <ColorField
            label="Label Background"
            value={data?.card?.button?.labelBgColor || "#6D4DF2"}
            path="hero1.card.button.labelBgColor"
          />
          <ColorField
            label="Label Text Color"
            value={data?.card?.button?.labelTextColor || "#FFFFFF"}
            path="hero1.card.button.labelTextColor"
          />
          <ColorField
            label="Text Color"
            value={data?.card?.button?.textColor || "#6D4DF2"}
            path="hero1.card.button.textColor"
          />
          <ColorField
            label="Icon Color"
            value={data?.card?.button?.iconColor || "#6D4DF2"}
            path="hero1.card.button.iconColor"
          />
        </FormGroup>
      </FormGroup>
    </div>
  );
}

// Hero 3 Content Form
function Hero3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badge?.visible !== false}
          path="hero3.badge.visible"
        />
        <TextField
          label="Badge Text"
          value={data?.badge?.text || ""}
          path="hero3.badge.text"
          placeholder="e.g. Build Without Limits"
        />
        <ColorField
          label="Background Color"
          value={data?.badge?.backgroundColor || "#FFFFFF"}
          path="hero3.badge.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.badge?.textColor || "#6342EC"}
          path="hero3.badge.textColor"
        />
        <ColorField
          label="Border Color"
          value={data?.badge?.borderColor || ""}
          path="hero3.badge.borderColor"
        />
      </FormGroup>

      <TextField
        label="Title (First Line)"
        value={data?.title?.part1 || ""}
        path="hero3.title.part1"
        placeholder="Enter first line of title"
      />

      <TextField
        label="Title (Second Line)"
        value={data?.title?.part2 || ""}
        path="hero3.title.part2"
        placeholder="Enter second line of title"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="hero3.description"
        placeholder="Enter hero description"
      />

      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Primary Button"
          value={data?.button?.visible !== false}
          path="hero3.button.visible"
        />
        <TextField
          label="Button Text"
          value={data?.button?.text || ""}
          path="hero3.button.text"
          placeholder="e.g. Try It Free"
        />
        <LinkField
          label="Button Link"
          value={data?.button?.link || ""}
          path="hero3.button.link"
        />
        <ColorField
          label="Background Color"
          value={data?.button?.backgroundColor || ""}
          path="hero3.button.backgroundColor"
        />
        <ColorField
          label="Text Color"
          value={data?.button?.textColor || "#FFFFFF"}
          path="hero3.button.textColor"
        />
        <ColorField
          label="Icon Color"
          value={data?.button?.iconColor || "#FFFFFF"}
          path="hero3.button.iconColor"
        />
      </FormGroup>

      <FormGroup title="Secondary Button">
        <ToggleField
          label="Show Secondary Button"
          value={data?.buttons?.secondary?.visible !== false}
          path="hero3.buttons.secondary.visible"
        />
        <TextField
          label="Button Text"
          value={data?.buttons?.secondary?.text || ""}
          path="hero3.buttons.secondary.text"
          placeholder="e.g. Learn More"
        />
        <LinkField
          label="Button Link"
          value={data?.buttons?.secondary?.link || ""}
          path="hero3.buttons.secondary.link"
        />
        <ColorField
          label="Background Color"
          value={data?.buttons?.secondary?.backgroundColor || "transparent"}
          path="hero3.buttons.secondary.backgroundColor"
        />
        <ColorField
          label="Border Color"
          value={data?.buttons?.secondary?.borderColor || ""}
          path="hero3.buttons.secondary.borderColor"
        />
        <ColorField
          label="Text Color"
          value={data?.buttons?.secondary?.textColor || ""}
          path="hero3.buttons.secondary.textColor"
        />
      </FormGroup>

      <FormGroup title="Avatars">
        <ToggleField
          label="Show Avatars"
          value={data?.avatarsVisible !== false}
          path="hero3.avatarsVisible"
        />
        {(data?.avatars || []).map((avatar: any, index: number) => (
          <FormGroup
            key={index}
            title={`Avatar ${index + 1}`}
            className="ml-4 mt-2 p-3 bg-sidebar rounded-md"
          >
            <ToggleField
              label="Show Avatar"
              value={avatar?.visible !== false}
              path={`hero3.avatars.${index}.visible`}
            />
            <div className="flex gap-2 items-center">
              <ImagePreview
                src={avatar.image || "/placeholder.jpg"}
                path={`hero3.avatars.${index}.image`}
                alt={avatar.alt || `User avatar ${index + 1}`}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <TextField
                  label="Alt Text"
                  value={avatar.alt || ""}
                  path={`hero3.avatars.${index}.alt`}
                  placeholder="e.g. User avatar"
                />
              </div>
            </div>
            <ColorField
              label="Border Color"
              value={avatar?.borderColor || "#FFFFFF"}
              path={`hero3.avatars.${index}.borderColor`}
            />
            <ColorField
              label="Background Color"
              value={avatar?.backgroundColor || ""}
              path={`hero3.avatars.${index}.backgroundColor`}
            />
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

// Hero 1 Media Form
function Hero1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Background Image"
        value={data?.images?.background || ""}
        path="hero1.images.background"
      />

      <ImageUploadField
        label="Shape 1 Image"
        value={data?.images?.shape1 || ""}
        path="hero1.images.shape1"
      />

      <ImageUploadField
        label="Shape 2 Image"
        value={data?.images?.shape2 || ""}
        path="hero1.images.shape2"
      />

      <ImageUploadField
        label="Shape 3 Image"
        value={data?.images?.shape3 || ""}
        path="hero1.images.shape3"
      />

      <ImageUploadField
        label="Card Image"
        value={data?.card?.image || ""}
        path="hero1.card.image"
      />
    </div>
  );
}

// Hero 3 Media Form
function Hero3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-2">Image Grid</div>
        <div className="grid grid-cols-2 gap-2">
          {["image1", "image2", "image3", "image4"].map((key) => (
            <ImagePreview
              key={key}
              src={data?.images?.[key] || "/placeholder.jpg"}
              path={`hero3.images.${key}`}
              alt={`Grid Image ${key}`}
            />
          ))}
        </div>
      </div>

      <ImageUploadField
        label="Star Image"
        value={data?.images?.star || ""}
        path="hero3.images.star"
      />

      <div className="space-y-2 mt-4">
        <div className="text-xs text-gray-500 font-medium mb-2">Avatars</div>
        <div className="space-y-4">
          {(data?.avatars || []).map((avatar: any, index: number) => (
            <div key={index} className="p-3 bg-sidebar rounded-md space-y-3">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Avatar {index + 1}
              </div>
              <div className="flex gap-2 items-center">
                <ImagePreview
                  src={avatar.image || "/placeholder.jpg"}
                  path={`hero3.avatars.${index}.image`}
                  alt={avatar.alt || `User avatar ${index + 1}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <TextField
                    label="Alt Text"
                    value={avatar.alt || ""}
                    path={`hero3.avatars.${index}.alt`}
                    placeholder="e.g. User avatar"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero 2 Content Form
function Hero2ContentForm({ data }: { data: any }) {
  const [slides, setSlides] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any>(data);
  const dispatch = useDispatch<AppDispatch>();
  const { hero, loading } = useSelector((state: RootState) => state.hero);

  // Sync with Redux state
  useEffect(() => {
    if (hero && hero.hero2) {
      // Only update if the slide structure has changed
      if (
        hero.hero2.slides &&
        JSON.stringify(slides) !== JSON.stringify(hero.hero2.slides)
      ) {
        setSlides([...hero.hero2.slides]);
      }

      // Update other localData fields
      setLocalData((prevData) => ({
        ...prevData,
        ...hero.hero2,
        // Don't overwrite slides in localData to avoid UI flickering
        slides: prevData.slides,
      }));
    }
  }, [hero]);

  // Initial data load
  useEffect(() => {
    // When data changes, update our local state
    setLocalData(data);
    if (data.slides && Array.isArray(data.slides)) {
      setSlides([...data.slides]);
    }
  }, [data]);

  // Save changes to Redux/backend
  const saveChanges = () => {
    // Create a new payload with the current local state and slides
    const payload = {
      hero2: {
        ...localData,
        slides: slides,
      },
    };

    // Dispatch the update action
    dispatch(updateHero(payload));
  };

  const handleAddSlide = () => {
    // Create a new slide with default values
    const newSlide = {
      backgroundImage: "/assets/imgs/hero-5/img-bg-1.png",
      badge: "🚀 Welcome to Infinia",
      title: "New Slide Title",
      description: "Add your slide description here.",
      primaryButtonText: "View Services",
      primaryButtonLink: "#",
      videoButtonVisible: true,
      videoButtonText: "Video Guide",
      lineImage: "/assets/imgs/hero-5/img-bg-line.png",
    };

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);

    // Immediately save changes to backend after adding
    setTimeout(() => {
      dispatch(
        updateHero({
          hero2: {
            ...localData,
            slides: updatedSlides,
          },
        })
      );
    }, 100);
  };

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("You must keep at least one slide.");
      return;
    }

    // Confirm before removing
    if (confirm("Are you sure you want to remove this slide?")) {
      const updatedSlides = [...slides];
      updatedSlides.splice(index, 1);
      setSlides(updatedSlides);

      // Immediately save changes to backend after removing
      setTimeout(() => {
        dispatch(
          updateHero({
            hero2: {
              ...localData,
              slides: updatedSlides,
            },
          })
        );
      }, 100);
    }
  };

  const handleUpdateSlide = (index: number, field: string, value: any) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value,
    };
    setSlides(updatedSlides);

    // Don't save immediately to avoid too many API calls
    // Changes will be saved when user clicks Save Changes button
  };

  return (
    <div className="space-y-4">
      <FormGroup title="Slider Settings">
        <ToggleField
          label="Autoplay"
          value={localData?.autoplay !== false}
          path="hero2.autoplay"
        />
        <TextField
          label="Slide Delay (ms)"
          value={localData?.slideDelay?.toString() || "4000"}
          path="hero2.slideDelay"
          placeholder="Delay between slides in milliseconds"
        />
        <ToggleField
          label="Show Navigation Buttons"
          value={localData?.showNavigation !== false}
          path="hero2.showNavigation"
        />
        <ColorField
          label="Navigation Button Color"
          value={localData?.navigationButtonColor || "#ffffff"}
          path="hero2.navigationButtonColor"
        />
        <ToggleField
          label="Show Pagination"
          value={localData?.paginationVisible !== false}
          path="hero2.paginationVisible"
        />
      </FormGroup>

      <FormGroup title="Video Settings">
        <TextField
          label="YouTube Video ID"
          value={localData?.videoId || ""}
          path="hero2.videoId"
          placeholder="e.g. gXFATcwrO-U"
        />
      </FormGroup>

      <FormGroup title="Global Style Settings">
        <ColorField
          label="Badge Background Color"
          value={localData?.badgeBackgroundColor || "rgba(255, 255, 255, 0.5)"}
          path="hero2.badgeBackgroundColor"
        />
        <ColorField
          label="Badge Text Color"
          value={localData?.badgeTextColor || "#6342EC"}
          path="hero2.badgeTextColor"
        />
        <ColorField
          label="Badge Border Color"
          value={localData?.badgeBorderColor || "rgba(99, 66, 236, 0.3)"}
          path="hero2.badgeBorderColor"
        />
        <ColorField
          label="Title Color"
          value={localData?.titleColor || "#111827"}
          path="hero2.titleColor"
        />
        <ColorField
          label="Description Color"
          value={localData?.descriptionColor || "#4B5563"}
          path="hero2.descriptionColor"
        />
        <ColorField
          label="Primary Button Background"
          value={
            localData?.primaryButtonBackgroundColor ||
            "linear-gradient(90deg, #6342EC 0%, #4731D8 100%)"
          }
          path="hero2.primaryButtonBackgroundColor"
        />
        <ColorField
          label="Primary Button Text Color"
          value={localData?.primaryButtonTextColor || "#FFFFFF"}
          path="hero2.primaryButtonTextColor"
        />
        <ColorField
          label="Video Button Background"
          value={
            localData?.videoButtonBackgroundColor || "rgba(255, 255, 255, 0.3)"
          }
          path="hero2.videoButtonBackgroundColor"
        />
        <ColorField
          label="Video Button Text Color"
          value={localData?.videoButtonTextColor || "#111827"}
          path="hero2.videoButtonTextColor"
        />
        <ColorField
          label="Video Button Icon Color"
          value={localData?.videoButtonIconColor || "#111827"}
          path="hero2.videoButtonIconColor"
        />

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={saveChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </FormGroup>

      <FormGroup title="Slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="p-3 bg-sidebar rounded-md space-y-3 mb-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-700">
                Slide {index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSlide(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <TextField
              label="Badge Text"
              value={slide.badge || ""}
              path={`hero2.slides.${index}.badge`}
              placeholder="e.g. Welcome to Infinia"
            />

            <TextField
              label="Title"
              value={slide.title || ""}
              path={`hero2.slides.${index}.title`}
              placeholder="e.g. Best Solutions for Innovation"
            />

            <TextAreaField
              label="Description"
              value={slide.description || ""}
              path={`hero2.slides.${index}.description`}
              placeholder="Enter slide description"
            />

            <FormGroup title="Primary Button" className="ml-4 mt-2">
              <TextField
                label="Button Text"
                value={slide.primaryButtonText || ""}
                path={`hero2.slides.${index}.primaryButtonText`}
                placeholder="e.g. View Our Services"
              />
              <LinkField
                label="Button Link"
                value={slide.primaryButtonLink || ""}
                path={`hero2.slides.${index}.primaryButtonLink`}
                placeholder="e.g. /services"
              />
            </FormGroup>

            <FormGroup title="Video Button" className="ml-4 mt-2">
              <ToggleField
                label="Show Video Button"
                value={slide.videoButtonVisible !== false}
                path={`hero2.slides.${index}.videoButtonVisible`}
              />
              <TextField
                label="Button Text"
                value={slide.videoButtonText || ""}
                path={`hero2.slides.${index}.videoButtonText`}
                placeholder="e.g. Video Guide"
              />
            </FormGroup>

            <div className="mt-3">
              <ImageUploadField
                label="Background Image"
                value={slide.backgroundImage || ""}
                path={`hero2.slides.${index}.backgroundImage`}
              />
            </div>

           
          </div>
        ))}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
            onClick={handleAddSlide}
          >
            Add Slide
          </button>
          {slides.length > 1 && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              onClick={() => handleRemoveSlide(slides.length - 1)}
            >
              Remove Last Slide
            </button>
          )}
        </div>
      </FormGroup>
    </div>
  );
}

// Hero 2 Media Form
function Hero2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Slides Media">
        {(data?.slides || []).map((slide: any, index: number) => (
          <div key={index} className="mb-4 p-3 bg-sidebar rounded-md">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Slide {index + 1}
            </div>
            <ImageUploadField
              label="Background Image"
              value={slide.backgroundImage || ""}
              path={`hero2.slides.${index}.backgroundImage`}
            />
            <ImageUploadField
              label="Line Image"
              value={slide.lineImage || ""}
              path={`hero2.slides.${index}.lineImage`}
              className="mt-3"
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}
