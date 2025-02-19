import { useState } from "react";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav absolute top-0 left-0 w-full z-50 text-white">
      <div className="bg-transparent  p-6 flex justify-between items-center">
        <a
          href="/home"
          className="text-2xl md:text-3xl flex flex-row text-center font-bold"
        >
          <img src="/logo.png" className="w-[64px]" />
          <div className="my-auto pl-8">Eternal Echoes</div>
        </a>
        <div className="hidden md:flex md:space-x-16 text-lg font-semibold">
          <a href="/home" className="hover:text-gray-300">
            Home
          </a>
          <a href="/about" className="hover:text-gray-300">
            About
          </a>
          <a href="/contact" className="hover:text-gray-300">
            Contact
          </a>
          <a href="/login" className="hover:text-gray-300">
            Login
          </a>
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
          }
        `}
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
          <a href="/login" className="hover:text-gray-300">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
