"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpaceshipAnimation } from "@/components/registration/spaceship-animation";
import { FadeInSection } from "@/components/fade-in-section";
import AuthFormSwitcher from "@/components/registration/authswitcher";

export default function RegisterPage() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const router = useRouter();

  const handleAuthSuccess = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    }, 2000);
  };

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden bg-black text-white transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0">
        <SpaceshipAnimation isLaunching={isLaunching} />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <FadeInSection
          delay={100}
          className={`w-full max-w-lg transform transition-all duration-1000 ${
            isLaunching ? "opacity-0 translate-y-20 scale-95" : "opacity-100"
          }`}
        >
          <AuthFormSwitcher onRegister={handleAuthSuccess} onLogin={handleAuthSuccess} />
        </FadeInSection>
      </div>
    </main>
  );
}
