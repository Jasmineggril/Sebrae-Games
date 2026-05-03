import { useState } from "react";
import LoadingScreen from "@/game/LoadingScreen";
import MainMenu from "@/game/MainMenu";
import FazendaGame from "@/game/FazendaGame";
import MarketScreen from "@/game/MarketScreen";

type Screen = "loading" | "menu" | "game" | "market";

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a1628" }}>
      {screen === "loading" && <LoadingScreen onDone={() => setScreen("menu")} />}
      {screen === "menu" && (
        <MainMenu
          onStart={() => setScreen("game")}
          onMarket={() => setScreen("market")}
        />
      )}
      {screen === "market" && <MarketScreen onBack={() => setScreen("menu")} />}
      {screen === "game" && (
        <FazendaGame
          onMenu={() => setScreen("menu")}
          onRestart={() => setScreen("game")}
        />
      )}
    </div>
  );
}
