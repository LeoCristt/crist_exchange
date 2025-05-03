import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Resource } from "./trading-interface";

export function ResourceMarket({
  selectedResourceId,
  onSelectResource,
}: {
  selectedResourceId?: string;
  onSelectResource: (resource: Resource) => void;
}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [stationId, setStationId] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) return;
    fetch(`/api/resource-prices/${stationId}`)
      .then((res) => res.json())
      .then((data: Resource[]) => setResources(data))
      .catch((err) => console.error("Ошибка загрузки ресурсов", err));
  }, [stationId]);

  useEffect(() => {
    const initialId = localStorage.getItem("stationId") || "1";
    setStationId(initialId);

    const onStationChange = () => {
      const newId = localStorage.getItem("stationId") || "1";
      setStationId(newId);
    };

    window.addEventListener("stationIdChanged", onStationChange);

    return () => {
      window.removeEventListener("stationIdChanged", onStationChange);
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="pb-4 text-left text-sm font-medium text-gray-400">Ресурс</th>
            <th className="pb-4 text-right text-sm font-medium text-gray-400">Цена</th>
            <th className="pb-4 text-right text-sm font-medium text-gray-400">Изменения за 24ч</th>
            <th className="pb-4 text-right text-sm font-medium text-gray-400">Количество</th>
            <th className="pb-4 text-right text-sm font-medium text-gray-400">Действие</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr
              key={resource.id}
              className={cn(
                "cursor-pointer border-b border-gray-800 transition-colors hover:bg-white/5",
                selectedResourceId === resource.id && "bg-white/10"
              )}
              onClick={() => onSelectResource(resource)}
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", resource.color)}>
                    <span className="text-lg">{resource.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{resource.name}</div>
                    <div className="text-xs text-gray-400">{resource.category}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 text-right font-mono text-white">
                {resource.price.toFixed(2)}
              </td>
              <td className={cn(
                "py-4 text-right font-medium",
                resource.change >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {resource.change >= 0 ? "+" : ""}{resource.change}%
              </td>
              <td className="py-4 text-right text-white">{resource.volume}</td>
              <td className="py-4 text-right">
                <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
                  Подробнее
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
