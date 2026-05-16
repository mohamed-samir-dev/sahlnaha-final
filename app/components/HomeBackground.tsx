"use client";
import { motion } from "framer-motion";

const blobs = [
  { size: 600, x: "-8%",  y: "-15%", color: "#225EFF", opacity: 0.28, duration: 14 },
  { size: 500, x: "68%",  y: "-5%",  color: "#7FA8FF", opacity: 0.25, duration: 18 },
  { size: 420, x: "40%",  y: "35%",  color: "#AAD6FF", opacity: 0.3,  duration: 12 },
  { size: 380, x: "-5%",  y: "60%",  color: "#225EFF", opacity: 0.22, duration: 20 },
  { size: 340, x: "78%",  y: "58%",  color: "#7FA8FF", opacity: 0.26, duration: 16 },
  { size: 280, x: "30%",  y: "75%",  color: "#AAD6FF", opacity: 0.28, duration: 10 },
];

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${(i * 31 + 8) % 92}%`,
  y: `${(i * 47 + 12) % 88}%`,
  size: i % 4 === 0 ? 7 : i % 4 === 1 ? 5 : i % 4 === 2 ? 4 : 3,
  duration: 2.5 + (i % 3),
  delay: i * 0.25,
  color: i % 3 === 0 ? "#225EFF" : i % 3 === 1 ? "#7FA8FF" : "#AAD6FF",
}));

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* White base */}
      <div className="absolute inset-0 bg-white" />

      {/* Subtle dot pattern */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
        <defs>
          <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#225EFF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#225EFF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, transparent 65%)`,
            opacity: b.opacity,
            filter: "blur(55px)",
          }}
          animate={{
            x: [0, 50, -40, 30, 0],
            y: [0, -40, 50, -25, 0],
            scale: [1, 1.2, 0.85, 1.15, 1],
          }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}



      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}88`,
          }}
          animate={{
            y: [0, -28, 0],
            x: [0, 10, 0],
            opacity: [0.35, 1, 0.35],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Diagonal streaks */}
      {[
        { left: "22%", top: "5%",  height: "40%", color: "#225EFF", duration: 3.5, delay: 0 },
        { left: "65%", top: "20%", height: "30%", color: "#7FA8FF", duration: 4.5, delay: 1.5 },
        { left: "45%", top: "55%", height: "25%", color: "#AAD6FF", duration: 3,   delay: 0.8 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: "2px",
            height: s.height,
            left: s.left,
            top: s.top,
            background: `linear-gradient(180deg, transparent, ${s.color}99, transparent)`,
            filter: "blur(1px)",
          }}
          animate={{ opacity: [0, 0.7, 0], scaleY: [0.5, 1.3, 0.5] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
