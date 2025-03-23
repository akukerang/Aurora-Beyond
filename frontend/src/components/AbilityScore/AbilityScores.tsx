import AbilityScoreBox from "./AbilityScoreBox";


const AbilityScores = () => {
    return (
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-2 w-full bg-gray-800 p-2">
            <AbilityScoreBox name="STR" score={20} />
            <AbilityScoreBox name="DEX" score={20} />
            <AbilityScoreBox name="CON" score={20} />
            <AbilityScoreBox name="INT" score={20} />  
            <AbilityScoreBox name="WIS" score={20} />
            <AbilityScoreBox name="CHA" score={20} />
        </div>
    );
  };
  
  export default AbilityScores;
  
