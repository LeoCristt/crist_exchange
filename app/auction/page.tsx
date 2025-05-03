"use client";

import { SpaceBackground } from "@/components/space-background";
import { AuctionPanel } from "@/components/trading/auction-panel";
import { FadeInSection } from "@/components/fade-in-section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuctionPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <SpaceBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FadeInSection delay={100}>
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться на главную
            </Link>
          </div>
        </FadeInSection>
        <FadeInSection delay={200}>
          <div className="grid gap-6">
            <AuctionPanel />
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}