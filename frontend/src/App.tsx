import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { useCharacter } from "./hooks/CharacterContext";
import { LogProvider } from "./hooks/logContext";
import LogSmall from "./components/Log/LogSmall";
import { useEffect } from "react";
import FloatingMenu from "./components/FloatingMenu";

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
    <div className="flex flex-col lg:flex-row text-white bg-black h-screen w-screen">
      <FloatingMenu />
      <LogProvider>
        <div className="hidden lg:flex lg:h-full lg:w-[50%] p-4 bg-gray-800">
          <InfoPanel />
        </div>

        <div className="w-full lg:h-full lg:w-[50%] flex flex-col h-full bg-gray-700">
          <Navbar />
          <div className="p-4 w-full max-h-full overflow-y-scroll">
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
