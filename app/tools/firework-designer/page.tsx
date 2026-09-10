'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import { MINECRAFT_DYES } from '@/app/lib/minecraft-colors';

type FireworkShape = 'small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst';

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
  const [flightDuration, setFlightDuration] = useState<number>(2);
  const [shape, setShape] = useState<FireworkShape>('star');
  const [primaryColors, setPrimaryColors] = useState<number[]>([16701501, 11546150]); // Yellow, Red
  const [fadeColors, setFadeColors] = useState<number[]>([3847130]); // Light Blue
  const [hasTrail, setHasTrail] = useState<boolean>(true);
  const [hasTwinkle, setHasTwinkle] = useState<boolean>(true);
  const { copy, toastMessage } = useClipboard();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

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
      (c) => MINECRAFT_DYES.find((fc) => fc.intVal === c)?.hex || '#FFD700'
    );
    const fadeHexList = fadeColors.map(
      (c) => MINECRAFT_DYES.find((fc) => fc.intVal === c)?.hex || '#FFFFFF'
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
        fadeColor: fadeHexList.length > 0 ? fadeHexList[Math.floor(Math.random() * fadeHexList.length)] : undefined,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        twinkle: hasTwinkle,
        trail: hasTrail,
        prevX: cx,
        prevY: cy,
      });
    }

    particlesRef.current = newParticles;
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const remaining: Particle[] = [];
      for (const p of particlesRef.current) {
        p.prevX = p.x;
        p.prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          if (p.trail && p.prevX && p.prevY) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.alpha * 0.4;
            ctx.lineWidth = 1.5;
            ctx.moveTo(p.prevX, p.prevY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }

          let drawAlpha = p.alpha;
          if (p.twinkle && Math.random() > 0.4) {
            drawAlpha = Math.random() * 0.8 + 0.2;
          }

          ctx.globalAlpha = drawAlpha;
          const displayColor = p.fadeColor && p.alpha < 0.5 ? p.fadeColor : p.color;
          ctx.fillStyle = displayColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          remaining.push(p);
        }
      }

      particlesRef.current = remaining;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute 1.20.5+ fireworks item component NBT
  const giveCommand = useMemo(() => {
    const shapeIdMap: Record<FireworkShape, number> = {
      small_ball: 0,
      large_ball: 1,
      star: 2,
      creeper: 3,
      burst: 4,
    };

    const explosionObj = {
      shape: shapeIdMap[shape],
      colors: primaryColors,
      fade_colors: fadeColors,
      has_trail: hasTrail,
      has_twinkle: hasTwinkle,
    };

    const explosionJson = `[${JSON.stringify(explosionObj).replace(/"/g, '')}]`;
    return `/give @p firework_rocket[fireworks={flight_duration:${flightDuration},explosions:${explosionJson}}] 64`;
  }, [flightDuration, shape, primaryColors, fadeColors, hasTrail, hasTwinkle]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Firework Rocket Designer"
        description="Design custom fireworks with explosion shapes, multiple color bursts, trails, and night-sky particle simulation for Minecraft 1.20.5+."
        badge="Server & Creator"
        icon="celebration"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">settings</span>
              Rocket & Explosion Settings
            </h2>

            {/* Flight Duration */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Flight Duration (Gunpowder)</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">Tier {flightDuration}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setFlightDuration(dur)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      flightDuration === dur
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    Duration {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Explosion Shape */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                Explosion Shape
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      shape === s.id
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Colors */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                Primary Burst Colors ({primaryColors.length} selected)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {MINECRAFT_DYES.map((c) => (
                  <button
                    key={`prim-${c.intVal}`}
                    type="button"
                    onClick={() => togglePrimaryColor(c.intVal)}
                    className={`h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      primaryColors.includes(c.intVal)
                        ? 'border-[var(--md-sys-color-primary)] ring-2 ring-[var(--md-sys-color-primary)]/50 scale-105'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 opacity-70 hover:opacity-100'
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
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                Fade Out Transition Colors ({fadeColors.length} selected)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {MINECRAFT_DYES.map((c) => (
                  <button
                    key={`fade-${c.intVal}`}
                    type="button"
                    onClick={() => toggleFadeColor(c.intVal)}
                    className={`h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      fadeColors.includes(c.intVal)
                        ? 'border-[var(--md-sys-color-primary)] ring-2 ring-[var(--md-sys-color-primary)]/50 scale-105'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    <span className="w-4 h-4 rounded-xs shadow-xs" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Modifiers */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40 flex gap-4 text-xs font-semibold text-[var(--md-sys-color-on-surface)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTrail}
                  onChange={(e) => setHasTrail(e.target.checked)}
                  className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                />
                <span>Trail (Diamond)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTwinkle}
                  onChange={(e) => setHasTwinkle(e.target.checked)}
                  className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                />
                <span>Twinkle / Flicker (Glowstone)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Canvas Viewport & /give command */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Night Sky Simulation
              </div>
              <button
                type="button"
                onClick={triggerExplosion}
                className="py-1.5 px-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-[var(--md-sys-color-on-surface)]">Minecraft 1.20.5+ /give Command</h3>
              <button
                type="button"
                onClick={() => copy(giveCommand, 'Copied /give command!')}
                className="text-xs font-semibold text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Command
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[var(--md-sys-color-outline-variant)]/30">
              {giveCommand}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
