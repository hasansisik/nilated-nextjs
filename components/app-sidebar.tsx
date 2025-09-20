"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"
import { getMyProfile } from "@/redux/actions/userActions"
import {
  Settings2,
  SquareTerminal,
  FilePenLine,
  Home,
  Users,
  Laptop,
  FileText,
  Database,
  Layout,
  MessageSquare,
  FolderGit2,
  Search,
  Globe,
  FileCode,
  Loader2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserRole } from "@/lib/types"

const data = {
  navMain: [
    {
      title: "Section Editor",
      url: "#",
      icon: Layout,
      isActive: true,
      roles: ["admin"],
      items: [
        {
          title: "Header",
          url: "/dashboard/editor/header",
        },
        {
          title: "Hero",
          url: "/dashboard/editor/hero",
        },
        {
          title: "Cta",
          url: "/dashboard/editor/cta",
        },
        {
          title: "Faq",
          url: "/dashboard/editor/faq",
        },
        {
          title: "Other",
          url: "/dashboard/editor/other",
        },
        {
          title: "Features",
          url: "/dashboard/editor/features",
        },
        {
          title: "Footer",
          url: "/dashboard/editor/footer",
        },
      ],
    },
    {
      title: "Page Builder",
      url: "#",
      icon: FileCode,
      roles: ["admin"],
      items: [
        {
          title: "Home Page",
          url: "/dashboard/page/home",
          description: "Drag and drop page builder"
        },
        {
          title: "Privacy Policy",
          url: "/dashboard/page/privacy",
        },
        {
          title: "Terms and Conditions",
          url: "/dashboard/page/terms",
        }
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      roles: ["admin"],
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        },
        {
          title: "Form",
          url: "/dashboard/users/form",
        },

      ],
    },
    {
      title: "Editor",
      url: "#",
      icon: FilePenLine,
      roles: ["admin", "editor"],
      items: [
        {
          title: "Blog",
          url: "/dashboard/blog",
        },
        {
          title: "Hizmet",
          url: "/dashboard/hizmet",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "SEO",
          url: "/dashboard/settings/seo",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: MessageSquare,
      roles: ["admin", "editor"],
    },
    {
      title: "Hizmet",
      url: "/dashboard/hizmet",
      icon: FolderGit2,
      roles: ["admin", "editor"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  const userRole = user?.role || null;

  useEffect(() => {
    // If not authenticated, get user profile
    if (!isAuthenticated && !loading) {
      dispatch(getMyProfile())
        .unwrap()
        .catch(() => {
          // If getting profile fails, redirect to login
          router.push('/');
        });
    }
  }, [isAuthenticated, loading, dispatch, router]);

  // Filter navMain items based on user role
  const filteredNavMain = data.navMain.filter(item => 
    userRole && item.roles && item.roles.includes(userRole as string)
  );
  
  // Filter navSecondary items based on user role
  const filteredNavSecondary = data.navSecondary.filter(item => 
    userRole && item.roles && item.roles.includes(userRole as string)
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  B
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Birim Ajans</span>
                  <span className="truncate text-xs capitalize">{userRole || 'Yükleniyor...'}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <NavMain items={filteredNavMain} />
            <NavSecondary items={filteredNavSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}