import { FC } from "react";
import SpellItem from "./SpellItem";
import { useCharacter } from "../../hooks/CharacterContext";
import MagicStats from "./MagicStats";
const SpellList = () => {
  const { character } = useCharacter();
  const magic = character?.Magic;
  return (
    <div>
      <MagicStats />
    </div>
  );
};
export default SpellList;
