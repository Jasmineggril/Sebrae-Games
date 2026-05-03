import { CROPS, type CropType } from "./types";

interface Props {
  crop: CropType;
  earned: number;
  onClose: () => void;
}

export default function FichaModal({ crop, earned, onClose }: Props) {
  const def = CROPS[crop];
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.82)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 750, backdropFilter: "blur(10px)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(160deg, #071a30 0%, #0d2a48 50%, #071a30 100%)",
        border: "2px solid rgba(79,195,247,0.3)",
        borderRadius: 26, padding: "0 0 24px",
        width: 370, overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,100,0.5), 0 0 40px rgba(79,195,247,0.1)",
        animation: "fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Hero header */}
        <div style={{
          background: `linear-gradient(135deg, ${def.color2}, ${def.color})`,
          padding: "24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }} />
          <div style={{ fontSize: 60, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))", position: "relative" }}>
            {def.emoji}
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginTop: 6, textTransform: "uppercase", position: "relative" }}>
            📊 Ficha do Produtor Brasileiro
          </div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 19, marginTop: 4, position: "relative", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {def.fichaTitle}
          </div>
        </div>

        <div style={{ padding: "20px 24px 0" }}>
          {/* Stat badge */}
          <div style={{
            background: "rgba(79,195,247,0.1)",
            border: "1px solid rgba(79,195,247,0.25)",
            borderRadius: 12, padding: "10px 14px",
            marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>🇧🇷</span>
            <div>
              <div style={{ color: "#4fc3f7", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>
                DADO REAL — AGRONEGÓCIO BRASILEIRO
              </div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{def.fichaStat}</div>
            </div>
          </div>

          {/* Fact */}
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 14, lineHeight: 1.75,
            margin: "0 0 16px", padding: 0,
          }}>
            {def.fichaFact}
          </p>

          {/* Earned */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 14, padding: "14px 16px",
            textAlign: "center", marginBottom: 16,
          }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4, letterSpacing: 1 }}>
              LUCRO DESTA COLHEITA
            </div>
            <div style={{ color: "#FFD700", fontWeight: 900, fontSize: 28, textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
              +R$ {earned}
            </div>
            <div style={{ color: "#f39c12", fontSize: 12, marginTop: 2 }}>adicionado ao seu caixa!</div>
          </div>

          {/* Source */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "7px 12px", marginBottom: 16,
          }}>
            <span style={{ fontSize: 14 }}>📚</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
              Fonte: IBGE · Embrapa · Sebrae · MAPA · Sebrae Games 2026
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #27ae60, #1e8449)",
              color: "#fff", border: "none",
              borderRadius: 14, padding: "14px",
              cursor: "pointer", fontSize: 16, fontWeight: 800,
              boxShadow: "0 6px 20px rgba(39,174,96,0.4)",
              letterSpacing: 0.5,
            }}
          >
            🌱 Continuar Plantando!
          </button>
        </div>
      </div>
    </div>
  );
}
