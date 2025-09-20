"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { updateFeatures, getFeatures } from "@/redux/actions/featuresActions";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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

// Feature type options
const featureTypes = [
  { value: "features1", label: "Features 1" },
  { value: "features4", label: "Features 4" },
  { value: "features5", label: "Features 5" },
  { value: "features8", label: "Features 8" },
  { value: "features10", label: "Features 10" },
];

export default function FeaturesEditor() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { features, loading, success, error } = useSelector(
    (state: RootState) => state.features
  );
  
  // State for preview iframe
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Component selection state
  const [activeComponent, setActiveComponent] = useState("features1");
  const [featuresData, setFeaturesData] = useState<any>(null);
  const [initialFeaturesData, setInitialFeaturesData] = useState<any>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  // Yükleniyor...ate
  const [isLoading, setIsLoading] = useState(true);
  
  // User authentication check
  const { user, loading: userLoading } = useSelector((state: RootState) => state.user);

  // Load features data
  useEffect(() => {
    dispatch(getFeatures());
  }, [dispatch]);
  
  // Update local state when features data is loaded
  useEffect(() => {
    if (features) {
      setFeaturesData(features);
      setInitialFeaturesData(JSON.parse(JSON.stringify(features))); // Deep copy
      setActiveComponent(features.activeFeature || "features1");
      setIsLoading(false);
      
      // Set preview immediately when data is loaded
      if (showPreview) {
        sendDataToPreview();
      }
    }
  }, [features]);


  // Send current data to preview iframe
  const sendDataToPreview = () => {
    if (previewIframeRef.current && previewIframeRef.current.contentWindow) {
      const previewData = {
        ...featuresData,
        activeFeature: activeComponent
      };
      
      previewIframeRef.current.contentWindow.postMessage({
        type: "UPDATE_FEATURES_DATA",
        featuresData: previewData
      }, "*");
    }
  };

  // Handle component selection
  const handleComponentChange = (componentName: string) => {
    setActiveComponent(componentName);
    
    // Update the component selection in data
    setFeaturesData((prev: any) => ({
      ...prev,
      activeFeature: componentName
    }));
  };

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;

    const activeFeature = data.activeFeature || "features1";

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
            label="Feature Type"
            value={activeFeature}
            options={featureTypes}
            onChange={(value) => handleComponentChange(value)}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeFeature === "features1" ? (
            <Features1ContentForm data={data.features1 || {}} />
          ) : activeFeature === "features4" ? (
            <Features4ContentForm data={data.features4 || {}} />
          ) : activeFeature === "features5" ? (
            <Features5ContentForm 
              data={data.features5 || {}} 
              updateFeaturesData={setFeaturesData}
            />
          ) : activeFeature === "features8" ? (
            <Features8ContentForm data={data.features8 || {}} />
          ) : (
            <Features10ContentForm data={data.features10 || {}} />
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
          {activeFeature === "features1" ? (
            <Features1MediaForm data={data.features1 || {}} />
          ) : activeFeature === "features4" ? (
            <Features4MediaForm data={data.features4 || {}} />
          ) : activeFeature === "features5" ? (
            <Features5MediaForm data={data.features5 || {}} />
          ) : activeFeature === "features8" ? (
            <Features8MediaForm data={data.features8 || {}} />
          ) : (
            <Features10MediaForm data={data.features10 || {}} />
          )}
        </TabsContent>
      </Tabs>
    );
  };

  // If still loading, return loading indicator
  if (isLoading || loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/features"
      sectionType="features"
      uploadHandler={uploadImageToCloudinary}
      initialData={featuresData}
      disableAutoSave={true}
      saveHandler={async (data) => {
        try {
          // Use Redux to update features data
          await dispatch(updateFeatures(data));
          return { success: true };
        } catch (error) {
          console.error("Error saving features data:", error);
          return { success: false, error: "Failed to save features data" };
        }
      }}
    >
      <EditorLayout
        title="Features Editor"
        sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
      >
        <SectionPreview 
          previewUrl="/preview/features" 
          paramName="featuresData" 
          ref={previewIframeRef}
        />
      </EditorLayout>
    </EditorProvider>
  );
}

