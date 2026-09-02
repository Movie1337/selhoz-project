"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LogoutButton() {
 const { logout } = useAuth();
 const router = useRouter();
 const handleLogout = () => {
  logout();
  router.push("/");
  router.refresh();
 };

 return <button onClick={handleLogout} className="btn" style={{background:"#dc2626",color:"#fff"}}><LogOut size={17}/> Выйти</button>;
}
