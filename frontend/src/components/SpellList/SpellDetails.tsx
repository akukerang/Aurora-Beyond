import { FC } from "react";
import { source } from "../../../wailsjs/go/models";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  spell: source.Spell;
  hidden: boolean;
  onClose: () => void;
};
const SpellDetails: FC<Props> = ({ spell, hidden, onClose }) => {
  if (hidden) {
    return null;
  }

  return (
    <div
      className="absolute z-30 bg-gray-800 p-8 w-[75%] max-h-[20rem] overflow-y-scroll rounded-lg
    shadow-lg .spell-container left-10
    "
    >
      <CloseIcon
        onClick={onClose}
        className="cursor-pointer absolute top-2 left-2 text-white"
      />
      <h1 className="text-2xl font-semibold">{spell.Name}</h1>
      <h2 className="text-lg font-semibold">
        Time:
        <span className="text-base font-normal"> {spell.Time}</span>
      </h2>
      <h2 className="text-lg font-semibold">
        Range:
        <span className="text-base font-normal"> {spell.Range}</span>
      </h2>
      <h2 className="text-lg font-semibold mb-2">
        Duration:
        <span className="text-base font-normal"> {spell.Duration}</span>
      </h2>

      <p className="text-sm">{spell.Description}</p>
    </div>
  );
};
export default SpellDetails;
