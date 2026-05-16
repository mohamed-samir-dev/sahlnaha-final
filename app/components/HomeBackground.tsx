export default function HomeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white" />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
        <defs>
          <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#225EFF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#225EFF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <style>{`
        @keyframes blob-move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -40px) scale(1.2); }
          50% { transform: translate(-40px, 50px) scale(0.85); }
          75% { transform: translate(30px, -25px) scale(1.15); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(10px, -28px) scale(1.6); opacity: 1; }
        }
        @keyframes streak-pulse {
          0%, 100% { opacity: 0; transform: scaleY(0.5); }
          50% { opacity: 0.7; transform: scaleY(1.3); }
        }
      `}</style>

      {/* Blobs */}
      {[
        { size: 600, x: "-8%",  y: "-15%", color: "#225EFF", opacity: 0.28, duration: 14 },
        { size: 500, x: "68%",  y: "-5%",  color: "#7FA8FF", opacity: 0.25, duration: 18 },
        { size: 420, x: "40%",  y: "35%",  color: "#AAD6FF", opacity: 0.3,  duration: 12 },
        { size: 380, x: "-5%",  y: "60%",  color: "#225EFF", opacity: 0.22, duration: 20 },
        { size: 340, x: "78%",  y: "58%",  color: "#7FA8FF", opacity: 0.26, duration: 16 },
        { size: 280, x: "30%",  y: "75%",  color: "#AAD6FF", opacity: 0.28, duration: 10 },
      ].map((b, i) => (
        <div
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
            animation: `blob-move ${b.duration}s ease-in-out infinite`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Particles - reduced to 12 */}
      {Array.from({ length: 12 }, (_, i) => ({
        x: `${(i * 62 + 8) % 92}%`,
        y: `${(i * 94 + 12) % 88}%`,
        size: i % 3 === 0 ? 7 : i % 3 === 1 ? 5 : 3,
        duration: 2.5 + (i % 3),
        delay: i * 0.5,
        color: i % 3 === 0 ? "#225EFF" : i % 3 === 1 ? "#7FA8FF" : "#AAD6FF",
      })).map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}88`,
            animation: `particle-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Streaks */}
      {[
        { left: "22%", top: "5%",  height: "40%", color: "#225EFF", duration: 3.5, delay: 0 },
        { left: "65%", top: "20%", height: "30%", color: "#7FA8FF", duration: 4.5, delay: 1.5 },
        { left: "45%", top: "55%", height: "25%", color: "#AAD6FF", duration: 3,   delay: 0.8 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: "2px",
            height: s.height,
            left: s.left,
            top: s.top,
            background: `linear-gradient(180deg, transparent, ${s.color}99, transparent)`,
            filter: "blur(1px)",
            animation: `streak-pulse ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