// Features1 Content Form
function Features1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badge?.visible !== false}
          path="features1.badge.visible"
        />
        <TextField
          label="Badge Label"
          value={data?.badge?.label || ""}
          path="features1.badge.label"
          placeholder="e.g. Our Features"
        />
        <ColorField
          label="Background Color"
          value={data?.badge?.backgroundColor || ""}
          path="features1.badge.backgroundColor"
        />
        <ColorField
          label="Label Text Color"
          value={data?.badge?.labelTextColor || "#6342EC"}
          path="features1.badge.labelTextColor"
        />
      </FormGroup>

      <FormGroup title="Title">
        <TextField
          label="Title Part 1"
          value={data?.title?.part1 || ""}
          path="features1.title.part1"
        />
        <TextField
          label="Title Part 2 (Bold)"
          value={data?.title?.part2 || ""}
          path="features1.title.part2"
        />
        <TextField
          label="Title Part 3 (Accent)"
          value={data?.title?.part3 || ""}
          path="features1.title.part3"
        />
        <ColorField
          label="Accent Text Color"
          value={data?.title?.part3TextColor || "#6342EC"}
          path="features1.title.part3TextColor"
        />
      </FormGroup>

      <FormGroup title="Video">
        <TextField
          label="YouTube Video ID"
          value={data?.videoId || ""}
          path="features1.videoId"
          placeholder="e.g. gXFATcwrO-U"
        />
      </FormGroup>

      <FormGroup title="Features">
        {(data?.features || []).map((feature: any, index: number) => (
          <FormGroup
            key={index}
            title={`Feature ${index + 1}`}
            className="ml-4 mt-2 p-3 bg-sidebar rounded-md"
          >
            <TextField
              label="Title"
              value={feature.title || ""}
              path={`features1.features.${index}.title`}
            />
            <TextAreaField
              label="Description"
              value={feature.description || ""}
              path={`features1.features.${index}.description`}
            />
            <ColorField
              label="Background Color"
              value={feature.backgroundColor || ""}
              path={`features1.features.${index}.backgroundColor`}
            />
            <ColorField
              label="Title Color"
              value={feature.titleColor || ""}
              path={`features1.features.${index}.titleColor`}
            />
            <ColorField
              label="Description Color"
              value={feature.descriptionColor || ""}
              path={`features1.features.${index}.descriptionColor`}
            />
            <ColorField
              label="Icon Background Color"
              value={feature.iconBackgroundColor || ""}
              path={`features1.features.${index}.iconBackgroundColor`}
            />
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

// Features1 Media Form
function Features1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Image 1"
        value={data?.images?.img1 || ""}
        path="features1.images.img1"
      />
      <ImageUploadField
        label="Image 2"
        value={data?.images?.img2 || ""}
        path="features1.images.img2"
      />
      <ImageUploadField
        label="Image 3"
        value={data?.images?.img3 || ""}
        path="features1.images.img3"
      />
      <ImageUploadField
        label="Background Ellipse"
        value={data?.images?.bgEllipse || ""}
        path="features1.images.bgEllipse"
      />
      <ImageUploadField
        label="Large Star"
        value={data?.images?.starLg || ""}
        path="features1.images.starLg"
      />
      <ImageUploadField
        label="Medium Star"
        value={data?.images?.starMd || ""}
        path="features1.images.starMd"
      />
      <ImageUploadField
        label="Badge Icon (Dots)"
        value={data?.images?.dots || ""}
        path="features1.images.dots"
      />
      {(data?.features || []).map((feature: any, index: number) => (
        <FormGroup
          key={index}
          title={`Feature ${index + 1} Icon`}
          className="p-3 bg-sidebar rounded-md"
        >
          <ImageUploadField
            label="Icon"
            value={feature.icon || ""}
            path={`features1.features.${index}.icon`}
          />
        </FormGroup>
      ))}
    </div>
  );
}

// Features4 Content Form
function Features4ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="General">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || ""}
          path="features4.backgroundColor"
        />
      </FormGroup>
      
      <FormGroup title="Badge">
        <ToggleField
          label="Show Badge"
          value={data?.badge?.visible !== false}
          path="features4.badge.visible"
        />
        <TextField
          label="Badge Label"
          value={data?.badge?.label || ""}
          path="features4.badge.label"
        />
        <ColorField
          label="Badge Background Color"
          value={data?.badge?.backgroundColor || ""}
          path="features4.badge.backgroundColor"
        />
        <ColorField
          label="Label Text Color"
          value={data?.badge?.labelTextColor || "#6342EC"}
          path="features4.badge.labelTextColor"
        />
      </FormGroup>

      <FormGroup title="Title">
        <TextField
          label="Title Part 1"
          value={data?.title?.part1 || ""}
          path="features4.title.part1"
        />
        <TextField
          label="Title Part 2 (Bold)"
          value={data?.title?.part2 || ""}
          path="features4.title.part2"
        />
        <TextField
          label="Title Part 3"
          value={data?.title?.part3 || ""}
          path="features4.title.part3"
        />
        <ColorField
          label="Part 2 Text Color"
          value={data?.title?.part2TextColor || ""}
          path="features4.title.part2TextColor"
        />
      </FormGroup>

      <FormGroup title="Features">
        {(data?.features || []).map((feature: any, index: number) => (
          <FormGroup
            key={index}
            title={`Feature ${index + 1}`}
            className="ml-4 mt-2 p-3 bg-sidebar rounded-md"
          >
            <TextField
              label="Title"
              value={feature.title || ""}
              path={`features4.features.${index}.title`}
            />
            <TextAreaField
              label="Description"
              value={feature.description || ""}
              path={`features4.features.${index}.description`}
            />
            <ColorField
              label="Background Color"
              value={feature.backgroundColor || ""}
              path={`features4.features.${index}.backgroundColor`}
            />
            <ColorField
              label="Title Color"
              value={feature.titleColor || ""}
              path={`features4.features.${index}.titleColor`}
            />
            <ColorField
              label="Description Color"
              value={feature.descriptionColor || ""}
              path={`features4.features.${index}.descriptionColor`}
            />
            <ColorField
              label="Icon Color"
              value={feature.iconColor || ""}
              path={`features4.features.${index}.iconColor`}
            />
          </FormGroup>
        ))}
      </FormGroup>

      <FormGroup title="Primary Button">
        <ToggleField
          label="Show Primary Button"
          value={data?.buttons?.primary?.visible !== false}
          path="features4.buttons.primary.visible"
        />
        <TextField
          label="Button Text"
          value={data?.buttons?.primary?.text || ""}
          path="features4.buttons.primary.text"
        />
        <LinkField
          label="Button Link"
          value={data?.buttons?.primary?.link || ""}
          path="features4.buttons.primary.link"
        />
        <ColorField
          label="Button Background Color"
          value={data?.buttons?.primary?.backgroundColor || ""}
          path="features4.buttons.primary.backgroundColor"
        />
        <ColorField
          label="Button Text Color"
          value={data?.buttons?.primary?.textColor || "#FFFFFF"}
          path="features4.buttons.primary.textColor"
        />
        <ColorField
          label="Button Icon Color"
          value={data?.buttons?.primary?.iconColor || "#FFFFFF"}
          path="features4.buttons.primary.iconColor"
        />
      </FormGroup>

      <FormGroup title="Secondary Button">
        <ToggleField
          label="Show Secondary Button"
          value={data?.buttons?.secondary?.visible !== false}
          path="features4.buttons.secondary.visible"
        />
        <TextField
          label="Button Text"
          value={data?.buttons?.secondary?.text || ""}
          path="features4.buttons.secondary.text"
        />
        <LinkField
          label="Button Link"
          value={data?.buttons?.secondary?.link || ""}
          path="features4.buttons.secondary.link"
        />
        <ColorField
          label="Button Text Color"
          value={data?.buttons?.secondary?.textColor || ""}
          path="features4.buttons.secondary.textColor"
        />
      </FormGroup>
    </div>
  );
}

