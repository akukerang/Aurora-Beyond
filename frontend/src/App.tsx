import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import DiceRoller from "./components/DiceRoller/DiceRoller";
import FloatingMenu from "./components/FloatingMenu";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import Log from "./components/Log/Log";
import Navbar from "./components/NavBar";
import { useCharacter } from "./hooks/CharacterContext";
import { FeatProvider } from "./hooks/FeatContext";
import { LogProvider } from "./hooks/logContext";
import { NoteProvider } from "./hooks/NotesContext";
import { SpellProvider } from "./hooks/SpellContext";
import { EventsOn } from "../wailsjs/runtime";
function App() {
  const { loadCharacter } = useCharacter();

  useEffect(() => {
    EventsOn("fileSelected", async (filePath: string) => {
      await loadCharacter(filePath);
    });
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
                <NoteProvider>
                  <Outlet />
                </NoteProvider>
              </SpellProvider>
            </FeatProvider>
          </div>
        </div>
        <div className="flex fixed right-0 bottom-0 z-100 w-[50%] md:w-[33%] lg:w-[30%] xl:w-[30%] 2xl:w-[20%]">
          <Log />
        </div>
      </LogProvider>
    </div>
  );
}

export default App;
