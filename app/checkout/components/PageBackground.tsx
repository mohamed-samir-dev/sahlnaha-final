const blobs = [
  { size: 600, x: "-8%",  y: "-15%", color: "#225EFF", opacity: 0.22, d: 14 },
  { size: 500, x: "68%",  y: "-5%",  color: "#7FA8FF", opacity: 0.18, d: 18 },
  { size: 420, x: "40%",  y: "35%",  color: "#AAD6FF", opacity: 0.22, d: 12 },
  { size: 380, x: "-5%",  y: "60%",  color: "#225EFF", opacity: 0.16, d: 20 },
];

export default function PageBackground({ dotId, gridId }: { dotId: string; gridId: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white" />
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
        <defs><pattern id={dotId} width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#225EFF" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${dotId})`} />
      </svg>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
        <defs><pattern id={gridId} width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#225EFF" strokeWidth="1" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
      <style>{`
        @keyframes blob-move {
          0%,100%{transform:translate(0,0) scale(1)}
          25%{transform:translate(50px,-40px) scale(1.2)}
          50%{transform:translate(-40px,50px) scale(0.85)}
          75%{transform:translate(30px,-25px) scale(1.15)}
        }
      `}</style>
      {blobs.map((b, i) => (
        <div key={i} className="absolute rounded-full" style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, transparent 65%)`, opacity: b.opacity, filter: "blur(55px)", animation: `blob-move ${b.d}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}