// Features4 Media Form
function Features4MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Badge Icon"
        value={data?.badge?.icon || ""}
        path="features4.badge.icon"
      />
      {(data?.features || []).map((feature: any, index: number) => (
        <FormGroup
          key={index}
          title={`Feature ${index + 1} Icon`}
          className="p-3 bg-sidebar rounded-md"
        >
          <ImageUploadField
            label="Icon"
            value={feature.icon || ""}
            path={`features4.features.${index}.icon`}
          />
        </FormGroup>
      ))}
    </div>
  );
}

// Features5 Content Form
function Features5ContentForm({ data, updateFeaturesData }: { data: any, updateFeaturesData: React.Dispatch<React.SetStateAction<any>> }) {
  const [sections, setSections] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any>(data);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    // When data changes, update our local state
    setLocalData(data);
    if (data.sections && Array.isArray(data.sections)) {
      // Sort sections by position
      const sortedSections = [...data.sections].sort((a, b) => a.position - b.position);
      setSections(sortedSections);
    }
  }, [data]);
  
  // Handle local state changes without dispatching to Redux immediately
  const handleLocalDataChange = (field: string, value: any) => {
    setLocalData((prev: any) => {
      const updated = { ...prev, [field]: value };
      updateFeaturesData((prevFeaturesData: any) => ({
        ...prevFeaturesData,
        features5: updated
      }));
      return updated;
    });
  };
  
  // Handle local section changes
  const handleLocalSectionChange = (sectionId: string, field: string, value: any) => {
    setSections(prevSections => {
      const newSections = prevSections.map(section => {
        if (section.id === sectionId) {
          // Handle nested fields like title.part1
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return {
              ...section,
              [parent]: {
                ...section[parent],
                [child]: value
              }
            };
          }
          // Handle direct fields
          return { ...section, [field]: value };
        }
        return section;
      });
      
      const newLocalData = { ...localData, sections: newSections };
      updateFeaturesData((prevFeaturesData: any) => ({
        ...prevFeaturesData,
        features5: newLocalData
      }));
      
      return newSections;
    });
  };
  
  // Save changes to Redux/backend
  const saveChanges = () => {
    // Save main features5 data
    dispatch(
      updateFeatures({
        features5: {
          backgroundColor: localData.backgroundColor,
          title: localData.title,
          titleColor: localData.titleColor,
          description: localData.description,
          descriptionColor: localData.descriptionColor
        }
      })
    );
    
    // Save each section's changes
    sections.forEach(section => {
      // Create a section update object with only standard properties
      const sectionUpdateData: any = {
        id: section.id,
        visible: section.visible,
        imagePosition: section.imagePosition,
        backgroundColor: section.backgroundColor,
        title: section.title,
        description: section.description,
        descriptionColor: section.descriptionColor
      };
      
      // Add new properties if they exist
      if (section.photoBackgroundColor) {
        sectionUpdateData.photoBackgroundColor = section.photoBackgroundColor;
      }
      if (section.gradientBackgroundColor) {
        sectionUpdateData.gradientBackgroundColor = section.gradientBackgroundColor;
      }
      if (section.gradientBackgroundColor2) {
        sectionUpdateData.gradientBackgroundColor2 = section.gradientBackgroundColor2;
      }
      
      dispatch(
        updateFeatures({
          features5: {
            sections: {
              operation: 'update',
              section: sectionUpdateData
            }
          }
        })
      );
    });
  };
  
  const handleAddSection = () => {
    // Create a new section with default values
    const newSection = {
      image: "/assets/imgs/features-5/img-default.png",
      imagePosition: "left" as "left" | "right",
      title: {
        part1: "New Section Title",
        part2: "Bold Part",
        part3: "Regular Part",
        part2Color: "",
        part3Color: ""
      },
      description: "New section description goes here.",
      descriptionColor: "",
      photoBackgroundColor: "",
      gradientBackgroundColor: "",
      gradientBackgroundColor2: ""
    };
    
    // Dispatch the add section action
    dispatch(
      updateFeatures({
        features5: {
          sections: {
            operation: 'add',
            section: newSection
          }
        }
      })
    );
  };
  
  const handleRemoveSection = (sectionId: string) => {
    if (sections.length <= 1) {
      alert("You must keep at least one section.");
      return;
    }
    
    // Confirm before removing
    if (confirm("Are you sure you want to remove this section?")) {
      dispatch(
        updateFeatures({
          features5: {
            sections: {
              operation: 'remove',
              sectionId
            }
          }
        })
      );
    }
  };
  
  const handleToggleVisibility = (section: any) => {
    handleLocalSectionChange(section.id, 'visible', !section.visible);
  };
  
  const handleChangeImagePosition = (section: any) => {
    const newPosition = section.imagePosition === 'left' ? 'right' : 'left';
    handleLocalSectionChange(section.id, 'imagePosition', newPosition);
  };

  return (
    <div className="space-y-6">
      <FormGroup title="General">
        <ColorField
          label="Background Color"
          value={localData?.backgroundColor || ""}
          path="features5.backgroundColor"
          onChange={(color) => handleLocalDataChange('backgroundColor', color)}
        />
        
        <div className="mt-4 flex justify-between">
          <button 
            type="button"
            onClick={saveChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            Save Changes
          </button>
          <button 
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
          >
            Add New Section
          </button>
        </div>
      </FormGroup>

      <FormGroup title="Title">
        <TextField
          label="Title"
          value={localData?.title || ""}
          path="features5.title"
          onChange={(e) => handleLocalDataChange('title', e.target.value)}
        />
        <ColorField
          label="Title Color"
          value={localData?.titleColor || ""}
          path="features5.titleColor"
          onChange={(color) => handleLocalDataChange('titleColor', color)}
        />
        <TextAreaField
          label="Description"
          value={localData?.description || ""}
          path="features5.description"
          onChange={(e) => handleLocalDataChange('description', e.target.value)}
        />
        <ColorField
          label="Description Color"
          value={localData?.descriptionColor || ""}
          path="features5.descriptionColor"
          onChange={(color) => handleLocalDataChange('descriptionColor', color)}
        />
      </FormGroup>
      
      {sections.map((section, index) => (
        <FormGroup 
          key={section.id} 
          title={`Section ${index + 1}`}
          className="border border-gray-200 rounded-lg overflow-hidden p-2"
        >
          <div className=" p-3 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Visible</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section.visible !== false}
                    onCheckedChange={() => handleToggleVisibility(section)}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Image Position</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section.imagePosition === 'right'}
                    onCheckedChange={() => handleChangeImagePosition(section)}
                  />
                  <span className="text-xs text-gray-500">
                    {section.imagePosition === 'left' ? 'Left' : 'Right'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveSection(section.id)}
                  className="inline-flex items-center px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">Section Preview</div>
              <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                <img 
                  src={section.image || `/assets/imgs/features-5/img-${index + 1}.png`}
                  alt="Section preview" 
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={section.image || ""}
              path={`features5.sections.${index}.image`}
            />
            
            <ColorField
              label="Section Background Color"
              value={section.backgroundColor || ""}
              path={`features5.sections.${index}.backgroundColor`}
              className="mt-3 mb-5"
              onChange={(color) => handleLocalSectionChange(section.id, 'backgroundColor', color)}
            />
            
            <FormGroup title="Image Styling" className="mt-4 mb-4 border-t pt-3">
           
              <ColorField
                label="Background Color"
                value={section.gradientBackgroundColor2 || ""}
                path={`features5.sections.${index}.gradientBackgroundColor2`}
                onChange={(color) => handleLocalSectionChange(section.id, 'gradientBackgroundColor2', color)}
              />
            </FormGroup>
            
            <TextField
              label="Title Part 1"
              value={section.title?.part1 || ""}
              path={`features5.sections.${index}.title.part1`}
              onChange={(e) => handleLocalSectionChange(section.id, 'title.part1', e.target.value)}
            />
            <TextField
              label="Title Part 2 (Bold)"
              value={section.title?.part2 || ""}
              path={`features5.sections.${index}.title.part2`}
              onChange={(e) => handleLocalSectionChange(section.id, 'title.part2', e.target.value)}
            />
            <ColorField
              label="Part 2 Color"
              value={section.title?.part2Color || ""}
              path={`features5.sections.${index}.title.part2Color`}
              onChange={(color) => handleLocalSectionChange(section.id, 'title.part2Color', color)}
            />
            <TextAreaField
              label="Description"
              value={section.description || ""}
              path={`features5.sections.${index}.description`}
              onChange={(e) => handleLocalSectionChange(section.id, 'description', e.target.value)}
            />
            <ColorField
              label="Description Color"
              value={section.descriptionColor || ""}
              path={`features5.sections.${index}.descriptionColor`}
              onChange={(color) => handleLocalSectionChange(section.id, 'descriptionColor', color)}
            />
          </div>
        </FormGroup>
      ))}
    </div>
  );
}

