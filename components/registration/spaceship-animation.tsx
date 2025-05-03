"use client";

import { useEffect, useRef } from "react";

export function SpaceshipAnimation({ isLaunching }: { isLaunching: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Star field
    const stars: Star[] = [];
    const numStars = Math.floor((canvas.width * canvas.height) / 2000);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
      });
    }

    // Spaceship properties
    let shipX = canvas.width / 2;
    let shipY = canvas.height / 2;
    let shipSpeed = 0;
    let shipRotation = 0;
    let engineGlow = 0;

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach((star) => {
        if (isLaunching) {
          star.y -= star.speed * 3;
          if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
          }
        } else {
          star.y += star.speed * 0.1;
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw spaceship
      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.rotate(shipRotation);

      // Engine glow
      if (isLaunching) {
        engineGlow = Math.min(1, engineGlow + 0.05);
        shipSpeed += 0.2;
        shipY -= shipSpeed;

        ctx.beginPath();
        ctx.fillStyle = `rgba(64, 156, 255, ${engineGlow * 0.5})`;
        ctx.moveTo(-20, 30);
        ctx.quadraticCurveTo(0, 80 + Math.random() * 20, 20, 30);
        ctx.fill();
      }

      // Ship body
      ctx.beginPath();
      ctx.fillStyle = "#1a1a1a";
      ctx.moveTo(0, -30);
      ctx.lineTo(-20, 30);
      ctx.lineTo(20, 30);
      ctx.closePath();
      ctx.fill();

      // Ship windows
      ctx.fillStyle = "#4099ff";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isLaunching]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}