import AbilityScores from "./AbilityScore/AbilityScores";
import HealthBar from "./Health/HealthBar";
import Tracker from "./Health/Tracker";
import portrait from "../assets/half elf-male-2.png";

const InfoPanel = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl">Aldric Shieldbearer</h1>
      <h2 className="text-xl mb-2">Paladin 8 / Sorcerer 2</h2>
      <div className="flex flex-row xl:mb-2">
        <img src={portrait} alt="Character Image" className="hidden xl:block object-cover w-1/3" />
        <div className="w-full xl:w-2/3 flex flex-col xl:ml-4">
          <HealthBar />
          <Tracker />
        </div>
      </div>
      <h1 className="text-lg">Ability Scores</h1>
      <AbilityScores />
    </div>
  );
};

export default InfoPanel;
