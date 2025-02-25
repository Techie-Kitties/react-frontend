import { useEffect, useState } from "react";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData !== null && storedUserData !== "null") {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      console.log(storedUserData);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData({});
    setDropdownOpen(false);
  };

  return (
    <div className="nav absolute top-0 left-0 w-full z-50 text-white">
      <div className="bg-transparent p-6 flex justify-between items-center">
        <a
          href="/"
          className="text-2xl md:text-3xl flex flex-row text-center font-bold"
        >
          <img src="/logo.png" className="w-[64px]" />
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
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userData.picture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span>{userData.given_name}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2F4754] text-white rounded-md shadow-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-left hover:bg-gray-600"
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
          <a href="/home" className="hover:text-gray-300">
            Home
          </a>
          <a href="/about" className="hover:text-gray-300">
            About
          </a>
          <a href="/contact" className="hover:text-gray-300">
            Contact
          </a>
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData.picture ? (
                  <img
                    src={userData.picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-400 rounded-full" /> // Placeholder if no picture
                )}
                <span>{userData.given_name}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2F4754] text-white rounded-md shadow-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-left hover:bg-gray-600"
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
      </div>
    </div>
  );
}
