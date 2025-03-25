import AttackList from "../components/FeatureList/AttackList";
import FeatureList from "../components/FeatureList/FeatureList";
export default function ItemPage() {
  return (
    <div className="text-white">
      <h1 className="text-2xl border-b border-white pb-1 mb-1">Attacks</h1>
      <AttackList />
      <h1 className="text-2xl border-b border-white pb-1 mb-1">Features</h1>
      <FeatureList />
    </div>
  );
}
