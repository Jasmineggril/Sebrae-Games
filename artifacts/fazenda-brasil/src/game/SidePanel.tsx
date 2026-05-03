import { CROPS, XP_PER_LEVEL, type GameState, type CropType } from "./types";
import ObjectivesPanel from "./ObjectivesPanel";

interface Props {
  state: GameState;
}

export default function SidePanel({ state }: Props) {
  const soilColor = state.soilQuality > 70 ? "#52b788" : state.soilQuality > 40 ? "#f5c518" : "#e74c3c";
  const xpPct = ((state.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  const readyCount = state.plots.filter(p => p.state === "ready").length;

  return (
    <div style={{
      width: 190,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative",
      zIndex: 10,
      flexShrink: 0,
      maxHeight: "100%",
      overflow: "hidden",
    }}>
      {/* Level + XP card */}
      <div style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,215,0,0.2)",
        borderRadius: 18, padding: "12px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #f39c12, #d35400)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: "#fff",
            boxShadow: "0 4px 12px rgba(243,156,18,0.5)",
            flexShrink: 0,
          }}>
            {state.level}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 12 }}>Nível {state.level}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
              {state.xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP
            </div>
          </div>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${xpPct}%`, height: "100%",
            background: "linear-gradient(90deg, #f39c12, #FFD700)",
            borderRadius: 4, transition: "width 0.6s ease",
            boxShadow: "0 0 8px rgba(255,215,0,0.6)",
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 18, padding: "12px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 11, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>📊 Fazenda</div>

        <Row label="💰 Moedas" value={`R$ ${state.coins}`} color="#f39c12" />
        <Row label="📅 Dia" value={state.day} />
        <Row label="🌾 Colheitas" value={state.harvestCount} color="#a5d6a7" />

        <div style={{ margin: "8px 0", height: 1, background: "rgba(255,255,255,0.06)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>🌱 Solo</span>
          <span style={{ color: soilColor, fontWeight: 700, fontSize: 11 }}>{state.soilQuality}%</span>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            width: `${state.soilQuality}%`, height: "100%",
            background: `linear-gradient(90deg, ${soilColor}88, ${soilColor})`,
            borderRadius: 4, transition: "width 0.7s ease",
            boxShadow: `0 0 8px ${soilColor}66`,
          }} />
        </div>

        {/* Seed counts */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {(Object.keys(CROPS) as CropType[]).map(crop => {
            const def = CROPS[crop];
            const count = state.seeds[crop];
            return (
              <div key={crop} title={`${def.name}: ${count} sementes`} style={{
                background: count > 0 ? "rgba(255,255,255,0.07)" : "rgba(255,0,0,0.07)",
                border: `1px solid ${count > 0 ? "rgba(255,255,255,0.08)" : "rgba(255,0,0,0.15)"}`,
                borderRadius: 7, padding: "3px 7px",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 12 }}>{def.emoji}</span>
                <span style={{
                  color: count > 0 ? "#c8e6c9" : "#e74c3c",
                  fontWeight: 700, fontSize: 11,
                }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready alert */}
      {readyCount > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,160,0,0.1))",
          border: "1px solid rgba(255,215,0,0.4)",
          borderRadius: 14, padding: "10px 14px",
          boxShadow: "0 0 20px rgba(255,215,0,0.2)",
          animation: "readyPulse 2s ease-in-out infinite",
        }}>
          <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 13, marginBottom: 2 }}>
            ✨ {readyCount} pronto{readyCount > 1 ? "s" : ""}!
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Selecione ✂️ e colha
          </div>
        </div>
      )}

      {/* Objectives */}
      <ObjectivesPanel objectives={state.objectives} day={state.day} />

      <style>{`
        @keyframes readyPulse {
          0%,100% { box-shadow: 0 0 16px rgba(255,215,0,0.2); }
          50%      { box-shadow: 0 0 28px rgba(255,215,0,0.5); }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, color = "#fff" }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" }}>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontSize: 12 }}>{value}</span>
    </div>
  );
}
