import Spells from "../components/SpellList/Spells";

export default function MagicPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl border-b border-white pb-1 mb-1">Magic</h1>
      <Spells />
    </div>
  );
}
