import { NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch all statistics from the server
    const [usersResponse, blogsResponse, servicesResponse, kalpResponse, contactResponse] = await Promise.all([
      axios.get(`${server}/users`),
      axios.get(`${server}/blog`),
      axios.get(`${server}/service`),
      axios.get(`${server}/kalp`),
      axios.get(`${server}/contact-form`)
    ]);

    const users = usersResponse.data.users || [];
    const blogs = blogsResponse.data.blogs || [];
    const services = servicesResponse.data.services || [];
    const kalpPosts = kalpResponse.data.kalps || [];
    const contacts = contactResponse.data.contactForms || [];

    // Calculate statistics
    const totalUsers = users.length;
    const totalBlogs = blogs.length;
    const totalServices = services.length;
    const totalKalpPosts = kalpPosts.length;
    const totalContacts = contacts.length;

    // Calculate recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = users.filter((user: any) => 
      new Date(user.createdAt) > sevenDaysAgo
    ).length;

    const recentBlogs = blogs.filter((blog: any) => 
      new Date(blog.createdAt) > sevenDaysAgo
    ).length;

    const recentServices = services.filter((service: any) => 
      new Date(service.createdAt) > sevenDaysAgo
    ).length;

    const recentKalpPosts = kalpPosts.filter((kalp: any) => 
      new Date(kalp.createdAt) > sevenDaysAgo
    ).length;

    const recentContacts = contacts.filter((contact: any) => 
      new Date(contact.createdAt) > sevenDaysAgo
    ).length;

    // Calculate premium users
    const premiumUsers = users.filter((user: any) => user.isPremium).length;

    // Calculate verified users
    const verifiedUsers = users.filter((user: any) => user.isVerified).length;

    // Get recent activities
    const recentActivities = [
      ...users.slice(0, 3).map((user: any) => ({
        id: `user-${user._id}`,
        title: "Yeni kullanıcı kaydı",
        description: `${user.name} platforma katıldı`,
        time: new Date(user.createdAt).toLocaleDateString('tr-TR'),
        type: "user",
        icon: "Users"
      })),
      ...blogs.slice(0, 2).map((blog: any) => ({
        id: `blog-${blog._id}`,
        title: "Blog yazısı yayınlandı",
        description: blog.title,
        time: new Date(blog.createdAt).toLocaleDateString('tr-TR'),
        type: "blog",
        icon: "FileText"
      })),
      ...services.slice(0, 2).map((service: any) => ({
        id: `service-${service._id}`,
        title: "Hizmet güncellendi",
        description: service.title,
        time: new Date(service.createdAt).toLocaleDateString('tr-TR'),
        type: "service",
        icon: "FolderOpen"
      })),
      ...kalpPosts.slice(0, 1).map((kalp: any) => ({
        id: `kalp-${kalp._id}`,
        title: "Kalp içeriği eklendi",
        description: kalp.title,
        time: new Date(kalp.createdAt).toLocaleDateString('tr-TR'),
        type: "kalp",
        icon: "Heart"
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    const stats = {
      totalUsers,
      totalBlogs,
      totalServices,
      totalKalpPosts,
      totalContacts,
      recentUsers,
      recentBlogs,
      recentServices,
      recentKalpPosts,
      recentContacts,
      premiumUsers,
      verifiedUsers,
      recentActivities
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: 0,
        totalBlogs: 0,
        totalServices: 0,
        totalKalpPosts: 0,
        totalContacts: 0,
        recentUsers: 0,
        recentBlogs: 0,
        recentServices: 0,
        recentKalpPosts: 0,
        recentContacts: 0,
        premiumUsers: 0,
        verifiedUsers: 0,
        recentActivities: []
      }
    });
  }
}
