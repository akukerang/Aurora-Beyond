import Spells from "../components/SpellList/Spells";
import { SpellProvider } from "../hooks/SpellContext";

export default function MagicPage() {
  return (
    <div className="text-white p-6">
      <SpellProvider>
        <h1 className="text-3xl border-b border-white pb-1 mb-2">Magic</h1>
        <Spells />
      </SpellProvider>
    </div>
  );
}