// Features5 Media Form
function Features5MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Section images are managed in the Content tab for each individual section.
      </div>
    </div>
  );
}

// Features8 Content Form
function Features8ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="General">
        <TextField
          label="Title"
          value={data?.title || ""}
          path="features8.title"
        />
        <TextAreaField
          label="Description"
          value={data?.description || ""}
          path="features8.description"
        />
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || ""}
          path="features8.backgroundColor"
        />
        <ColorField
          label="Title Color"
          value={data?.titleColor || "#FFFFFF"}
          path="features8.titleColor"
        />
        <ColorField
          label="Description Color"
          value={data?.descriptionColor || "#FFFFFF"}
          path="features8.descriptionColor"
        />
        <ColorField
          label="Values Title Color"
          value={data?.valuesTitleColor || "#FFFFFF"}
          path="features8.valuesTitleColor"
        />
        <ColorField
          label="Values Description Color"
          value={data?.valuesDescriptionColor || "#FFFFFF"}
          path="features8.valuesDescriptionColor"
        />
      </FormGroup>

      <FormGroup title="Values">
        {(data?.values || []).map((value: any, index: number) => (
          <FormGroup
            key={index}
            title={`Value ${index + 1}`}
            className="ml-4 mt-2 p-3 bg-sidebar rounded-md"
          >
            <TextField
              label="Title"
              value={value.title || ""}
              path={`features8.values.${index}.title`}
            />
            <TextAreaField
              label="Description"
              value={value.description || ""}
              path={`features8.values.${index}.description`}
            />
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

// Features8 Media Form
function Features8MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Star Icon"
        value={data?.starIcon || ""}
        path="features8.starIcon"
      />
      {(data?.values || []).map((value: any, index: number) => (
        <FormGroup
          key={index}
          title={`Value ${index + 1} Icon`}
          className="p-3 bg-sidebar rounded-md"
        >
          <ImageUploadField
            label="Icon"
            value={value.icon || ""}
            path={`features8.values.${index}.icon`}
          />
        </FormGroup>
      ))}
    </div>
  );
}

// Features10 Content Form
function Features10ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="General">
        <ColorField
          label="Background Color"
          value={data?.backgroundColor || ""}
          path="features10.backgroundColor"
        />
      </FormGroup>

      <FormGroup title="Features">
        {(data?.features || []).map((feature: any, index: number) => (
          <FormGroup
            key={index}
            title={`Feature ${index + 1}`}
            className="ml-4 mt-2 p-3 bg-sidebar rounded-md"
          >
            <TextField
              label="Title"
              value={feature.title || ""}
              path={`features10.features.${index}.title`}
            />
            <TextAreaField
              label="Description"
              value={feature.description || ""}
              path={`features10.features.${index}.description`}
            />
            <ColorField
              label="Background Color"
              value={feature.backgroundColor || ""}
              path={`features10.features.${index}.backgroundColor`}
            />
            <ColorField
              label="Title Color"
              value={feature.titleColor || ""}
              path={`features10.features.${index}.titleColor`}
            />
            <ColorField
              label="Description Color"
              value={feature.descriptionColor || ""}
              path={`features10.features.${index}.descriptionColor`}
            />
            <ColorField
              label="Icon Background Color"
              value={feature.iconBackgroundColor || ""}
              path={`features10.features.${index}.iconBackgroundColor`}
            />
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  );
}

// Features10 Media Form
function Features10MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Background Image"
        value={data?.backgroundImage || ""}
        path="features10.backgroundImage"
      />
      {(data?.features || []).map((feature: any, index: number) => (
        <FormGroup
          key={index}
          title={`Feature ${index + 1} Icon`}
          className="p-3 bg-sidebar rounded-md"
        >
          <ImageUploadField
            label="Icon"
            value={feature.icon || ""}
            path={`features10.features.${index}.icon`}
          />
        </FormGroup>
      ))}
    </div>
  );
} 