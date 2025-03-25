import { FC } from "react";
import { source } from "../../../wailsjs/go/models";

type Props = {
  spell: source.Spell;
};
const SpellItem: FC<Props> = ({ spell }) => {
  return (
    <div className="flex flex-row mb-2">
      <h1 className="text-lg w-[40%] italic">{spell.Name}</h1>
      <h1 className="text-lg w-[20%]">{spell.Time}</h1>
      <h1 className="text-lg w-[12.5%]">{spell.Range}</h1>
      <h1 className="text-lg w-[25%]">{spell.Ritual ? "Ritual" : ""}</h1>
    </div>
  );
};
export default SpellItem;
