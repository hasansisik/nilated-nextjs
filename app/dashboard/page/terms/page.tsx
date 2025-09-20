"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Save, CheckCircle2, Eye } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { useDispatch, useSelector } from "react-redux";
import { getPage, updatePage } from "@/redux/actions/pageActions";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";

export default function TermsConditionsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { pages, loading } = useSelector((state: RootState) => state.page);
  
  const [pageData, setPageData] = useState({
    hero: {
      title: "",
      description: ""
    },
    content: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Get the terms page data from Redux store
  useEffect(() => {
    if (pages && pages.terms) {
      setPageData({
        hero: {
          title: pages.terms.hero?.title || "",
          description: pages.terms.hero?.description || ""
        },
        content: pages.terms.content || ""
      });
    }
  }, [pages]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Use Redux to fetch page data
        await dispatch(getPage('terms'));
      } catch (error) {
        console.error('Error fetching terms and conditions data:', error);
        toast.error("Failed to load terms and conditions data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);


  // Save the page data
  const savePageData = async () => {
    try {
      setIsSaving(true);
      
      // Use Redux to update page data
      await dispatch(updatePage({
        pageType: 'terms',
        pageData: {
          hero: pageData.hero,
          content: pageData.content
        }
      }));
      
      setIsSaved(true);
      toast.success("Terms and conditions saved successfully", {
        description: "Your changes have been applied"
      });
    } catch (error) {
      console.error('Error saving terms and conditions data:', error);
      toast.error("Error saving terms and conditions", {
        description: "There was a problem saving your changes"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle content change
  const handleContentChange = (html: string) => {
    setPageData({
      ...pageData,
      content: html
    });
    setIsSaved(false);
  };

  // Handle hero section changes
  const handleHeroChange = (field: string, value: string) => {
    setPageData({
      ...pageData,
      hero: {
        ...pageData.hero,
        [field]: value
      }
    });
    setIsSaved(false);
  };

  if (isLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
  }

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
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Toaster richColors position="top-right" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Terms & Conditions Editor</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Edit your site's terms and conditions content
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/kullanim-kosullari')} className="flex items-center gap-2 text-xs h-8">
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Button>
            <Button 
              onClick={savePageData} 
              disabled={isSaving} 
              className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : ''} flex items-center gap-2 text-xs h-8`}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-t-transparent rounded-full mr-1" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Hero Section */}
          <div className="border rounded-lg p-4 bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-4">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Title</label>
                <Input 
                  value={pageData.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="Enter terms and conditions title"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
                <Input 
                  value={pageData.hero.description}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  placeholder="Enter terms and conditions description"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="border rounded-lg p-4 bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-4">Terms & Conditions Content</h3>
            {pageData.content && (
              <RichTextEditor 
                content={pageData.content} 
                onChange={handleContentChange}
                placeholder="Enter your terms and conditions content here..."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
