import { FC } from "react";
import Tracker from "./Tracker";

type Props = {
  name: string;
  description: string;
  usage?: string;
};
const FeatureItem: FC<Props> = ({ name, description, usage }) => {
  const regex = /\d+\/.*/;
  let uses: number | null = null;
  let per: string | null = null;

  if (regex.test(usage || "")) {
    // Check if usage matches DIGIT/STRING ex. 30/Long Rest
    const match = usage?.match(regex);
    uses = Number.parseInt(match?.[0].split("/")[0] || "0", 10);
    per = match?.[0].split("/")[1] || "1";
  }

  return (
    <div className="mb-2">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm">{description}</p>
      {uses && per ? <Tracker uses={uses} per={per} /> : null}
    </div>
  );
};
export default FeatureItem;
