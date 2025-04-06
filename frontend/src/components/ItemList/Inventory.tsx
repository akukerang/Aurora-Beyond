import { useCharacter } from "../../hooks/CharacterContext";
import { source } from "../../../wailsjs/go/models";
import Item from "./Item";
import { useState } from "react";
import SearchBar from "../SearchBar";
const Inventory = () => {
  const { character } = useCharacter();
  const [search, setSearch] = useState<string>("");

  const filteredItems = character?.Inventory?.filter(
    (item: source.ItemDetail) => {
      const searchQuery = search.toLowerCase();
      return (
        item.Name.toLowerCase().includes(searchQuery) ||
        item.Category.toLowerCase().includes(searchQuery) ||
        (item.Rarity ? item.Rarity.toLowerCase().includes(searchQuery) : false)
      );
    }
  );

  return (
    <div>
      <SearchBar
        placeholder="Search Item Names, Types, or Rarities"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-row mb-2">
        <h1 className="text-xl font-semibold w-[10%]">Active</h1>
        <h1 className="text-xl font-semibold w-[45%]">Name</h1>
        <h1 className="text-xl font-semibold w-[5%]">QTY</h1>
      </div>
      {filteredItems && filteredItems.length > 0 ? (
        filteredItems.map((item: source.ItemDetail, index) => (
          <Item key={index} item={item} />
        ))
      ) : (
        <p className="text-gray-300 italic mb-2">No items found.</p>
      )}
    </div>
  );
};
export default Inventory;
