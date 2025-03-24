import AbilityScoreBox from "./AbilityScoreBox";

const AbilityScores = () => {
  return (
    <>
      <h1 className="text-lg mb-2">Ability Scores</h1>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 w-full bg-gray-800">
        <AbilityScoreBox name="STR" score={20} />
        <AbilityScoreBox name="DEX" score={20} />
        <AbilityScoreBox name="CON" score={20} />
        <AbilityScoreBox name="INT" score={20} />
        <AbilityScoreBox name="WIS" score={20} />
        <AbilityScoreBox name="CHA" score={20} />
      </div>
    </>
  );
};

export default AbilityScores;
