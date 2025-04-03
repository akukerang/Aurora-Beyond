import { useNote } from "../../hooks/NotesContext";
const Notes = () => {
  const { note, setNote } = useNote();
  return (
    <div className="h-screen w-full">
      <textarea
        className="w-full h-[85%] p-2 bg-gray-800 text-white border border-gray-600 rounded"
        placeholder="Write your notes here..."
        onChange={(e) => setNote(e.target.value)}
        value={note}
      ></textarea>
    </div>
  );
};
export default Notes;
