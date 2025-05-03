"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { SpaceBackground } from "@/components/space-background";
import { FadeInSection } from "@/components/fade-in-section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/register");
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          router.replace("/");
          return;
        }
        // const user = await res.json();
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <SpaceBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться на главную
          </Link>
        </div>
        <FadeInSection delay={100}>
          <ProfilePanel />
        </FadeInSection>
      </div>
    </main>
  );
}
