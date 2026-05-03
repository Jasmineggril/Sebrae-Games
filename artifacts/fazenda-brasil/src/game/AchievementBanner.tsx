import { useEffect, useState } from "react";
import type { Achievement } from "./types";

interface Props {
  achievement: Achievement | null;
  onDone: () => void;
}

export default function AchievementBanner({ achievement, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3500);
    return () => clearTimeout(t);
  }, [achievement, onDone]);

  if (!achievement) return null;

  return (
    <>
      <style>{`
        @keyframes bannerSlide {
          from { transform: translateY(-80px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes bannerOut {
          from { transform: translateY(0); opacity: 1; }
          to   { transform: translateY(-80px); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)",
        zIndex: 2000, pointerEvents: "none",
        animation: visible ? "bannerSlide 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" : "bannerOut 0.4s ease forwards",
        background: "linear-gradient(135deg, rgba(15,30,15,0.97), rgba(25,50,25,0.97))",
        border: "2px solid rgba(125,255,125,0.5)",
        borderRadius: 18, padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(125,255,125,0.2)",
        backdropFilter: "blur(12px)",
        minWidth: 300,
      }}>
        <div style={{ fontSize: 36, filter: "drop-shadow(0 0 8px rgba(125,255,125,0.6))" }}>
          {achievement.emoji}
        </div>
        <div>
          <div style={{ color: "#7dff7d", fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 2 }}>
            🏆 CONQUISTA DESBLOQUEADA
          </div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{achievement.title}</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{achievement.description}</div>
        </div>
      </div>
    </>
  );
}
