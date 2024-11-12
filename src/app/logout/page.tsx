"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { directusLogout } from "@/lib/logout";
import { deleteCookies } from "@/lib/deleteCookie";

export default function Posts() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await directusLogout();
        await deleteCookies();
        console.log("Successfully logged out");
        // router.push("/"); // Redirect to home or login page after logout
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      Successfully logged out
    </div>
  );
}
