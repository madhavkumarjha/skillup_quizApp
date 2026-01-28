import { LogOut, Menu, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState,useEffect, use } from "react";

function Header({ toggleSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const goToProfile = () => {
    setOpen(false);
    navigate(`/${user.role}/user/profile`, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };  
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl">SkillUp</h1>
      </div>

      {/* Right */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="text-gray-700 dark:text-gray-300 capitalize">
            {user?.name}
          </span>
          <User size={18} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border dark:border-gray-700 z-50">
            <button
              onClick={goToProfile}
              className="flex w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User size={16} className="mr-2" /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;