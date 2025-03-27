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
        <div className="w-full md:h-full md:w-[50%] bg-gray-800 p-4">
          <InfoPanel />
        </div>

        <div className="w-full md:h-full md:w-[50%] flex flex-col h-full bg-gray-700">
          <Navbar />
          <div className="p-4 max-h-full overflow-y-scroll">
            <Outlet />
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
