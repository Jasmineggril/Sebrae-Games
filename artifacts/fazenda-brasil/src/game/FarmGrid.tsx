import { useState } from "react";
import { CROPS, GRID_COLS, type Plot, type Tool } from "./types";

interface Props {
  plots: Plot[];
  selectedTool: Tool;
  soilQuality: number;
  playerLevel: number;
  onPlotClick: (id: number) => void;
}

function getPlotBg(plot: Plot): string {
  if (plot.state === "empty") return "linear-gradient(160deg, #9b7a2a 0%, #6b4e0a 60%, #4a3208 100%)";
  if (plot.state === "planted") return plot.strategy === "chemical"
    ? "linear-gradient(160deg, #5a2a0a, #3a1a06, #2a1004)"
    : "linear-gradient(160deg, #5a4a18, #3a2e08, #2a1e04)";
  if (plot.state === "watered") return "linear-gradient(160deg, #1a5c2a, #0e3a16, #092a0e)";
  if (plot.state === "ready") return "linear-gradient(160deg, #0e4a08, #082e04, #041a02)";
  return "linear-gradient(160deg, #9b7a2a, #6b4e0a)";
}

function getBorder(plot: Plot, tool: Tool): string {
  if (plot.state === "ready") return "2px solid #FFD700";
  if (plot.state === "empty" && tool === "plant") return "2px dashed rgba(255,255,255,0.25)";
  if (plot.state === "planted" && tool === "water") return "2px solid rgba(100,200,255,0.8)";
  if (plot.strategy === "chemical" && plot.state !== "empty") return "2px solid rgba(255,100,50,0.5)";
  if (plot.state === "watered") return "2px solid rgba(100,200,255,0.3)";
  return "2px solid rgba(255,255,255,0.07)";
}

function getGrowthStage(plot: Plot): { emoji: string; size: number; label?: string } {
  if (!plot.crop || plot.state === "empty") return { emoji: "", size: 0 };
  const now = Date.now();
  const cropDef = CROPS[plot.crop];
  const base = cropDef.growthTime * 1000;
  const multiplier = plot.strategy === "chemical" ? 0.55 : plot.state === "watered" ? 0.65 : 1;
  const elapsed = now - (plot.plantedAt ?? now);
  const pct = Math.min(1, elapsed / (base * multiplier));

  if (plot.state === "ready") return { emoji: cropDef.emoji, size: 44, label: "✨ PRONTO!" };
  if (pct < 0.33) return { emoji: "🌱", size: 22 };
  if (pct < 0.66) return { emoji: cropDef.emoji, size: 28 };
  return { emoji: cropDef.emoji, size: 36 };
}

function GrowthBar({ plot }: { plot: Plot }) {
  if (plot.state !== "planted" && plot.state !== "watered") return null;
  const now = Date.now();
  const cropDef = CROPS[plot.crop!];
  const base = cropDef.growthTime * 1000;
  const multiplier = plot.strategy === "chemical" ? 0.55 : plot.state === "watered" ? 0.65 : 1;
  const elapsed = now - (plot.plantedAt ?? now);
  const pct = Math.min(100, (elapsed / (base * multiplier)) * 100);
  const barColor = pct > 80 ? "#7dff7d" : plot.strategy === "chemical" ? "#ff8c42" : "#4fc3f7";
  return (
    <div style={{
      position: "absolute", bottom: 5, left: 6, right: 6, height: 5,
      background: "rgba(0,0,0,0.55)", borderRadius: 4, overflow: "hidden",
    }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: `linear-gradient(90deg, ${barColor}77, ${barColor})`,
        borderRadius: 4, transition: "width 0.9s linear",
        boxShadow: `0 0 6px ${barColor}88`,
      }} />
    </div>
  );
}

function WaterDroplets() {
  const drops = [
    { left: "20%", delay: 0, size: 14 },
    { left: "50%", delay: 0.15, size: 12 },
    { left: "75%", delay: 0.3, size: 13 },
  ];
  return (
    <>
      <style>{`
        @keyframes dropFall {
          0%   { transform: translateY(-8px); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(28px); opacity: 0; }
        }
      `}</style>
      {drops.map((d, i) => (
        <div key={i} style={{
          position: "absolute", top: 4, left: d.left,
          fontSize: d.size, pointerEvents: "none",
          animation: `dropFall 1s ease-in infinite`,
          animationDelay: `${d.delay}s`,
          filter: "drop-shadow(0 0 4px rgba(100,200,255,0.8))",
        }}>💧</div>
      ))}
    </>
  );
}

