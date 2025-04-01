import { FC } from "react";
import { source } from "../../../wailsjs/go/models";
import CastButton from "./CastButton";

type Props = {
  spell: source.Spell;
};
const SpellItem: FC<Props> = ({ spell }) => {
  const note =
    spell.Ritual || spell.Duration
      ? `${spell.Ritual ? "Ritual" : ""} ${
          spell.Duration ? spell.Duration : ""
        }`
      : "";

  return (
    <div className="flex flex-row mb-2">
      <div className="w-[5%] flex items-center justify-center ">
        {spell.Level !== 0 ? <CastButton level={spell.Level} /> : null}
      </div>
      <h1 className="text-lg w-[40%] italic">{spell.Name}</h1>
      <h1 className="text-lg w-[12.5%]">{spell.Time}</h1>
      <h1 className="text-lg w-[12.5%]">{spell.Range}</h1>
      <h1 className="text-lg w-[25%] italic">{note}</h1>
    </div>
  );
};
export default SpellItem;
