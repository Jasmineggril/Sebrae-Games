import type { Objective } from "./types";

interface Props {
  objectives: Objective[];
  day: number;
}

export default function ObjectivesPanel({ objectives, day }: Props) {
  const done = objectives.filter(o => o.done).length;

  return (
    <div style={{
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 18,
      padding: "14px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
          🎯 Missões — Dia {day}
        </div>
        <div style={{
          background: done === objectives.length ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.08)",
          color: done === objectives.length ? "#7dff7d" : "rgba(255,255,255,0.5)",
          fontSize: 11, fontWeight: 700, borderRadius: 8, padding: "2px 8px",
        }}>
          {done}/{objectives.length}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {objectives.map(obj => {
          const pct = Math.min(100, (obj.current / obj.target) * 100);
          return (
            <div key={obj.id} style={{
              background: obj.done ? "rgba(39,174,96,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${obj.done ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, padding: "8px 10px",
              opacity: obj.done ? 0.85 : 1,
              transition: "all 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{obj.emoji}</span>
                <span style={{
                  flex: 1, color: obj.done ? "#7dff7d" : "rgba(255,255,255,0.8)",
                  fontSize: 11, fontWeight: 600,
                  textDecoration: obj.done ? "line-through" : "none",
                }}>
                  {obj.label}
                </span>
                <span style={{ color: "#f39c12", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                  +R${obj.reward}
                </span>
              </div>
              {!obj.done && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.4)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: "linear-gradient(90deg, #f39c12, #FFD700)",
                      borderRadius: 3, transition: "width 0.5s ease",
                      boxShadow: "0 0 6px rgba(255,215,0,0.5)",
                    }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, whiteSpace: "nowrap" }}>
                    {obj.current}/{obj.target}
                  </span>
                </div>
              )}
              {obj.done && (
                <div style={{ color: "#7dff7d", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
                  ✓ CONCLUÍDA
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
