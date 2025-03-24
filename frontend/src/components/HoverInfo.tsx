import { FC } from "react";

type Props = {
  info: string;
};
const HoverInfo: FC<Props> = ({ info }) => {
  return (
    <div className="bg-white text-black rounded-md hover:bg-gray-300 cursor-pointer text-center p-2">
      {info}
    </div>
  );
};
export default HoverInfo;
