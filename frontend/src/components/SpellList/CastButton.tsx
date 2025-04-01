import { FC } from "react";
import { useSpells } from "../../hooks/SpellContext";
type Props = {
  level: number;
};
const CastButton: FC<Props> = ({ level }) => {
  const { useSlot } = useSpells();
  const onClick = () => {
    useSlot(level - 1);
  };

  return (
    <div
      onClick={onClick}
      className="bg-red-500 hover:bg-red-700 text-white rounded-md cursor-pointer text-sm p-1"
    >
      Cast
    </div>
  );
};
export default CastButton;
