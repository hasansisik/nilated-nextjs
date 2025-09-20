"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getFooter, updateFooter } from "@/redux/actions/footerActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Upload,
  Trash2,
  Pencil,
  ArrowLeft,
  Layout,
  Type,
  Settings,
  Image
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
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Textarea } from "@/components/ui/textarea";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { SectionTypeSelector } from "@/components/editor/FormFields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";

// Define types for footer items
interface LinkItem {
  _id: string;
  name: string;
  link: string;
  order: number;
}

interface Column {
  _id: string;
  title: string;
  order: number;
  links: LinkItem[];
}

interface AppLink {
  image: string;
  link: string;
  alt: string;
}

interface ContactItems {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface FooterData {
  logo: {
    src: string;
    alt: string;
    text: string;
  };
  copyright: string;
  description: string;
  socialLinks: LinkItem[];
  columns: Column[];
  footerComponent: string;
  contactItems: ContactItems;
  instagramPosts: string[];
  appLinks: AppLink[];
  showAppLinks: boolean;
  showInstagram: boolean;
  showPrivacyLinks: boolean;
  showSocialLinks: boolean;
  privacyLinks: LinkItem[];
}

// Footer component configurations
const footers = [
  {
    id: 1,
    name: "Footer 1",
    image: "/assets/imgs/footers/footer1.png",
    component: "Footer1",
    hasInstagram: false,
    hasAppLinks: false
  },
  {
    id: 2,
    name: "Footer 2",
    image: "/assets/imgs/footers/footer2.png",
    component: "Footer2",
    hasInstagram: true,
    hasAppLinks: false
  },
  {
    id: 3,
    name: "Footer 3",
    image: "/assets/imgs/footers/footer3.png",
    component: "Footer3",
    hasInstagram: false,
    hasAppLinks: true
  },
  {
    id: 4,
    name: "Footer 4",
    image: "/assets/imgs/footers/footer4.png",
    component: "Footer4",
    hasInstagram: false,
    hasAppLinks: true
  }
];

// Create array of options for dropdown
const footerOptions = footers.map(footer => ({
  value: footer.component,
  label: footer.name
}));

interface FooterEditorContentProps {
  footers: {
    id: number;
    name: string;
    image: string;
    hasInstagram: boolean;
    hasAppLinks: boolean;
    component: string;
  }[];
  footerData: FooterData;
  setFooterData: (data: FooterData) => void;
  handleItemAdd: (e: React.FormEvent) => void;
  handleItemDelete: (itemId: string, type: string, columnId?: string) => void;
  handleItemsReorder: (updatedItems: any[], type: string, columnId?: string) => void;
  handleEditItem: (itemId: string, type: string, columnId?: string) => void;
  handleUpdateItem: (e: React.FormEvent) => void;
  socialDialogOpen: boolean;
  setSocialDialogOpen: (open: boolean) => void;
  columnDialogOpen: boolean;
  setColumnDialogOpen: (open: boolean) => void;
  linkDialogOpen: boolean;
  setLinkDialogOpen: (open: boolean) => void;
  privacyLinkDialogOpen: boolean;
  setPrivacyLinkDialogOpen: (open: boolean) => void;
  selectedColumn: string | null;
  setSelectedColumn: (column: string | null) => void;
  logoUploading: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newItem: any;
  setNewItem: (item: any) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editedItem: any;
  setEditedItem: (item: any) => void;
  sortedColumns: Column[];
  sortedSocialLinks: LinkItem[];
  sortedPrivacyLinks: LinkItem[];
  handleSaveChanges: () => void;
  saveChangesToAPI: (data: any) => Promise<void>;
}

// FooterEditorContent component
function FooterEditorContent({
  footers,
  footerData,
  setFooterData,
  handleItemAdd,
  handleItemDelete,
  handleItemsReorder,
  handleEditItem,
  handleUpdateItem,
  socialDialogOpen,
  setSocialDialogOpen,
  columnDialogOpen,
  setColumnDialogOpen,
  linkDialogOpen,
  setLinkDialogOpen,
  privacyLinkDialogOpen,
  setPrivacyLinkDialogOpen,
  selectedColumn,
  setSelectedColumn,
  logoUploading,
  handleLogoUpload,
  newItem,
  setNewItem,
  editDialogOpen,
  setEditDialogOpen,
  editedItem,
  setEditedItem,
  sortedColumns,
  sortedSocialLinks,
  sortedPrivacyLinks,
  handleSaveChanges,
  saveChangesToAPI
}: FooterEditorContentProps) {
  // Render sidebar content function
  const renderSidebarContent = (data: FooterData) => {
    if (!data) return null;
    
    // Find the footer info based on the selected component
    const currentFooter = footers.find(f => f.component === data.footerComponent) || footers[0];
    const hasInstagram = currentFooter.hasInstagram;
    const hasAppLinks = currentFooter.hasAppLinks;

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
        <TabsContent value="layout" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-3">Footer Template</h3>
            <select
              value={data.footerComponent}
              onChange={(e) => setFooterData({
                ...data,
                footerComponent: e.target.value
              })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none bg-no-repeat bg-[right_0.5rem_center]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")" }}
            >
              {footers.map((footer) => (
                <option key={footer.id} value={footer.component}>
                  {footer.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Social Links Display Toggle */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showSocialLinks" className="text-sm">
                Social Media Icons
              </Label>
              <Switch
                id="showSocialLinks"
                checked={data.showSocialLinks !== false}
                onCheckedChange={(checked) => {
                  const updatedData = {
                    ...data,
                    showSocialLinks: checked
                  };
                  setFooterData(updatedData);
                  saveChangesToAPI(updatedData);
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 mb-3">Show social media icons in the footer.</p>
          </div>

          {/* Footer Columns Management */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Footer Columns</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => {
                  setNewItem({
                    name: "",
                    link: "",
                    title: "",
                    type: "column"
                  });
                  setColumnDialogOpen(true);
                }}
              >
                Add Column
              </Button>
            </div>
            
            {sortedColumns.length > 0 ? (
              <div className="space-y-4">
                {sortedColumns.map((column) => (
                  <div key={column._id} className="border rounded-md overflow-hidden">
                    <div className="bg-sidebar p-2 border-b flex justify-between items-center">
                      <h4 className="font-medium text-sm">{column.title}</h4>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-500 hover:text-gray-700"
                          onClick={() => handleEditItem(column._id, "column")}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-500 hover:text-red-600"
                          onClick={() => handleItemDelete(column._id, "column")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Links ({column.links.length})</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedColumn(column._id);
                            setNewItem({
                              name: "",
                              link: "",
                              title: "",
                              type: "link"
                            });
                            setLinkDialogOpen(true);
                          }}
                        >
                          + Add Link
                        </Button>
                      </div>
                    </div>
                    
                    {column.links.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto">
                        {column.links.map((link) => (
                          <div 
                            key={link._id} 
                            className="flex justify-between items-center p-2 border-b last:border-0 text-sm hover:bg-gray-50"
                          >
                            <div>
                              <div className="font-medium text-xs">{link.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">{link.link}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                onClick={() => handleEditItem(link._id, "link", column._id)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-500 hover:text-red-600"
                                onClick={() => handleItemDelete(link._id, "link", column._id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-400 text-xs">
                        No links added yet
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500 text-sm">No columns added yet.</p>
                <p className="text-xs text-gray-400 mt-1">Add columns to organize your footer links.</p>
              </div>
            )}
          </div>
          
          {/* Social Links Management */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Social Media Links</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => {
                  setNewItem({
                    name: "",
                    link: "",
                    title: "",
                    type: "socialLinks"
                  });
                  setSocialDialogOpen(true);
                }}
              >
                Add Social Link
              </Button>
            </div>
            
            {sortedSocialLinks.length > 0 ? (
              <div className="space-y-2">
                {sortedSocialLinks.map((social) => (
                  <div 
                    key={social._id} 
                    className="flex justify-between items-center p-2 border rounded-md text-sm hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center mr-2 text-white"
                        style={{
                          backgroundColor: 
                            social.name === "Facebook" ? "#1877F2" :
                            social.name === "Twitter" ? "#1DA1F2" :
                            social.name === "LinkedIn" ? "#0A66C2" :
                            social.name === "Instagram" ? "#E4405F" :
                            social.name === "YouTube" ? "#FF0000" :
                            social.name === "Pinterest" ? "#BD081C" :
                            social.name === "Behance" ? "#1769FF" :
                            social.name === "Dribbble" ? "#EA4C89" :
                            social.name === "TikTok" ? "#000000" : "#333333"
                        }}
                      >
                        <i className={`bi bi-${social.name.toLowerCase()}`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-xs">{social.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{social.link}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                        onClick={() => handleEditItem(social._id, "socialLinks")}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-500 hover:text-red-600"
                        onClick={() => handleItemDelete(social._id, "socialLinks")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500 text-sm">No social media links added yet.</p>
                <p className="text-xs text-gray-400 mt-1">Add links to your social media profiles.</p>
              </div>
            )}
          </div>
          
          {/* Privacy Links Settings */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showPrivacyLinks" className="text-sm">
                Privacy Links
              </Label>
              <Switch
                id="showPrivacyLinks"
                checked={data.showPrivacyLinks}
                onCheckedChange={(checked) => {
                  const updatedData = {
                    ...data,
                    showPrivacyLinks: checked
                  };
                  setFooterData(updatedData);
                  saveChangesToAPI(updatedData);
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 mb-3">Show privacy policy and cookie links in the footer.</p>
            
            {data.showPrivacyLinks && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Privacy Links</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => {
                      setNewItem({
                        name: "",
                        link: "",
                        title: "",
                        type: "privacyLinks"
                      });
                      setPrivacyLinkDialogOpen(true);
                    }}
                  >
                    Add Link
                  </Button>
                </div>
                
                {sortedPrivacyLinks.length > 0 ? (
                  <div className="space-y-2">
                    {sortedPrivacyLinks.map((link) => (
                      <div 
                        key={link._id} 
                        className="flex justify-between items-center p-2 border rounded-md text-sm hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium text-xs">{link.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">{link.link}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-gray-500 hover:text-gray-700"
                            onClick={() => handleEditItem(link._id, "privacyLinks")}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-gray-500 hover:text-red-600"
                            onClick={() => handleItemDelete(link._id, "privacyLinks")}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-500 text-xs">No privacy links added yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {hasInstagram && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showInstagram" className="text-sm">
                  Instagram Feed
                </Label>
                <Switch
                  id="showInstagram"
                  checked={data.showInstagram}
                  onCheckedChange={(checked) => {
                    const updatedData = {
                      ...data,
                      showInstagram: checked
                    };
                    setFooterData(updatedData);
                    saveChangesToAPI(updatedData);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Display Instagram posts in the footer.</p>
            </div>
          )}

          {hasAppLinks && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showAppLinks" className="text-sm">
                  App & Store Links
                </Label>
                <Switch
                  id="showAppLinks"
                  checked={data.showAppLinks}
                  onCheckedChange={(checked) => {
                    const updatedData = {
                      ...data,
                      showAppLinks: checked
                    };
                    setFooterData(updatedData);
                    saveChangesToAPI(updatedData);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Display app store and payment links in the footer.</p>
            </div>
          )}
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="copyright" className="text-sm">
                Copyright Text
              </Label>
              <div className="border rounded-md">
                <RichTextEditor
                  content={data.copyright}
                  onChange={(html) => {
                    const updatedData = {
                      ...data,
                      copyright: html
                    };
                    setFooterData(updatedData);
                    
                    // Update preview immediately
                    setTimeout(() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                          type: "UPDATE_FOOTER_DATA",
                          footerData: updatedData
                        }, "*");
                      }
                    }, 100);
                  }}
                  className="min-h-[100px]"
                  placeholder="Copyright © 2024 Your Company. All Rights Reserved"
                />
              </div>
              <p className="text-xs text-gray-500">
                Use the editor to format your copyright text. You can add links, bold text, etc.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">
                Footer Description
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setFooterData({
                  ...data,
                  description: e.target.value
                })}
                placeholder="Brief description for your footer"
                className="min-h-[100px] text-sm resize-y"
              />
            </div>
          </div>
        </TabsContent>

        {/* Style Tab - For additional style options if needed */}
        <TabsContent value="style" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contact Information</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs">
                  Address
                </Label>
                <Input
                  id="address"
                  value={data.contactItems.address}
                  onChange={(e) => setFooterData({
                    ...data,
                    contactItems: {
                      ...data.contactItems,
                      address: e.target.value
                    }
                  })}
                  placeholder="123 Business St, City"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={data.contactItems.phone}
                  onChange={(e) => setFooterData({
                    ...data,
                    contactItems: {
                      ...data.contactItems,
                      phone: e.target.value
                    }
                  })}
                  placeholder="+1 (234) 567-8900"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={data.contactItems.email}
                  onChange={(e) => setFooterData({
                    ...data,
                    contactItems: {
                      ...data.contactItems,
                      email: e.target.value
                    }
                  })}
                  placeholder="contact@example.com"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-xs">
                  Business Hours
                </Label>
                <Input
                  id="hours"
                  value={data.contactItems.hours}
                  onChange={(e) => setFooterData({
                    ...data,
                    contactItems: {
                      ...data.contactItems,
                      hours: e.target.value
                    }
                  })}
                  placeholder="Mon-Fri: 9am-5pm"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoText" className="text-sm">
                Logo Text
              </Label>
              <Input
                id="logoText"
                value={data.logo.text}
                onChange={(e) => {
                  const updatedData = {
                    ...data,
                    logo: {
                      ...data.logo,
                      text: e.target.value,
                      alt: e.target.value.toLowerCase()
                    }
                  };
                  setFooterData(updatedData);
                  // Auto-update preview after short delay
                  setTimeout(() => {
                    const iframe = document.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({
                        type: "UPDATE_FOOTER_DATA",
                        footerData: updatedData
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
                  value={data.logo.src}
                  onChange={(e) => {
                    const updatedData = {
                      ...data,
                      logo: {
                        ...data.logo,
                        src: e.target.value
                      }
                    };
                    setFooterData(updatedData);
                    // Auto-update preview after short delay
                    setTimeout(() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                          type: "UPDATE_FOOTER_DATA",
                          footerData: updatedData
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

            {data.logo.src && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-gray-500">
                  Preview:
                </p>
                <img
                  src={data.logo.src}
                  alt={data.logo.text || "Logo"}
                  className="h-8 object-contain border rounded p-1 bg-gray-800"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

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
    <EditorLayout
      title="Footer Editor"
      sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <SectionPreview previewUrl="/preview/footer" paramName="footerData" />
          
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
    </EditorLayout>
  );
}

export default function FooterEditor() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { footer, loading } = useSelector((state: RootState) => state.footer);
  const [footerData, setFooterData] = useState<FooterData>({
    logo: {
      src: "/assets/imgs/logo/logo-white.svg",
      alt: "infinia",
      text: "Infinia"
    },
    copyright: "Copyright © 2024 Infinia. All Rights Reserved",
    description: "You may also realize cost savings from your energy efficient choices in your custom home. Federal tax credits for some green materials can allow you to deduct as much.",
    socialLinks: [],
    columns: [],
    footerComponent: "Footer1",
    contactItems: {
      address: "0811 Erdman Prairie, Joaville CA",
      phone: "+01 (24) 568 900",
      email: "contact@infinia.com",
      hours: "Mon-Fri: 9am-5pm"
    },
    instagramPosts: [],
    appLinks: [],
    showAppLinks: false,
    showInstagram: false,
    showPrivacyLinks: true,
    showSocialLinks: true,
    privacyLinks: []
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [privacyLinkDialogOpen, setPrivacyLinkDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<any>({
    _id: "",
    name: "",
    link: "",
    title: "",
    type: "",
    columnId: ""
  });
  
  const [newItem, setNewItem] = useState<any>({
    name: "",
    link: "",
    title: "",
    type: "socialLinks",
    columnId: ""
  });

  // Function to monitor iframe connection
  useEffect(() => {
    if (!footerData) return;

    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (
        event.data.type === "PREVIEW_READY" ||
        event.data.type === "PREVIEW_UPDATED" ||
        event.data.type === "UPDATE_FOOTER_DATA_RECEIVED"
      ) {
        setUseFallback(false);
      }
    };

    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [footerData]);

  // Fetch initial data using Redux
  useEffect(() => {
    dispatch(getFooter() as any);
  }, [dispatch]);

  // Update local state when Redux data changes
  useEffect(() => {
    if (footer) {
      setFooterData(footer);
      setIsLoading(false);
    }
  }, [footer]);

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
        ...footerData,
        logo: {
          ...footerData.logo,
          src: uploadedUrl
        }
      };
      
      // Update the local state
      setFooterData(updatedData);
      
      // The EditorProvider's saveHandler will handle saving this data
      // This will trigger the preview update automatically
      
      showSuccessAlert("Logo uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading logo: ${error.message}`);
    } finally {
      setLogoUploading(false);
    }
  };

  // Update the saveChangesToAPI function to handle columns better
  const saveChangesToAPI = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Update Redux state first (this will call the API)
      await dispatch(updateFooter(data) as any);
      
      // Also update local API for backward compatibility
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      const response = await fetch('/api/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(data),
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes to local API');
      }

      // Get the response data
      const result = await response.json();
      
      // Update the iframe with new data
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "UPDATE_FOOTER_DATA",
          footerData: data
        }, "*");
      }

      showSuccessAlert(`Footer changes saved successfully!`);
      return result;
    } catch (error: any) {
      console.error(`Error saving footer changes:`, error);
      showErrorAlert(`Error saving changes: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding social link
  const handleItemAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.socialLinks.length;
    let updatedData = { ...footerData };
    
    if (newItem.type === "socialLinks") {
    const updatedSocialLinks = [
      ...footerData.socialLinks,
      { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
    ];

      updatedData = {
      ...footerData,
      socialLinks: updatedSocialLinks
    };
      
      setSocialDialogOpen(false);
      showSuccessAlert("Social link added successfully");
    } else if (newItem.type === "column") {
      if (!newItem.title) {
        showErrorAlert("Please enter a column title");
        return;
      }

      const newColumn: Column = {
        _id: newId,
        title: newItem.title,
        order: footerData.columns.length,
        links: []
      };

      updatedData = {
        ...footerData,
        columns: [...footerData.columns, newColumn]
      };
      
      setColumnDialogOpen(false);
      showSuccessAlert("Column added successfully");
    } else if (newItem.type === "link") {
      if (!selectedColumn) {
        showErrorAlert("Selected column not found");
        return;
      }

      const columnIndex = footerData.columns.findIndex(col => col._id === selectedColumn);
      if (columnIndex === -1) {
        showErrorAlert("Selected column not found");
        return;
      }

      const newLink: LinkItem = {
        _id: newId,
        name: newItem.name,
        link: newItem.link,
        order: footerData.columns[columnIndex].links.length
      };

      // Create a deep copy of columns array
      const updatedColumns = [...footerData.columns];
      updatedColumns[columnIndex] = {
        ...updatedColumns[columnIndex],
        links: [...updatedColumns[columnIndex].links, newLink]
      };

      updatedData = {
        ...footerData,
        columns: updatedColumns
      };
      
      setLinkDialogOpen(false);
      showSuccessAlert("Link added successfully");
    } else if (newItem.type === "privacyLinks") {
      const updatedPrivacyLinks = [
        ...footerData.privacyLinks,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
      ];

      updatedData = {
        ...footerData,
        privacyLinks: updatedPrivacyLinks
      };
      
      setPrivacyLinkDialogOpen(false);
      showSuccessAlert("Privacy link added successfully");
    }

    // Update state with new data
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    // Reset form
    setNewItem({
      name: "",
      link: "",
      title: "",
      type: newItem.type,
      columnId: ""
    });
  };

  // Handle adding a new footer column
  const handleColumnAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.title) {
      showErrorAlert("Please enter a column title");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.columns.length;
    
    const newColumn: Column = {
      _id: newId,
      title: newItem.title,
      order: newOrder,
      links: []
    };

    const updatedColumns = [...footerData.columns, newColumn];
    const updatedData = {
      ...footerData,
      columns: updatedColumns
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    // Reset form
    setNewItem({
      name: "",
      link: "",
      title: "",
      type: "column"
    });

    // Close dialog
    setColumnDialogOpen(false);

    showSuccessAlert("Column added successfully");
  };

  // Handle adding a new link to a column
  const handleLinkAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link || !selectedColumn) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const columnIndex = footerData.columns.findIndex(col => col._id === selectedColumn);
    if (columnIndex === -1) {
      showErrorAlert("Selected column not found");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.columns[columnIndex].links.length;
    
    const newLink: LinkItem = {
      _id: newId,
      name: newItem.name,
      link: newItem.link,
      order: newOrder
    };

    // Create a deep copy of columns array
    const updatedColumns = [...footerData.columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      links: [...updatedColumns[columnIndex].links, newLink]
    };

    const updatedData = {
      ...footerData,
      columns: updatedColumns
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      name: "",
      link: ""
    });

    // Close dialog
    setLinkDialogOpen(false);

    showSuccessAlert("Link added successfully");
  };

  // Handle adding a privacy link
  const handlePrivacyLinkAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.privacyLinks.length;
    
    const updatedPrivacyLinks = [
      ...footerData.privacyLinks,
      { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
    ];

    const updatedData = {
      ...footerData,
      privacyLinks: updatedPrivacyLinks
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      name: "",
      link: ""
    });

    // Close dialog
    setPrivacyLinkDialogOpen(false);

    showSuccessAlert("Privacy link added successfully");
  };

  // Handle item deletion
  const handleItemDelete = (itemId: string, type: string, columnId?: string) => {
    let updatedData = { ...footerData };

    if (type === "socialLinks") {
      const updatedSocialLinks = footerData.socialLinks.filter(item => item._id !== itemId);
      
      // Re-calculate order values
      const reorderedSocialLinks = updatedSocialLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        socialLinks: reorderedSocialLinks
      };

      showSuccessAlert("Social link deleted successfully");
    } else if (type === "column") {
      const updatedColumns = footerData.columns.filter(col => col._id !== itemId);
      
      // Re-calculate order values
      const reorderedColumns = updatedColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        columns: reorderedColumns
      };

      showSuccessAlert("Column deleted successfully");
    } else if (type === "link" && columnId) {
      const columnIndex = footerData.columns.findIndex(col => col._id === columnId);
      if (columnIndex !== -1) {
        const updatedLinks = footerData.columns[columnIndex].links.filter(link => link._id !== itemId);
        
        // Re-calculate order values
        const reorderedLinks = updatedLinks.map((link, index) => ({
          ...link,
          order: index
        }));
        
        const updatedColumns = [...footerData.columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: reorderedLinks
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };

        showSuccessAlert("Link deleted successfully");
      }
    } else if (type === "privacyLinks") {
      const updatedPrivacyLinks = footerData.privacyLinks.filter(item => item._id !== itemId);
      
      // Re-calculate order values
      const reorderedPrivacyLinks = updatedPrivacyLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        privacyLinks: reorderedPrivacyLinks
      };

      showSuccessAlert("Privacy link deleted successfully");
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  // Handle item editing
  const handleEditItem = (itemId: string, type: string, columnId?: string) => {
    let itemToEdit;

    if (type === "socialLinks") {
      itemToEdit = footerData.socialLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          type: "socialLinks"
        });
      }
    } else if (type === "column") {
      itemToEdit = footerData.columns.find((col) => col._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          title: itemToEdit.title,
          type: "column"
        });
      }
    } else if (type === "link" && columnId) {
      const column = footerData.columns.find((col) => col._id === columnId);
      if (column) {
        itemToEdit = column.links.find((link) => link._id === itemId);
        if (itemToEdit) {
          setEditedItem({
            _id: itemToEdit._id,
            name: itemToEdit.name,
            link: itemToEdit.link,
            type: "link",
            columnId: columnId
          });
        }
      }
    } else if (type === "privacyLinks") {
      itemToEdit = footerData.privacyLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          type: "privacyLinks"
        });
      }
    }

    setEditDialogOpen(true);
  };

  // Handle updating an item
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") {
      if (!editedItem.name || !editedItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (editedItem.type === "column") {
      if (!editedItem.title) {
        showErrorAlert("Please enter a column title");
        return;
      }
    }

    let updatedData = { ...footerData };

    if (editedItem.type === "socialLinks") {
      const updatedSocialLinks = footerData.socialLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      updatedData = {
        ...footerData,
        socialLinks: updatedSocialLinks
      };
      
      showSuccessAlert("Social link updated successfully");
    } else if (editedItem.type === "column") {
      const updatedColumns = footerData.columns.map((col) =>
        col._id === editedItem._id
          ? { ...col, title: editedItem.title }
          : col
      );

      updatedData = {
        ...footerData,
        columns: updatedColumns
      };
      
      showSuccessAlert("Column updated successfully");
    } else if (editedItem.type === "link") {
      const columnIndex = footerData.columns.findIndex(col => col._id === editedItem.columnId);
      if (columnIndex !== -1) {
        const updatedColumns = [...footerData.columns];
        const updatedLinks = updatedColumns[columnIndex].links.map((link) =>
          link._id === editedItem._id
            ? { ...link, name: editedItem.name, link: editedItem.link }
            : link
        );
        
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: updatedLinks
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };
        
        showSuccessAlert("Link updated successfully");
      }
    } else if (editedItem.type === "privacyLinks") {
      const updatedPrivacyLinks = footerData.privacyLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      updatedData = {
        ...footerData,
        privacyLinks: updatedPrivacyLinks
      };
      
      showSuccessAlert("Privacy link updated successfully");
    } else if (editedItem.type === "appLink") {
      const updatedAppLinks = [...footerData.appLinks];
      const index = parseInt(editedItem._id);
      
      if (!isNaN(index) && index >= 0 && index < updatedAppLinks.length) {
        updatedAppLinks[index] = {
          image: editedItem.image,
          link: editedItem.link,
          alt: editedItem.name
        };
        
        updatedData = {
          ...footerData,
          appLinks: updatedAppLinks
        };
        
        showSuccessAlert("App link updated successfully");
      }
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    // Reset the edited item
    setEditedItem({
      _id: "",
      name: "",
      link: "",
      title: "",
      type: "",
      columnId: ""
    });
    
    setEditDialogOpen(false);
  };

  // Handle reordering of items
  const handleItemsReorder = (updatedItems: any[], type: string, columnId?: string) => {
    // Ensure the updatedItems have their order values set correctly
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    let updatedData = { ...footerData };

    if (type === "socialLinks") {
      updatedData = {
        ...footerData,
        socialLinks: itemsWithUpdatedOrder as LinkItem[],
      };
      showSuccessAlert("Social links reordered successfully");
    } else if (type === "columns") {
      updatedData = {
        ...footerData,
        columns: itemsWithUpdatedOrder as Column[],
      };
      showSuccessAlert("Columns reordered successfully");
    } else if (type === "links" && columnId) {
      const columnIndex = footerData.columns.findIndex(col => col._id === columnId);
      if (columnIndex !== -1) {
        const updatedColumns = [...footerData.columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: itemsWithUpdatedOrder as LinkItem[]
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };
        
        showSuccessAlert("Links reordered successfully");
      }
    } else if (type === "privacyLinks") {
      updatedData = {
        ...footerData,
        privacyLinks: itemsWithUpdatedOrder as LinkItem[],
      };
      showSuccessAlert("Privacy links reordered successfully");
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  const handleSaveChanges = async () => {
    try {
      // The EditorProvider will handle saving through its saveHandler prop
      // Just update local state to ensure it's in sync
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "UPDATE_FOOTER_DATA",
          footerData: footerData
        }, "*");
      }
      
      showSuccessAlert("Footer changes saved successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };
  
  // Sort columns and links by order field
  const sortedColumns = footerData?.columns
    ? [...footerData.columns].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const sortedSocialLinks = footerData?.socialLinks
    ? [...footerData.socialLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const sortedPrivacyLinks = footerData?.privacyLinks
    ? [...footerData.privacyLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  // If still loading, return empty div
  if (isLoading) {
    return <div></div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/footer"
      sectionType="footer"
      uploadHandler={uploadImageToCloudinary}
      initialData={footerData}
      disableAutoSave={true}
      saveHandler={async (data) => {
        try {
          // Save using our dedicated function
          await saveChangesToAPI(data);
          return { success: true };
        } catch (error) {
          console.error("Error saving footer data:", error);
          return { success: false, error: "Failed to save footer data" };
        }
      }}
    >
      <FooterEditorContent
        footers={footers}
        footerData={footerData}
        setFooterData={setFooterData}
        handleItemAdd={handleItemAdd}
        handleItemDelete={handleItemDelete}
        handleItemsReorder={handleItemsReorder}
        handleEditItem={handleEditItem}
        handleUpdateItem={handleUpdateItem}
        socialDialogOpen={socialDialogOpen}
        setSocialDialogOpen={setSocialDialogOpen}
        columnDialogOpen={columnDialogOpen}
        setColumnDialogOpen={setColumnDialogOpen}
        linkDialogOpen={linkDialogOpen}
        setLinkDialogOpen={setLinkDialogOpen}
        privacyLinkDialogOpen={privacyLinkDialogOpen}
        setPrivacyLinkDialogOpen={setPrivacyLinkDialogOpen}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        logoUploading={logoUploading}
        handleLogoUpload={handleLogoUpload}
        newItem={newItem}
        setNewItem={setNewItem}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editedItem={editedItem}
        setEditedItem={setEditedItem}
        sortedColumns={sortedColumns}
        sortedSocialLinks={sortedSocialLinks}
        sortedPrivacyLinks={sortedPrivacyLinks}
        handleSaveChanges={handleSaveChanges}
        saveChangesToAPI={saveChangesToAPI}
      />
      
      {/* Add Dialog components */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Edit {editedItem.type === "socialLinks" ? "Social Link" : 
                    editedItem.type === "column" ? "Column" :
                    editedItem.type === "link" ? "Link" : 
                    editedItem.type === "privacyLinks" ? "Privacy Link" :
                    editedItem.type === "appLink" ? "App Link" : "Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateItem} className="space-y-4 mt-3">
            {editedItem.type === "column" && (
                      <div className="space-y-2">
                <Label htmlFor="editColumnTitle" className="text-sm">
                  Column Title
                        </Label>
                        <Input
                  id="editColumnTitle"
                  value={editedItem.title}
                          onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      title: e.target.value
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
            )}

            {(editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") && (
              <>
                      <div className="space-y-2">
                  <Label htmlFor="editItemName" className="text-sm">
                    {editedItem.type === "socialLinks" ? "Platform" : "Name"}
                        </Label>
                  {editedItem.type === "socialLinks" ? (
                    <select
                      id="editItemName"
                      value={editedItem.name}
                            onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          name: e.target.value
                              })
                            }
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
                    >
                      <option value="">Select a platform</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Pinterest">Pinterest</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Dribbble">Dribbble</option>
                    </select>
                  ) : (
                    <Input
                      id="editItemName"
                      value={editedItem.name}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          name: e.target.value
                        })
                      }
                      className="h-9 text-sm"
                    />
                              )}
                          </div>
                <div className="space-y-2">
                  <Label htmlFor="editItemLink" className="text-sm">
                    Link URL
                  </Label>
                  <Input
                    id="editItemLink"
                    value={editedItem.link}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        link: e.target.value
                      })
                    }
                    className="h-9 text-sm"
                          />
                        </div>
              </>
                      )}

            {editedItem.type === "appLink" && (
              <>
                      <div className="space-y-2">
                  <Label htmlFor="editAppName" className="text-sm">Store/App Name</Label>
                        <Input
                    id="editAppName"
                    value={editedItem.name}
                          onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        name: e.target.value
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                  <Label htmlFor="editAppLink" className="text-sm">Link URL</Label>
                  <Input
                    id="editAppLink"
                    value={editedItem.link}
                          onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        link: e.target.value
                            })
                          }
                    className="h-9 text-sm"
                        />
                      </div>
                <div className="space-y-2">
                  <Label htmlFor="editAppImage" className="text-sm">Image URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="editAppImage"
                      value={editedItem.image}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          image: e.target.value
                        })
                      }
                      className="h-9 text-sm flex-1"
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          try {
                            const uploadedUrl = await uploadImageToCloudinary(file);
                            setEditedItem({
                              ...editedItem,
                              image: uploadedUrl
                            });
                          } catch (error: any) {
                            showErrorAlert(`Error uploading image: ${error.message}`);
                          }
                        }}
                      />
                      <Button variant="outline" className="h-9 text-sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                        </div>
                      </div>
                    </div>
                {editedItem.image && (
                  <div className="h-12 border rounded-md overflow-hidden">
                    <img 
                      src={editedItem.image} 
                      alt={editedItem.name}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                )}
              </>
            )}
            
                        <Button
              type="submit"
              className="w-full mt-2 text-sm"
              disabled={
                (editedItem.type === "column" && !editedItem.title) ||
                ((editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") && 
                 (!editedItem.name || !editedItem.link)) ||
                (editedItem.type === "appLink" && (!editedItem.name || !editedItem.link || !editedItem.image))
              }
            >
              Update
                        </Button>
          </form>
        </DialogContent>
      </Dialog>
          
      {/* Social Link Dialog */}
      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-base font-semibold">
                            New Social Link
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-500 mt-1">
                            Add a new social media link to your footer.
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
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">Twitter</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Instagram">Instagram</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Pinterest">Pinterest</option>
                              <option value="TikTok">TikTok</option>
                              <option value="Dribbble">Dribbble</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="link" className="text-sm">
                              Link URL
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
                              placeholder="https://facebook.com/yourusername"
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

      {/* Column Dialog */}
      <Dialog open={columnDialogOpen} onOpenChange={setColumnDialogOpen}>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-base font-semibold">
                            New Footer Column
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-500 mt-1">
                            Add a new column category to your footer.
                          </DialogDescription>
                        </DialogHeader>
          <form onSubmit={handleColumnAdd} className="space-y-4 mt-3">
                          <div className="space-y-2">
                            <Label htmlFor="columnTitle" className="text-sm">
                              Column Title
                            </Label>
                            <Input
                              id="columnTitle"
                              value={newItem.title}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                    title: e.target.value,
                    type: "column"
                                })
                              }
                              placeholder="e.g. Company, Resources, Services"
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full mt-2 text-sm"
                            disabled={!newItem.title}
                          >
                            Add Column
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle className="text-base font-semibold">
                          New Link
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                          Add a new link to the selected column.
                        </DialogDescription>
                      </DialogHeader>
          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
                        {selectedColumn && (
                          <div className="p-3 bg-sidebar rounded-md text-sm mb-2">
                            Adding to column: <span className="font-medium">
                              {footerData.columns.find(col => col._id === selectedColumn)?.title || 'Selected Column'}
                            </span>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="linkName" className="text-sm">
                            Link Name
                          </Label>
                          <Input
                            id="linkName"
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                    name: e.target.value,
                    type: "link"
                              })
                            }
                            placeholder="e.g. About Us, Contact"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkUrl" className="text-sm">
                            Link URL
                          </Label>
                          <Input
                            id="linkUrl"
                            value={newItem.link}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                    link: e.target.value,
                    type: "link"
                              })
                            }
                            placeholder="e.g. /about, https://example.com"
                            className="h-9 text-sm"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full mt-2 text-sm"
                          disabled={!newItem.name || !newItem.link || !selectedColumn}
                        >
                          Add Link
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

      {/* Privacy Link Dialog */}
      <Dialog open={privacyLinkDialogOpen} onOpenChange={setPrivacyLinkDialogOpen}>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle className="text-base font-semibold">
                                  New Privacy Link
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                  Add a new privacy or legal link to your footer.
                                </DialogDescription>
                              </DialogHeader>
          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
                                <div className="space-y-2">
                                  <Label htmlFor="privacyLinkName" className="text-sm">
                                    Link Name
                                  </Label>
                                  <Input
                                    id="privacyLinkName"
                                    value={newItem.name}
                                    onChange={(e) =>
                                      setNewItem({
                                        ...newItem,
                                        name: e.target.value,
                                        type: "privacyLinks",
                                      })
                                    }
                                    placeholder="e.g. Privacy Policy, Terms of Service"
                                    className="h-9 text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="privacyLinkUrl" className="text-sm">
                                    Link URL
                                  </Label>
                                  <Input
                                    id="privacyLinkUrl"
                                    value={newItem.link}
                                    onChange={(e) =>
                                      setNewItem({
                                        ...newItem,
                                        link: e.target.value,
                                        type: "privacyLinks",
                                      })
                                    }
                                    placeholder="e.g. /privacy, /terms"
                                    className="h-9 text-sm"
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="w-full mt-2 text-sm"
                                  disabled={!newItem.name || !newItem.link}
                                >
                                  Add Privacy Link
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
    </EditorProvider>
  );
}
