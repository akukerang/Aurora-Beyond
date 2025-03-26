import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import Log from "./components/Log/Log";
import { useCharacter } from "./hooks/CharacterContext";
import { LogProvider } from "./hooks/logContext";
import LogSmall from "./components/Log/LogSmall";
import { useEffect } from "react";

//* Responsive Layout Ideas
//* InfoPanel
// Image, don't show at small width
// Reponsive grid for the ability scores
// 6x1 -> 3x2
//* Main Layout
// XL 3x1 (infoPanel, main, log)
// Medium (2x1) (infoPanel, main), log toggle
// Small (1x2) column, log toggle
function App() {
  const { loadCharacter } = useCharacter();

  useEffect(() => {
    const handleLoad = async () => {
      const filePath =
        "C:/Users/gabri/OneDrive/Documents/5e Character Builder/Aldric.dnd5e";
      await loadCharacter(filePath);
    };
    handleLoad();
  }, []);

  return (
    <div className="flex flex-col md:flex-row text-white bg-black h-screen w-screen">
      <LogProvider>
        <div className="w-full md:h-full md:w-[40%] xl:w-[40%] bg-gray-800 p-4">
          <InfoPanel />
        </div>

        <div className="w-full md:h-full md:w-[60%] xl:w-[40%] flex flex-col h-full bg-gray-700">
          <Navbar />
          <div className="p-4 max-h-full overflow-y-scroll">
            <Outlet />
          </div>
        </div>

        <div className="hidden xl:flex xl:flex-col xl:w-[20%] xl:h-full bg-gray-600 p-3 overflow-y-auto">
          <Log />
        </div>

        <div className="flex xl:hidden fixed right-0 bottom-0 z-100">
          <LogSmall />
        </div>
      </LogProvider>
    </div>
  );
}

export default App;
