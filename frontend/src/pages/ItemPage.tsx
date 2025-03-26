import Inventory from "../components/ItemList/Inventory";
export default function ItemPage() {
  return (
    <div className="text-white">
      <h1 className="text-2xl border-b border-white pb-1 mb-1">Inventory</h1>
      <Inventory />
    </div>
  );
}
