import SpellList from "../components/SpellList/SpellList";
export default function MagicPage() {
  return (
    <div className="text-white">
      <h1 className="text-2xl border-b border-white pb-1 mb-1">Spells</h1>
      <SpellList />
    </div>
  );
}
