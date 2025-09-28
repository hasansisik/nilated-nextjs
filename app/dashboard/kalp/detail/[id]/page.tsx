"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getSingleKalp } from "@/redux/actions/kalpActions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdditionalSection {
  title?: string;
  description?: string;
  image?: string;
  order?: number;
  blogCategory?: string;
  isDetailPage?: boolean;
  detailContent?: string;
}

interface KalpContent {
  intro?: string;
  readTime?: string;
  author?: {
    name?: string;
    avatar?: string;
    date?: string;
  };
  mainImage?: string;
  fullContent?: string;
  bannerSectionTitle?: string;
  bannerSectionDescription?: string;
  additionalSections?: AdditionalSection[];
}

interface Kalp {
  _id?: string;
  title: string;
  description: string;
  image: string;
  content?: KalpContent;
}

export default function KalpDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { kalp, loading, error } = useSelector((state: RootState) => state.kalp);
  
  const [selectedSection, setSelectedSection] = useState<AdditionalSection | null>(null);
  const [content, setContent] = useState<string>("");
  const [detailContent, setDetailContent] = useState<string>("");
  
  const kalpId = params.id as string;
  const sectionTitle = searchParams.get('section');

  useEffect(() => {
    if (kalpId) {
      dispatch(getSingleKalp(kalpId));
    }
  }, [dispatch, kalpId]);

  useEffect(() => {
    if (kalp && sectionTitle) {
      const section = kalp.content?.additionalSections?.find(
        (s: any) => s.title === decodeURIComponent(sectionTitle)
      );
      if (section) {
        setSelectedSection(section);
        setContent(section.description || "");
        setDetailContent(section.detailContent || "");
      }
    }
  }, [kalp, sectionTitle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !kalp) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600">Error loading kalp: {error}</p>
        <Link href="/dashboard/kalp">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Kalp Management
          </Button>
        </Link>
      </div>
    );
  }

  if (!selectedSection) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-600">Section not found</p>
        <Link href="/dashboard/kalp">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Kalp Management
          </Button>
        </Link>
      </div>
    );
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/kalp">Kalp Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedSection.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/kalp">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{selectedSection.title}</h1>
              <p className="text-sm text-gray-600">From: {kalp.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedSection.blogCategory && (
              <Badge variant="secondary">
                {selectedSection.blogCategory}
              </Badge>
            )}
            <Badge variant="outline">
              Detail Page
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section Description */}
            <Card>
              <CardHeader>
                <CardTitle>Section Description</CardTitle>
                <p className="text-sm text-gray-600">This is the original description of the section</p>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </CardContent>
            </Card>

            {/* Detail Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Content Editor</CardTitle>
                <p className="text-sm text-gray-600">Add rich content for the detail page</p>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={detailContent}
                  onChange={setDetailContent}
                  placeholder="Add detailed content for this section..."
                  className="min-h-[500px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Section Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSection.image && (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <img 
                      src={selectedSection.image} 
                      alt={selectedSection.title || 'Section image'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Title</p>
                  <p className="text-sm">{selectedSection.title}</p>
                </div>
                
                {selectedSection.blogCategory && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-sm">{selectedSection.blogCategory}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Order</p>
                  <p className="text-sm">{selectedSection.order || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Kalp Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Parent Kalp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {kalp.image && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={kalp.image} 
                        alt={kalp.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{kalp.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{kalp.description}</p>
                  </div>
                </div>
                
                <Link href={`/kalp/${kalp.title.toLowerCase().replace(/\s+/g, '-')}`} target="_blank">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
