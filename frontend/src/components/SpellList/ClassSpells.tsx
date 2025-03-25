import { FC } from "react";
import { character, source } from "../../../wailsjs/go/models";
import SpellItem from "./SpellItem";

type Props = {
  className: character.spells;
};
const ClassSpells: FC<Props> = ({ className }) => {
  const allSpells = [
    ...(className.Spells || []),
    ...(className.Cantrips || []),
  ];

  const spellsByLevel = allSpells.reduce(
    (acc: Record<number, source.Spell[]>, spell: source.Spell) => {
      console.log(spell);
      if (!acc[spell.Level]) {
        acc[spell.Level] = [];
      }
      acc[spell.Level].push(spell as source.Spell);
      return acc;
    },
    {}
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2"> {className.ClassName} </h1>
      {Object.keys(spellsByLevel)
        .sort((a, b) => Number(a) - Number(b)) // Sort
        .map((level) => (
          <>
            <h2 className="text-xl border-b border-white pb-1 mb-1">
              {Number(level) === 0 ? "Cantrips" : `Level ${level} Spells`}
            </h2>
            <div className="flex flex-row">
              <h3 className="font-semibold text-lg w-[40%]">Name</h3>
              <h3 className="font-semibold text-lg w-[20%]">Time</h3>
              <h3 className="font-semibold text-lg w-[12.5%]">Range</h3>
              <h3 className="font-semibold text-lg w-[25%]">Notes</h3>
            </div>

            {spellsByLevel[Number(level)].map((spell: source.Spell) => (
              <SpellItem spell={spell} />
            ))}
          </>
        ))}
    </div>
  );
};
export default ClassSpells;
