import { Menu as MenuIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // if click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target &&
        !(event.target as Element).closest(".menu-container")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className="fixed bg-red-700 p-3 rounded-full top-4 right-8 lg:hidden hover:bg-red-500 cursor-pointer z-50 shadow-xl menu-container"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MenuIcon fontSize="large" />
      </div>
      <MenuNavBar menuOpen={menuOpen} />
    </>
  );
};

interface MenuNavBarProps {
  menuOpen: boolean;
}

const MenuNavBar = ({ menuOpen }: MenuNavBarProps) => {
  return (
    <div
      className={`fixed lg:hidden flex flex-col bg-gray-900 px-12 py-4 z-[100]
      top-0 right-0 w-1/4 h-full shadow-xl gap-4 text-white transform 
      ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <h1 className="text-2xl">Menu</h1>
      <Link to="/">Stats</Link>
      <Link to="/features">Actions</Link>
      <Link to="/magic">Magic</Link>
      <Link to="/items">Inventory</Link>
      <Link to="/notes">Notes</Link>
    </div>
  );
};

export default FloatingMenu;
