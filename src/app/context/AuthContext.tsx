"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserRole =
  | "admin"
  | "officer"
  | "driver"

type User = {
  user_id: string;
  onboarding: boolean;
  role: UserRole;
  is_active: boolean;
  badge_number?: string;
  license_number?: string;
  court_id?: string;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>; // in case I want to manually re-check
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
        credentials: "include", // Important for sending cookie
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();

      console.log(data.is_active);
      setUser({
        user_id: data.user_id,
        onboarding: data.onboarding,
        role: data.role,
        is_active: data.is_active,
        badge_number: data.badge_number,
        license_number: data.license_number,
        court_id: data.court_id,
        department: data.department,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: !!user,
        loading,
        logout,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};