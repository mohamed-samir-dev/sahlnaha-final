"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HEX_SIZE = 36;
const HEX_W = HEX_SIZE * 2;
const HEX_H = Math.sqrt(3) * HEX_SIZE;

const hexPath = (r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  });
  return `M ${pts.join(" L ")} Z`;
};

const orbs = [
  { size: 650, x: "-5%",  y: "-10%", color: "rgba(6,57,155,0.08)",    duration: 22, delay: 0 },
  { size: 500, x: "80%",  y: "70%",  color: "rgba(50,88,177,0.07)",   duration: 28, delay: 4 },
  { size: 350, x: "45%",  y: "30%",  color: "rgba(217,228,245,0.45)", duration: 18, delay: 7 },
];

export default function AnimatedBackground() {
  const [grid, setGrid] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const build = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cols = Math.ceil(W / (HEX_W * 0.75)) + 2;
      const rows = Math.ceil(H / HEX_H) + 2;
      const svgW = cols * HEX_W * 0.75 + HEX_W * 0.25;
      const svgH = rows * HEX_H + HEX_H;
      const hexagons = Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          id: i,
          x: col * HEX_W * 0.75 + HEX_W / 2,
          y: row * HEX_H + (col % 2 === 1 ? HEX_H / 2 : 0) + HEX_H / 2,
          delay: (col * 0.3 + row * 0.5) % 8,
        };
      });
      setGrid(hexagons);
      setSvgSize({ w: svgW, h: svgH });
    };

    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>

      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 40%, #f5f8ff 70%, #edf3ff 100%)"
      }} />

      {/* Orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(70px)",
            translateX: "-50%", translateY: "-50%",
          }}
          animate={{ x: [0, 50, -30, 20, 0], y: [0, -40, 35, -20, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Full-screen hexagon SVG */}
      {svgSize.w > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3258B1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06399B" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Static outlines */}
          {grid.map((h) => (
            <path
              key={h.id}
              d={hexPath(HEX_SIZE - 2)}
              transform={`translate(${h.x}, ${h.y})`}
              fill="none"
              stroke="rgba(6,57,155,0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Glowing hexagons */}
          {grid.map((h) => (
            <motion.path
              key={`g-${h.id}`}
              d={hexPath(HEX_SIZE - 3)}
              transform={`translate(${h.x}, ${h.y})`}
              fill="url(#hexGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{
                duration: 3.5,
                delay: h.delay,
                repeat: Infinity,
                repeatDelay: 4 + (h.id % 6),
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      )}

    </div>
  );
}
