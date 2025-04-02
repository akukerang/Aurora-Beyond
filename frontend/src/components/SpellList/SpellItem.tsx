import { FC, useState } from "react";
import { source } from "../../../wailsjs/go/models";
import CastButton from "./CastButton";
import SpellDetails from "./SpellDetails";

type Props = {
  spell: source.Spell;
};
const SpellItem: FC<Props> = ({ spell }) => {
  const [hidden, setHidden] = useState(true);
  const note =
    spell.Ritual || spell.Duration
      ? `${spell.Ritual ? "Ritual" : ""} ${
          spell.Duration ? spell.Duration : ""
        }`
      : "";

  return (
    <div className="flex flex-row mb-2 relative">
      <SpellDetails
        spell={spell}
        hidden={hidden}
        onClose={() => setHidden(true)}
      />
      <div className="w-[8%] flex items-center justify-center pb-2">
        {spell.Level !== 0 ? <CastButton level={spell.Level} /> : null}
      </div>
      <h1
        className="text-lg w-[40%] italic pb-2  border-b border-gray-500 cursor-pointer"
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        {spell.Name}
      </h1>
      <h1 className="text-lg w-[12.5%] pb-2  border-b border-gray-500">
        {spell.Time}
      </h1>
      <h1 className="text-lg w-[12.5%] pb-2 border-b border-gray-500">
        {spell.Range}
      </h1>
      <h1 className="text-base w-[30%] pb-2 italic border-b border-gray-500">
        {note}
      </h1>
    </div>
  );
};
export default SpellItem;
