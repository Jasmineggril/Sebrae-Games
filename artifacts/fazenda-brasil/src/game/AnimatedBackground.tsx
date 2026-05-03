import { useMemo } from "react";

export default function AnimatedBackground() {
  const cloudData = useMemo(() => [
    { top: 7, width: 140, height: 48, speed: 36, delay: 0, opacity: 1 },
    { top: 15, width: 90, height: 34, speed: 54, delay: -18, opacity: 0.85 },
    { top: 4, width: 180, height: 58, speed: 62, delay: -30, opacity: 0.9 },
    { top: 21, width: 110, height: 40, speed: 44, delay: -8, opacity: 0.8 },
    { top: 11, width: 70, height: 28, speed: 28, delay: -22, opacity: 0.75 },
  ], []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <style>{`
        @keyframes cloudDrift { from { transform: translateX(-220px); } to { transform: translateX(110vw); } }
        @keyframes birdSoar {
          0%   { transform: translateX(-60px) translateY(0); }
          30%  { transform: translateX(30vw) translateY(-14px); }
          65%  { transform: translateX(65vw) translateY(4px); }
          100% { transform: translateX(110vw) translateY(-6px); }
        }
        @keyframes sunRay {
          0%,100% { transform: rotate(0deg) scaleX(1); opacity: 0.18; }
          50%      { transform: rotate(5deg) scaleX(1.08); opacity: 0.28; }
        }
        @keyframes sunGlow {
          0%,100% { box-shadow: 0 0 50px 15px rgba(255,220,0,0.55), 0 0 100px 40px rgba(255,160,0,0.25); }
          50%      { box-shadow: 0 0 70px 25px rgba(255,220,0,0.75), 0 0 140px 60px rgba(255,160,0,0.35); }
        }
        @keyframes hillSway {
          0%,100% { transform: scaleX(1) translateX(0); }
          50%      { transform: scaleX(1.01) translateX(-4px); }
        }
      `}</style>

      {/* Sky */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #29b6f6 0%, #4fc3f7 25%, #81d4fa 45%, #b3e5fc 58%, #c8e6c9 68%, #81c784 80%, #4caf50 90%, #388e3c 100%)",
      }} />

      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <div key={i} style={{
          position: "absolute", top: "7%", right: "9%",
          width: 120, height: 3,
          background: "linear-gradient(90deg, rgba(255,240,100,0.5), transparent)",
          transformOrigin: "left center",
          transform: `rotate(${deg}deg)`,
          animation: `sunRay ${3 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}

      {/* Sun */}
      <div style={{
        position: "absolute", top: "6%", right: "8%",
        width: 90, height: 90, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 38%, #fffde7 20%, #FFD700 60%, #FF8F00 100%)",
        animation: "sunGlow 4s ease-in-out infinite",
        zIndex: 2,
      }} />

      {/* Clouds */}
      {cloudData.map((c, i) => (
        <div key={i} style={{
          position: "absolute", top: `${c.top}%`,
          animation: `cloudDrift ${c.speed}s linear infinite`,
          animationDelay: `${c.delay}s`,
          opacity: c.opacity, zIndex: 3,
        }}>
          <div style={{ position: "relative", width: c.width, height: c.height }}>
            <div style={{ position: "absolute", bottom: 0, left: "5%", width: "90%", height: "55%", background: "rgba(255,255,255,0.95)", borderRadius: 999, filter: "blur(1px)" }} />
            <div style={{ position: "absolute", bottom: "28%", left: "18%", width: "55%", height: "75%", background: "rgba(255,255,255,0.95)", borderRadius: 999, filter: "blur(1px)" }} />
            <div style={{ position: "absolute", bottom: "18%", left: "45%", width: "42%", height: "65%", background: "rgba(255,255,255,0.9)", borderRadius: 999, filter: "blur(1px)" }} />
          </div>
        </div>
      ))}

      {/* Birds */}
      {[{ top: 9, delay: 0, scale: 1.1 }, { top: 13, delay: -6, scale: 0.75 }, { top: 7, delay: -11, scale: 0.9 }].map((b, i) => (
        <div key={i} style={{
          position: "absolute", top: `${b.top}%`,
          fontSize: 20 * b.scale,
          animation: `birdSoar 20s linear infinite`,
          animationDelay: `${b.delay}s`,
          zIndex: 4, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}>🐦</div>
      ))}

      {/* Rolling green hills */}
      <div style={{
        position: "absolute", bottom: 0, left: "-5%", right: "-5%",
        height: "38%",
        background: "radial-gradient(ellipse 120% 80% at 50% 100%, #2e7d32 50%, transparent 100%)",
        animation: "hillSway 8s ease-in-out infinite",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: "-8%", right: "-8%",
        height: "26%",
        background: "radial-gradient(ellipse 90% 70% at 30% 100%, #1b5e20 40%, transparent 100%)",
        animation: "hillSway 10s ease-in-out infinite",
        animationDelay: "-3s", zIndex: 1,
      }} />

      {/* Grass foreground strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "15%",
        background: "linear-gradient(180deg, transparent, rgba(27,94,32,0.8) 60%, #1b5e20 100%)",
        zIndex: 2,
      }} />

      {/* Decorative trees */}
      {[5, 15, 82, 93].map((left, i) => (
        <div key={i} style={{
          position: "absolute", bottom: "14%", left: `${left}%`,
          fontSize: 32 + (i % 2) * 10, opacity: 0.6, zIndex: 3,
          filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.3))",
        }}>🌳</div>
      ))}
      {[25, 72].map((left, i) => (
        <div key={i} style={{
          position: "absolute", bottom: "13%", left: `${left}%`,
          fontSize: 24, opacity: 0.5, zIndex: 3,
        }}>🌲</div>
      ))}
    </div>
  );
}
