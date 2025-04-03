import Notes from "../components/Notes/Notes";
export default function NotePage() {
  return (
    <div className="text-white p-6 h-full">
      <h1 className="text-3xl border-b border-white pb-1 mb-2">Notes</h1>
      <Notes />
    </div>
  );
}
