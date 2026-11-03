"use client";

import { useEffect, useRef } from "react";

// every dot is a person. they drift around and link up when they get close,
// and the pointer pulls nearby people together. thats the whole idea of kindred.
const COLORS = ["#8b74ff", "#e36bff", "#ffc266", "#ffffff"];

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
}

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let running = true;
    let started = performance.now();
    const pointer = { x: -9999, y: -9999, active: false };

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(110, Math.max(36, (width * height) / 14000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
      started = performance.now();
    }

    function draw(now: number) {
      const t = reduce ? 1 : Math.min(1, (now - started) / 1800);
      // ease out, dots grow out from the middle on first load
      const grow = 1 - Math.pow(1 - t, 3);
      const cx = width * 0.62;
      const cy = height * 0.5;
      const link = Math.min(150, width / 7);

      ctx!.clearRect(0, 0, width, height);

      const pos = dots.map((d) => ({
        x: cx + (d.x - cx) * grow,
        y: cy + (d.y - cy) * grow,
      }));

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < link) {
            ctx!.strokeStyle = `rgba(184, 170, 255, ${(1 - dist / link) * 0.28 * grow})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(pos[i].x, pos[i].y);
            ctx!.lineTo(pos[j].x, pos[j].y);
            ctx!.stroke();
          }
        }
        if (pointer.active) {
          const dist = Math.hypot(pos[i].x - pointer.x, pos[i].y - pointer.y);
          if (dist < link * 1.4) {
            ctx!.strokeStyle = `rgba(255, 194, 102, ${(1 - dist / (link * 1.4)) * 0.55})`;
            ctx!.beginPath();
            ctx!.moveTo(pos[i].x, pos[i].y);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }
      }

      for (let i = 0; i < dots.length; i++) {
        ctx!.fillStyle = dots[i].c;
        ctx!.globalAlpha = 0.9 * grow;
        ctx!.beginPath();
        ctx!.arc(pos[i].x, pos[i].y, dots[i].r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function step(now: number) {
      if (!running) return;
      for (const d of dots) {
        if (pointer.active) {
          const dx = pointer.x - d.x;
          const dy = pointer.y - d.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 220) {
            d.vx += (dx / dist) * 0.012;
            d.vy += (dy / dist) * 0.012;
          }
        }
        d.vx *= 0.985;
        d.vy *= 0.985;
        // keep a little drift so it never freezes
        if (Math.abs(d.vx) < 0.05) d.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(d.vy) < 0.05) d.vy += (Math.random() - 0.5) * 0.04;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -20) d.x = width + 20;
        if (d.x > width + 20) d.x = -20;
        if (d.y < -20) d.y = height + 20;
        if (d.y > height + 20) d.y = -20;
      }
      draw(now);
      frame = requestAnimationFrame(step);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    }
    function onLeave() {
      pointer.active = false;
    }

    setup();
    if (reduce) {
      draw(performance.now());
    } else {
      frame = requestAnimationFrame(step);
    }

    // stop drawing when the hero is not on screen
    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(step);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    const onResize = () => {
      setup();
      if (reduce) draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
