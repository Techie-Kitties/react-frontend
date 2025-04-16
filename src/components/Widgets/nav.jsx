import { useEffect, useState } from "react";
import { useAuth } from "../Context/authhandler";
export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    console.log(user);
    logout();
    setDropdownOpen(false);
  };

  return (
    <div className="nav absolute top-0 left-0 w-full z-50 text-white">
      <div className="bg-transparent p-6 flex justify-between items-center">
        <a
          href="/"
          className="text-2xl md:text-3xl flex flex-row text-center font-bold"
        >
          <img src="/logo.png" className="w-[64px]" alt="Logo" />
          <div className="my-auto pl-8">Eternal Echoes</div>
        </a>

        <div className="hidden md:flex md:space-x-16 text-lg font-semibold">
          <a href="/" className="hover:text-gray-300">
            Home
          </a>
          <a href="/about" className="hover:text-gray-300">
            About
          </a>
          <a href="/contact" className="hover:text-gray-300">
            Contact
          </a>

          {user?.role == 1 ||
            (user?.role == 0 && (
              <a href="/admin" className="hover:text-gray-300">
                Admin
              </a>
            ))}

          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    referrerPolicy="no-referrer"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-400 rounded-full" />
                )}
                <span>{user?.name || user?.username || "User"}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2F4754] text-white rounded-md shadow-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hover:text-gray-300">
              Login
            </a>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`absolute top-[64px] left-0 w-full bg-[#2F4754] text-lg font-semibold 
          transform transition-all duration-300 ease-in-out origin-top 
          ${
            isOpen
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col space-y-4 p-6">
          <a
            href="/"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>

          {user?.role == 1 ||
            (user?.role == 3 && (
              <a
                href="/admin"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </a>
            ))}

          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    referrerPolicy="no-referrer"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-400 rounded-full" />
                )}
                <span>{user?.name || user?.username || "User"}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2F4754] text-white rounded-md shadow-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
