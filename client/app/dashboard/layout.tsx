"use client";

import { useGetUserQuery } from "@/lib/services/authApiSlice";

import Conversations from "@/components/conversations";
import Info from "@/components/Info";
import Sidebar from "@/components/sidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useGetUserQuery();
  return (
    <div className="w-full flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <Conversations />
      {children}
      <Info />
    </div>
  );
};

export default DashBoardLayout;
