import Spells from "../components/SpellList/Spells";

export default function MagicPage() {
  return (
    <div className="text-white">
      // TODO: Backend, Spell action shorten. // TODO: Ex. 1 Action = 1A
      <h1 className="text-3xl border-b border-white pb-1 mb-2">Magic</h1>
      <Spells />
    </div>
  );
}
