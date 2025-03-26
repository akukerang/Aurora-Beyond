import { FC } from "react";

interface Props {
  armorProf: string[];
  weaponProf: string[];
  toolProf: string[];
  languages: string[];
}

const ProficienciesAndSenses: FC<Props> = ({
  armorProf,
  weaponProf,
  toolProf,
  languages,
}) => {
  return (
    <>
      <div className="mb-2">
        <h1 className="text-xl border-b border-white pb-1 mb-1">Senses</h1>
        <h2 className="text-lg">Passive Perception: </h2>
        <h2 className="text-lg">Passive Investigation: </h2>
        <h2 className="text-lg">Passive Insight: </h2>
      </div>
      <div>
        <h1 className="text-xl border-b border-white pb-1 mb-1">
          Proficiencies
        </h1>
        <h2 className="text-lg font-semibold">Armor</h2>
        <p className="text-md">
          {armorProf
            ? armorProf.map((item: string) => item).join(", ")
            : "None"}
        </p>
        <h2 className="text-lg font-semibold">Weapons </h2>
        <p className="text-md">
          {weaponProf
            ? weaponProf.map((item: string) => item).join(", ")
            : "None"}
        </p>
        <h2 className="text-lg font-semibold">Tools </h2>
        <p className="text-md">
          {toolProf ? toolProf.map((item: string) => item).join(", ") : "None"}
        </p>
        <h2 className="text-lg font-semibold">Languages </h2>
        <p className="text-md">
          {languages
            ? languages.map((item: string) => item).join(", ")
            : "None"}
        </p>
      </div>
    </>
  );
};
export default ProficienciesAndSenses;
