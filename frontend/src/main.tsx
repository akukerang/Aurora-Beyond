import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { CharacterProvider } from "./hooks/CharacterContext";
import "./index.css";
import FeaturePage from "./pages/FeaturePage";
import ItemPage from "./pages/ItemPage";
import MagicPage from "./pages/MagicPage";

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
