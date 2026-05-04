import { useEffect, useRef, useState } from "react";
import { CROPS, type CropType, type Tool, type GameState } from "./types";

interface Props {
  state: GameState;
  onSelectTool: (t: Tool) => void;
  onSelectCrop: (c: CropType) => void;
  onShop: () => void;
  onMenu: () => void;
  onRestart: () => void;
  tutorialStep?: number;
}

const TOOLS: { id: Tool; label: string; emoji: string; active: string }[] = [
  { id: "plant", label: "Plantar", emoji: "🌱", active: "#27ae60" },
  { id: "water", label: "Regar", emoji: "💧", active: "#2980b9" },
  { id: "harvest", label: "Colher", emoji: "✂️", active: "#d4ac0d" },
];

export default function HUD({ state, onSelectTool, onSelectCrop, onShop, onMenu, onRestart, tutorialStep = 0 }: Props) {
  const highlightForStep = (step: number) => tutorialStep === step ? {
    animation: 'pulseHighlight 1.3s infinite',
    boxShadow: '0 0 26px rgba(79,195,247,0.18), 0 0 8px rgba(79,195,247,0.12)'
  } : {};

  const plantRef = useRef<HTMLButtonElement | null>(null);
  const waterRef = useRef<HTMLButtonElement | null>(null);
  const harvestRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; top: number; text: string } | null>(null);

  useEffect(() => {
    const map: Record<number, React.RefObject<HTMLButtonElement>> = {
      1: plantRef,
      3: waterRef,
      4: harvestRef,
    } as any;
    const ref = map[tutorialStep];
    if (!ref || !ref.current) { setIndicator(null); return; }
    const rect = ref.current.getBoundingClientRect();
    // position indicator above the button
    setIndicator({ left: rect.left + rect.width / 2, top: rect.top - 10, text: tutorialStep === 1 ? 'Clique em Plantar' : tutorialStep === 3 ? 'Clique em Regar' : 'Clique em Colher' });
    const onResize = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r) setIndicator({ left: r.left + r.width / 2, top: r.top - 10, text: indicator?.text ?? '' });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [tutorialStep]);
  return (
    <div style={{
      background: "rgba(0,0,0,0.72)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      padding: "8px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
      minHeight: 62,
      position: "relative",
      zIndex: 60,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.05))",
        border: "1px solid rgba(255,215,0,0.2)",
        borderRadius: 10, padding: "4px 12px",
      }}>
        <span style={{ fontSize: 18 }}>🌾</span>
        <span style={{ color: "#FFD700", fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
          Fazenda Brasil
        </span>
      </div>

      {/* Coins */}
      <div style={{
        background: "linear-gradient(135deg, #f39c12, #d35400)",
        borderRadius: 12, padding: "6px 14px",
        fontWeight: 800, fontSize: 16, color: "#fff",
        boxShadow: "0 3px 12px rgba(243,156,18,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}>
        💰 R$ {state.coins}
      </div>

      {/* Stats */}
      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10, padding: "4px 12px",
        display: "flex", gap: 10,
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Dia <b style={{ color: "#fff" }}>{state.day}</b></span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}><b style={{ color: "#7dff7d" }}>{state.harvestCount}</b> colheitas</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Tools */}
      <style>{`@keyframes pulseHighlight { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.02); } 100% { transform: translateY(0) scale(1); } }`}</style>
      <div style={{ display: "flex", gap: 6 }}>
        {TOOLS.map(tool => {
          const isActive = state.selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              ref={tool.id === 'plant' ? plantRef : tool.id === 'water' ? waterRef : harvestRef}
              onClick={() => onSelectTool(tool.id)}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${tool.active}, ${tool.active}bb)`
                  : "rgba(255,255,255,0.08)",
                color: "white",
                border: isActive
                  ? `2px solid ${tool.active}`
                  : "2px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "6px 14px",
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                transition: "all 0.15s",
                boxShadow: isActive ? `0 0 12px ${tool.active}66` : "none",
                ...(tool.id === 'plant' ? highlightForStep(1) : {}),
                ...(tool.id === 'water' ? highlightForStep(3) : {}),
                ...(tool.id === 'harvest' ? highlightForStep(4) : {}),
                whiteSpace: "nowrap",
              }}
            >
              {tool.emoji} {tool.label}
            </button>
          );
        })}
      </div>

      {indicator && (
        <div style={{ position: 'fixed', left: indicator.left, top: Math.max(8, indicator.top), transform: 'translateX(-50%)', zIndex: 80, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ background: 'linear-gradient(135deg,#4fc3f7,#1565c0)', color: '#012', padding: '6px 10px', borderRadius: 8, fontWeight: 800, boxShadow: '0 6px 20px rgba(25,118,210,0.18)' }}>{indicator.text}</div>
            <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '10px solid rgba(79,195,247,0.92)' }} />
          </div>
        </div>
      )}

      {/* Crop selector */}
      {state.selectedTool === "plant" && (
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}>SEMENTE:</span>
          {(Object.keys(CROPS) as CropType[]).map(crop => {
            const def = CROPS[crop];
            const count = state.seeds[crop];
            const isSelected = state.selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => onSelectCrop(crop)}
                title={`${def.name} — ${count} sementes · vende R$${def.sellPrice}`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${def.color}, ${def.color2})`
                    : "rgba(255,255,255,0.07)",
                  color: "white",
                  border: isSelected
                    ? `2px solid ${def.color}`
                    : "2px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "4px 10px",
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  opacity: count === 0 ? 0.38 : 1,
                  transition: "all 0.15s",
                  boxShadow: isSelected ? `0 0 10px ${def.color}66` : "none",
                }}
              >
                {def.emoji} {def.name}
                <span style={{
                  marginLeft: 4, fontSize: 10, opacity: 0.8,
                  background: "rgba(0,0,0,0.3)", borderRadius: 4, padding: "0 4px",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right buttons */}
      <button
        onClick={onShop}
        style={{
          background: "linear-gradient(135deg, #8e44ad, #6c3483)",
          color: "white", border: "2px solid rgba(142,68,173,0.5)",
          borderRadius: 10, padding: "7px 16px",
          cursor: "pointer", fontSize: 13, fontWeight: 800,
          boxShadow: "0 3px 12px rgba(142,68,173,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        🏪 Feira
      </button>

      <button
        onClick={onRestart}
        title="Reiniciar jogo"
        style={{
          background: "rgba(255,200,0,0.12)",
          color: "#FFD700", border: "1px solid rgba(255,200,0,0.25)",
          borderRadius: 9, padding: "7px 11px",
          cursor: "pointer", fontSize: 14,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,200,0,0.22)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,200,0,0.12)"}
      >
        🔄
      </button>

      <button
        onClick={onMenu}
        style={{
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 9, padding: "7px 12px",
          cursor: "pointer", fontSize: 13,
        }}
      >
        ← Menu
      </button>
    </div>
  );
}
