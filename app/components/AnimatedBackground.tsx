"use client";
import { motion } from "framer-motion";

const orbs = [
  { size: 600, x: "-10%", y: "-5%",  color: "rgba(6,57,155,0.10)",   duration: 20, delay: 0 },
  { size: 500, x: "70%",  y: "60%",  color: "rgba(50,88,177,0.09)",  duration: 25, delay: 3 },
  { size: 350, x: "40%",  y: "20%",  color: "rgba(217,228,245,0.55)",duration: 18, delay: 6 },
  { size: 280, x: "85%",  y: "5%",   color: "rgba(6,57,155,0.07)",   duration: 22, delay: 2 },
  { size: 220, x: "15%",  y: "75%",  color: "rgba(71,108,183,0.08)", duration: 30, delay: 8 },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${(i * 37 + 5) % 95}%`,
  y: `${(i * 53 + 10) % 90}%`,
  size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
  duration: 8 + (i % 5) * 3,
  delay: (i * 0.7) % 6,
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 35%, #f5f8ff 65%, #edf3ff 100%)"
      }} />

      {/* Mesh grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(6,57,155,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,57,155,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%)",
        }}
        animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -50, 40, -30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: p.id % 2 === 0 ? "#06399B" : "#3258B1",
            opacity: 0.25,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Diagonal shimmer line */}
      <motion.div
        className="absolute"
        style={{
          width: "2px",
          height: "40%",
          background: "linear-gradient(180deg, transparent, rgba(6,57,155,0.15), transparent)",
          top: "30%",
          left: "25%",
          rotate: "30deg",
          filter: "blur(1px)",
        }}
        animate={{ opacity: [0, 0.8, 0], y: [-100, 100] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "2px",
          height: "30%",
          background: "linear-gradient(180deg, transparent, rgba(50,88,177,0.12), transparent)",
          top: "20%",
          left: "70%",
          rotate: "-20deg",
          filter: "blur(1px)",
        }}
        animate={{ opacity: [0, 0.6, 0], y: [-80, 80] }}
        transition={{ duration: 8, repeat: Infinity, delay: 5, ease: "easeInOut" }}
      />
    </div>
  );
}
