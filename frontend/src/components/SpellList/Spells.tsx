import { useCharacter } from "../../hooks/CharacterContext";
import MagicStats from "./MagicStats";
import { character } from "../../../wailsjs/go/models";
import ClassSpells from "./ClassSpells";
import { useSpells } from "../../hooks/SpellContext";
import { useEffect } from "react";
const Spells = () => {
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
            <ClassSpells
              className={className}
              spellSlots={magic.SpellSlots}
              key={index}
            />
          ))}

          <div></div>
        </>
      ) : (
        <p className="text-gray-300 italic mb-2">No Spells found</p>
      )}
    </div>
  );
};
export default Spells;
