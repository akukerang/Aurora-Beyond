import { useCharacter } from "../../hooks/CharacterContext";
import { source } from "../../../wailsjs/go/models";
import Item from "./Item";
const Inventory = () => {
  const { character } = useCharacter();
  return (
    <div>
      <div className="flex flex-row mb-2">
        <h1 className="text-xl font-semibold w-[10%]">Active</h1>
        <h1 className="text-xl font-semibold w-[45%]">Name</h1>
        <h1 className="text-xl font-semibold w-[5%]">QTY</h1>
      </div>
      {character?.Inventory ? (
        character.Inventory.map((item: source.ItemDetail, index) => (
          <Item key={index} item={item} />
        ))
      ) : (
        <p className="text-gray-300 italic mb-2">No items found.</p>
      )}
    </div>
  );
};
export default Inventory;
