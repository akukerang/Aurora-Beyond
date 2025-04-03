import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import DiceRoller from "./components/DiceRoller/DiceRoller";
import FloatingMenu from "./components/FloatingMenu";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import LogSmall from "./components/Log/LogSmall";
import Navbar from "./components/NavBar";
import { useCharacter } from "./hooks/CharacterContext";
import { FeatProvider } from "./hooks/FeatContext";
import { LogProvider } from "./hooks/logContext";
import { SpellProvider } from "./hooks/SpellContext";

function App() {
  const { loadCharacter } = useCharacter();

  useEffect(() => {
    const handleLoad = async () => {
      const filePath =
        "C:/Users/gabri/OneDrive/Documents/5e Character Builder/AldricTEST.dnd5e";
      await loadCharacter(filePath);
    };
    handleLoad();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row text-white bg-black h-screen w-screen">
      <FloatingMenu />
      <LogProvider>
        <div className="hidden lg:flex lg:h-full lg:w-[50%] bg-gray-800">
          <InfoPanel />
        </div>
        <DiceRoller />
        <div className="w-full lg:h-full lg:w-[50%] flex flex-col h-full bg-gray-700">
          <Navbar />
          <div className="pb-14 lg:pb-0 w-full max-h-full overflow-y-scroll">
            <FeatProvider>
              <SpellProvider>
                <Outlet />
              </SpellProvider>
            </FeatProvider>
          </div>
        </div>
        <div className="flex fixed right-0 bottom-0 z-100 w-[50%] md:w-[33%] lg:w-[30%] xl:w-[30%] 2xl:w-[20%]">
          <LogSmall />
        </div>
      </LogProvider>
    </div>
  );
}

export default App;
