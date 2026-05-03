import AnimatedBackground from "./AnimatedBackground";

interface Props {
  onStart: () => void;
  onMarket: () => void;
}

export default function MainMenu({ onStart, onMarket }: Props) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden" }}>
      <AnimatedBackground />

      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        zIndex: 10, gap: 0,
      }}>
        {/* Title card */}
        <div style={{
          background: "rgba(0,0,0,0.60)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(255,215,0,0.35)",
          borderRadius: 28, padding: "28px 52px",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          marginBottom: 22,
        }}>
          <div style={{ fontSize: 68, lineHeight: 1, marginBottom: 6, filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.6))" }}>🌾</div>
          <h1 style={{
            color: "#FFD700", fontSize: 54, fontWeight: 900, margin: "4px 0",
            textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,215,0,0.3)",
            letterSpacing: 3, lineHeight: 1,
          }}>
            FAZENDA BRASIL
          </h1>
          <p style={{ color: "#c8f0a0", fontSize: 16, margin: "6px 0 0", fontWeight: 600, letterSpacing: 1 }}>
            Safra Inteligente · Sebrae Games 2026
          </p>
        </div>

        {/* Crop showcase */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { emoji: "🌽", name: "Milho", color: "#f5c518" },
            { emoji: "🫛", name: "Soja", color: "#6dbf3e" },
            { emoji: "☕", name: "Café", color: "#c8a06e" },
            { emoji: "🎋", name: "Cana", color: "#7ec850" },
            { emoji: "🥔", name: "Mandioca", color: "#c8a96e" },
          ].map((c, i) => (
            <div key={i} style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(10px)",
              border: `2px solid ${c.color}55`,
              borderRadius: 16, padding: "10px 14px",
              textAlign: "center", minWidth: 72,
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 0 20px ${c.color}0a`,
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1) translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1) translateY(0)"}
            >
              <div style={{ fontSize: 32 }}>{c.emoji}</div>
              <div style={{ color: c.color, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={onStart}
          style={{
            background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)",
            color: "#fff", border: "3px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "20px 70px",
            fontSize: 26, fontWeight: 900, cursor: "pointer",
            boxShadow: "0 10px 40px rgba(39,174,96,0.55), inset 0 2px 0 rgba(255,255,255,0.15)",
            letterSpacing: 1, marginBottom: 14,
            textShadow: "0 2px 6px rgba(0,0,0,0.4)",
            transition: "transform 0.12s, box-shadow 0.12s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.06) translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 18px 50px rgba(39,174,96,0.7), inset 0 2px 0 rgba(255,255,255,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 10px 40px rgba(39,174,96,0.55), inset 0 2px 0 rgba(255,255,255,0.15)";
          }}
        >
          ▶ JOGAR AGORA
        </button>

        {/* Market pitch button */}
        <button
          onClick={onMarket}
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            color: "#4fc3f7", border: "1px solid rgba(79,195,247,0.3)",
            borderRadius: 12, padding: "10px 28px",
            cursor: "pointer", fontSize: 14, fontWeight: 700,
            marginBottom: 20, letterSpacing: 0.5,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(79,195,247,0.1)";
            e.currentTarget.style.borderColor = "rgba(79,195,247,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(0,0,0,0.45)";
            e.currentTarget.style.borderColor = "rgba(79,195,247,0.3)";
          }}
        >
          📊 Ver Potencial de Mercado
        </button>

        {/* How to play strip */}
        <div style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14, padding: "12px 24px",
          display: "flex", gap: 20, alignItems: "center",
        }}>
          {[
            { emoji: "🌱", text: "Plantar" },
            { emoji: "⚖️", text: "Decidir" },
            { emoji: "💧", text: "Regar" },
            { emoji: "✂️", text: "Colher" },
            { emoji: "📊", text: "Aprender" },
            { emoji: "💰", text: "Lucrar" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 600 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
