# 🌾 Sebrae-Games / Fazenda Brasil

Jogo educativo interativo sobre agronegócio brasileiro, desenvolvido com React + TypeScript + Vite. Educação gamificada sobre culturas e sustentabilidade.

## 🎮 Visão Geral

**Fazenda Brasil** é um simulador de fazenda com:
- 🌱 5 culturas (Milho, Soja, Café, Cana, Mandioca)
- 🎯 Sistema de metas e objetivos dinâmicos
- ⭐ Badges e conquistas desbloqueáveis
- 🔧 Sistema de upgrades progressivos (venda, irrigação, ferramentas)
- 🎓 Fichas educativas sobre cada cultura
- 🎵 Feedback sonoro via WebAudio
- 📱 Responsivo e mobile-friendly

## 📋 Estrutura do Projeto

```
Sebrae-Games/
├── artifacts/fazenda-brasil/          # App principal (React + Vite)
│   ├── src/
│   │   ├── game/                      # Componentes e lógica do jogo
│   │   │   ├── FazendaGame.tsx        # Estado e orquestração principal
│   │   │   ├── FarmGrid.tsx           # Grade da fazenda
│   │   │   ├── ShopModal.tsx          # Loja (sementes + upgrades)
│   │   │   ├── HUD.tsx                # Interface superior
│   │   │   ├── Sound.ts               # Helpers de som
│   │   │   ├── types.ts               # Tipos compartilhados
│   │   │   └── [outros componentes]   # Modais, overlays, etc
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── lib/                               # Bibliotecas compartilhadas
│   ├── api-spec/                      # Especificação OpenAPI
│   ├── api-client-react/              # Client HTTP da API
│   └── api-zod/                       # Validação com Zod
├── Dockerfile                         # Build + produção
├── docker-compose.yml                 # Orquestração local
├── README.md                          # Este arquivo
└── pnpm-workspace.yaml                # Monorepo config

```

## 🚀 Quick Start

### Desenvolvimento Local

**Requisitos:** Node.js 20+, pnpm 10+

```bash
# 1. Clonar e instalar dependências
git clone https://github.com/Jasmineggril/Sebrae-Games.git
cd Sebrae-Games
pnpm install

# 2. Iniciar dev server
cd artifacts/fazenda-brasil
PORT=5173 BASE_PATH=/ pnpm dev

# Acesso: http://localhost:5173
```

### Build de Produção

```bash
cd artifacts/fazenda-brasil
PORT=3000 BASE_PATH=/ pnpm build

# Output: dist/public/
```

### Docker (Recomendado)

```bash
# Build imagem
docker build -t sebrae-games .

# Executar container
docker run -p 3000:3000 sebrae-games

# Ou com docker-compose
docker-compose up -d
# Acesso: http://localhost:3000
```

## 🎮 Como Jogar

1. **Plante:** Selecione uma cultura e clique em um canteiro vazio
2. **Escolha a estratégia:** Orgânico (+qualidade solo) ou Químico (+lucro rápido)
3. **Regue (opcional):** Acelera o crescimento em ~40% do tempo
4. **Colha:** Quando estiver pronto (pulsando), colha para ganhar moedas + XP
5. **Upgrade:** Compre melhorias na Feira para aumentar lucro, eficiência e XP
6. **Evolua:** Suba de nível destravando novas culturas e recursos

### Mecânicas

- **Soilqualidade:** Orgânico +5, Químico -10. Afeta lucro se < 50
- **XP:** Venda de culturas + bônus por objetivos e conquistas
- **Upgrades:**
  - **+R$ Colheita:** +5 moedas por nível
  - **Irrigação:** Reduz tempo de crescimento (mín. 40% do original)
  - **Ferramenta:** +2 XP por colheita, +5% lucro por nível

## 📦 Stack Técnico

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** CSS-in-JS (estilos inline otimizados)
- **Audio:** WebAudio API nativa (sem bibliotecas externas)
- **UI:** Componentes customizados com design system próprio
- **Build:** Vite (dev + prod)
- **Package Manager:** pnpm (workspaces)
- **Testing:** Playwright (headless automation)

