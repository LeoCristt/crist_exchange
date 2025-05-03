"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FadeInSection({ 
  children, 
  delay = 0,
  className 
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transform transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}