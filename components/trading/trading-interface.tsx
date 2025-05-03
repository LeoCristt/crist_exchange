"use client";

import { useState } from "react";
import { ResourceMarket } from "./resource-market";
import { TransactionPanel } from "./transaction-panel";
import { ResourceChart } from "./resource-chart";

export interface Resource {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  price: number;
  change: number;
  volume: number;
  description: string;
  change24h: string;
  supply: string;
  stability: string;
  sourceStations: string[];
}

export function TradingInterface() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-black/40 p-6 backdrop-blur-lg border-2 border-white">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-white">Магазин ресурсов</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Статус магазина:</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Активно
            </span>
          </div>
        </div>
        <ResourceMarket
          selectedResourceId={selectedResource?.id}
          onSelectResource={setSelectedResource}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-black/40 p-6 backdrop-blur-lg border-2 border-white">
            <h2 className="mb-4 text-xl font-medium text-white">Ценообразование</h2>
            <ResourceChart resourceId={selectedResource?.id || ""} />
          </div>
        </div>
        {selectedResource && (
          <TransactionPanel resource={selectedResource} />
        )}
      </div>
    </div>
  );
}