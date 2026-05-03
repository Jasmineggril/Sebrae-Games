interface Props { onBack: () => void; }

export default function MarketScreen({ onBack }: Props) {
  return (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      background: "linear-gradient(160deg, #0a1628 0%, #0f2540 50%, #0a1628 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "auto",
    }}>
      {/* Stars background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 7.3) % 100}%`,
            top: `${(i * 5.7) % 100}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: "white",
            borderRadius: "50%",
            opacity: 0.15 + (i % 5) * 0.08,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "28px 36px", maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <div style={{ color: "#4fc3f7", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" }}>
              📊 Potencial de Mercado
            </div>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              Fazenda Brasil<br />
              <span style={{ color: "#FFD700" }}>Safra Inteligente</span>
            </h1>
          </div>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
            padding: "8px 16px", cursor: "pointer", fontSize: 14,
          }}>
            ← Voltar
          </button>
        </div>

        {/* Pitch cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Target audience */}
          <Card title="🎯 Público-Alvo" color="#1565c0">
            <StatItem emoji="👨‍🌾" label="Produtores rurais" value="40M pessoas" />
            <StatItem emoji="📱" label="Gamers casuais BR" value="120M+ jogadores" />
            <StatItem emoji="🎓" label="Estudantes agro" value="Mercado educacional" />
            <StatItem emoji="🏢" label="Empresas do agro" value="B2B capacitação" />
          </Card>

          {/* Market size */}
          <Card title="📈 Tamanho de Mercado" color="#6a1b9a">
            <StatItem emoji="🌎" label="Mercado global games" value="US$ 455 bi (2024)" />
            <StatItem emoji="🇧🇷" label="Mercado jogos BR" value="R$ 10 bi/ano" />
            <StatItem emoji="🌾" label="PIB agronegócio BR" value="R$ 2,4 tri (2024)" />
            <StatItem emoji="📲" label="Mobile games LATAM" value="Crescimento 18%/ano" />
          </Card>

          {/* Monetization */}
          <Card title="💰 Estratégia de Monetização" color="#1b5e20">
            <StatItem emoji="🆓" label="Modelo base" value="Free-to-Play" />
            <StatItem emoji="🌱" label="IAP — sementes premium" value="R$ 1,99–9,99" />
            <StatItem emoji="⚡" label="Aceleradores de tempo" value="R$ 0,99–4,99" />
            <StatItem emoji="🏢" label="Licença B2B Sebrae" value="SaaS educacional" />
          </Card>

          {/* Differentials */}
          <Card title="✨ Diferenciais Competitivos" color="#b71c1c">
            <StatItem emoji="📊" label="Dados reais do IBGE/Sebrae" value="Único no segmento" />
            <StatItem emoji="🧠" label="Decisão orgânico vs químico" value="Pensamento crítico" />
            <StatItem emoji="🇧🇷" label="Identidade cultural 100% BR" value="5 culturas nativas" />
            <StatItem emoji="🔄" label="Loop de retenção" value="Missões + conquistas" />
          </Card>
        </div>

        {/* Projections */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 14, marginBottom: 16, letterSpacing: 1 }}>
            📅 PROJEÇÃO DE CRESCIMENTO — 12 MESES
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { month: "Mês 3", users: "10K", revenue: "R$5K", color: "#4fc3f7" },
              { month: "Mês 6", users: "50K", revenue: "R$30K", color: "#81c784" },
              { month: "Mês 9", users: "150K", revenue: "R$90K", color: "#FFD700" },
              { month: "Mês 12", users: "500K", revenue: "R$300K", color: "#ff8c42" },
            ].map(p => (
              <div key={p.month} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 6 }}>{p.month}</div>
                <div style={{
                  background: `${p.color}22`, border: `1px solid ${p.color}55`,
                  borderRadius: 12, padding: "10px 6px",
                }}>
                  <div style={{ color: p.color, fontWeight: 900, fontSize: 18 }}>{p.users}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>usuários</div>
                  <div style={{ color: "#7dff7d", fontWeight: 700, fontSize: 13, marginTop: 4 }}>{p.revenue}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>/mês</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sebrae alignment */}
        <div style={{
          background: "linear-gradient(135deg, rgba(39,174,96,0.12), rgba(27,94,32,0.2))",
          border: "1px solid rgba(39,174,96,0.3)",
          borderRadius: 18, padding: "18px 24px",
        }}>
          <div style={{ color: "#7dff7d", fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
            🤝 ALINHAMENTO COM A MISSÃO SEBRAE
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              "Capacitação empreendedora gamificada",
              "Fomento ao pequeno produtor rural",
              "Inovação em agronegócio digital",
              "Dados reais IBGE/Embrapa integrados",
              "Sustentabilidade e impacto social",
              "Inclusão digital no campo",
            ].map(tag => (
              <div key={tag} style={{
                background: "rgba(39,174,96,0.15)",
                border: "1px solid rgba(39,174,96,0.25)",
                borderRadius: 20, padding: "5px 14px",
                color: "#a5d6a7", fontSize: 12, fontWeight: 600,
              }}>{tag}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
      border: `1px solid ${color}44`,
      borderRadius: 18, padding: "18px 20px",
    }}>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function StatItem({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{value}</span>
    </div>
  );
}
