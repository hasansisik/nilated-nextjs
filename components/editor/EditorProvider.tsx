"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

// Preview mode types
export type PreviewMode = "desktop" | "tablet" | "mobile";

// Editor context for the necessary functionality
export interface EditorContextType {
  sectionData: any;
  setSectionData: (data: any) => void;
  selectedSection: number | null;
  setSelectedSection: (id: number | null) => void;
  sectionType: string;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  alertType: "success" | "error";
  setAlertType: (type: "success" | "error") => void;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
  showSuccessAlert: (message: string) => void;
  showErrorAlert: (message: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  updateIframeContent: () => void;
  saveChangesToAPI: (data: any) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  imageUploading: boolean; 
  setImageUploading: (uploading: boolean) => void;
  handleTextChange: (value: string, path: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => Promise<void>;
  savedData: any;
  saveCurrentData: () => void;
  data: any;
  uploadFile: (file: File, path: string) => Promise<string>;
  updateData: (path: string, value: string | boolean | number | object) => void;
  handleSubmit: () => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  saved: boolean;
  error: string | null;
}

// Create context with default values
export const EditorContext = createContext<EditorContextType>({
  sectionData: null,
  sectionType: '',
  loading: false,
  handleTextChange: () => {},
  updateData: () => {},
  handleImageUpload: async () => '',
  handleImageDelete: () => {},
  handleSave: async () => ({ success: false }),
  isSaving: false,
  saveError: null,
  saveSuccess: false,
  resetSaveState: () => {},
  savedData: null,
  saveCurrentData: () => {},
  selectedSection: null,
  setSelectedSection: () => {},
  previewMode: "desktop",
  setPreviewMode: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  showAlert: false,
  setShowAlert: () => {},
  alertType: "success",
  setAlertType: () => {},
  alertMessage: "",
  setAlertMessage: () => {},
  showSuccessAlert: () => {},
  showErrorAlert: () => {},
  iframeRef: { current: null },
  updateIframeContent: () => {},
  saveChangesToAPI: async () => {},
  isLoading: false,
  setIsLoading: () => {},
  imageUploading: false,
  setImageUploading: () => {},
  data: null,
  uploadFile: async () => '',
  handleSubmit: async () => ({ success: false }),
  saved: false,
  error: null,
});

// EditorProvider props type
interface EditorProviderProps {
  children: ReactNode;
  apiEndpoint: string;
  sectionType: string;
  defaultSection?: number | null;
  uploadHandler?: (file: File) => Promise<string>;
  initialData?: any;
  saveHandler?: (data: any) => Promise<{success: boolean, error?: string}>;
  disableAutoSave?: boolean;
}

export const EditorProvider = ({ 
  children, 
  apiEndpoint,
  sectionType,
  defaultSection = null,
  uploadHandler,
  initialData = null,
  saveHandler,
  disableAutoSave = false
}: EditorProviderProps) => {
  const [sectionData, setSectionData] = useState<any>(initialData);
  const [savedData, setSavedData] = useState<any>(initialData);
  const [selectedSection, setSelectedSection] = useState<number | null>(defaultSection);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Save the current data to the saved state to trigger a preview update
  const saveCurrentData = () => {
    setSavedData({...sectionData});
    updateIframeContent();
  };

  // Load data from API if no initial data provided
  useEffect(() => {
    if (initialData) {
      setSectionData(initialData);
      setSavedData(initialData);
      
      // Force immediate iframe update
      setTimeout(() => {
        updateIframeContent();
      }, 100);
      
      return;
    }
    
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`${apiEndpoint}?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: { revalidate: 0 }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSectionData(data);
          setSavedData(data);
          
          // Force immediate iframe update
          setTimeout(() => {
            updateIframeContent();
          }, 100);
        } else {
          console.error(`Error fetching initial ${sectionType} data:`, await response.text());
          showErrorAlert(`Failed to load ${sectionType} data. Please try again.`);
        }
      } catch (error) {
        console.error(`Error in initial data fetch:`, error);
        showErrorAlert('Failed to connect to the server. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [apiEndpoint, initialData, sectionType]);

  // Instead of relying on saveCurrentData function being called explicitly,
  // Let's add a useEffect to automatically update the savedData when sectionData changes

  useEffect(() => {
    // Don't update on initial load
    if (initialData && !savedData) return;
    
    // Use a debounce approach to avoid too frequent updates
    const updateTimer = setTimeout(() => {
      // Only update if there are actual changes
      if (JSON.stringify(sectionData) !== JSON.stringify(savedData)) {
        setSavedData({...sectionData});
      }
    }, 2000); // 2 second debounce
    
    return () => clearTimeout(updateTimer);
  }, [sectionData, savedData, initialData]);

  // Add an auto-save effect
  useEffect(() => {
    if (!sectionData || disableAutoSave) return;
    
    // Use a debounce to avoid too frequent API calls
    const saveTimer = setTimeout(() => {
      // Call the API with the current section data
      saveChangesToAPI(sectionData);
    }, 3000); // 3 second debounce for API saving
    
    return () => clearTimeout(saveTimer);
  }, [sectionData, disableAutoSave]);

  // Function to update iframe content
  const updateIframeContent = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    
    
    if (sectionType === "hero") {
      iframeRef.current.contentWindow.postMessage({
        type: "UPDATE_HERO_DATA",
        heroData: sectionData
      }, "*");
    } else {
      iframeRef.current.contentWindow.postMessage({
        type: "UPDATE_SECTION_DATA",
        sectionData: sectionData,
        sectionType: sectionType
      }, "*");
    }
  };

  // Show success alert
  const showSuccessAlert = (message: string) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  // Show error alert
  const showErrorAlert = (message: string) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  // Handle text change with auto-save
  const handleTextChange = (value: string, path: string) => {
    // Handle boolean values from string
    let parsedValue: string | boolean | number = value;
    
    // Convert "true"/"false" strings to actual boolean values
    if (value === "true") {
      parsedValue = true;
    } else if (value === "false") {
      parsedValue = false;
    }
    
    // Use our updateData method that properly clones objects
    updateData(path, parsedValue);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => {
    const file = e.target.files?.[0];
    if (!file || !uploadHandler) return;

    try {
      setImageUploading(true);
      // Upload image using the provided handler
      const uploadedUrl = await uploadHandler(file);

      // Use our improved updateData method to update the image path
      updateData(imagePath, uploadedUrl);
      
      // Success message
      showSuccessAlert("Image uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  // Function to save changes to API
  const saveChangesToAPI = async (data: any) => {
    try {
      if (!data) return;

      // Use custom save handler if provided, otherwise use default API endpoint
      if (saveHandler) {
        const result = await saveHandler(data);
        if (result.success) {
          showSuccessAlert(`${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} updated successfully!`);
          
          // If we're saving Hero2 slides, make sure we update the preview too
          if (data.hero2 && data.hero2.slides) {
            setSavedData({...sectionData});
            setTimeout(() => {
              updateIframeContent();
            }, 100);
          }
        } else {
          showErrorAlert(result.error || `Failed to update ${sectionType}.`);
        }
        return;
      }

      // Default behavior using API endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSuccessAlert(`${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} updated successfully!`);
        
        // If we're saving Hero2 slides, make sure we update the preview too
        if (data.hero2 && data.hero2.slides) {
          setSavedData({...sectionData});
          setTimeout(() => {
            updateIframeContent();
          }, 100);
        }
      } else {
        const errorText = await response.text();
        console.error(`API Error:`, errorText);
        showErrorAlert(`Failed to update ${sectionType}. Please try again.`);
      }
    } catch (error) {
      console.error(`Error saving ${sectionType} data:`, error);
      showErrorAlert(`An error occurred while saving. Please check your connection.`);
    }
  };

  // Inside the EditorProvider component, update the updateData method
  const updateData = (path: string, value: string | boolean | number | object) => {
    if (!path) return;

    try {
      // Create a deep clone of the entire object to avoid modifying read-only properties
      const updatedData = JSON.parse(JSON.stringify(sectionData));
      const pathArray = path.split('.');

      // Handle array paths like 'hero2.slides.0.title'
      let current = updatedData;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        
        // Handle array indices
        if (i < pathArray.length - 2 && !isNaN(Number(pathArray[i + 1]))) {
          // We have an array index coming next
          if (!current[key]) {
            current[key] = [];
          } else if (!Array.isArray(current[key])) {
            current[key] = [];
          }
        } 
        // Create object if it doesn't exist
        else if (!current[key]) {
          current[key] = {};
        }
        
        current = current[key];
      }

      const lastKey = pathArray[pathArray.length - 1];
      current[lastKey] = value;

      // Update state with the new cloned object
      setSectionData(updatedData);
      
      // Always update saved data to refresh preview
      setSavedData({...updatedData});
      
      // Always schedule a preview update
      setTimeout(() => {
        updateIframeContent();
      }, 100);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Create context value
  const contextValue: EditorContextType = {
    sectionData,
    setSectionData,
    selectedSection,
    setSelectedSection,
    sectionType,
    previewMode,
    setPreviewMode,
    sidebarCollapsed, 
    setSidebarCollapsed,
    showAlert,
    setShowAlert,
    alertType,
    setAlertType,
    alertMessage,
    setAlertMessage,
    showSuccessAlert,
    showErrorAlert,
    iframeRef,
    updateIframeContent,
    saveChangesToAPI,
    isLoading,
    setIsLoading,
    imageUploading,
    setImageUploading,
    handleTextChange,
    handleImageUpload,
    savedData,
    saveCurrentData,
    data: sectionData,
    uploadFile: async (file: File, path: string) => {
      // Implementation of uploadFile method
      return ""; // Placeholder return, actual implementation needed
    },
    updateData,
    handleSubmit: async () => ({ success: false }),
    isSaving: false,
    saved: false,
    error: null,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const updateDataInObject = (obj: any, path: string, value: string | boolean | number): any => {
  // Create a deep clone of the object to avoid modifying read-only properties
  const newObj = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current = newObj;
  
  // Navigate to the right depth
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    // Handle array indices
    if (key.includes('[') && key.includes(']')) {
      const arrKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
      if (!current[arrKey]) current[arrKey] = [];
      if (!current[arrKey][index]) current[arrKey][index] = {};
      current = current[arrKey][index];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
  
  // Set the value at the final key
  const finalKey = keys[keys.length - 1];
  // Handle array indices in the final key
  if (finalKey.includes('[') && finalKey.includes(']')) {
    const arrKey = finalKey.substring(0, finalKey.indexOf('['));
    const index = parseInt(finalKey.substring(finalKey.indexOf('[') + 1, finalKey.indexOf(']')));
    if (!current[arrKey]) current[arrKey] = [];
    current[arrKey][index] = value;
  } else {
    current[finalKey] = value;
  }
  
  return newObj;
}; 