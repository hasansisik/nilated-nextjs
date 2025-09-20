'use client';

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage() {
  // Default user data - no authentication
  const user = {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    role: "admin"
  };

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
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
              <p className="text-gray-500">
                You are logged in as: <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            {user.role === 'admin' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Users</h4>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Posts</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Projects</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            ) : user.role === 'editor' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Posts</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Projects</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-500">Welcome to your personal dashboard.</p>
                <p className="text-center">You can view and update your profile information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
