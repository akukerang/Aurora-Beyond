import AbilityScores from "./AbilityScores";
import HealthBar from "./HealthBar";
import Tracker from "./Tracker";
import portrait from "../../assets/half elf-male-2.png";
import Stats from "./Stats";

const InfoPanel = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl">Aldric Shieldbearer</h1>
      <h2 className="text-xl mb-2">Paladin 8 / Sorcerer 2</h2>
      <div className="flex flex-row xl:mb-2">
        <img
          src={portrait}
          alt="Character Image"
          className="hidden xl:block object-cover w-1/3"
        />
        <div className="w-full xl:w-2/3 flex flex-col xl:ml-4">
          <HealthBar />
          <Tracker />
        </div>  
      </div>
      <div className="flex flex-col xl:flex-row">
        <div className="order-2 xl:order-1 p-2">
          <AbilityScores />
        </div>
        <div className="order-1 xl:order-2 p-2">
          <Stats profBonus={3} initiative={1} />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
