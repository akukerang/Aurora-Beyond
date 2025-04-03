import defaultPortrait from "../../assets/half elf-male-2.png";
import { useCharacter } from "../../hooks/CharacterContext";
import AbilityScores from "./AbilityScores";
import Conditions from "./Conditions";
import HealthBar from "./HealthBar";
import ProficienciesAndSenses from "./ProficienciesAndSenses";
import SavingThrows from "./SavingThrows";
import Skills from "./Skills";
import Stats from "./Stats";
const InfoPanel = () => {
  const { character } = useCharacter();
  console.log(character);
  const className = character?.Multiclassing
    ? character?.Class
    : character?.Class + " (" + character?.Level + ")";
  return (
    <div className="bg-gray-800 p-4 xl:p-6 w-full">
      {character ? (
        <div className="flex flex-col lg:h-full px-2 ">
          <h1 className="text-3xl">{character.Name}</h1>
          <h2 className="text-xl mb-2">{character.Race + " " + className}</h2>
          <div className="flex flex-row xl:mb-2">
            <img
              src={
                character.Portrait != ""
                  ? `data:image/png;base64,${character.Portrait}`
                  : defaultPortrait
              }
              className="hidden xl:block object-cover w-1/4"
              alt="Character Portrait"
            />
            <div className="w-full xl:w-3/4 flex flex-col xl:ml-4">
              <HealthBar playerHealth={character.HP} />
              <div className="order-2 2xl:order-1 p-2">
                <AbilityScores abilityScore={character.AbilityScore} />
              </div>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row ">
            <div className="w-full xl:w-3/5 p-2">
              <Stats
                profBonus={character.ProfBonus}
                initiative={character.Initiative}
                ac={character.AC}
                speed={character.Speed}
              />
            </div>
            <div className="w-full xl:w-2/5 p-2">
              <Conditions />
            </div>
          </div>
          <div className="flex mt-4 h-1/2 bg-gray-800 lg:overflow-y-scroll">
            <div className="flex flex-col w-1/2 gap-2 pt-4 px-6">
              <SavingThrows savingProf={character.SavingThrows} />
              <ProficienciesAndSenses
                armorProf={character.ArmorProf}
                weaponProf={character.WeaponProf}
                toolProf={character.ToolProf}
                languages={character.Languages}
                passiveSkills={character.PassiveSkills}
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
    </div>
  );
};

export default InfoPanel;
