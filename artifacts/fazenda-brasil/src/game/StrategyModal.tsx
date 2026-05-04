import { CROPS, type CropType } from "./types";

interface Props {
  crop: CropType;
  soilQuality: number;
  onChoose: (strategy: "organic" | "chemical") => void;
  onCancel: () => void;
}

export default function StrategyModal({ crop, soilQuality, onChoose, onCancel }: Props) {
  const def = CROPS[crop];
  const soilColor = soilQuality > 70 ? "#6dbf3e" : soilQuality > 40 ? "#f5c518" : "#e74c3c";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 600,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a2a1a, #2a3d2a)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 22,
        padding: 30,
        width: 360,
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48 }}>{def.emoji}</div>
          <h2 style={{ color: "#fff", margin: "8px 0 4px", fontSize: 20 }}>Plantar {def.name}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>
            Escolha sua estratégia de cultivo
          </p>
        </div>

        {/* Indicador do solo */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: "10px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>🌱</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Qualidade do Solo</div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginTop: 4 }}>
              <div style={{ width: `${soilQuality}%`, height: "100%", background: soilColor, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ color: soilColor, fontWeight: 700, fontSize: 15 }}>{soilQuality}</div>
        </div>

        {/* Estratégias */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {/* Orgânico */}
          <button
            onClick={() => onChoose("organic")}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #27ae60, #1e8449)",
              color: "#fff",
              border: "2px solid #2ecc71",
              borderRadius: 14,
              padding: "16px 10px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 6 }}>🌿</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Orgânico</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6, lineHeight: 1.4 }}>
              Crescimento mais lento<br />
              <span style={{ color: "#a8f0a0" }}>+5 solo por colheita</span><br />
              Sustentável ♻️
            </div>
          </button>

          {/* Químico */}
          <button
            onClick={() => onChoose("chemical")}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #c0392b, #96281b)",
              color: "#fff",
              border: "2px solid #e74c3c",
              borderRadius: 14,
              padding: "16px 10px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 6 }}>⚡</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Químico</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6, lineHeight: 1.4 }}>
              Crescimento rápido<br />
              <span style={{ color: "#ffaaaa" }}>-10 solo por uso</span><br />
              +R$15 na colheita
            </div>
          </button>
        </div>

        <button
          onClick={onCancel}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "10px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
