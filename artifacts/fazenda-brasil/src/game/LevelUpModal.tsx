import { useEffect } from "react";

interface Props {
  level: number;
  reward: number;
  onClose: () => void;
}

const LEVEL_REWARDS: Record<number, string> = {
  2: "🌾 Canteiros crescem 10% mais rápido!",
  3: "☕ Café desbloqueado na Feira!",
  4: "💰 Preços na feira sobem 10%!",
  5: "🌿 Orgânico recupera +3 solo/colheita!",
  6: "🎋 Cana desbloqueada na Feira!",
  7: "⚡ Químico tem penalidade reduzida!",
  8: "🌱 Solo começa cada partida com +10!",
  9: "💧 Regar dura 2x mais!",
  10: "🏆 Modo Lendário desbloqueado!",
};

export default function LevelUpModal({ level, reward, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const perk = LEVEL_REWARDS[level] ?? "🎁 Bônus de progressão desbloqueado!";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 850,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <style>{`
        @keyframes levelUpBounce {
          0%   { transform: scale(0.5) translateY(30px); opacity: 0; }
          60%  { transform: scale(1.08) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes starOrbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, #1a1a00, #3d3000, #1a1a00)",
        border: "3px solid #FFD700",
        borderRadius: 28,
        padding: "36px 44px",
        textAlign: "center",
        boxShadow: "0 0 60px rgba(255,215,0,0.5), 0 24px 60px rgba(0,0,0,0.8)",
        animation: "levelUpBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        position: "relative",
        overflow: "hidden",
        minWidth: 340,
        pointerEvents: "auto",
      }}>
        {/* Estrelas decorativas */}
        {["⭐","🌟","✨","💫"].map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            fontSize: 20,
            animation: `starOrbit ${2 + i * 0.5}s linear infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.7,
            pointerEvents: "none",
          }}>{s}</div>
        ))}

        <div style={{ fontSize: 16, color: "#FFD700", fontWeight: 800, letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
          🎉 Subiu de Nível!
        </div>

        <div style={{
          fontSize: 96, fontWeight: 900, color: "#FFD700",
          textShadow: "0 0 30px rgba(255,215,0,0.8), 0 4px 20px rgba(0,0,0,0.8)",
          lineHeight: 1, marginBottom: 8,
        }}>
          {level}
        </div>

        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Nível {level} Alcançado!
        </div>

        <div style={{
          background: "rgba(255,215,0,0.12)",
          border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 14, padding: "12px 20px", marginBottom: 20,
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4, letterSpacing: 1 }}>NOVA HABILIDADE</div>
          <div style={{ color: "#FFD700", fontSize: 15, fontWeight: 700 }}>{perk}</div>
        </div>

        <div style={{ color: "#7dff7d", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
          +R$ {reward} de bônus!
        </div>

        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #f39c12, #d35400)",
            color: "#fff", border: "none",
            borderRadius: 12, padding: "12px 32px",
            cursor: "pointer", fontSize: 15, fontWeight: 800,
            boxShadow: "0 4px 16px rgba(243,156,18,0.5)",
          }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
