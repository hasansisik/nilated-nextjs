'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "@/redux/actions/userActions";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const resultAction = await dispatch(getMyProfile());
        if (getMyProfile.fulfilled.match(resultAction)) {
        } else if (getMyProfile.rejected.match(resultAction)) {
          console.error("Failed to fetch profile:", resultAction.payload);
          // Redirect to login if not authenticated
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push('/');
      }
    };

    fetchUserProfile();
  }, [dispatch, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
