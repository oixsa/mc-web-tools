'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type FireworkShape = 'small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst';

interface FireworkColor {
  name: string;
  hex: string;
  intVal: number;
}

const FIREWORK_COLORS: FireworkColor[] = [
  { name: 'Black', hex: '#1E1B1B', intVal: 1973019 },
  { name: 'Red', hex: '#B02E26', intVal: 11546150 },
  { name: 'Green', hex: '#5E7C16', intVal: 6192150 },
  { name: 'Brown', hex: '#835432', intVal: 8606770 },
  { name: 'Blue', hex: '#3C44AA', intVal: 3949738 },
  { name: 'Purple', hex: '#8932B8', intVal: 8991416 },
  { name: 'Cyan', hex: '#169C9C', intVal: 1481884 },
  { name: 'Light Gray', hex: '#9D9D97', intVal: 10329495 },
  { name: 'Gray', hex: '#474F52', intVal: 4673362 },
  { name: 'Pink', hex: '#F38BAA', intVal: 15961002 },
  { name: 'Lime', hex: '#80C71F', intVal: 8439583 },
  { name: 'Yellow', hex: '#FED83D', intVal: 16701501 },
  { name: 'Light Blue', hex: '#3AB3DA', intVal: 3847130 },
  { name: 'Magenta', hex: '#C74EBD', intVal: 13061821 },
  { name: 'Orange', hex: '#F9801D', intVal: 16351261 },
  { name: 'White', hex: '#F9FFFE', intVal: 16382457 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  fadeColor?: string;
  alpha: number;
  decay: number;
  twinkle: boolean;
  trail: boolean;
  prevX?: number;
  prevY?: number;
}

export default function FireworkDesignerPage() {

  // States
  const [flightDuration, setFlightDuration] = useState<number>(2);
  const [shape, setShape] = useState<FireworkShape>('star');
  const [primaryColors, setPrimaryColors] = useState<number[]>([16701501, 11546150]); // Yellow, Red
  const [fadeColors, setFadeColors] = useState<number[]>([3847130]); // Light Blue
  const [hasTrail, setHasTrail] = useState<boolean>(true);
  const [hasTwinkle, setHasTwinkle] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const togglePrimaryColor = (intVal: number) => {
    if (primaryColors.includes(intVal)) {
      if (primaryColors.length > 1) {
        setPrimaryColors((prev) => prev.filter((c) => c !== intVal));
      }
    } else {
      setPrimaryColors((prev) => [...prev, intVal]);
    }
  };

  const toggleFadeColor = (intVal: number) => {
    if (fadeColors.includes(intVal)) {
      setFadeColors((prev) => prev.filter((c) => c !== intVal));
    } else {
      setFadeColors((prev) => [...prev, intVal]);
    }
  };

  // Launch rocket on canvas
  const triggerExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;
    const count = shape === 'large_ball' ? 120 : shape === 'burst' ? 60 : 80;

    const newParticles: Particle[] = [];
    const colorHexList = primaryColors.map(
      (c) => FIREWORK_COLORS.find((fc) => fc.intVal === c)?.hex || '#FFD700'
    );
    const fadeHexList = fadeColors.map(
      (c) => FIREWORK_COLORS.find((fc) => fc.intVal === c)?.hex || '#FFFFFF'
    );

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      let speed = Math.random() * 4 + 2;

      // Adjust particle vectors for shapes
      if (shape === 'star') {
        const points = 5;
        const starAngle = angle * points;
        speed = 2 + Math.abs(Math.sin(starAngle)) * 4;
      } else if (shape === 'creeper') {
        // approximate squarish explosion
        speed = (Math.random() > 0.5 ? 3 : 5) + Math.random() * 2;
      }

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      newParticles.push({
        x: cx,
        y: cy,
        vx,
        vy,
        color: colorHexList[Math.floor(Math.random() * colorHexList.length)],
        fadeColor: fadeHexList.length > 0 ? fadeHexList[Math.floor(Math.random() * fadeHexList.length)] : '',
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.015,
        twinkle: hasTwinkle,
        trail: hasTrail,
        prevX: cx,
        prevY: cy,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      // Clear with dark trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.prevX = p.x;
        p.prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.98; // air drag
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.twinkle && Math.random() > 0.4 ? p.alpha * 0.6 : p.alpha;
        ctx.fillStyle = p.fadeColor && p.alpha < 0.5 ? p.fadeColor : p.color;

        if (p.trail && p.prevX !== undefined && p.prevY !== undefined) {
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.prevX, p.prevY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compile Modern 1.20.5+ /give command
  const giveCommand = useMemo(() => {
    const explosionObj = {
      shape: shape,
      colors: primaryColors,
      ...(fadeColors.length > 0 ? { fade_colors: fadeColors } : {}),
      ...(hasTrail ? { has_trail: true } : {}),
      ...(hasTwinkle ? { has_twinkle: true } : {}),
    };

    return `/give @p firework_rocket[fireworks={flight_duration:${flightDuration},explosions:[${JSON.stringify(
      explosionObj
    )}]}] 64`;
  }, [flightDuration, shape, primaryColors, fadeColors, hasTrail, hasTwinkle]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Firework Rocket Designer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">celebration</span>
            Creator Tools
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Firework Rocket Designer
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Create spectacular custom Minecraft fireworks with explosion shapes, multi-color bursts, fade transitions, and test with live particle simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">tune</span>
                Explosion Attributes
              </h2>

              {/* Flight Duration */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Flight Duration (Gunpowder)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlightDuration(f)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                        flightDuration === f
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                      }`}
                    >
                      Duration {f} ({f * 12} to {f * 22} blocks)
                    </button>
                  ))}
                </div>
              </div>

              {/* Explosion Shape */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Burst Shape</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'small_ball' as const, label: 'Small Ball' },
                    { id: 'large_ball' as const, label: 'Large Ball' },
                    { id: 'star' as const, label: 'Star' },
                    { id: 'creeper' as const, label: 'Creeper' },
                    { id: 'burst' as const, label: 'Burst' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      className={`p-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                        shape === s.id
                          ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F] font-bold'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Colors */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Primary Burst Colors ({primaryColors.length} selected)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {FIREWORK_COLORS.map((c) => (
                    <button
                      key={`prim-${c.intVal}`}
                      type="button"
                      onClick={() => togglePrimaryColor(c.intVal)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        primaryColors.includes(c.intVal)
                          ? 'border-[#8A4228] dark:border-[#E07A5F] ring-2 ring-amber-500/50 scale-105'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] opacity-70 hover:opacity-100'
                      }`}
                      title={c.name}
                    >
                      <span className="w-4 h-4 rounded-xs shadow-xs" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fade Colors */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Fade Out Transition Colors ({fadeColors.length} selected)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {FIREWORK_COLORS.map((c) => (
                    <button
                      key={`fade-${c.intVal}`}
                      type="button"
                      onClick={() => toggleFadeColor(c.intVal)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        fadeColors.includes(c.intVal)
                          ? 'border-[#8A4228] dark:border-[#E07A5F] ring-2 ring-blue-500/50 scale-105'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] opacity-70 hover:opacity-100'
                      }`}
                      title={c.name}
                    >
                      <span className="w-4 h-4 rounded-xs shadow-xs" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Modifiers */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28] flex gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTrail}
                    onChange={(e) => setHasTrail(e.target.checked)}
                    className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                  />
                  <span>Trail (Diamond)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTwinkle}
                    onChange={(e) => setHasTwinkle(e.target.checked)}
                    className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                  />
                  <span>Twinkle / Flicker (Glowstone)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Canvas Viewport & /give command */}
          <div className="lg:col-span-6 space-y-6">
            {/* Canvas Viewport */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#68615A] dark:text-[#A8A19B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Night Sky Simulation
                </div>
                <button
                  type="button"
                  onClick={triggerExplosion}
                  className="py-1.5 px-3 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold hover:bg-[#72341D] transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  Launch Rocket
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-black/40">
                <canvas
                  ref={canvasRef}
                  width="480"
                  height="280"
                  className="w-full h-[280px] bg-[#0A0A0F] cursor-pointer"
                  onClick={triggerExplosion}
                />
                <div className="absolute bottom-2 left-3 text-[10px] text-white/50 pointer-events-none">
                  Click canvas or button to launch
                </div>
              </div>
            </div>

            {/* /give command */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm">Minecraft 1.20.5+ /give Command</h3>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(giveCommand);
                    triggerToast('Copied /give command!');
                  }}
                  className="text-xs font-semibold text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy Command
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-black/5 dark:bg-black/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[#E2DDD8]/60 dark:border-[#3A2D28]/60">
                {giveCommand}
              </pre>
            </div>
          </div>
        </div>
    </div>
  );
}
