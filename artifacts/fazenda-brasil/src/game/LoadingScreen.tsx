import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

// Carregamento rápido para a tela principal aparecer
export default function LoadingScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ fontSize: 96, lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))", marginBottom: 16 }}>🌾</div>
      <h1 style={{ color: "#FFD700", fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: 3, textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>
        FAZENDA BRASIL
      </h1>
      <p style={{ color: "#95d5b2", fontSize: 16, marginTop: 8, fontWeight: 600, letterSpacing: 1 }}>
        Safra Inteligente · Sebrae Games 2026
      </p>
    </div>
  );
}
