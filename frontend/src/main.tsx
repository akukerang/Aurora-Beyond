import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import MagicPage from "./pages/MagicPage";
import ItemPage from "./pages/ItemPage";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { CharacterProvider } from "./hooks/CharacterContext";
import { useEffect, useState } from "react";

function ResponsiveRoutes() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Routes>
      {isLargeScreen ? (
        <Route path="/" element={<App />}>
          <Route index element={<FeaturePage />} />
          <Route path="features" element={<FeaturePage />} />
          <Route path="magic" element={<MagicPage />} />
          <Route path="items" element={<ItemPage />} />
        </Route>
      ) : (
        <Route path="/" element={<App />}>
          <Route index element={<InfoPanel />} />
          <Route path="features" element={<FeaturePage />} />
          <Route path="magic" element={<MagicPage />} />
          <Route path="items" element={<ItemPage />} />
        </Route>
      )}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CharacterProvider>
    <HashRouter basename={"/"}>
      <ResponsiveRoutes />
    </HashRouter>
  </CharacterProvider>
);
