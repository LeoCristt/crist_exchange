import { SpaceBackground } from "@/components/space-background";
import { TradingInterface } from "@/components/trading/trading-interface";
import { StationSelect } from "@/components/station-select";
import { FadeInSection } from "@/components/fade-in-section";
import Link from "next/link";
import { Globe, UserCircle2, Rocket, Package, Gavel } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <SpaceBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FadeInSection delay={100}>
          <header className="mb-12">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Crist Exchange
                  </span>
                </h1>
              </div>
              <nav className="flex flex-wrap justify-center gap-4 sm:flex-nowrap sm:space-x-6">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700/50 hover:text-white hover:shadow-lg"
                >
                  <Rocket className="h-4 w-4" />
                  <span>Регистрация кораблей</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700/50 hover:text-white hover:shadow-lg"
                >
                  <UserCircle2 className="h-4 w-4" />
                  <span>Профиль</span>
                </Link>
                <Link
                  href="/auction"
                  className="flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-gray-700/50 hover:text-white hover:shadow-lg"
                >
                  <Gavel className="h-4 w-4" />
                  <span>Аукцион</span>
                </Link>
              </nav>
            </div>
          </header>
        </FadeInSection>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <StationSelect />
          <FadeInSection delay={300} className="order-1 lg:order-2 lg:col-span-3">
            <TradingInterface />
          </FadeInSection>
        </div>
      </div>
    </main>
  );
}