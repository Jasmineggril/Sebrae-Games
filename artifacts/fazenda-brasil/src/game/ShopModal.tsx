import { CROPS, type CropType } from "./types";

interface Props {
  coins: number;
  seeds: Record<CropType, number>;
  playerLevel: number;
  onBuy: (crop: CropType, qty: number) => void;
  onClose: () => void;
}

export default function ShopModal({ coins, seeds, playerLevel, onBuy, onClose }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.78)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 500, backdropFilter: "blur(8px)",
      fontFamily: "'Segoe UI', sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "linear-gradient(135deg, #0d1f0d, #1a3a1a, #0d1f0d)",
        border: "2px solid rgba(39,174,96,0.35)",
        borderRadius: 24,
        padding: "28px 26px",
        minWidth: 380,
        maxWidth: 500,
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(39,174,96,0.1)",
        animation: "fadeInUp 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <h2 style={{ color: "#FFD700", margin: 0, fontSize: 22, fontWeight: 900 }}>
              🏪 Feira do Produtor
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "2px 0 0", letterSpacing: 0.5 }}>
              Compre sementes para plantar na sua fazenda
            </p>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #f39c12, #d35400)",
            borderRadius: 12, padding: "8px 14px",
            fontWeight: 800, fontSize: 18, color: "#fff",
            boxShadow: "0 3px 12px rgba(243,156,18,0.4)",
          }}>
            💰 R$ {coins}
          </div>
        </div>

        {/* Level badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(243,156,18,0.12)", border: "1px solid rgba(243,156,18,0.2)",
          borderRadius: 8, padding: "4px 12px", marginBottom: 16,
        }}>
          <span style={{ fontSize: 13 }}>⭐</span>
          <span style={{ color: "#FFD700", fontSize: 12, fontWeight: 700 }}>Nível {playerLevel} — desbloqueie culturas subindo de nível!</span>
        </div>

        {/* Crop list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {(Object.keys(CROPS) as CropType[]).map(crop => {
            const def = CROPS[crop];
            const canAfford1 = coins >= def.seedCost;
            const canAfford5 = coins >= def.seedCost * 5;
            const locked = def.unlockLevel > playerLevel;

            return (
              <div key={crop} style={{
                background: locked ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "11px 14px",
                display: "flex", alignItems: "center", gap: 12,
                border: `1px solid ${locked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)"}`,
                opacity: locked ? 0.6 : 1,
                transition: "all 0.2s",
              }}>
                <div style={{
                  fontSize: 30,
                  filter: locked ? "grayscale(1) opacity(0.5)" : "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
                }}>
                  {locked ? "🔒" : def.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: locked ? "rgba(255,255,255,0.35)" : "#fff", fontWeight: 700, fontSize: 14 }}>
                      {def.name}
                    </span>
                    {locked && (
                      <span style={{
                        background: "rgba(255,100,50,0.15)", color: "#ff8c42",
                        fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "1px 6px",
                      }}>
                        Nível {def.unlockLevel}
                      </span>
                    )}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 1 }}>
                    {def.growthTime}s · Vende R${def.sellPrice} · +{def.xpReward} XP
                  </div>
                  <div style={{ color: locked ? "rgba(255,255,255,0.25)" : "#a5d6a7", fontSize: 11, fontWeight: 600, marginTop: 1 }}>
                    Estoque: {seeds[crop]} sementes
                  </div>
                </div>
                {!locked && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <BuyBtn label={`+1\nR$${def.seedCost}`} disabled={!canAfford1} onClick={() => onBuy(crop, 1)} />
                    <BuyBtn label={`+5\nR$${def.seedCost * 5}`} disabled={!canAfford5} onClick={() => onBuy(crop, 5)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "12px",
            cursor: "pointer", fontSize: 15, fontWeight: 600,
          }}
        >
          ✓ Fechar Feira
        </button>
      </div>
    </div>
  );
}

function BuyBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #27ae60, #1e8449)",
        color: disabled ? "rgba(255,255,255,0.25)" : "#fff",
        border: disabled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.2)",
        borderRadius: 9, padding: "7px 10px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12, fontWeight: 700, lineHeight: 1.4, whiteSpace: "pre", textAlign: "center", minWidth: 52,
        boxShadow: disabled ? "none" : "0 3px 10px rgba(39,174,96,0.35)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
