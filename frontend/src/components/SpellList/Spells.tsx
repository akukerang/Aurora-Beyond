import { FC } from "react";
import SpellItem from "./SpellItem";
import { useCharacter } from "../../hooks/CharacterContext";
import MagicStats from "./MagicStats";
import { character } from "../../../wailsjs/go/models";
import ClassSpells from "./ClassSpells";

const Spells = () => {
  const { character } = useCharacter();
  const magic = character?.Magic;
  const spellSlots = magic?.SpellSlots;
  return (
    <div>
      {magic ? (
        <>
          <MagicStats classMagic={magic.ClassSpells} />
          {magic.ClassSpells.map((className: character.spells, index) => (
            <ClassSpells className={className} key={index} />
          ))}

          <div></div>
        </>
      ) : null}
    </div>
  );
};
export default Spells;
