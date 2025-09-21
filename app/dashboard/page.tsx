'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Activity, 
  Settings, 
  BarChart3,
  Clock,
  ArrowUpRight,
  Heart,
  MessageSquare,
  Loader2
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalServices: number;
  totalKalpPosts: number;
  totalContacts: number;
  recentUsers: number;
  recentBlogs: number;
  recentServices: number;
  recentKalpPosts: number;
  recentContacts: number;
  premiumUsers: number;
  verifiedUsers: number;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: string;
    icon: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    role: "admin"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data and stats in parallel
        const [userResponse, statsResponse] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/dashboard/stats')
        ]);
        
        const userData = await userResponse.json();
        const statsData = await statsResponse.json();
        
        if (userData.success) {
          setUser(userData.user);
        }
        
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatsData = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Toplam Kullanıcılar",
        value: stats.totalUsers.toLocaleString('tr-TR'),
        change: `+${stats.recentUsers} bu hafta`,
        changeType: "positive",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Blog Yazıları",
        value: stats.totalBlogs.toLocaleString('tr-TR'),
        change: `+${stats.recentBlogs} bu hafta`,
        changeType: "positive",
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Hizmetler",
        value: stats.totalServices.toLocaleString('tr-TR'),
        change: `+${stats.recentServices} bu hafta`,
        changeType: "positive",
        icon: FolderOpen,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        title: "Kalp İçerikleri",
        value: stats.totalKalpPosts.toLocaleString('tr-TR'),
        change: `+${stats.recentKalpPosts} bu hafta`,
        changeType: "positive",
        icon: Heart,
        color: "text-pink-600",
        bgColor: "bg-pink-50"
      },
      {
        title: "İletişim Mesajları",
        value: stats.totalContacts.toLocaleString('tr-TR'),
        change: `+${stats.recentContacts} bu hafta`,
        changeType: "positive",
        icon: MessageSquare,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        title: "Premium Kullanıcılar",
        value: stats.premiumUsers.toLocaleString('tr-TR'),
        change: `${Math.round((stats.premiumUsers / stats.totalUsers) * 100) || 0}% oran`,
        changeType: "positive",
        icon: Users,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      }
    ];
  };

  const quickActions = [
    {
      title: "Yeni Blog Yazısı",
      description: "Blog yazısı oluştur ve yayınla",
      icon: FileText,
      href: "/dashboard/blog",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Hizmet Yönetimi",
      description: "Hizmetleri görüntüle ve düzenle",
      icon: FolderOpen,
      href: "/dashboard/hizmet",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Kalp İçerikleri",
      description: "Kalp içeriklerini yönet",
      icon: Heart,
      href: "/dashboard/kalp",
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100"
    },
    {
      title: "Kullanıcı Yönetimi",
      description: "Kullanıcıları görüntüle ve yönet",
      icon: Users,
      href: "/dashboard/users",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Genel Ayarlar",
      description: "Sistem ayarlarını yapılandır",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100"
    },
    {
      title: "İletişim Mesajları",
      description: "Gelen mesajları görüntüle",
      icon: MessageSquare,
      href: "/dashboard/contact",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    }
  ];

  const getRecentActivities = () => {
    if (!stats?.recentActivities) return [];
    
    const iconMap: { [key: string]: any } = {
      Users,
      FileText,
      FolderOpen,
      Heart,
      MessageSquare,
      Settings
    };

    return stats.recentActivities.map(activity => ({
      ...activity,
      icon: iconMap[activity.icon] || Activity,
      color: activity.type === 'user' ? 'text-blue-600' :
             activity.type === 'blog' ? 'text-green-600' :
             activity.type === 'service' ? 'text-purple-600' :
             activity.type === 'kalp' ? 'text-pink-600' :
             activity.type === 'contact' ? 'text-orange-600' : 'text-gray-600'
    }));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg font-semibold">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                <span>•</span>
                <span className="text-sm">{new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Hızlı İşlemler
              </CardTitle>
              <CardDescription>
                Sık kullanılan görevlere hızlı erişim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${action.bgColor} transition-colors duration-300`}>
                            <action.icon className={`h-5 w-5 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
}
