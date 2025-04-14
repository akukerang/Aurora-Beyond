import { FC, useState } from "react";
import { source } from "../../../wailsjs/go/models";
import CastButton from "./CastButton";
import SpellDetails from "./SpellDetails";
import RollDice from "../DiceRoller/RollDice";

type Props = {
  spell: source.Spell;
};


const SaveDC = (saveDC: string) => {
  const num = saveDC.substring(0, 2)
  const type = saveDC.substring(2, saveDC.length).trim()
  let shortened = ""
  switch (type) {
    case "Strength":
      shortened = "STR"
      break;
    case "Dexterity":
      shortened = "DEX"
      break;
    case "Constitution":
      shortened = "CON"
      break;
    case "Intelligence":
      shortened = "INT"
      break;
    case "Wisdom":
      shortened = "WIS"
      break;
    case "Charisma":
      shortened = "CHA"
      break;
    default:
      shortened = type
      break;
  }

  return (
    <div className="flex flex-col items-center">
      <p className="font-semibold">{shortened}</p>
      <p>{num}</p>
    </div>
  )

}


const SpellItem: FC<Props> = ({ spell }) => {
  const [hidden, setHidden] = useState(true);
  const note =
    spell.Ritual || spell.Duration
      ? `${spell.Ritual ? "Ritual" : ""} ${spell.Duration ? spell.Duration : ""
      }`
      : "";

  return (
    <div className="flex flex-row mb-2 relative">
      <SpellDetails
        spell={spell}
        hidden={hidden}
        onClose={() => setHidden(true)}
      />
      <div className="w-[8%] min-w-[50px] flex items-center justify-center pb-2">
        {spell.Level !== 0 ? <CastButton level={spell.Level} /> : null}
      </div>
      <h1
        className="text-base w-[20%] min-w-[80px] italic pb-2 border-b border-gray-500 cursor-pointer text-clip"
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        {spell.Name}
      </h1>
      <h1 className="text-base w-[10%] min-w-[50px] pb-2 border-b border-gray-500 text-clip">
        {spell.Time}
      </h1>
      <h1 className="text-base w-[10%] min-w-[50px] pb-2 border-b border-gray-500 text-clip">
        {spell.Range}
      </h1>

      <div
        className="w-[10%] min-w-[50px] pb-2 border-b border-gray-500 px-2 flex justify-start text-clip"
      >
        {spell.Hit != 0 ? (
          <RollDice mod={spell.Hit} context={spell.Name} type="To Hit" />
        ) : spell.SaveDC != "" ? (
          SaveDC(spell.SaveDC)
        ) : (
          "-"
        )}
      </div>
      <div
        className="w-[15%] min-w-[80px] pb-2 border-b border-gray-500 px-2 flex justify-start text-clip"
      >
        {spell.Effect.Text != "" ? (
          <RollDice dice={spell.Effect} context={spell.Name} type="Effect" />
        ) : (
          "-"
        )}
      </div>

      <h1 className="text-base w-[25%] min-w-[150px] pb-2 italic border-b border-gray-500 text-clip">
        {note}
      </h1>
    </div>
  );
};
export default SpellItem;
