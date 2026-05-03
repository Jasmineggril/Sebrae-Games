import { type RandomEvent } from "./types";

interface Props {
  event: RandomEvent;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: Props) {
  const positive = event.coinBonus >= 0;
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 700,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: positive
          ? "linear-gradient(135deg, #1a3a2a, #1e5c30)"
          : "linear-gradient(135deg, #3a1a1a, #5c2020)",
        border: `2px solid ${positive ? "#27ae60" : "#c0392b"}`,
        borderRadius: 22,
        padding: 32,
        width: 320,
        textAlign: "center",
        boxShadow: `0 20px 60px ${positive ? "rgba(39,174,96,0.3)" : "rgba(192,57,43,0.3)"}`,
        fontFamily: "'Segoe UI', sans-serif",
        animation: "fadeInUp 0.3s ease",
      }}>
        <div style={{ fontSize: 64, marginBottom: 10 }}>{event.emoji}</div>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>{event.title}</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: "0 0 20px", lineHeight: 1.5 }}>
          {event.description}
        </p>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "10px 20px",
          marginBottom: 24,
          fontSize: 20,
          fontWeight: 700,
          color: positive ? "#7dff7d" : "#ff8888",
        }}>
          {positive ? "+" : ""}{event.coinBonus} moedas
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: positive ? "linear-gradient(135deg, #27ae60, #1e8449)" : "linear-gradient(135deg, #c0392b, #96281b)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
