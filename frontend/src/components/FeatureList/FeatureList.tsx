import FeatureItem from "./FeatureItem";
import { useCharacter } from "../../hooks/CharacterContext";
const FeatureList = () => {
  // TODO: Add actions and stat tracker for certain features.
  // * When this is added, remove the stat tracker from infoPage.
  const { character } = useCharacter();
  const classFeats = character?.FeatsFinal;
  return (
    <>
      {classFeats ? (
        <div className="flex flex-col justify-between px-4">
          {classFeats.map((feat: any, index) => (
            <FeatureItem
              key={index}
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
