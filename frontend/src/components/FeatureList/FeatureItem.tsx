import { FC } from "react";
import Tracker from "./Tracker";

type Props = {
  name: string;
  description: string;
  usage?: string;
};
const FeatureItem: FC<Props> = ({ name, description, usage }) => {
  const parts = usage?.split("/");
  const re = /\d+/g;
  const uses = parts?.[0] ? parseInt(parts[0].match(re)?.[0] || "0") : undefined;
  const per = parts?.[1];
  return (

    <div className="mb-2">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm">{description}</p>
      {uses && per ? <Tracker name={name} uses={uses} per={per} /> : null}
    </div>
  );
};
export default FeatureItem;
