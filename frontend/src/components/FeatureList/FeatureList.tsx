import FeatureItem from "./FeatureItem";
import { useCharacter } from "../../hooks/CharacterContext";
const FeatureList = () => {
  const { character } = useCharacter();
  const classFeats = character?.FeatsFinal;
  return (
    <div className="flex flex-col justify-between px-4">
      {classFeats
        ? classFeats.map((feat: any) => (
            <FeatureItem
              key={feat.index}
              name={feat.Name}
              description={feat.Description}
            />
          ))
        : null}
    </div>
  );
};
export default FeatureList;
