import { FC } from "react";

type Props = { type: string };
const TypeText: FC<Props> = ({ type }) => {
  let textColor = "";
  switch (type) {
    case "Check":
      textColor = "text-purple-500";
      break;
    case "Damage":
      textColor = "text-orange-500";
      break;
    case "To Hit":
      textColor = "text-blue-400";
      break;
    case "Roll":
      textColor = "text-yellow-500";
      break;
    case "Effect":
      textColor = "text-red-500";
      break;
    case "Save":
      textColor = "text-green-500";
      break;

    default:
      textColor = "text-white";
  }

  return <span className={textColor}>{type}</span>;
};
export default TypeText;
