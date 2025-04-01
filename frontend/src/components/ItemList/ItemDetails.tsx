import { FC } from "react";
import { source } from "../../../wailsjs/go/models";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  item: source.ItemDetail;
  category: string;
  hidden: boolean;
  onClose: () => void;
};
const ItemDetails: FC<Props> = ({ item, category, hidden, onClose }) => {
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
      <h1 className="text-2xl font-semibold">{item.Name}</h1>
      <h2 className="text-lg ">{category}</h2>
      <div className="flex flex-row gap-2">
        {item.Damage ? (
          <h2 className="text-lg font-semibold">
            Damage:
            <span className="text-base font-normal"> {item.Damage}</span>
          </h2>
        ) : null}
        {item.DMGType ? (
          <h2 className="text-lg font-semibold">
            DMG Type:
            <span className="text-base font-normal"> {item.DMGType}</span>
          </h2>
        ) : null}
        {item.Range ? (
          <h2 className="text-lg font-semibold">
            Range:
            <span className="text-base font-normal"> {item.Range}</span>
          </h2>
        ) : null}
        {item.AC ? (
          <h2 className="text-lg font-semibold">
            AC:
            <span className="text-base font-normal"> {item.AC}</span>
          </h2>
        ) : null}
      </div>
      <div className="flex flex-row gap-2 mb-2">
        {item.ArmorType ? (
          <h2 className="text-lg font-semibold">
            Type:
            <span className="text-base font-normal"> {item.ArmorType}</span>
          </h2>
        ) : null}
        {item.Stealth ? (
          <h2 className="text-lg font-semibold">
            Stealth:
            <span className="text-base font-normal"> Disadvantage</span>
          </h2>
        ) : null}
      </div>

      <p className="text-sm">{item.Description}</p>
    </div>
  );
};
export default ItemDetails;