## 🔧 Desenvolvimento

### Scripts

```bash
# Dev server com hot reload
PORT=5173 BASE_PATH=/ pnpm dev

# Build produção otimizado
PORT=3000 BASE_PATH=/ pnpm build

# Analisar tamanho do bundle
PORT=3000 BASE_PATH=/ pnpm build && ls -lh dist/public/assets/

# Rodar walkthrough automatizado
node scripts/walkthrough.cjs

# Gravar vídeo do walkthrough
node scripts/walkthrough-video.cjs
```

### Estrutura de Código

**State Management:** React hooks (useState, useCallback, useEffect)

**Game State:**
```typescript
interface GameState {
  coins: number
  level: number
  xp: number
  plots: Plot[]
  seeds: Record<CropType, number>
  upgrades: { sellBonus: number, wateringEfficiency: number, toolLevel: number }
  objectives: Objective[]
  achievements: Achievement[]
  soilQuality: number
}
```

**Loop Principal:**
1. `FazendaGame` gerencia estado global
2. `FarmGrid` renderiza grid interativa
3. Cliques disparam `handlePlotClick` → estratégia → acréscimo de XP/moedas
4. Upgrades aplicam modificadores em ganhos/tempo
5. Objetivos e conquistas checam progresso

## 🎯 Features Implementadas

✅ Tutorial interativo com focos guiados  
✅ HUD com destaque de ações durante tutorial  
✅ Sistema de upgrades com custo dinâmico (exponencial)  
✅ Loja de sementes e melhorias  
✅ Metas dinâmicas (trocam a cada dia)  
✅ Conquistas desbloqueáveis  
✅ Fichas educativas sobre culturas  
✅ Feedback sonoro (clique, rega, colheita, compra)  
✅ Partículas de moedas animadas  
✅ Bônus diário passivo (escalável com nível)  
✅ Build otimizado (<300KB gzipped)  

## 📊 Performance

- **Bundle size:** 260KB (JS) + 0.9KB (CSS) → ~78KB gzip
- **Startup:** ~250ms (local)
- **60 FPS:** Animações e particles otimizadas
- **Mobile:** Responsivo, sem dependências pesadas

## 🌐 Deploy

### GitHub Pages (Estático)

```bash
# Build
pnpm build

# Copiar dist/public/* para gh-pages branch
# ou usar GitHub Actions (veja .github/workflows/)
```

### Vercel / Netlify

```bash
# Vercel detecta automaticamente
vercel
```

### Docker / Cloud Run / ECS

```bash
docker build -t sebrae-games .
docker push [seu-registry]/sebrae-games
# Deploy em Kubernetes, Cloud Run, etc
```

### Replit (Conforme replit.md)

```bash
pnpm install
PORT=3000 BASE_PATH=/ pnpm build && npm install -g serve && serve -s artifacts/fazenda-brasil/dist/public -l 3000
```

## 🧪 Testing

Testes automatizados via Playwright (headless):

```bash
cd artifacts/fazenda-brasil
npx playwright install
node scripts/walkthrough-video.cjs  # Gera vídeo de teste
```

## 📚 Referências & Educação

Cada cultura tem uma ficha com dados reais:
- **Milho:** 137M toneladas/ano, 2º maior exportador
- **Soja:** 163M toneladas/ano, 36% produção global
- **Café:** 150+ anos liderando, R$38B exportados
- **Cana:** Etanol −90% CO₂ vs gasolina
- **Mandioca:** Alimenta 800M pessoas, 100% do Brasil

## 🤝 Contribuindo

1. Fork do repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 📝 Licença

MIT - Veja LICENSE para detalhes

## 👥 Autores

- Desenvolvido para **SEBRAE** (Serviço Brasileiro de Apoio às Micro e Pequenas Empresas)
- Jogo educativo sobre agronegócio brasileiro

## 🐛 Issues & Sugestões

Abra uma issue em https://github.com/Jasmineggril/Sebrae-Games/issues

---

**Versão:** 1.0.0  
**Última Atualização:** Maio 2026  
**Status:** Production Ready ✅
