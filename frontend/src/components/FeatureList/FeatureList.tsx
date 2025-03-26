import FeatureItem from "./FeatureItem";
import { useCharacter } from "../../hooks/CharacterContext";
const FeatureList = () => {
  const { character } = useCharacter();
  const classFeats = character?.FeatsFinal;
  return (
    <>
      {classFeats ? (
        <div className="flex flex-col justify-between px-4">
          {classFeats.map((feat: any) => (
            <FeatureItem
              key={feat.index}
              name={feat.Name}
              description={feat.Description}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-300 italic mb-2">No Features found</p>
      )}
    </>
  );
};
export default FeatureList;
