import { FC } from "react";
import { character, source } from "../../../wailsjs/go/models";
import SpellItem from "./SpellItem";
import SpellLevelHeader from "./SpellLevelHeader";
import { useSpells } from "../../hooks/SpellContext";
type Props = {
  className: character.spells;
};

const ClassSpells: FC<Props> = ({ className }) => {
  const allSpells = [
    ...(className.Spells || []),
    ...(className.Cantrips || []),
  ];
  const { slots } = useSpells();
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
      {Array.from({ length: slots.maxSlots.length + 1 }).map((_, index) => {
        const level = index;

        // Skip cantrips if empty
        if (level === 0 && !spellsByLevel[0]) {
          return null;
        }

        return (
          <div key={level}>
            <SpellLevelHeader level={level} />
            {spellsByLevel[level] ? (
              <>
                <div className="flex flex-row pb-2 text-base font-semibold">
                  <div className="w-[8%]"></div>
                  <h3 className=" w-[30%]">Name</h3>
                  <h3 className=" w-[10%]">Time</h3>
                  <h3 className=" w-[10%]">Range</h3>
                  <h3 className=" w-[10%]">Hit/DC</h3>
                  <h3 className=" w-[20%]">Effect</h3>
                  <h3 className=" w-[20%]">Notes</h3>
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
