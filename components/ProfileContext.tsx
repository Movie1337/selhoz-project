"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserProfile = {
  photo?: string;
  phone: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  inn: string;
  email: string;
  password: string;
  accountType: "individual" | "legal";
};

type ProfileContextType = {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const defaultProfile: UserProfile = {
  phone: "+7 ",
  firstName: "",
  lastName: "",
  organizationName: "",
  inn: "",
  email: "",
  password: "123456789",
  accountType: "individual"
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = {...prev, ...data};
      localStorage.setItem("userProfile", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
