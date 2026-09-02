"use client";

import AuthProvider from "@/components/AuthProvider";
import { ListingsProvider } from "@/components/ListingsContext";
import { ProfileProvider } from "@/components/ProfileContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ListingsProvider>
          {children}
        </ListingsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
