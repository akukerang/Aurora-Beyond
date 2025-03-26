import AbilityScores from "./AbilityScores";
import HealthBar from "./HealthBar";
import Tracker from "./Tracker";
import portrait from "../../assets/half elf-male-2.png";
import Stats from "./Stats";
import { useCharacter } from "../../hooks/CharacterContext";
import { useEffect } from "react";
// TODO; Figure out how to use local images
const InfoPanel = () => {
  const { character, loadCharacter } = useCharacter();
  useEffect(() => {
    const handleLoad = async () => {
      const filePath =
        "C:/Users/gabri/OneDrive/Documents/5e Character Builder/Aldric.dnd5e";
      await loadCharacter(filePath);
    };
    handleLoad();
  }, []);
  return (
    <>
      {character ? (
        <div className="flex flex-col">
          <h1 className="text-3xl">{character.Name}</h1>
          <h2 className="text-xl mb-2">{character.Class} </h2>
          <div className="flex flex-row xl:mb-2">
            <img
              src={portrait}
              alt="Character Image"
              className="hidden xl:block object-cover w-1/3"
            />
            <div className="w-full xl:w-2/3 flex flex-col xl:ml-4">
              <HealthBar playerHealth={character.HP} />
              <Tracker />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row">
            <div className="order-2 xl:order-1 p-2">
              <AbilityScores abilityScore={character.AbilityScore} />
            </div>
            <div className="order-1 xl:order-2 p-2">
              <Stats
                profBonus={character.ProfBonus}
                initiative={character.Initiative}
                ac={character.AC}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default InfoPanel;
