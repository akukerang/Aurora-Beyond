import { FC } from "react";
import { character, source } from "../../../wailsjs/go/models";
import SpellItem from "./SpellItem";
import SpellLevelHeader from "./SpellLevelHeader";

type Props = {
  className: character.spells;
  spellSlots: number[];
};

const ClassSpells: FC<Props> = ({ className, spellSlots }) => {
  const allSpells = [
    ...(className.Spells || []),
    ...(className.Cantrips || []),
  ];

  console.log(allSpells);

  const spellsByLevel = allSpells.reduce(
    (acc: Record<number, source.Spell[]>, spell: source.Spell) => {
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
      {Array.from({ length: spellSlots.length + 1 }).map((_, index) => {
        const level = index;
        const slots = index > 0 ? spellSlots[index - 1] : 0;

        // Skip cantrips if empty
        if (level === 0 && !spellsByLevel[0]) {
          return null;
        }

        return (
          <div key={level}>
            <SpellLevelHeader level={level} slots={slots} />
            {spellsByLevel[level] ? (
              <>
                <div className="flex flex-row">
                  <h3 className="font-semibold text-lg w-[40%]">Name</h3>
                  <h3 className="font-semibold text-lg w-[12.5%]">Time</h3>
                  <h3 className="font-semibold text-lg w-[12.5%]">Range</h3>
                  <h3 className="font-semibold text-lg w-[25%]">Notes</h3>
                </div>
                {spellsByLevel[level].map((spell: source.Spell) => (
                  <SpellItem key={spell.ID} spell={spell} />
                ))}
              </>
            ) : (
              // Show a message for empty levels except cantrips
              level > 0 && (
                <p className="text-gray-300 italic mb-2">
                  No spells available for this level. Some spells may be
                  upcasted.
                </p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClassSpells;
