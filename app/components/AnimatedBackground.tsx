"use client";
import { motion } from "framer-motion";

const COLS = 14;
const ROWS = 8;
const HEX_SIZE = 36;
const HEX_W = HEX_SIZE * 2;
const HEX_H = Math.sqrt(3) * HEX_SIZE;

// SVG hexagon path centered at 0,0
const hexPath = (r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });
  return `M ${pts.join(" L ")} Z`;
};

const hexagons = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * HEX_W * 0.75 + HEX_W / 2;
  const y = row * HEX_H + (col % 2 === 1 ? HEX_H / 2 : 0) + HEX_H / 2;
  return { id: i, x, y, delay: (col * 0.3 + row * 0.5) % 8 };
});

const orbs = [
  { size: 600, x: "-5%",  y: "-10%", color: "rgba(6,57,155,0.10)",   duration: 22, delay: 0 },
  { size: 500, x: "75%",  y: "65%",  color: "rgba(50,88,177,0.09)",  duration: 28, delay: 4 },
  { size: 320, x: "45%",  y: "25%",  color: "rgba(217,228,245,0.50)",duration: 18, delay: 7 },
];

const svgW = COLS * HEX_W * 0.75 + HEX_W * 0.25;
const svgH = ROWS * HEX_H + HEX_H;

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>

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

      {/* Hexagon grid */}
      <div className="absolute inset-0" style={{
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3258B1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06399B" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Static hex outlines */}
          {hexagons.map((h) => (
            <path
              key={`outline-${h.id}`}
              d={hexPath(HEX_SIZE - 2)}
              transform={`translate(${h.x}, ${h.y})`}
              fill="none"
              stroke="rgba(6,57,155,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Animated glowing hexagons */}
          {hexagons.map((h) => (
            <motion.path
              key={`glow-${h.id}`}
              d={hexPath(HEX_SIZE - 3)}
              transform={`translate(${h.x}, ${h.y})`}
              fill="url(#hexGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
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
      </div>

    </div>
  );
}
