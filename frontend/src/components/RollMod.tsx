import HexagonIcon from "@mui/icons-material/Hexagon";
import { FC } from "react";

type Props = {
  advantage?: boolean;
  disadvantage?: boolean;
};

const RollMod: FC<Props> = ({ advantage, disadvantage }) => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <HexagonIcon
        className={
          advantage && disadvantage
            ? "text-yellow-500" // Both
            : advantage
            ? "text-green-500" // Advantage
            : disadvantage
            ? "text-red-500" // Disadvantage
            : ""
        }
      />
      <span
        className="absolute text-white text-sm font-semibold flex items-center justify-center"
        style={{
          textShadow: "0px 0px 2px black, 0px 0px 2px black",
        }}
      >
        {advantage && disadvantage
          ? "B"
          : advantage
          ? "A"
          : disadvantage
          ? "D"
          : ""}
      </span>
    </div>
  );
};

export default RollMod;
