"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getHeader, updateHeader } from "@/redux/actions/headerActions";
import { RootState } from "@/redux/store";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Upload,
  Moon,
  Sun,
  Trash2,
  Pencil,
  ArrowLeft,
  Layout,
  Type,
  Settings,
  Image,
} from "lucide-react";
import { SortableList } from "@/components/ui/sortable-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";

// Define types for menu items
interface MenuItem {
  _id: string;
  name: string;
  link: string;
  order: number;
}

interface TopBarItem {
  _id: string;
  name: string;
  content: string;
  order: number;
}

interface HeaderData {
  mainMenu: MenuItem[];
  socialLinks: MenuItem[];
  topBarItems: TopBarItem[];
  logoText: string;
  logoUrl: string;
  showDarkModeToggle: boolean;
  showActionButton: boolean;
  showSecondActionButton: boolean;
  actionButtonText: string;
  actionButtonLink: string;
  buttonColor: string;
  buttonTextColor: string;
  secondActionButtonText: string;
  secondActionButtonLink: string;
  secondButtonColor: string;
  secondButtonTextColor: string;
  secondButtonBorderColor: string;
  headerComponent: string;
  workingHours: string;
  topBarColor: string;
  topBarTextColor: string;
  mobileMenuButtonColor: string;
  phoneIconBgColor?: string;
  phoneIconColor?: string;
  phoneQuestionText?: string;
}

// Topbar item tipleri ve iconları için sabit listeler
const topBarItemTypes = [
  { name: "Phone", icon: "phone" },
  { name: "Email", icon: "email" },
  { name: "Address", icon: "location" },
  { name: "Hours", icon: "clock" }
];

// Social media tipleri ve iconları
const socialMediaTypes = [
  { name: "Facebook", icon: "facebook" },
  { name: "Twitter", icon: "twitter" },
  { name: "LinkedIn", icon: "linkedin" },
  { name: "Instagram", icon: "instagram" },
  { name: "Behance", icon: "behance" },
  { name: "YouTube", icon: "youtube" },
  { name: "Pinterest", icon: "pinterest" }
];

// Props for HeaderEditorContent
interface HeaderEditorContentProps {
  headers: {
    id: number;
    name: string;
    image: string;
    hasTopBar: boolean;
    buttonText: string;
    component: string;
  }[];
  selectedHeader: number | null;
  setSelectedHeader: (header: number | null) => void;
  headerData: HeaderData;
  setHeaderData: (data: HeaderData) => void;
  handleItemAdd: (e: React.FormEvent) => void;
  handleItemDelete: (itemId: string, type: string) => void;
  handleItemsReorder: (updatedItems: MenuItem[] | TopBarItem[], type: string) => void;
  handleEditItem: (itemId: string, type: string) => void;
  handleUpdateItem: (e: React.FormEvent) => void;
  menuDialogOpen: boolean;
  setMenuDialogOpen: (open: boolean) => void;
  topBarDialogOpen: boolean;
  setTopBarDialogOpen: (open: boolean) => void;
  socialDialogOpen: boolean;
  setSocialDialogOpen: (open: boolean) => void;
  logoUploading: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newItem: {
    name: string;
    link: string;
    content: string;
    type: string;
  };
  setNewItem: (item: { name: string; link: string; content: string; type: string }) => void;
  sortedMainMenu: MenuItem[];
  sortedSocialLinks: MenuItem[];
  sortedTopBarItems: TopBarItem[];
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editedItem: {
    _id: string;
    name: string;
    link: string;
    content: string;
    type: string;
  };
  setEditedItem: (item: { _id: string; name: string; link: string; content: string; type: string }) => void;
  handleSaveChanges: () => void;
  saveChangesToAPI: (data: any) => Promise<void>;
  dispatch: any;
}

