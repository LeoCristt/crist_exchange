"use client";

import { useEffect, useRef } from "react";

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const stars: Star[] = [];
    const numStars = Math.floor((canvas.width * canvas.height) / 1000);
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.05,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const nebulae: Nebula[] = [];
    const numNebulae = 3;
    
    for (let i = 0; i < numNebulae; i++) {
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 100,
        color: i % 3 === 0 ? "#4f3b78" : i % 3 === 1 ? "#3b5978" : "#783b5c",
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    let shootingStars: ShootingStar[] = [];
    const maxShootingStars = 2;
    
    const addShootingStar = () => {
      if (shootingStars.length < maxShootingStars && Math.random() < 0.01) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 150 + 50,
          speed: Math.random() * 15 + 5,
          angle: Math.PI / 4 + (Math.random() * Math.PI / 4),
          opacity: 0,
          growing: true,
        });
      }
    };

    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nebulae.forEach(nebula => {
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, `${nebula.color}${Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      const parallaxX = (mouseX - canvas.width / 2) * 0.005;
      const parallaxY = (mouseY - canvas.height / 2) * 0.005;
      
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDirection;
        
        if (star.opacity > 1) {
          star.opacity = 1;
          star.twinkleDirection = -1;
        } else if (star.opacity < 0.3) {
          star.opacity = 0.3;
          star.twinkleDirection = 1;
        }
        
        const starX = star.x + parallaxX * star.size * 3;
        const starY = star.y + parallaxY * star.size * 3;
        
        const wrappedX = (starX + canvas.width) % canvas.width;
        const wrappedY = (starY + canvas.height) % canvas.height;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      addShootingStar();
      
      shootingStars = shootingStars.filter(shootingStar => {
        if (shootingStar.growing) {
          shootingStar.opacity += 0.05;
          if (shootingStar.opacity >= 1) {
            shootingStar.growing = false;
          }
        } else {
          shootingStar.opacity -= 0.02;
        }
        
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        
        if (shootingStar.opacity > 0) {
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
          
          const gradient = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y,
            tailX, tailY
          );
          
          gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          
          return true;
        }
        
        return false; 
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full bg-black"
    />
  );
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDirection: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  growing: boolean;
}