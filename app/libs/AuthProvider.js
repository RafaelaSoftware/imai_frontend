"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createDirectus,
  rest,
  authentication,
  readMe,
  createItem,
  readItems,
  updateItem,
} from "@directus/sdk";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const DIRECTUS_URL =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

  const directus = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

  const router = useRouter();

  const getUser = async () => {
    //const result = await directus.login("admin@imai.net", "adminadmin");
    //const result = await directus.logout();

    try {
      setLoading(true);
      const me = await directus.request(
        readMe({
          fields: ["id", "email", "first_name", "last_name", "role.*"],
        })
      );
      if (me) {
        setUser(me);
      }
      if (me && me.role.name !== "Operario") {
        router.push("/dashboard");
      }
    } catch (error) {
      setUser(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = {
    directus,
    getUser,
    user,
    loading,
    createItem,
    readItems,
    updateItem,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
