import { FC } from "react";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  placeholder?: string; // Optional placeholder text for the search input
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
};
const SearchBar: FC<Props> = ({ placeholder, onChange }) => {
  return (
    <div className="m-4 relative">
      <SearchIcon className="absolute left-2 top-2 text-gray-500" />
      <input
        type="search"
        className="w-[70%] pl-10 p-2 rounded-lg text-black"
        placeholder={placeholder}
        onChange={onChange} // Update search query
      ></input>
    </div>
  );
};
export default SearchBar;
