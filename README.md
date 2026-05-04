# Sebrae-Games / Fazenda Brasil

Jogo educativo interativo sobre agronegócio brasileiro, desenvolvido com React, TypeScript e Vite. O objetivo é equilibrar lucro, XP e cuidado com o solo em decisões curtas e objetivas.

## Demonstração

- Link jogável local: [http://localhost:3000](http://localhost:3000)
- Vídeo da jogabilidade: [artifacts/fazenda-brasil/videos/0ff1fe92601897728e7830b0d5022f9d.webm](artifacts/fazenda-brasil/videos/0ff1fe92601897728e7830b0d5022f9d.webm)
- Capturas de tela: [thumbnail.png](artifacts/fazenda-brasil/videos/thumbnail.png) e [thumbnail-0ff1.png](artifacts/fazenda-brasil/videos/thumbnail-0ff1.png)

![Fazenda Brasil em ação](artifacts/fazenda-brasil/videos/thumbnail.png)

## Visão geral

Fazenda Brasil é um simulador de fazenda com:

- 5 culturas: Milho, Soja, Café, Cana e Mandioca
- Sistema de metas e objetivos dinâmicos
- Conquistas desbloqueáveis
- Upgrades progressivos de venda, irrigação e ferramentas
- Fichas educativas sobre cada cultura
- Feedback sonoro via WebAudio
- Interface responsiva e compatível com dispositivos móveis

## Mecânica central

A principal decisão do jogo está na escolha entre Orgânico e Químico. Essa escolha altera a qualidade do solo, o ritmo da partida e o retorno da safra, criando uma camada estratégica simples de entender e fácil de demonstrar.

## Estrutura do projeto

```
Sebrae-Games/
├── artifacts/fazenda-brasil/          # App principal (React + Vite)
│   ├── src/
│   │   ├── game/                      # Componentes e lógica do jogo
│   │   │   ├── FazendaGame.tsx        # Estado e orquestração principal
│   │   │   ├── FarmGrid.tsx           # Grade da fazenda
│   │   │   ├── ShopModal.tsx          # Loja de sementes e upgrades
│   │   │   ├── HUD.tsx                # Interface superior
│   │   │   ├── Sound.ts               # Helpers de som
│   │   │   ├── types.ts               # Tipos compartilhados
│   │   │   └── [outros componentes]   # Modais e overlays
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── lib/                               # Bibliotecas compartilhadas
│   ├── api-spec/                      # Especificação OpenAPI
│   ├── api-client-react/              # Cliente HTTP da API
│   └── api-zod/                       # Validação com Zod
├── Dockerfile                         # Build e produção
├── docker-compose.yml                 # Orquestração local
├── README.md                          # Este arquivo
└── pnpm-workspace.yaml                # Configuração do monorepo
```

## Início rápido

### Desenvolvimento local

Requisitos: Node.js 20+ e pnpm 10+

```bash
# Clonar e instalar dependências
git clone https://github.com/Jasmineggril/Sebrae-Games.git
cd Sebrae-Games
pnpm install

# Iniciar o servidor de desenvolvimento
cd artifacts/fazenda-brasil
PORT=5173 BASE_PATH=/ pnpm dev

# Acesso: http://localhost:5173
```

### Build de produção

```bash
cd artifacts/fazenda-brasil
PORT=3000 BASE_PATH=/ pnpm build

# Saída: dist/public/
```

### Docker recomendado

```bash
# Build da imagem
docker build -t sebrae-games .

# Executar o container
docker run -p 3000:3000 sebrae-games

# Ou com docker-compose
docker-compose up -d
# Acesso: http://localhost:3000
```

## Como jogar

1. Plante: selecione uma cultura e clique em um canteiro vazio.
2. Escolha a estratégia: Orgânico melhora a qualidade do solo; Químico acelera o lucro.
3. Regue quando necessário: isso reduz o tempo de crescimento.
4. Colha quando o canteiro estiver pronto para ganhar moedas e XP.
5. Compre melhorias na Feira para aumentar lucro, eficiência e XP.
6. Suba de nível para desbloquear novas culturas e recursos.

### Mecânicas

- Qualidade do solo: Orgânico +5, Químico -10. Afeta o lucro quando fica abaixo de 50.
- XP: vem da venda de culturas, objetivos e conquistas.
- Upgrades:
  - Colheita: +5 moedas por nível.
  - Irrigação: reduz o tempo de crescimento para no mínimo 40% do original.
  - Ferramenta: +2 XP por colheita e +5% de lucro por nível.

## Stack técnico

- Frontend: React 18 + TypeScript + Vite
- Styling: CSS-in-JS com estilos inline
- Audio: WebAudio API nativa, sem bibliotecas externas
- UI: componentes customizados com design system próprio
- Build: Vite para desenvolvimento e produção
- Package manager: pnpm com workspaces
- Testing: Playwright com automação headless

## Desenvolvimento

### Scripts

```bash
# Servidor de desenvolvimento com hot reload
PORT=5173 BASE_PATH=/ pnpm dev

# Build de produção otimizado
PORT=3000 BASE_PATH=/ pnpm build

# Analisar tamanho do bundle
PORT=3000 BASE_PATH=/ pnpm build && ls -lh dist/public/assets/

# Rodar walkthrough automatizado
node scripts/walkthrough.cjs

# Gravar vídeo do walkthrough
node scripts/walkthrough-video.cjs
```

### Estrutura de código

State management: React hooks (`useState`, `useCallback`, `useEffect`)

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

Loop principal:

1. `FazendaGame` gerencia o estado global.
2. `FarmGrid` renderiza a grade interativa.
3. Cliques disparam `handlePlotClick`, que aplica estratégia e atualiza XP e moedas.
4. Upgrades aplicam modificadores em ganhos e tempo.
5. Objetivos e conquistas acompanham o progresso.

## Funcionalidades implementadas

- Tutorial interativo com foco guiado.
- HUD com destaque de ações durante o tutorial.
- Sistema de upgrades com custo dinâmico e progressivo.
- Loja de sementes e melhorias.
- Metas dinâmicas que mudam a cada dia.
- Conquistas desbloqueáveis.
- Fichas educativas sobre culturas.
- Feedback sonoro para clique, rega, colheita e compra.
- Partículas de moedas animadas.
- Bônus diário passivo escalável com o nível.
- Build leve, abaixo de 300KB gzipped.

## Performance

- Bundle size: 260KB (JS) + 0.9KB (CSS), cerca de 78KB gzip.
- Startup: aproximadamente 250ms em ambiente local.
- 60 FPS: animações e particles otimizadas.
- Mobile: responsivo e sem dependências pesadas.

## Implantação

### GitHub Pages

```bash
pnpm build

# Copiar dist/public/* para a branch gh-pages
# ou usar GitHub Actions (veja .github/workflows/)
```

### Vercel / Netlify

```bash
vercel
```

### Docker / Cloud Run / ECS

```bash
docker build -t sebrae-games .
docker push [seu-registry]/sebrae-games
# Deploy em Kubernetes, Cloud Run ou outro provedor compatível
```

### Replit

```bash
pnpm install
PORT=3000 BASE_PATH=/ pnpm build && npm install -g serve && serve -s artifacts/fazenda-brasil/dist/public -l 3000
```

## Testes

Testes automatizados via Playwright:

```bash
cd artifacts/fazenda-brasil
npx playwright install
node scripts/walkthrough-video.cjs
```

## Referências e educação

Cada cultura tem uma ficha com dados reais:

- Milho: 137M toneladas/ano, 2º maior exportador.
- Soja: 163M toneladas/ano, 36% da produção global.
- Café: mais de 150 anos de liderança, R$ 38 bilhões exportados.
- Cana: etanol com redução de até 90% de CO₂ em relação à gasolina.
- Mandioca: alimenta 800M pessoas e é cultivada em todo o Brasil.

## Contribuindo

1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b feature/minha-feature`.
3. Faça o commit: `git commit -m "feat: descrição"`.
4. Envie a branch: `git push origin feature/minha-feature`.
5. Abra um Pull Request.

## Licença

MIT. Veja LICENSE para detalhes.

## Autores

- Desenvolvido para o SEBRAE (Serviço Brasileiro de Apoio às Micro e Pequenas Empresas).
- Jogo educativo sobre agronegócio brasileiro.

## Issues e sugestões

Abra uma issue em https://github.com/Jasmineggril/Sebrae-Games/issues

---

Versão: 1.0.0
Última atualização: Maio 2026
Status: Pronto para uso
