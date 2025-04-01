import { FC } from "react";
import { source } from "../../../wailsjs/go/models";

type Props = {
  item: source.ItemDetail;
};

const Item: FC<Props> = ({ item }) => {
  const itemCategory = item.Rarity
    ? item.Category + " (" + item.Rarity + ")"
    : item.Category;

  let itemColor = "text-white";
  switch (item.Rarity) {
    case "Common":
      itemColor = "text-white";
      break;
    case "Uncommon":
      itemColor = "text-green-500";
      break;
    case "Rare":
      itemColor = "text-blue-500";
      break;
    case "Very Rare":
      itemColor = "text-purple-500";
      break;
    case "Legendary":
      itemColor = "text-yellow-500";
      break;
    default:
      itemColor = "text-white";
      break;
  }

  return (
    <div className="flex flex-col mb-2">
      <div className="flex flex-row items-center pb-2 border-b border-gray-500">
        <div className="flex items-center justify-center w-[10%]">
          <input
            type="checkbox"
            className="form-checkbox accent-red-500 w-6 h-6"
            checked={item.Equipped}
            readOnly={true}
          />
        </div>
        <div className="flex flex-col  w-[45%]  pl-2">
          <h1 className={"text-lg " + itemColor}>{item.Name}</h1>
          <h1 className="text-base italic">{itemCategory}</h1>
        </div>
        <div className="flex w-[5%] items-center justify-center">
          <h1 className=" text-xl">{item.Amount}</h1>
        </div>
      </div>
    </div>
  );
};

export default Item;
