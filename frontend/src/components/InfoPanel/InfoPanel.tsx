import AbilityScores from "./AbilityScores";
import HealthBar from "./HealthBar";
import Tracker from "./Tracker";
import Stats from "./Stats";
import { useCharacter } from "../../hooks/CharacterContext";
import defaultPortrait from "../../assets/half elf-male-2.png";
import ProficienciesAndSenses from "./ProficienciesAndSenses";
import SavingThrows from "./SavingThrows";
import Skills from "./Skills";
const InfoPanel = () => {
  const { character } = useCharacter();
  console.log(character);
  return (
    <>
      {character ? (
        <div className="flex flex-col h-full px-4">
          <h1 className="text-3xl">{character.Name}</h1>
          <h2 className="text-xl mb-2">{character.Class} </h2>
          <div className="flex flex-row xl:mb-2">
            <img
              src={
                character.Portrait != ""
                  ? `data:image/png;base64,${character.Portrait}`
                  : defaultPortrait
              }
              className="hidden xl:block object-cover w-1/3"
              alt="Character Portrait"
            />
            <div className="w-full xl:w-2/3 flex flex-col xl:ml-4">
              <HealthBar playerHealth={character.HP} />
              <Tracker />
            </div>
          </div>
          <div className="flex flex-col 2xl:flex-row">
            <div className="order-2 2xl:order-1 p-2">
              <AbilityScores abilityScore={character.AbilityScore} />
            </div>
            <div className="order-1 2xl:order-2 p-2">
              <Stats
                profBonus={character.ProfBonus}
                initiative={character.Initiative}
                ac={character.AC}
                speed={character.Speed}
              />
            </div>
          </div>
          <div className="flex mt-4 h-1/2 bg-gray-800 overflow-y-scroll">
            <div className="flex flex-col w-1/2 gap-2 pt-4 px-6">
              <SavingThrows savingProf={character.SavingThrows} />
              <ProficienciesAndSenses
                armorProf={character.ArmorProf}
                weaponProf={character.WeaponProf}
                toolProf={character.ToolProf}
                languages={character.Languages}
              />
            </div>
            <Skills skillProf={character.Skills} />
          </div>
        </div>
      ) : (
        <p className="text-gray-300 italic mb-2">
          No Stats found, make sure file loaded.
        </p>
      )}
    </>
  );
};

export default InfoPanel;