export default function HeaderEditor() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { header, loading } = useSelector((state: RootState) => state.header);
  const [selectedHeader, setSelectedHeader] = useState<number | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData>({
    mainMenu: [],
    socialLinks: [],
    topBarItems: [],
    logoText: "Infinia",
    logoUrl: "/assets/imgs/template/favicon.svg",
    showDarkModeToggle: true,
    showActionButton: true,
    showSecondActionButton: false,
    actionButtonText: "Join For Free Trial",
    actionButtonLink: "/contact",
    buttonColor: "#3b71fe",
    buttonTextColor: "#ffffff",
    secondActionButtonText: "Kayıt Ol",
    secondActionButtonLink: "/register",
    secondButtonColor: "#ffffff",
    secondButtonTextColor: "#3b71fe",
    secondButtonBorderColor: "#3b71fe",
    headerComponent: "Header1",
    workingHours: "Mon-Fri: 10:00am - 09:00pm",
    topBarColor: "#3b71fe",
    topBarTextColor: "#ffffff",
    mobileMenuButtonColor: "#3b71fe"
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [topBarDialogOpen, setTopBarDialogOpen] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({
    _id: "",
    name: "",
    link: "",
    content: "",
    type: "",
  });
  const [newItem, setNewItem] = useState({
    name: "",
    link: "",
    content: "",
    type: "mainMenu",
  });

  const headers = [
    {
      id: 1,
      name: "Header 1",
      image: "/assets/imgs/headers/header1.png",
      hasTopBar: false,
      buttonText: "Join For Free Trial",
      component: "Header1"
    },
    {
      id: 2,
      name: "Header 2",
      image: "/assets/imgs/headers/header2.png",
      hasTopBar: false,
      buttonText: "Join For Free Trial",
      component: "Header2"
    },
    {
      id: 3,
      name: "Header 3",
      image: "/assets/imgs/headers/header3.png",
      hasTopBar: true,
      buttonText: "Join For Free Trial",
      component: "Header3" 
    },
    {
      id: 4,
      name: "Header 4",
      image: "/assets/imgs/headers/header4.png",
      hasTopBar: false,
      buttonText: "",
      component: "Header4"
    },
    {
      id: 5,
      name: "Header 5",
      image: "/assets/imgs/headers/header5.png",
      hasTopBar: true,
      buttonText: "Get a Quote",
      component: "Header5"
    },

  ];

    // Fetch header data once when component mounts
  useEffect(() => {
    dispatch(getHeader() as any);
  }, []);

  // Initialize header data based on selection
  useEffect(() => {
    // Set default selected header if not already set
    if (selectedHeader === null) {
      const defaultHeaderId = 1; // Header1 as default
      setSelectedHeader(defaultHeaderId);
    }
    
    if (selectedHeader === null) return;

    const headerTemplate = headers.find((h) => h.id === selectedHeader);
    if (!headerTemplate) return;

    // Initial default values while waiting for API data
    const initialData = {
      mainMenu: [
        { _id: "1", name: "Home", link: "/", order: 0 },
        { _id: "2", name: "About", link: "/about", order: 1 },
        { _id: "3", name: "Services", link: "/services", order: 2 },
        { _id: "4", name: "Blog", link: "/blog", order: 3 },
        { _id: "5", name: "Contact", link: "/contact", order: 4 },
      ],
      socialLinks: selectedHeader === 5 ? [
        {
          _id: "1",
          name: "Twitter",
          link: "https://twitter.com/example",
          order: 0,
        },
        {
          _id: "2",
          name: "Facebook",
          link: "https://facebook.com/example",
          order: 1,
        },
        {
          _id: "3",
          name: "Instagram",
          link: "https://instagram.com/example",
          order: 2,
        }
      ] : [],
      topBarItems: headerTemplate.hasTopBar ? [
        { _id: "1", name: "Phone", content: "+01 (24) 568 900", order: 0 },
        { _id: "2", name: "Email", content: "contact@infinia.com", order: 1 },
        {
          _id: "3",
          name: "Address",
          content: "0811 Erdman Prairie, Joaville CA",
          order: 2,
        }
      ] : [],
      logoText: "Infinia",
      logoUrl: "/assets/imgs/template/favicon.svg",
      showDarkModeToggle: true,
      showActionButton: headerTemplate.buttonText !== "",
      showSecondActionButton: false,
      actionButtonText: headerTemplate.buttonText,
      actionButtonLink: "/contact",
      buttonColor: "#3b71fe",
      buttonTextColor: "#ffffff",
      secondActionButtonText: "Kayıt Ol",
      secondActionButtonLink: "/register",
      secondButtonColor: "#ffffff",
      secondButtonTextColor: "#3b71fe",
      secondButtonBorderColor: "#3b71fe",
      headerComponent: headerTemplate.component,
      workingHours: "Mon-Fri: 10:00am - 09:00pm",
      topBarColor: "#3b71fe",
      topBarTextColor: "#ffffff",
      mobileMenuButtonColor: "#3b71fe"
    };

    // If we already have header data from Redux, use it
    if (header) {
      const updatedData = {
        mainMenu: Array.isArray(header.mainMenu) ? header.mainMenu : initialData.mainMenu,
        socialLinks: Array.isArray(header.socialLinks) ? header.socialLinks : initialData.socialLinks,
        topBarItems: Array.isArray(header.topBarItems) ? header.topBarItems : initialData.topBarItems,
        logoText: header.logo?.text || initialData.logoText,
        logoUrl: header.logo?.src || initialData.logoUrl,
        showDarkModeToggle: header.showDarkModeToggle !== undefined ? header.showDarkModeToggle : initialData.showDarkModeToggle,
        showActionButton: header.showActionButton !== undefined ? header.showActionButton : initialData.showActionButton,
        showSecondActionButton: header.showSecondActionButton !== undefined ? header.showSecondActionButton : initialData.showSecondActionButton,
        actionButtonText: header.actionButtonText || header.links?.freeTrialLink?.text || initialData.actionButtonText,
        actionButtonLink: header.actionButtonLink || header.links?.freeTrialLink?.href || initialData.actionButtonLink,
        buttonColor: header.buttonColor || initialData.buttonColor,
        buttonTextColor: header.buttonTextColor || initialData.buttonTextColor,
        secondActionButtonText: header.secondActionButtonText || header.links?.secondActionButton?.text || initialData.secondActionButtonText,
        secondActionButtonLink: header.secondActionButtonLink || header.links?.secondActionButton?.href || initialData.secondActionButtonLink,
        secondButtonColor: header.secondButtonColor || initialData.secondButtonColor,
        secondButtonTextColor: header.secondButtonTextColor || initialData.secondButtonTextColor,
        secondButtonBorderColor: header.secondButtonBorderColor || initialData.secondButtonBorderColor,
        headerComponent: header.headerComponent || initialData.headerComponent,
        workingHours: header.workingHours || initialData.workingHours,
        topBarColor: header.topBarColor || initialData.topBarColor,
        topBarTextColor: header.topBarTextColor || initialData.topBarTextColor,
        mobileMenuButtonColor: header.mobileMenuButtonColor || initialData.mobileMenuButtonColor
      };
      setHeaderData(updatedData);
    } else {
    // Set initial data while waiting for API response
    setHeaderData(initialData);
    }
  }, [selectedHeader, header]);

  const showSuccessAlert = (message: string) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const showErrorAlert = (message: string) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLogoUploading(true);
      
      // Upload to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(file);

      // Update state with new logo URL
      const updatedData = {
        ...headerData,
        logoUrl: uploadedUrl,
      };
      
      // Update the local state
      setHeaderData(updatedData);
      
      // The EditorProvider's saveHandler will handle saving this data
      
      showSuccessAlert("Logo uploaded successfully");
    } catch (error: any) {
      console.error('Error during logo upload:', error);
      showErrorAlert(`Error uploading logo: ${error.message}`);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleItemAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (newItem.type === "mainMenu" || newItem.type === "socialLinks") {
      if (!newItem.name || !newItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (newItem.type === "topBarItems") {
      if (!newItem.name || !newItem.content) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    }

    const newId = Math.random().toString(36).substr(2, 9);
    let updatedData = { ...headerData };

    if (newItem.type === "mainMenu") {
      const newOrder = headerData.mainMenu.length;
      const newMainMenu = [
        ...headerData.mainMenu,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      updatedData = {
        ...headerData,
        mainMenu: newMainMenu,
      };
    } else if (newItem.type === "socialLinks") {
      const newOrder = headerData.socialLinks.length;
      const newSocialLinks = [
        ...headerData.socialLinks,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      updatedData = {
        ...headerData,
        socialLinks: newSocialLinks,
      };
    } else if (newItem.type === "topBarItems") {
      const newOrder = headerData.topBarItems.length;
      const newTopBarItems = [
        ...headerData.topBarItems,
        {
          _id: newId,
          name: newItem.name,
          content: newItem.content,
          order: newOrder,
        },
      ];

      updatedData = {
        ...headerData,
        topBarItems: newTopBarItems,
      };
    }

    // Update state with new data
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      name: "",
      link: "",
      content: "",
      type: "mainMenu",
    });

    // Close dialogs
    setMenuDialogOpen(false);
    setSocialDialogOpen(false);
    setTopBarDialogOpen(false);

    showSuccessAlert(`New ${newItem.type === "mainMenu" ? "menu item" : newItem.type === "socialLinks" ? "social link" : "top bar item"} added successfully`);
  };

  const handleItemDelete = (itemId: string, type: string) => {
    let updatedData = { ...headerData };

    if (type === "mainMenu") {
      const updatedMenu = headerData.mainMenu.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values to ensure they remain sequential
      const reorderedMenu = updatedMenu.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        mainMenu: reorderedMenu,
      };

      showSuccessAlert("Menu item deleted successfully");
    } else if (type === "socialLinks") {
      const updatedSocialLinks = headerData.socialLinks.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values
      const reorderedSocialLinks = updatedSocialLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        socialLinks: reorderedSocialLinks,
      };

      showSuccessAlert("Social link deleted successfully");
    } else if (type === "topBarItems") {
      const updatedTopBarItems = headerData.topBarItems.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values
      const reorderedTopBarItems = updatedTopBarItems.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        topBarItems: reorderedTopBarItems,
      };

      showSuccessAlert("Top bar item deleted successfully");
    }

    // Update state
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  const handleItemsReorder = (
    updatedItems: MenuItem[] | TopBarItem[],
    type: string
  ) => {
    // Ensure the updatedItems have their order values set correctly
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    let updatedData = { ...headerData };

    if (type === "mainMenu") {
      updatedData = {
        ...headerData,
        mainMenu: itemsWithUpdatedOrder as MenuItem[],
      };
      showSuccessAlert("Menu items reordered successfully");
    } else if (type === "socialLinks") {
      updatedData = {
        ...headerData,
        socialLinks: itemsWithUpdatedOrder as MenuItem[],
      };
      showSuccessAlert("Social links reordered successfully");
    } else if (type === "topBarItems") {
      updatedData = {
        ...headerData,
        topBarItems: itemsWithUpdatedOrder as TopBarItem[],
      };
      showSuccessAlert("Top bar items reordered successfully");
    }

    // Update state
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  const handleEditItem = (itemId: string, type: string) => {
    let itemToEdit;

    if (type === "mainMenu") {
      itemToEdit = headerData.mainMenu.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          content: "",
          type: "mainMenu",
        });
      }
    } else if (type === "socialLinks") {
      itemToEdit = headerData.socialLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          content: "",
          type: "socialLinks",
        });
      }
    } else if (type === "topBarItems") {
      itemToEdit = headerData.topBarItems.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: "",
          content: itemToEdit.content,
          type: "topBarItems",
        });
      }
    }

    setEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (editedItem.type === "mainMenu" || editedItem.type === "socialLinks") {
      if (!editedItem.name || !editedItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (editedItem.type === "topBarItems") {
      if (!editedItem.name || !editedItem.content) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    }

    if (editedItem.type === "mainMenu") {
      // Create a completely new array with the updated item
      const updatedMenu = headerData.mainMenu.map((item) =>
        item._id === editedItem._id
          ? { 
              ...item, 
              name: editedItem.name, 
              link: editedItem.link 
            }
          : item
      );

      // Log the changes for debugging


      // Update the state with the new array
      setHeaderData({
        ...headerData,
        mainMenu: updatedMenu,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        mainMenu: updatedMenu,
      });
      
      showSuccessAlert("Menu item updated successfully");
    } else if (editedItem.type === "socialLinks") {
      const updatedSocialLinks = headerData.socialLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      setHeaderData({
        ...headerData,
        socialLinks: updatedSocialLinks,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        socialLinks: updatedSocialLinks,
      });
      
      showSuccessAlert("Social link updated successfully");
    } else if (editedItem.type === "topBarItems") {
      const updatedTopBarItems = headerData.topBarItems.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, content: editedItem.content }
          : item
      );

      setHeaderData({
        ...headerData,
        topBarItems: updatedTopBarItems,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        topBarItems: updatedTopBarItems,
      });
      
      showSuccessAlert("Top bar item updated successfully");
    }

    // Reset the edited item
    setEditedItem({
      _id: "",
      name: "",
      link: "",
      content: "",
      type: "",
    });
    
    setEditDialogOpen(false);
  };

  // Function to update the editor with the latest header data from Redux store
  const refreshHeaderData = () => {
    if (selectedHeader === null || !header) return;
    
    const headerTemplate = headers.find((h) => h.id === selectedHeader);
    if (!headerTemplate) return;

    // Create updated header data with values from the Redux store
    const updatedHeaderData = {
      // These should come from the API via Redux
      mainMenu: Array.isArray(header.mainMenu) ? header.mainMenu : [],
      socialLinks: Array.isArray(header.socialLinks) ? header.socialLinks : [],
      topBarItems: Array.isArray(header.topBarItems) ? header.topBarItems : [],
          
      // Logo data should always come from the API
      logoText: header.logo?.text || "Infinia",
      logoUrl: header.logo?.src || "/assets/imgs/template/favicon.svg",
          
      // Settings from API
      showDarkModeToggle: header.showDarkModeToggle !== undefined ? header.showDarkModeToggle : true,
      showActionButton: header.showActionButton !== undefined ? header.showActionButton : headerTemplate.buttonText !== "",
      showSecondActionButton: header.showSecondActionButton !== undefined ? header.showSecondActionButton : false,
          
      // Button settings - get from API if available, otherwise use defaults
      actionButtonText: header.actionButtonText || header.links?.freeTrialLink?.text || headerTemplate.buttonText,
      actionButtonLink: header.actionButtonLink || header.links?.freeTrialLink?.href || "/contact",
          
      // Button colors from API or defaults
      buttonColor: header.buttonColor || "#3b71fe",
      buttonTextColor: header.buttonTextColor || "#ffffff",
      
      // Second button settings - prioritize individual properties over nested structure
      secondActionButtonText: header.secondActionButtonText || header.links?.secondActionButton?.text || "Kayıt Ol",
      secondActionButtonLink: header.secondActionButtonLink || header.links?.secondActionButton?.href || "/register",
      secondButtonColor: header.secondButtonColor || "#ffffff",
      secondButtonTextColor: header.secondButtonTextColor || "#3b71fe",
      secondButtonBorderColor: header.secondButtonBorderColor || "#3b71fe",
          
      // Component type from API or fall back to the header's component
      headerComponent: header.headerComponent || headerTemplate.component,
      workingHours: header.workingHours || "Mon-Fri: 10:00am - 09:00pm",
      topBarColor: header.topBarColor || "#3b71fe",
      topBarTextColor: header.topBarTextColor || "#ffffff",
      mobileMenuButtonColor: header.mobileMenuButtonColor || "#3b71fe",
      
      // Add phone-related properties 
      phoneIconBgColor: header.phoneIconBgColor || "#3b71fe",
      phoneIconColor: header.phoneIconColor || "#ffffff",
      phoneQuestionText: header.phoneQuestionText || "Have Any Questions?"
    };

    // Use functional state update to ensure we're working with the latest state
    setHeaderData(prevData => {
      // If the data is the same, don't trigger a re-render
      if (JSON.stringify(prevData) === JSON.stringify(updatedHeaderData)) {
        return prevData;
      }
      
      return updatedHeaderData;
    });
  };

  // Call refreshHeaderData when the selected header changes
  useEffect(() => {
    if (selectedHeader !== null) {
      refreshHeaderData();
    }
  }, [selectedHeader]);

  // After successful API operations, refresh data to ensure consistency
  const saveChangesToAPI = async (data: any) => {
    try {
      // Create the data structure to save
      const dataToSave = {
        logo: {
          src: data.logoUrl || headerData.logoUrl,
          alt: (data.logoText || headerData.logoText).toLowerCase(),
          text: data.logoText || headerData.logoText
        },
        links: {
          freeTrialLink: {
            href: data.actionButtonLink || headerData.actionButtonLink || "#",
            text: data.actionButtonText || headerData.actionButtonText || "Join For Free Trial"
          },
          secondActionButton: {
            href: data.secondActionButtonLink || headerData.secondActionButtonLink || "/register",
            text: data.secondActionButtonText || headerData.secondActionButtonText || "Kayıt Ol"
          }
        },
        mainMenu: data.mainMenu || headerData.mainMenu,
        socialLinks: data.socialLinks || headerData.socialLinks,
        topBarItems: data.topBarItems || headerData.topBarItems,
        showDarkModeToggle: typeof data.showDarkModeToggle === 'boolean' ? data.showDarkModeToggle : headerData.showDarkModeToggle,
        showActionButton: typeof data.showActionButton === 'boolean' ? data.showActionButton : headerData.showActionButton,
        showSecondActionButton: typeof data.showSecondActionButton === 'boolean' ? data.showSecondActionButton : headerData.showSecondActionButton,
        // Add these properties explicitly
        actionButtonText: data.actionButtonText || headerData.actionButtonText,
        actionButtonLink: data.actionButtonLink || headerData.actionButtonLink,
        secondActionButtonText: data.secondActionButtonText || headerData.secondActionButtonText,
        secondActionButtonLink: data.secondActionButtonLink || headerData.secondActionButtonLink,
        buttonColor: data.buttonColor || headerData.buttonColor || "#3b71fe",
        buttonTextColor: data.buttonTextColor || headerData.buttonTextColor || "#ffffff",
        secondButtonColor: data.secondButtonColor || headerData.secondButtonColor || "#ffffff",
        secondButtonTextColor: data.secondButtonTextColor || headerData.secondButtonTextColor || "#3b71fe",
        secondButtonBorderColor: data.secondButtonBorderColor || headerData.secondButtonBorderColor || "#3b71fe",
        headerComponent: data.headerComponent || headerData.headerComponent || "Header1",
        workingHours: data.workingHours || headerData.workingHours,
        topBarColor: data.topBarColor || headerData.topBarColor || "#3b71fe",
        topBarTextColor: data.topBarTextColor || headerData.topBarTextColor || "#ffffff",
        mobileMenuButtonColor: data.mobileMenuButtonColor || headerData.mobileMenuButtonColor || "#3b71fe",
        // Make sure these properties are included in the save
        phoneIconBgColor: data.phoneIconBgColor || headerData.phoneIconBgColor || "#3b71fe",
        phoneIconColor: data.phoneIconColor || headerData.phoneIconColor || "#ffffff",
        phoneQuestionText: data.phoneQuestionText !== undefined ? data.phoneQuestionText : (headerData.phoneQuestionText || "Have Any Questions?")
      };

      // Use Redux to update header
      await dispatch(updateHeader(dataToSave) as any);

      // Also update the API via the traditional endpoint for backward compatibility
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      const response = await fetch('/api/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(dataToSave),
        // Make sure we're not caching
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes to API endpoint');
      }

      // Update the iframe with new data
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "UPDATE_HEADER_DATA",
          headerData: dataToSave
        }, "*");
      }

      // Update local state to ensure UI consistency
      setHeaderData(prevData => ({
        ...prevData,
        ...data,
        secondActionButtonLink: data.secondActionButtonLink || prevData.secondActionButtonLink,
        secondActionButtonText: data.secondActionButtonText || prevData.secondActionButtonText,
        phoneIconBgColor: data.phoneIconBgColor || prevData.phoneIconBgColor,
        phoneIconColor: data.phoneIconColor || prevData.phoneIconColor,
        phoneQuestionText: data.phoneQuestionText !== undefined ? data.phoneQuestionText : prevData.phoneQuestionText
      }));

      // We don't show a success message here since the calling function will do it
      showSuccessAlert(`Header changes saved successfully!`);
      return await response.json();
    } catch (error: any) {
      console.error('Error saving menu changes:', error);
      showErrorAlert(`Error saving changes: ${error.message}`);
      throw error;
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare data to save
      const dataToSave = {
        logo: {
          src: headerData.logoUrl,
          alt: headerData.logoText.toLowerCase(),
          text: headerData.logoText
        },
        links: {
          freeTrialLink: {
            href: headerData.actionButtonLink || "#",
            text: headerData.actionButtonText || "Join For Free Trial"
          },
          secondActionButton: {
            href: headerData.secondActionButtonLink || "/register",
            text: headerData.secondActionButtonText || "Kayıt Ol"
          }
        },
        mainMenu: headerData.mainMenu,
        socialLinks: headerData.socialLinks,
        topBarItems: headerData.topBarItems,
        showDarkModeToggle: headerData.showDarkModeToggle,
        showActionButton: headerData.showActionButton,
        showSecondActionButton: headerData.showSecondActionButton,
        actionButtonText: headerData.actionButtonText,
        actionButtonLink: headerData.actionButtonLink,
        secondActionButtonText: headerData.secondActionButtonText,
        secondActionButtonLink: headerData.secondActionButtonLink,
        buttonColor: headerData.buttonColor || "#3b71fe",
        buttonTextColor: headerData.buttonTextColor || "#ffffff",
        secondButtonColor: headerData.secondButtonColor || "#ffffff",
        secondButtonTextColor: headerData.secondButtonTextColor || "#3b71fe",
        secondButtonBorderColor: headerData.secondButtonBorderColor || "#3b71fe",
        headerComponent: headerData.headerComponent,
        workingHours: headerData.workingHours,
        topBarColor: headerData.topBarColor || "#3b71fe",
        topBarTextColor: headerData.topBarTextColor || "#ffffff",
        mobileMenuButtonColor: headerData.mobileMenuButtonColor || "#3b71fe",
        phoneIconBgColor: headerData.phoneIconBgColor || "#3b71fe",
        phoneIconColor: headerData.phoneIconColor || "#ffffff",
        phoneQuestionText: headerData.phoneQuestionText || "Have Any Questions?"
      };

      // Dispatch ile Redux store'u güncelle
      await dispatch(updateHeader(dataToSave) as any);
      
      // API'yi doğrudan çağır
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      const response = await fetch('/api/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(dataToSave),
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes to API endpoint');
      }
      
      // Ardından iframe'i güncelle
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "UPDATE_HEADER_DATA",
          headerData: dataToSave
        }, "*");
      }
      
      // Refresh the iframe to ensure changes are visible
      refreshIframePreview();
      
      showSuccessAlert("Header changes saved successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  // Sort items by order field
  const sortedMainMenu = headerData?.mainMenu
    ? [...headerData.mainMenu].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const sortedSocialLinks = headerData?.socialLinks
    ? [...headerData.socialLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const sortedTopBarItems = headerData?.topBarItems
    ? [...headerData.topBarItems].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  // Function to refresh the iframe preview
  const refreshIframePreview = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        if (iframe) {
          iframe.src = currentSrc;
        }
      }, 100);
    }
  };

  return (
    <div className="w-full">
      <EditorProvider
        apiEndpoint="/api/header"
        sectionType="header"
        uploadHandler={uploadImageToCloudinary}
        initialData={headerData}
        disableAutoSave={true}
        saveHandler={headerData => {
          // Create a complete data object to save
          const completeData = {
            ...headerData,
            // Include all specific properties
            phoneIconBgColor: headerData.phoneIconBgColor,
            phoneIconColor: headerData.phoneIconColor,
            phoneQuestionText: headerData.phoneQuestionText
          };
          
          // Save all changes
          handleSaveChanges();
          
          // Also send data to iframe
          const iframe = document.querySelector('iframe');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: "UPDATE_HEADER_DATA",
              headerData: completeData
            }, "*");
          }
          
          return Promise.resolve({ success: true });
        }}
      >
        <HeaderEditorContent 
          headers={headers} 
          selectedHeader={selectedHeader}
          setSelectedHeader={setSelectedHeader}
          headerData={headerData}
          setHeaderData={setHeaderData}
          handleItemAdd={handleItemAdd}
          handleItemDelete={handleItemDelete}
          handleItemsReorder={handleItemsReorder}
          handleEditItem={handleEditItem}
          handleUpdateItem={handleUpdateItem}
          menuDialogOpen={menuDialogOpen}
          setMenuDialogOpen={setMenuDialogOpen}
          topBarDialogOpen={topBarDialogOpen}
          setTopBarDialogOpen={setTopBarDialogOpen}
          socialDialogOpen={socialDialogOpen}
          setSocialDialogOpen={setSocialDialogOpen}
          logoUploading={logoUploading}
          handleLogoUpload={handleLogoUpload}
          newItem={newItem}
          setNewItem={setNewItem}
          sortedMainMenu={sortedMainMenu}
          sortedSocialLinks={sortedSocialLinks}
          sortedTopBarItems={sortedTopBarItems}
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          editedItem={editedItem}
          setEditedItem={setEditedItem}
          handleSaveChanges={handleSaveChanges}
          saveChangesToAPI={saveChangesToAPI}
          dispatch={dispatch}
        />
      </EditorProvider>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Edit Item</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Update the information for this item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateItem} className="space-y-4 mt-3">
            {editedItem.type === "socialLinks" && (
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm">
                  Platform
                </Label>
                <select
                  id="edit-name"
                  value={editedItem.name}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, name: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
                >
                  <option value="">Select a platform</option>
                  {socialMediaTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {editedItem.type === "topBarItems" && (
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm">
                  Type
                </Label>
                <select
                  id="edit-name"
                  value={editedItem.name}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, name: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
                >
                  <option value="">Select a type</option>
                  {topBarItemTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {editedItem.type === "mainMenu" && (
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editedItem.name}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, name: e.target.value })
                  }
                  placeholder="Item name"
                  className="h-9 text-sm"
                />
              </div>
            )}

            {(editedItem.type === "mainMenu" ||
              editedItem.type === "socialLinks") && (
              <div className="space-y-2">
                <Label htmlFor="edit-link" className="text-sm">
                  Link
                </Label>
                <Input
                  id="edit-link"
                  value={editedItem.link}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, link: e.target.value })
                  }
                  placeholder="/page-link or https://..."
                  className="h-9 text-sm"
                />
              </div>
            )}

            {editedItem.type === "topBarItems" && (
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-sm">
                  Content
                </Label>
                <Input
                  id="edit-content"
                  value={editedItem.content}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      content: e.target.value,
                    })
                  }
                  placeholder={editedItem.name === "Phone" ? "+1 (555) 123-4567" : 
                               editedItem.name === "Email" ? "contact@example.com" :
                               editedItem.name === "Address" ? "123 Main St, City" : 
                               editedItem.name === "Hours" ? "Mon-Fri: 9am-5pm" : ""}
                  className="h-9 text-sm"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2 text-sm"
              disabled={
                (editedItem.type === "mainMenu" && (!editedItem.name || !editedItem.link)) ||
                (editedItem.type === "socialLinks" && (!editedItem.name || !editedItem.link)) ||
                (editedItem.type === "topBarItems" && (!editedItem.name || !editedItem.content))
              }
            >
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate component for the editor content
function HeaderEditorContent({
  headers,
  selectedHeader,
  setSelectedHeader,
  headerData,
  setHeaderData,
  handleItemAdd,
  handleItemDelete,
  handleItemsReorder,
  handleEditItem,
  handleUpdateItem,
  menuDialogOpen,
  setMenuDialogOpen,
  topBarDialogOpen,
  setTopBarDialogOpen,
  socialDialogOpen,
  setSocialDialogOpen,
  logoUploading,
  handleLogoUpload,
  newItem,
  setNewItem,
  sortedMainMenu,
  sortedSocialLinks,
  sortedTopBarItems,
  editDialogOpen,
  setEditDialogOpen,
  editedItem,
  setEditedItem,
  handleSaveChanges,
  saveChangesToAPI,
  dispatch,
}: HeaderEditorContentProps) {
  const router = useRouter();

  // Function to refresh the iframe preview
  const refreshIframePreview = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        if (iframe) {
          iframe.src = currentSrc;
        }
      }, 100);
    }
  };

  // Render sidebar content function
  const renderSidebarContent = (data: HeaderData) => {
    if (!data) return null;
    
    // Find the header info based on the selected component
    const currentHeader = headers.find(h => h.component === data.headerComponent) || headers[0];
    const hasTopBar = currentHeader.hasTopBar || false;
    
    // State for sticky preview toggle
    const [isSticky, setIsSticky] = useState(false);
    
    // Effect to update iframe with sticky state
    useEffect(() => {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "TOGGLE_HEADER_SCROLL",
          scroll: isSticky
        }, "*");
      }
    }, [isSticky]);
    
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
        <TabsContent value="layout" className="m-0 p-3 border-t overflow-y-auto">
          <div className="space-y-5 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Header Template</h3>
              <select
                value={headerData.headerComponent}
                onChange={(e) => setHeaderData({
                  ...headerData,
                  headerComponent: e.target.value
                })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none bg-no-repeat bg-[right_0.5rem_center]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
              >
                {headers.map((header) => (
                  <option key={header.id} value={header.component}>
                    {header.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="stickyToggle" className="text-sm">
                Sticky Header Preview
              </Label>
              <Switch
                id="stickyToggle"
                checked={isSticky}
                onCheckedChange={setIsSticky}
              />
            </div>
          </div>
        </TabsContent>

        {/* Content Tab - All the main tabs content from the original file */}
        <TabsContent value="content" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-5">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Main Menu</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-normal"
                    onClick={() => setMenuDialogOpen(true)}
                  >
                    + Add Menu Item
                  </Button>
                </div>
                <div className="mt-2">
                  {sortedMainMenu.length > 0 ? (
                    <SortableList
                      items={sortedMainMenu}
                      onChange={(updatedItems: MenuItem[]) =>
                        handleItemsReorder(updatedItems, "mainMenu")
                      }
                      onDelete={(itemId: string) =>
                        handleItemDelete(itemId, "mainMenu")
                      }
                      onEdit={(itemId: string) =>
                        handleEditItem(itemId, "mainMenu")
                      }
                      renderItem={(item: MenuItem) => (
                        <div className="flex justify-between items-center w-full px-2">
                          <div className="font-medium text-xs">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-xs truncate max-w-[100px]">
                            {item.link}
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-xs bg-sidebar rounded-md">
                      No menu items yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {data.headerComponent === "Header5" && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-normal"
                      onClick={() => setSocialDialogOpen(true)}
                    >
                      + Add Social Link
                    </Button>
                  </div>
                  <div className="mt-2">
                    {sortedSocialLinks.length > 0 ? (
                      <SortableList
                        items={sortedSocialLinks}
                        onChange={(updatedItems: MenuItem[]) =>
                          handleItemsReorder(updatedItems, "socialLinks")
                        }
                        onDelete={(itemId: string) =>
                          handleItemDelete(itemId, "socialLinks")
                        }
                        onEdit={(itemId: string) =>
                          handleEditItem(itemId, "socialLinks")
                        }
                        renderItem={(item: MenuItem) => (
                          <div className="flex justify-between items-center w-full px-2">
                            <div className="font-medium text-xs">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-xs truncate max-w-[100px]">
                              {item.link}
                            </div>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-xs bg-sidebar rounded-md">
                        No social links yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {hasTopBar && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Bar Items</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-normal"
                      onClick={() => setTopBarDialogOpen(true)}
                    >
                      + Add Top Bar Item
                    </Button>
                  </div>
                  <div className="mt-2">
                    {sortedTopBarItems.length > 0 ? (
                      <SortableList
                        items={sortedTopBarItems}
                        onChange={(updatedItems: TopBarItem[]) =>
                          handleItemsReorder(updatedItems, "topBarItems")
                        }
                        onDelete={(itemId: string) =>
                          handleItemDelete(itemId, "topBarItems")
                        }
                        onEdit={(itemId: string) =>
                          handleEditItem(itemId, "topBarItems")
                        }
                        renderItem={(item: TopBarItem) => (
                          <div className="flex justify-between items-center w-full px-2">
                            <div className="font-medium text-xs">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-xs truncate max-w-[100px]">
                              {item.content}
                            </div>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-xs bg-sidebar rounded-md">
                        No top bar items yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkModeToggle" className="text-sm">
                  Dark Mode Toggle
                </Label>
                <Switch
                  id="darkModeToggle"
                  checked={headerData.showDarkModeToggle}
                  onCheckedChange={(checked) => {
                    const updatedData = {
                      ...headerData,
                      showDarkModeToggle: checked,
                    };
                    setHeaderData(updatedData);
                    // Save changes immediately
                    saveChangesToAPI(updatedData);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Show dark mode toggle in the header.</p>
            </div>

            {/* Add TopBar Color section for Header3 and Header5 */}
            {(headerData.headerComponent === "Header3" || headerData.headerComponent === "Header5") && (
              <>
                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="topBarColor" className="text-sm">
                    Top Bar Background Color
                  </Label>
                  <Input
                    id="topBarColor"
                    type="color"
                    value={headerData.topBarColor || "#3b71fe"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        topBarColor: e.target.value,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                    className="w-full h-9 p-1 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the background color of the top bar.
                  </p>
                </div>
                
                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="topBarTextColor" className="text-sm">
                    Top Bar Text Color
                  </Label>
                  <Input
                    id="topBarTextColor"
                    type="color"
                    value={headerData.topBarTextColor || "#ffffff"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        topBarTextColor: e.target.value,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                    className="w-full h-9 p-1 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the text color for the top bar content.
                  </p>
                </div>
                
                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="mobileMenuButtonColor" className="text-sm">
                    Mobile Menu Button Color
                  </Label>
                  <Input
                    id="mobileMenuButtonColor"
                    type="color"
                    value={headerData.mobileMenuButtonColor || "#3b71fe"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        mobileMenuButtonColor: e.target.value,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                    className="w-full h-9 p-1 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the background color for the mobile menu toggle button.
                  </p>
                </div>
              </>
            )}

            {/* Add Working Hours section for Header3 and Header5 */}
            {(headerData.headerComponent === "Header3" || headerData.headerComponent === "Header5") && (
              <div className="space-y-3 pt-3 border-t">
                <Label htmlFor="workingHours" className="text-sm">
                  Working Hours
                </Label>
                <Input
                  id="workingHours"
                  value={headerData.workingHours || "Mon-Fri: 10:00am - 09:00pm"}
                  onChange={(e) => {
                    const updatedData = {
                      ...headerData,
                      workingHours: e.target.value,
                    };
                    setHeaderData(updatedData);
                  }}
                  onBlur={(e) => {
                    // Save changes on blur
                    saveChangesToAPI({
                      ...headerData,
                      workingHours: e.target.value
                    });
                  }}
                  placeholder="Mon-Fri: 10:00am - 09:00pm"
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set the working hours displayed in the top bar.
                </p>
              </div>
            )}

            {/* Add Phone Icon settings for Header5 */}
            {headerData.headerComponent === "Header5" && (
              <>
                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="phoneIconBgColor" className="text-sm">
                    Phone Icon Background Color
                  </Label>
                  <Input
                    id="phoneIconBgColor"
                    type="color"
                    value={headerData.phoneIconBgColor || "#3b71fe"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        phoneIconBgColor: e.target.value,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                    className="w-full h-9 p-1 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the background color for the phone icon in the header.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="phoneIconColor" className="text-sm">
                    Phone Icon Color
                  </Label>
                  <Input
                    id="phoneIconColor"
                    type="color"
                    value={headerData.phoneIconColor || "#ffffff"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        phoneIconColor: e.target.value,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                    className="w-full h-9 p-1 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the color of the phone icon in the header.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="phoneQuestionText" className="text-sm">
                    Phone Question Text
                  </Label>
                  <Input
                    id="phoneQuestionText"
                    value={headerData.phoneQuestionText || "Have Any Questions?"}
                    onChange={(e) => {
                      const updatedData = {
                        ...headerData,
                        phoneQuestionText: e.target.value,
                      };
                      setHeaderData(updatedData);
                    }}
                    onBlur={(e) => {
                      // Save changes immediately on blur
                      saveChangesToAPI({
                        ...headerData,
                        phoneQuestionText: e.target.value
                      });
                    }}
                    placeholder="Have Any Questions?"
                    className="h-9 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set the question text displayed above the phone number.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="actionButton" className="text-sm">
                  Action Button
                </Label>
                <Switch
                  id="actionButton"
                  checked={headerData.showActionButton}
                  onCheckedChange={(checked) => {
                    const updatedData = {
                      ...headerData,
                      showActionButton: checked,
                    };
                    setHeaderData(updatedData);
                    // Save changes immediately
                    saveChangesToAPI(updatedData);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Show a call-to-action button in the header.</p>

              {headerData.showActionButton && (
                <div className="space-y-4 mt-4 pl-2 border-l-2 border-gray-100">
                  <div className="space-y-2">
                    <Label
                      htmlFor="actionButtonText"
                      className="text-sm"
                    >
                      Button Text
                    </Label>
                    <Input
                      id="actionButtonText"
                      value={headerData.actionButtonText}
                      onChange={(e) => {
                        const updatedData = {
                          ...headerData,
                          actionButtonText: e.target.value,
                        };
                        setHeaderData(updatedData);
                      }}
                      onBlur={(e) => {
                        // Save changes on blur
                        saveChangesToAPI({
                          ...headerData,
                          actionButtonText: e.target.value
                        });
                      }}
                      placeholder="Get Started"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="actionButtonLink"
                      className="text-sm"
                    >
                      Button Link
                    </Label>
                    <Input
                      id="actionButtonLink"
                      value={headerData.actionButtonLink}
                      onChange={(e) => {
                        const updatedData = {
                          ...headerData,
                          actionButtonLink: e.target.value,
                        };
                        setHeaderData(updatedData);
                      }}
                      onBlur={(e) => {
                        // Save changes on blur
                        saveChangesToAPI({
                          ...headerData,
                          actionButtonLink: e.target.value
                        });
                      }}
                      placeholder="/contact"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="buttonColor"
                      className="text-sm"
                    >
                      Button Color
                    </Label>
                    <Input
                      id="buttonColor"
                      type="color"
                      value={headerData.buttonColor || "#3b71fe"}
                      onChange={(e) => {
                        const updatedData = {
                          ...headerData,
                          buttonColor: e.target.value,
                        };
                        setHeaderData(updatedData);
                        // Save changes immediately
                        saveChangesToAPI(updatedData);
                      }}
                      className="w-full h-9 p-1 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="buttonTextColor"
                      className="text-sm"
                    >
                      Button Text Color
                    </Label>
                    <Input
                      id="buttonTextColor"
                      type="color"
                      value={headerData.buttonTextColor || "#ffffff"}
                      onChange={(e) => {
                        const updatedData = {
                          ...headerData,
                          buttonTextColor: e.target.value,
                        };
                        setHeaderData(updatedData);
                        // Save changes immediately
                        saveChangesToAPI(updatedData);
                      }}
                      className="w-full h-9 p-1 cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
              {/* Second Action Button Section */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="secondActionButton" className="text-sm">
                    Second Action Button
                  </Label>
                  <Switch
                    id="secondActionButton"
                    checked={headerData.showSecondActionButton}
                    onCheckedChange={(checked) => {
                      const updatedData = {
                        ...headerData,
                        showSecondActionButton: checked,
                      };
                      setHeaderData(updatedData);
                      // Save changes immediately
                      saveChangesToAPI(updatedData);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">Show a secondary action button in the header.</p>

                {headerData.showSecondActionButton && (
                  <div className="space-y-4 mt-4 pl-2 border-l-2 border-gray-100">
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondActionButtonText"
                        className="text-sm"
                      >
                        Second Button Text
                      </Label>
                      <Input
                        id="secondActionButtonText"
                        value={headerData.secondActionButtonText}
                        onChange={(e) => {
                          const updatedData = {
                            ...headerData,
                            secondActionButtonText: e.target.value,
                          };
                          setHeaderData(updatedData);
                        }}
                        onBlur={(e) => {
                          // Save changes on blur
                          saveChangesToAPI({
                            ...headerData,
                            secondActionButtonText: e.target.value
                          });
                        }}
                        placeholder="Sign Up"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondActionButtonLink"
                        className="text-sm"
                      >
                        Second Button Link
                      </Label>
                      <Input
                        id="secondActionButtonLink"
                        value={headerData.secondActionButtonLink}
                        onChange={(e) => {
                          const updatedData = {
                            ...headerData,
                            secondActionButtonLink: e.target.value,
                          };
                          setHeaderData(updatedData);
                        }}
                        onBlur={(e) => {
                          // Save changes on blur
                          saveChangesToAPI({
                            ...headerData,
                            secondActionButtonLink: e.target.value
                          });
                        }}
                        placeholder="/register"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondButtonColor"
                        className="text-sm"
                      >
                        Second Button Background Color
                      </Label>
                      <Input
                        id="secondButtonColor"
                        type="color"
                        value={headerData.secondButtonColor || "#ffffff"}
                        onChange={(e) => {
                          const updatedData = {
                            ...headerData,
                            secondButtonColor: e.target.value,
                          };
                          setHeaderData(updatedData);
                          // Save changes immediately
                          saveChangesToAPI(updatedData);
                        }}
                        className="w-full h-9 p-1 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondButtonTextColor"
                        className="text-sm"
                      >
                        Second Button Text Color
                      </Label>
                      <Input
                        id="secondButtonTextColor"
                        type="color"
                        value={headerData.secondButtonTextColor || "#3b71fe"}
                        onChange={(e) => {
                          const updatedData = {
                            ...headerData,
                            secondButtonTextColor: e.target.value,
                          };
                          setHeaderData(updatedData);
                          // Save changes immediately
                          saveChangesToAPI(updatedData);
                        }}
                        className="w-full h-9 p-1 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondButtonBorderColor"
                        className="text-sm"
                      >
                        Second Button Border Color
                      </Label>
                      <Input
                        id="secondButtonBorderColor"
                        type="color"
                        value={headerData.secondButtonBorderColor || "#3b71fe"}
                        onChange={(e) => {
                          const updatedData = {
                            ...headerData,
                            secondButtonBorderColor: e.target.value,
                          };
                          setHeaderData(updatedData);
                          // Save changes immediately
                          saveChangesToAPI(updatedData);
                        }}
                        className="w-full h-9 p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="logoText"
                className="text-sm"
              >
                Logo Text
              </Label>
              <Input
                id="logoText"
                value={headerData.logoText}
                onChange={(e) => {
                  const updatedData = {
                    ...headerData,
                    logoText: e.target.value,
                  };
                  setHeaderData(updatedData);
                  
                  // Auto-update preview after short delay
                  setTimeout(() => {
                    const iframe = document.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({
                        type: "UPDATE_HEADER_DATA",
                        headerData: updatedData
                      }, "*");
                    }
                  }, 100);
                }}
                placeholder="Logo text"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-sm">
                Logo URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logoUrl"
                  value={headerData.logoUrl}
                  onChange={(e) => {
                    const updatedData = {
                      ...headerData,
                      logoUrl: e.target.value,
                    };
                    setHeaderData(updatedData);
                    
                    // Auto-update preview after short delay
                    setTimeout(() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                          type: "UPDATE_HEADER_DATA",
                          headerData: updatedData
                        }, "*");
                      }
                    }, 100);
                  }}
                  placeholder="/images/logo.png"
                  className="flex-1 h-9 text-sm"
                />
                <div className="relative">
                  <Input
                    type="file"
                    id="logoFile"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={logoUploading}
                    className="relative h-9 text-sm"
                    size="sm"
                  >
                    {logoUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL or upload an image file.
              </p>
            </div>

            {headerData.logoUrl && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-gray-500">
                  Preview:
                </p>
                <img
                  src={headerData.logoUrl}
                  alt={headerData.logoText || "Logo"}
                  className="h-8 object-contain border rounded p-1"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <EditorLayout
      title="Header Editor"
      sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <SectionPreview previewUrl="/preview/header" paramName="headerData" />
          
          {/* Refresh button overlay */}
          <div className="absolute top-0 right-0 p-2 z-50">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 bg-white/80 shadow-sm hover:bg-white"
              onClick={refreshIframePreview}
              title="Refresh preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h3" />
                <path d="M15 3v6h6" />
                <path d="M17 17v-6h-6" />
              </svg>
            </Button>
          </div>
        </div>
       
      </div>

      {/* Add Menu Dialog */}
      <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">New Menu Item</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Add a new item to your main navigation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Menu item name"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm">Link</Label>
              <Input
                id="link"
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                placeholder="/page-link"
                className="h-9 text-sm"
              />
            </div>
            <input
              type="hidden"
              value="mainMenu"
              onChange={() => setNewItem({ ...newItem, type: "mainMenu" })}
            />
            <Button type="submit" className="w-full mt-2 text-sm">
              Add Menu Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Social Link Dialog */}
      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">New Social Link</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Add a new social media platform link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Platform
              </Label>
              <select
                id="name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    name: e.target.value,
                    type: "socialLinks",
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
              >
                <option value="">Select a platform</option>
                {[
                  "Facebook", 
                  "Twitter", 
                  "LinkedIn", 
                  "Instagram", 
                  "Behance", 
                  "YouTube", 
                  "Pinterest"
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm">
                Link
              </Label>
              <Input
                id="link"
                value={newItem.link}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    link: e.target.value,
                    type: "socialLinks",
                  })
                }
                placeholder="https://twitter.com/username"
                className="h-9 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2 text-sm"
              disabled={!newItem.name || !newItem.link}
            >
              Add Social Link
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Top Bar Item Dialog */}
      <Dialog open={topBarDialogOpen} onOpenChange={setTopBarDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">New Top Bar Item</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Add contact information to your header's top bar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Type
              </Label>
              <select
                id="name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    name: e.target.value,
                    type: "topBarItems",
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
              >
                <option value="">Select a type</option>
                {["Phone", "Email", "Address", "Hours"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm">
                Content
              </Label>
              <Input
                id="content"
                value={newItem.content}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    content: e.target.value,
                    type: "topBarItems",
                  })
                }
                placeholder={newItem.name === "Phone" ? "+1 (555) 123-4567" : 
                            newItem.name === "Email" ? "contact@example.com" :
                            newItem.name === "Address" ? "123 Main St, City" : 
                            newItem.name === "Hours" ? "Mon-Fri: 9am-5pm" : ""}
                className="h-9 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2 text-sm"
              disabled={!newItem.name || !newItem.content}
            >
              Add Top Bar Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </EditorLayout>
  );
}
