import { useCharacter } from "../../hooks/CharacterContext";
const Conditions = () => {
  const { character } = useCharacter();

  return (
    <>
      {" "}
      <h1 className="text-lg">Conditions</h1>
      {character && character.Conditions ? (
        <div className="mb-2 text-gray-300">
          {character.Conditions.join(", ")}
        </div>
      ) : (
        <p className="text-gray-300 italic mb-2">No Conditions found.</p>
      )}
    </>
  );
};
export default Conditions;
