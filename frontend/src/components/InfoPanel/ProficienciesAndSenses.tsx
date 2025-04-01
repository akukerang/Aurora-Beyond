import { FC } from "react";

interface Props {
  armorProf: string[];
  weaponProf: string[];
  toolProf: string[];
  languages: string[];
  passiveSkills: Record<string, number>;
}

const ProficienciesAndSenses: FC<Props> = ({
  armorProf,
  weaponProf,
  toolProf,
  languages,
  passiveSkills,
}) => {
  return (
    <>
      <div className="mb-2">
        <h1 className="text-xl border-b border-white pb-1 mb-1">Senses</h1>
        <h2 className="text-lg">
          Passive Perception: {passiveSkills["Perception"]}
        </h2>
        <h2 className="text-lg">
          Passive Investigation: {passiveSkills["Investigation"]}
        </h2>
        <h2 className="text-lg">Passive Insight: {passiveSkills["Insight"]}</h2>
      </div>
      <div>
        <h1 className="text-xl border-b border-white pb-1 mb-1">
          Proficiencies
        </h1>
        <h2 className="text-lg font-semibold">Armor</h2>
        <p className="text-base">
          {armorProf
            ? armorProf.map((item: string) => item).join(", ")
            : "None"}
        </p>
        <h2 className="text-lg font-semibold">Weapons </h2>
        <p className="text-base">
          {weaponProf
            ? weaponProf.map((item: string) => item).join(", ")
            : "None"}
        </p>
        <h2 className="text-lg font-semibold">Tools </h2>
        <p className="text-base">
          {toolProf ? toolProf.map((item: string) => item).join(", ") : "None"}
        </p>
        <h2 className="text-lg font-semibold">Languages </h2>
        <p className="text-base">
          {languages
            ? languages.map((item: string) => item).join(", ")
            : "None"}
        </p>
      </div>
    </>
  );
};
export default ProficienciesAndSenses;
