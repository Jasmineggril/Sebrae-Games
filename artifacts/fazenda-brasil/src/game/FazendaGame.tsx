import { useState, useEffect, useCallback, useRef } from "react";
import {
  CROPS, GRID_ROWS, GRID_COLS, RANDOM_EVENTS, INITIAL_ACHIEVEMENTS, XP_PER_LEVEL, MAX_LEVEL,
  makeObjectives,
  type Plot, type CropType, type Tool, type GameState, type PlotState, type Strategy,
  type RandomEvent, type Achievement,
} from "./types";
import FarmGrid from "./FarmGrid";
import HUD from "./HUD";
import SidePanel from "./SidePanel";
import ShopModal from "./ShopModal";
import StrategyModal from "./StrategyModal";
import EventModal from "./EventModal";
import FichaModal from "./FichaModal";
import AnimatedBackground from "./AnimatedBackground";
import CoinParticles, { type Particle } from "./CoinParticle";
import TutorialOverlay from "./TutorialOverlay";
import LevelUpModal from "./LevelUpModal";
import AchievementBanner from "./AchievementBanner";
import { playClick, playChime, playHarvest, playBuy, resumeAudio } from './Sound';

const INITIAL_SEEDS: Record<CropType, number> = {
  milho: 5, soja: 5, cafe: 2, cana: 2, mandioca: 3,
};

function makePlots(): Plot[] {
  const plots: Plot[] = [];
  let id = 0;
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      plots.push({ id: id++, row, col, state: "empty", crop: null, strategy: null, plantedAt: null, wateredAt: null });
    }
  }
  return plots;
}

function makeInitialState(): GameState {
  return {
    coins: 80,
    soilQuality: 100,
    xp: 0,
    level: 1,
    plots: makePlots(),
    selectedCrop: "milho",
    selectedTool: "plant",
    day: 1,
    harvestCount: 0,
    organicCount: 0,
    seeds: { ...INITIAL_SEEDS },
    objectives: makeObjectives(0),
    achievements: [...INITIAL_ACHIEVEMENTS],
    tutorialDone: false,
    upgrades: { sellBonus: 0, wateringEfficiency: 0, toolLevel: 0 },
  };
}

interface Props { onMenu: () => void; onRestart: () => void; }

type ModalState =
  | { kind: "none" }
  | { kind: "strategy"; plotId: number }
  | { kind: "event"; event: RandomEvent; pendingHarvest: { plotId: number; crop: CropType; strategy: Strategy } }
  | { kind: "ficha"; crop: CropType; earned: number };

let particleId = 0;

