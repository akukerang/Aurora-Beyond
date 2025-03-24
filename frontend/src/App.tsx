import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import Log from "./components/Log";

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
    return (
      <div className="flex flex-col md:flex-row text-white bg-black h-screen w-screen">
        {/* InfoPanel */}
        <div className="w-full md:h-full md:w-[40%] xl:w-[40%] bg-gray-800 p-4">
          <InfoPanel />
        </div>
  
        {/* Main Content */}
        <div className="w-full md:h-full md:w-[60%] xl:w-[40%] flex flex-col h-full bg-gray-700">
          <Navbar />
          <div className="p-4 max-h-full overflow-y-scroll">
            <Outlet />
          </div>
        </div>
  
        {/* Log */}
        <div className="hidden xl:block xl:w-[20%] bg-gray-600 p-3">
          <h1 className="text-2xl border-b border-white pb-1 mb-1">Log</h1>
          <Log />
        </div>
      </div>
    );
  }
  
  export default App;