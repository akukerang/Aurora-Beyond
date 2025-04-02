import { useCharacter } from "../../hooks/CharacterContext";
import MagicStats from "./MagicStats";
import { character } from "../../../wailsjs/go/models";
import ClassSpells from "./ClassSpells";
import { useSpells } from "../../hooks/SpellContext";
import { useEffect } from "react";
const Spells = () => {
  // TODO: More responsive layout to display spells on smaller screens.
  const { character } = useCharacter();
  const magic = character?.Magic;
  const { slots, loadSlots } = useSpells();
  useEffect(() => {
    if (
      magic &&
      slots.availableSlots.length === 0 &&
      slots.maxSlots.length === 0
    ) {
      loadSlots(magic.SpellSlots);
    }
  }, [magic, slots, loadSlots]);
  return (
    <div>
      {magic ? (
        <>
          <MagicStats classMagic={magic.ClassSpells} />
          {magic.ClassSpells.map((className: character.spells, index) => (
            <ClassSpells className={className} key={index} />
          ))}
        </>
      ) : (
        <p className="text-gray-300 italic mb-2">No Spells found</p>
      )}
    </div>
  );
};
export default Spells;