export default function FazendaGame({ onMenu, onRestart }: Props) {
  const [state, setState] = useState<GameState>(makeInitialState);
  const [showShop, setShowShop] = useState(false);
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStepState] = useState(0);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; reward: number } | null>(null);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const spawnParticle = useCallback((value: number) => {
    const x = window.innerWidth * 0.5 + (Math.random() - 0.5) * 300;
    const y = window.innerHeight * 0.5 + (Math.random() - 0.5) * 150;
    setParticles(prev => [...prev, { id: ++particleId, x, y, value }]);
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((newState: GameState): { state: GameState; unlocked: Achievement | null } => {
    let unlocked: Achievement | null = null;
    const achievements = newState.achievements.map(a => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      if (a.id === "first_harvest" && newState.harvestCount >= 1) shouldUnlock = true;
      if (a.id === "five_harvests" && newState.harvestCount >= 5) shouldUnlock = true;
      if (a.id === "organic_farmer" && newState.organicCount >= 3) shouldUnlock = true;
      if (a.id === "rich_farmer" && newState.coins >= 300) shouldUnlock = true;
      if (a.id === "soil_guardian" && newState.soilQuality >= 80 && newState.harvestCount >= 5) shouldUnlock = true;
      if (shouldUnlock) {
        unlocked = { ...a, unlocked: true };
        return { ...a, unlocked: true };
      }
      return a;
    });
    return { state: { ...newState, achievements }, unlocked };
  }, []);

  // Add XP and level up
  const addXP = useCallback((current: GameState, amount: number): GameState => {
    const newXP = current.xp + amount;
    const newLevel = Math.min(MAX_LEVEL, Math.floor(newXP / XP_PER_LEVEL) + 1);
    if (newLevel > current.level) {
      const reward = newLevel * 20;
      setTimeout(() => setLevelUpInfo({ level: newLevel, reward }), 400);
      return { ...current, xp: newXP, level: newLevel, coins: current.coins + reward };
    }
    return { ...current, xp: newXP, level: newLevel };
  }, []);

  // Update objectives helper
  const updateObjectives = useCallback((
    current: GameState,
    updates: { plantCount?: number; earnAmount?: number; organicCount?: number; waterCount?: number; harvestCount?: number; harvestCafe?: number }
  ): { state: GameState; bonusCoins: number } => {
    let bonusCoins = 0;
    const objectives = current.objectives.map(obj => {
      if (obj.done) return obj;
      let delta = 0;
      if (obj.id === "plant3" && updates.plantCount) delta = updates.plantCount;
      if (obj.id === "harvest5" && updates.harvestCount) delta = updates.harvestCount;
      if (obj.id === "earn50" && updates.earnAmount) delta = updates.earnAmount;
      if (obj.id === "earn100" && updates.earnAmount) delta = updates.earnAmount;
      if (obj.id === "earn150" && updates.earnAmount) delta = updates.earnAmount;
      if (obj.id === "organic1" && updates.organicCount) delta = updates.organicCount;
      if (obj.id === "organic3" && updates.organicCount) delta = updates.organicCount;
      if (obj.id === "water3" && updates.waterCount) delta = updates.waterCount;
      if (obj.id === "cafe1" && updates.harvestCafe) delta = updates.harvestCafe;
      if (delta === 0) return obj;
      const newCurrent = Math.min(obj.target, obj.current + delta);
      const justDone = !obj.done && newCurrent >= obj.target;
      if (justDone) {
        bonusCoins += obj.reward;
        setTimeout(() => showToast(`🎯 Missão concluída: "${obj.label}"! +R$${obj.reward}`), 600);
      }
      return { ...obj, current: newCurrent, done: justDone || obj.done };
    });
    return { state: { ...current, objectives }, bonusCoins };
  }, [showToast]);

  // Grow crops timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setState(prev => ({
        ...prev,
        plots: prev.plots.map(plot => {
          if ((plot.state === "planted" || plot.state === "watered") && plot.plantedAt && plot.crop) {
            const base = CROPS[plot.crop].growthTime * 1000;
            // apply upgrade effects: wateringEfficiency reduces time further
            const wateringEff = prev.upgrades?.wateringEfficiency ?? 0;
            const wateredMultiplier = Math.max(0.4, 0.65 - (wateringEff * 0.03));
            const multiplier = plot.strategy === "chemical" ? 0.55 : plot.state === "watered" ? wateredMultiplier : 1;
            if (now - plot.plantedAt >= base * multiplier) {
              return { ...plot, state: "ready" as PlotState };
            }
          }
          return plot;
        }),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Day counter
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newDay = prev.day + 1;
        const passive = prev.level * 2 + (prev.upgrades?.sellBonus ?? 0);
        if (passive > 0) {
          // small daily bonus to keep loop engaging
          setTimeout(() => showToast(`Bônus do dia: +R$${passive}`), 400);
        }
        return { ...prev, day: newDay, objectives: makeObjectives(newDay - 1), coins: prev.coins + passive };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Tutorial auto-advance: when player plants, waters or harvests, advance tutorial steps and show overlay hints
  useEffect(() => {
    // after planting (some plot becomes planted)
    if (tutorialStep === 2) {
      const planted = state.plots.some(p => p.state === "planted");
      if (planted) {
        setShowTutorial(true);
        setTutorialStepState(3); // show water step
      }
    }
    // after watering
    if (tutorialStep === 3) {
      const watered = state.plots.some(p => p.state === "watered");
      if (watered) {
        setShowTutorial(true);
        setTutorialStepState(4); // show harvest step
      }
    }
  }, [state.plots, tutorialStep]);

  useEffect(() => {
    // when strategy modal opens after initial plant click, advance to strategy step
    if (tutorialStep === 1 && modal.kind === "strategy") {
      setTutorialStepState(2);
    }

    // when harvest event produced a ficha modal
    if (tutorialStep === 4 && modal.kind === "ficha") {
      setShowTutorial(true);
      setTutorialStepState(5); // show ficha/learn step
    }
    // after ficha closed, move to final step (feira) and show overlay
    if (tutorialStep === 5 && modal.kind === "none") {
      setShowTutorial(true);
      setTutorialStepState(6);
    }
  }, [modal.kind, tutorialStep]);

  const handlePlotClick = useCallback((plotId: number) => {
    setState(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot) return prev;

      if (prev.selectedTool === "plant" && plot.state === "empty") {
        const seedCount = prev.seeds[prev.selectedCrop];
        if (seedCount <= 0) {
          showToast(`Sem sementes de ${CROPS[prev.selectedCrop].name}! Vá à Feira. 🏪`);
          return prev;
        }
        const cropDef = CROPS[prev.selectedCrop];
        if (cropDef.unlockLevel > prev.level) {
          showToast(`${cropDef.name} requer Nível ${cropDef.unlockLevel}! Você está no Nível ${prev.level}.`);
          return prev;
        }
        setModal({ kind: "strategy", plotId });
        return prev;
      }

      if (prev.selectedTool === "water" && plot.state === "planted") {
        showToast("💧 Regado! Cresce muito mais rápido agora.");
        try { resumeAudio(); playClick(); } catch (e) {}
        const { state: afterObj, bonusCoins } = updateObjectives(prev, { waterCount: 1 });
        return {
          ...afterObj,
          coins: afterObj.coins + bonusCoins,
          plots: afterObj.plots.map(p =>
            p.id === plotId ? { ...p, state: "watered" as PlotState, wateredAt: Date.now() } : p
          ),
        };
      }

      if (prev.selectedTool === "harvest" && plot.state === "ready") {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        setModal({ kind: "event", event, pendingHarvest: { plotId, crop: plot.crop!, strategy: plot.strategy } });
        return prev;
      }

      if (plot.state === "ready") showToast("Selecione ✂️ Colher para colher este canteiro!");
      if (plot.state === "planted" && prev.selectedTool === "plant") showToast("Já tem plantio! Use 💧 para regar.");
      if (plot.state === "watered" && prev.selectedTool === "water") showToast("Já regado! Aguarde crescer. ⏳");
      return prev;
    });
  }, [showToast, updateObjectives]);

  const handleStrategy = useCallback((strategy: Strategy) => {
    if (modal.kind !== "strategy") return;
    const { plotId } = modal;
    setModal({ kind: "none" });
    setState(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot || plot.state !== "empty") return prev;
      const crop = prev.selectedCrop;
      const seedCount = prev.seeds[crop];
      if (seedCount <= 0) return prev;
      const soilPenalty = strategy === "chemical" ? 10 : 0;
      const isOrganic = strategy === "organic";
      const newOrganicCount = isOrganic ? prev.organicCount + 1 : prev.organicCount;

      const baseState: GameState = {
        ...prev,
        soilQuality: Math.max(0, prev.soilQuality - soilPenalty),
        organicCount: newOrganicCount,
        seeds: { ...prev.seeds, [crop]: seedCount - 1 },
        plots: prev.plots.map(p =>
          p.id === plotId
            ? { ...p, state: "planted" as PlotState, crop, strategy, plantedAt: Date.now(), wateredAt: null }
            : p
        ),
      };

      try { resumeAudio(); playClick(); } catch (e) {}

      const { state: afterObj, bonusCoins } = updateObjectives(baseState, {
        plantCount: 1,
        organicCount: isOrganic ? 1 : 0,
      });

      return { ...afterObj, coins: afterObj.coins + bonusCoins };
    });
  }, [modal, updateObjectives]);

  const handleEventClose = useCallback(() => {
    if (modal.kind !== "event") return;
    const { event, pendingHarvest } = modal;
    const { plotId, crop, strategy } = pendingHarvest;

    setState(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot || plot.state !== "ready") return prev;
      const base = CROPS[crop].sellPrice;
      const chemBonus = strategy === "chemical" ? 15 : 0;
      const soilMod = prev.soilQuality < 50 ? -5 : 0;
      const sellBonus = prev.upgrades?.sellBonus ?? 0;
      const toolLevel = prev.upgrades?.toolLevel ?? 0;
      const earnedBase = base + chemBonus + soilMod + event.coinBonus + sellBonus;
      const earned = Math.max(5, earnedBase + Math.floor(earnedBase * (toolLevel * 0.05)));
      const soilChange = strategy === "organic" ? 5 : 0;
      const xpGain = CROPS[crop].xpReward + toolLevel * 2;

      const newHarvestCount = prev.harvestCount + 1;
      const newSoilQuality = Math.min(100, Math.max(0, prev.soilQuality + soilChange));

      let updated: GameState = {
        ...prev,
        coins: prev.coins + earned,
        soilQuality: newSoilQuality,
        harvestCount: newHarvestCount,
        plots: prev.plots.map(p =>
          p.id === plotId
            ? { ...p, state: "empty" as PlotState, crop: null, strategy: null, plantedAt: null, wateredAt: null }
            : p
        ),
      };

      // Add XP
      updated = addXP(updated, xpGain);

      // Update objectives
      const { state: afterObj, bonusCoins } = updateObjectives(updated, {
        earnAmount: earned,
        harvestCount: 1,
        harvestCafe: crop === "cafe" ? 1 : 0,
      });
      updated = { ...afterObj, coins: afterObj.coins + bonusCoins };

      // Check achievements
      const { state: afterAch, unlocked } = checkAchievements(updated);
      if (unlocked) {
        setTimeout(() => setPendingAchievement(unlocked), 800);
      }

      spawnParticle(earned);
      setModal({ kind: "ficha", crop, earned });
      try { resumeAudio(); playHarvest(); } catch (e) {}
      return afterAch;
    });
  }, [modal, spawnParticle, addXP, updateObjectives, checkAchievements]);

  const handleBuy = useCallback((crop: CropType, qty: number) => {
    const cost = CROPS[crop].seedCost * qty;
    setState(prev => {
      if (prev.coins < cost) { showToast("Moedas insuficientes! 💸"); return prev; }
      if (CROPS[crop].unlockLevel > prev.level) {
        showToast(`${CROPS[crop].name} requer Nível ${CROPS[crop].unlockLevel}!`);
        return prev;
      }
      showToast(`Comprou ${qty}x ${CROPS[crop].name}! ${CROPS[crop].emoji}`);
      return {
        ...prev,
        coins: prev.coins - cost,
        seeds: { ...prev.seeds, [crop]: prev.seeds[crop] + qty },
      };
    });
  }, [showToast]);

  const handleBuyUpgrade = useCallback((key: 'sellBonus' | 'wateringEfficiency' | 'toolLevel', cost: number, amount = 1) => {
    setState(prev => {
      if (prev.coins < cost) { showToast('Moedas insuficientes para upgrade!'); return prev; }
      const upgrades = { ...(prev.upgrades || { sellBonus: 0, wateringEfficiency: 0, toolLevel: 0 }) };
      upgrades[key] = (upgrades[key] || 0) + amount;
      showToast(`Upgrade comprado: ${key} +${amount}`);
      try { resumeAudio(); playBuy(); } catch (e) {}
      return { ...prev, coins: prev.coins - cost, upgrades };
    });
  }, [showToast]);

  const handleRestart = useCallback(() => {
    setState(makeInitialState());
    setModal({ kind: "none" });
    setShowShop(false);
    setParticles([]);
    setToast(null);
    setShowTutorial(true);
    setLevelUpInfo(null);
    setPendingAchievement(null);
    onRestart();
  }, [onRestart]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes toastIn { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes bounceReady { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.08); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <AnimatedBackground />

      {/* Tutorial */}
      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          setStep={(n: number) => {
            // when moving to the first actionable step, hide overlay so player can interact
            if (n === 1) {
              setShowTutorial(false);
              setTutorialStepState(1);
              return;
            }
            setTutorialStepState(n);
          }}
          onDone={() => {
            setShowTutorial(false);
            setState(prev => ({ ...prev, tutorialDone: true }));
          }}
        />
      )}

      {/* Level up */}
      {levelUpInfo && (
        <LevelUpModal
          level={levelUpInfo.level}
          reward={levelUpInfo.reward}
          onClose={() => setLevelUpInfo(null)}
        />
      )}

      {/* Achievement banner */}
      <AchievementBanner
        achievement={pendingAchievement}
        onDone={() => setPendingAchievement(null)}
      />

      {/* Top HUD */}
      <HUD
        state={state}
        tutorialStep={tutorialStep}
        onSelectTool={(tool) => {
          setState(prev => ({ ...prev, selectedTool: tool as Tool }));
          // advance tutorial if player selected the expected tool
          const expected: Record<number, Tool> = { 1: 'plant', 3: 'water', 4: 'harvest' };
          if (tutorialStep in expected && expected[tutorialStep] === tool) {
            // hide focus overlay to allow interaction with game
            setShowTutorial(false);
            setTutorialStepState(tutorialStep + 1);
          }
        }}
        onSelectCrop={crop => setState(prev => ({ ...prev, selectedCrop: crop as CropType }))}
        onShop={() => setShowShop(true)}
        onMenu={onMenu}
        onRestart={handleRestart}
      />

      {/* Tutorial focus overlay: blocks interaction except HUD when tutorial expects a tool click */}
      {([1, 3, 4].includes(tutorialStep)) && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 30,
          background: 'rgba(0,0,0,0.46)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'auto'
        }}>
          <div style={{ color: '#fff', textAlign: 'center', maxWidth: 520, padding: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              {tutorialStep === 1 ? 'Clique em "Plantar"' : tutorialStep === 3 ? 'Clique em "Regar"' : 'Clique em "Colher"'}
            </div>
            <div style={{ opacity: 0.9, marginBottom: 12 }}>
              Siga o tutorial: essa ação é necessária para aprender a mecânica.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => { setShowTutorial(false); setState(prev => ({ ...prev, tutorialDone: true })); }}
                style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                Continuar manualmente
              </button>
              <button onClick={() => { setShowTutorial(false); setTutorialStepState(0); setState(prev => ({ ...prev, tutorialDone: true })); }}
                style={{ padding: '8px 12px', borderRadius: 10, background: 'linear-gradient(135deg,#e74c3c,#c0392b)', color: '#fff', border: 'none', fontWeight: 700 }}>
                Pular tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content: side panel + farm grid */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "10px 16px 14px",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}>
        <SidePanel state={state} />
        <FarmGrid
          plots={state.plots}
          selectedTool={state.selectedTool}
          soilQuality={state.soilQuality}
          playerLevel={state.level}
          onPlotClick={handlePlotClick}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.92)", color: "#fff", borderRadius: 16,
          padding: "13px 30px", fontSize: 15, fontWeight: 600, zIndex: 1500,
          pointerEvents: "none",
          boxShadow: "0 8px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: "toastIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>{toast}</div>
      )}

      <CoinParticles particles={particles} onExpire={removeParticle} />

      {modal.kind === "strategy" && (
        <StrategyModal
          crop={state.selectedCrop}
          soilQuality={state.soilQuality}
          onChoose={handleStrategy}
          onCancel={() => setModal({ kind: "none" })}
        />
      )}
      {modal.kind === "event" && (
        <EventModal event={modal.event} onClose={handleEventClose} />
      )}
      {modal.kind === "ficha" && (
        <FichaModal crop={modal.crop} earned={modal.earned} onClose={() => setModal({ kind: "none" })} />
      )}
      {showShop && (
        <ShopModal
          coins={state.coins}
          seeds={state.seeds}
          playerLevel={state.level}
          upgrades={state.upgrades}
          onBuy={handleBuy}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setShowShop(false)}
        />
      )}
    </div>
  );
}
