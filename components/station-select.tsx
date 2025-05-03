"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Station = {
  id: string;
  name: string;
  type: string;
  resources: string[];
  distance: string;
  image: string;
};

export function StationSelect() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  class Particle {
    x: number;
    y: number;
    z: number;
    speed: number;
    color: string;

    constructor(canvas: HTMLCanvasElement) {
      this.z = Math.random() * 2000;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(canvas.width, canvas.height);
      this.x = Math.cos(angle) * radius + canvas.width / 2;
      this.y = Math.sin(angle) * radius + canvas.height / 2;
      this.speed = Math.random() * 10 + 10;
      this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
    }

    update(canvas: HTMLCanvasElement) {
      this.z -= this.speed;
      if (this.z < 1) {
        this.z = 2000;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(canvas.width, canvas.height);
        this.x = Math.cos(angle) * radius + canvas.width / 2;
        this.y = Math.sin(angle) * radius + canvas.height / 2;
      }
    }

    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      const scale = 2000 / (2000 - this.z);
      const x = (this.x - canvas.width / 2) * scale + canvas.width / 2;
      const y = (this.y - canvas.height / 2) * scale + canvas.height / 2;
      const r = scale * 2;

      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.min((2000 - this.z) / 1000, 1);
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/galaxies");
        const data = await response.json();
        setStations(data);

        const defaultStation = data[0];
        setSelectedStation(defaultStation);
        localStorage.setItem("stationId", defaultStation.id);
      } catch (error) {
        console.error("Ошибка загрузки станций:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particlesRef.current = Array.from({ length: 400 }, () => new Particle(canvas));

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx, canvas);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isTransitioning) {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTransitioning]);

  const handleStationSelect = (station: Station) => {
    if (selectedStation?.id === station.id) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setSelectedStation(station);
      localStorage.setItem("stationId", station.id);
      window.dispatchEvent(new Event("stationIdChanged"));

      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 1000);
  };

  return (
    <>
      {isTransitioning && (
        <div className="fixed inset-0 z-[99999] bg-black transition-opacity duration-1000 pointer-events-none">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      )}

      <div className="space-y-6 rounded-xl bg-black/40 p-6 backdrop-blur-lg border-2 border-grey">
        <h2 className="text-xl font-medium text-white">Космические станции</h2>

        <div className="relative">
          <div
            className={cn(
              "space-y-4 transition-opacity duration-500",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          >
            {stations.map((station) => (
              <button
                key={station.id}
                className={cn(
                  "group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border transition-all duration-300",
                  selectedStation?.id === station.id
                    ? "border-blue-500 ring-2 ring-blue-500/50"
                    : "border-gray-800 hover:border-gray-700"
                )}
                onClick={() => handleStationSelect(station)}
              >
                <div className="relative h-24 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${station.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{station.name}</h3>
                    <span className="rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300">
                      {station.type}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {station.resources.map((resource) => (
                      <span
                        key={resource}
                        className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-400">
                    Дистанция: {station.distance}
                  </div>
                </div>

                {selectedStation?.id === station.id && (
                  <div className="absolute right-2 top-2 h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedStation && (
          <div className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-3">
            <h4 className="font-medium text-blue-300">Статус передачи</h4>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              Подключены к {selectedStation.name}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
