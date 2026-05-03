import { useEffect, useState } from "react";

export interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface Props {
  particles: Particle[];
  onExpire: (id: number) => void;
}

function CoinBurst({ p, onExpire }: { p: Particle; onExpire: (id: number) => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onExpire(p.id);
    }, 1200);
    return () => clearTimeout(t);
  }, [p.id, onExpire]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      left: p.x,
      top: p.y,
      pointerEvents: "none",
      zIndex: 2000,
      animation: "coinRise 1.2s ease-out forwards",
      fontWeight: 900,
      fontSize: 22,
      color: "#FFD700",
      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
      whiteSpace: "nowrap",
    }}>
      +R${p.value} 💰
    </div>
  );
}

export default function CoinParticles({ particles, onExpire }: Props) {
  return (
    <>
      <style>{`
        @keyframes coinRise {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateY(-60px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-100px) scale(0.8); }
        }
      `}</style>
      {particles.map(p => (
        <CoinBurst key={p.id} p={p} onExpire={onExpire} />
      ))}
    </>
  );
}
