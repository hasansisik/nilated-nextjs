"use client";

import { ReactNode, useState, useEffect } from "react";
import { useEditor } from "./EditorProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  Save
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
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster, toast } from "sonner";

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  dashboardUrl?: string;
  sidebarContent: ReactNode;
}

export default function EditorLayout({
  children,
  title,
  dashboardUrl = "/dashboard",
  sidebarContent
}: EditorLayoutProps) {
  const router = useRouter();
  const {
    sectionData,
    previewMode,
    setPreviewMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    showAlert,
    alertType,
    alertMessage,
    saveChangesToAPI,
    isLoading,
    saveCurrentData
  } = useEditor();
  
  // To track and save the sidebar width before collapsing
  const [sidebarWidth, setSidebarWidth] = useState(30); // Default: 25% (wider)

  // Handler for the "Save Changes" button click
  const handleSaveChanges = async () => {
    try {
      await saveChangesToAPI(sectionData);
      toast.success(`${title} changes saved successfully!`);
      // No redirection to dashboard
    } catch (error) {
      toast.error("Error saving changes");
      // Error is handled inside saveChangesToAPI
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={dashboardUrl}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="border rounded-md bg-sidebar p-1 flex">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            className="bg-black hover:bg-gray-800 text-white h-8"
            size="sm"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">{isLoading ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </header>

      {/* Sonner Toaster component */}
      <Toaster position="top-right" richColors />

      {/* Main layout with resizable panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar Panel */}
          {!sidebarCollapsed ? (
            <>
              <ResizablePanel 
                defaultSize={sidebarWidth} 
                minSize={15}
                maxSize={35} 
                onResize={(size) => setSidebarWidth(size)}
                className="bg-white"
              >
                <div className="flex flex-col h-full">
                  <div className="p-3 border-b bg-white flex justify-between items-center">
                    <h3 className="text-sm font-medium">Edit {title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setSidebarCollapsed(true)}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {sidebarContent}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          ) : (
            <ResizablePanel defaultSize={4} maxSize={4} minSize={4} className="bg-sidebar border-r">
              <div className="flex justify-center p-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setSidebarCollapsed(false)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </ResizablePanel>
          )}
          
          {/* Preview Panel */}
          <ResizablePanel defaultSize={sidebarCollapsed ? 96 : 75}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto p-2">
                <div className={`
                  mx-auto h-full bg-gray-100 overflow-y-auto
                  ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px]" : "w-[375px]"}
                `}>
                  {sectionData && (
                    <div className="h-full">
                      {children}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
} 