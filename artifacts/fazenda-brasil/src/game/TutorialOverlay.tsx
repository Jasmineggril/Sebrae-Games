import { useState } from "react";

interface Step {
  title: string;
  desc: string;
  emoji: string;
  highlight?: string;
}

const STEPS: Step[] = [
  {
    emoji: "🌾",
    title: "Bem-vindo à Fazenda Brasil!",
    desc: "Você é um produtor rural brasileiro. Gerencie sua fazenda, tome decisões inteligentes e aprenda sobre o agronegócio do nosso país!",
  },
  {
    emoji: "🌱",
    title: "Passo 1: Plantar",
    desc: "Com a ferramenta \"Plantar\" selecionada, clique em qualquer canteiro marrom vazio. Você vai escolher como quer cultivar!",
  },
  {
    emoji: "⚖️",
    title: "Passo 2: Estratégia",
    desc: "Cada plantio pede uma decisão: 🌿 Orgânico preserva o solo mas cresce devagar. ⚡ Químico cresce rápido mas degrada o solo. Solo ruim = menos produção!",
  },
  {
    emoji: "💧",
    title: "Passo 3: Regar",
    desc: "Selecione \"Regar\" e clique numa plantação. A água reduz o tempo de crescimento pela metade! Sempre vale a pena regar.",
  },
  {
    emoji: "✂️",
    title: "Passo 4: Colher",
    desc: "Quando o canteiro brilhar em ouro e mostrar \"✨ PRONTO!\", selecione \"Colher\" e clique. Um evento climático pode ajudar ou atrapalhar!",
  },
  {
    emoji: "📊",
    title: "Passo 5: Aprender",
    desc: "Após cada colheita aparece uma Ficha do Produtor com dados reais do agronegócio brasileiro. Você aprende jogando!",
  },
  {
    emoji: "🏪",
    title: "Passo 6: Feira do Produtor",
    desc: "Compre mais sementes na Feira com as moedas que ganhar. Complete missões diárias para bônus extras. Bom plantio! 🌾",
  },
];

interface Props {
  step: number;
  setStep: (n: number) => void;
  onDone: () => void;
}

export default function TutorialOverlay({ step, setStep, onDone }: Props) {
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 900,
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0d2137 0%, #1a3a56 100%)",
        border: "2px solid rgba(100,200,255,0.3)",
        borderRadius: 28,
        padding: "36px 40px",
        width: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        animation: "fadeInUp 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(100,200,255,0.06)" }} />

        <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= step ? "#4fc3f7" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <div style={{ textAlign: "center", fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 4px 16px rgba(79,195,247,0.4))" }}>
          {current.emoji}
        </div>

        <h2 style={{ color: "#e3f2fd", fontSize: 22, fontWeight: 900, textAlign: "center", margin: "0 0 14px", lineHeight: 1.3 }}>
          {current.title}
        </h2>

        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, textAlign: "center", margin: "0 0 28px" }}>
          {current.desc}
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 600,
              }}
            >
              ← Voltar
            </button>
          )}
          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            style={{
              flex: 2,
              background: isLast
                ? "linear-gradient(135deg, #27ae60, #1e8449)"
                : "linear-gradient(135deg, #1565c0, #0d47a1)",
              color: "#fff", border: "none",
              borderRadius: 12, padding: "13px", cursor: "pointer",
              fontSize: 15, fontWeight: 800,
              boxShadow: isLast ? "0 6px 20px rgba(39,174,96,0.4)" : "0 6px 20px rgba(21,101,192,0.4)",
            }}
          >
            {isLast ? "🚀 Começar a Plantar!" : "Próximo →"}
          </button>
        </div>

        {!isLast && (
          <button
            onClick={onDone}
            style={{
              display: "block", margin: "14px auto 0", background: "none",
              color: "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", fontSize: 12,
            }}
          >
            Pular tutorial
          </button>
        )}
      </div>
    </div>
  );
}