function PlotCell({ plot, selectedTool, onPlotClick }: {
  plot: Plot; selectedTool: Tool; onPlotClick: (id: number) => void;
}) {
  const isReady = plot.state === "ready";
  const isChemical = plot.strategy === "chemical";
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const stage = getGrowthStage(plot);

  const canInteract =
    (plot.state === "empty" && selectedTool === "plant") ||
    (plot.state === "planted" && selectedTool === "water") ||
    (plot.state === "ready" && selectedTool === "harvest");

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 180);
    onPlotClick(plot.id);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 100, height: 100,
        background: getPlotBg(plot),
        borderRadius: 16,
        border: getBorder(plot, selectedTool),
        cursor: canInteract ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: clicked ? "scale(0.91)" : hovered && canInteract ? "scale(1.1) translateY(-3px)" : "scale(1)",
        transition: "transform 0.14s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s",
        boxShadow: isReady
          ? "0 0 22px 8px rgba(255,215,0,0.55), 0 6px 16px rgba(0,0,0,0.45)"
          : hovered && canInteract
          ? "0 12px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 4px 10px rgba(0,0,0,0.4)",
        userSelect: "none", overflow: "hidden",
      }}
    >
      {/* Top gloss */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)",
        borderRadius: "16px 16px 0 0", pointerEvents: "none",
      }} />

      {/* Bottom shadow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
        borderRadius: "0 0 16px 16px", pointerEvents: "none",
      }} />

      {/* Soil rows (empty) */}
      {plot.state === "empty" && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 14 }}>
          {[18, 36, 54, 70].map(y => (
            <div key={y} style={{
              position: "absolute", top: y, left: 12, right: 12,
              height: 2, background: "rgba(210,175,100,0.2)", borderRadius: 2,
            }} />
          ))}
        </div>
      )}

      {/* Water animation */}
      {plot.state === "watered" && <WaterDroplets />}

      {/* Strategy badge */}
      {plot.strategy && plot.state !== "empty" && (
        <div style={{
          position: "absolute", top: 5, left: 5,
          fontSize: 11, background: "rgba(0,0,0,0.65)",
          borderRadius: 6, padding: "2px 7px",
          color: isChemical ? "#ff8c42" : "#7dff7d",
          fontWeight: 800, letterSpacing: 0.5,
          boxShadow: `0 0 8px ${isChemical ? "rgba(255,80,50,0.4)" : "rgba(125,255,125,0.4)"}`,
        }}>
          {isChemical ? "⚡" : "🌿"}
        </div>
      )}

      {/* Crop growth stages */}
      {stage.emoji && (
        <div style={{
          fontSize: stage.size,
          lineHeight: 1,
          filter: isReady
            ? "drop-shadow(0 0 12px gold) drop-shadow(0 3px 8px rgba(0,0,0,0.6))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          transition: "font-size 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          animation: isReady ? "bounceReady 1.6s ease-in-out infinite" : undefined,
          zIndex: 2,
        }}>
          {stage.emoji}
        </div>
      )}

      {/* Crop name below emoji */}
      {plot.crop && plot.state !== "empty" && !isReady && (
        <div style={{
          fontSize: 9, color: "rgba(255,255,255,0.45)",
          fontWeight: 700, marginTop: 2, zIndex: 2,
          letterSpacing: 0.5,
        }}>
          {CROPS[plot.crop].name.toUpperCase()}
        </div>
      )}

      {/* Empty icon */}
      {plot.state === "empty" && !hovered && (
        <div style={{ fontSize: 24, opacity: 0.15, zIndex: 2 }}>🪴</div>
      )}

      {/* Hover hint */}
      {hovered && canInteract && plot.state === "empty" && (
        <div style={{ fontSize: 28, opacity: 0.85, zIndex: 2, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}>🌱</div>
      )}
      {hovered && canInteract && plot.state === "planted" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 24, opacity: 0.8, zIndex: 3 }}>💧</div>
      )}

      {/* Ready label */}
      {isReady && (
        <div style={{
          position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
          fontSize: 9, color: "#FFD700", fontWeight: 900, whiteSpace: "nowrap",
          background: "rgba(0,0,0,0.75)", borderRadius: 6, padding: "2px 7px",
          boxShadow: "0 0 10px rgba(255,215,0,0.6)", letterSpacing: 0.5,
          zIndex: 3,
        }}>
          ✨ PRONTO!
        </div>
      )}

      <GrowthBar plot={plot} />
    </div>
  );
}

export default function FarmGrid({ plots, selectedTool, soilQuality, onPlotClick }: Props) {
  const soilColor = soilQuality > 70 ? "#52b788" : soilQuality > 40 ? "#f5c518" : "#e74c3c";
  const soilGlow = soilQuality > 70 ? "rgba(82,183,136,0.4)" : soilQuality > 40 ? "rgba(245,197,24,0.4)" : "rgba(231,76,60,0.4)";
  const soilLabel = soilQuality > 70 ? "Solo Saudável 🌱" : soilQuality > 40 ? "Solo Regular ⚠️" : "Solo Esgotado ☠️";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 10 }}>
      {/* Soil quality bar */}
      <div style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 18, padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, whiteSpace: "nowrap", fontWeight: 600 }}>
          🌱 Solo
        </span>
        <div style={{
          flex: 1, height: 10, background: "rgba(0,0,0,0.4)",
          borderRadius: 8, overflow: "hidden",
          boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)",
        }}>
          <div style={{
            width: `${soilQuality}%`, height: "100%",
            background: `linear-gradient(90deg, ${soilColor}88, ${soilColor})`,
            borderRadius: 8, transition: "width 0.7s ease",
            boxShadow: `0 0 10px ${soilGlow}`,
          }} />
        </div>
        <span style={{ color: soilColor, fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", textShadow: `0 0 8px ${soilGlow}` }}>
          {soilLabel}
        </span>
      </div>

      {/* Farm grid */}
      <div style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(18px)",
        borderRadius: 24, padding: "18px 20px 20px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14,
        }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap" }}>
            🌾 CANTEIROS DA FAZENDA
          </span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gap: 10,
        }}>
          {plots.map(plot => (
            <PlotCell key={plot.id} plot={plot} selectedTool={selectedTool} onPlotClick={onPlotClick} />
          ))}
        </div>

        <div style={{
          display: "flex", gap: 20, justifyContent: "center", marginTop: 14, flexWrap: "wrap",
        }}>
          {[
            { icon: "🌱", label: "muda → crescendo → pronto", color: "rgba(255,255,255,0.3)" },
            { icon: "🌿", label: "Orgânico preserva o solo", color: "#7dff7d" },
            { icon: "⚡", label: "Químico degrada o solo", color: "#ff8c42" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 13 }}>{l.icon}</span>
              <span style={{ color: l.color, fontSize: 11, fontWeight: 600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
