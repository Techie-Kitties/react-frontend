import { useState } from "react";

export function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="h-1/3 md:h-full md:w-2/3 flex-grow bg-cover bg-center"
        style={{ backgroundImage: "url('/login.png')" }}
      ></div>
      <div className="relative flex-grow flex justify-center items-center md:w-1/3 p-4">
        <div className="relative w-full max-w-sm h-[60vh] md:h-auto">
          <div
            className={`relative w-full h-full transition-transform duration-500 transform ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute w-full h-full p-4 shadow-lg  flex flex-col justify-center space-y-4"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-xl font-semibold text-center">Register</div>
              <input
                type="text"
                placeholder="Username"
                className="w-full border-b  py-2 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b  py-2 focus:outline-none"
              />
              <button className="w-full p-2 bg-black text-white rounded-lg">
                Register
              </button>

              <div className="text-sm text-center">
                Already registered?
                <button
                  onClick={() => setIsFlipped(true)}
                  className="text-blue-600 underline"
                >
                  Login here.
                </button>
              </div>
            </div>
            <div
              className="absolute w-full h-full p-4 bg-white shadow-lg rounded-lg flex flex-col justify-center space-y-4"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-xl font-semibold text-center">Login</div>
              <input
                type="text"
                placeholder="Username"
                className="w-full border-b border-gray-300 py-2 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b border-gray-300 py-2 focus:outline-none"
              />
              <button className="w-full p-2 bg-black text-white rounded-lg">
                Login
              </button>

              <div className="text-sm text-center">
                Don't have an account?
                <button
                  onClick={() => setIsFlipped(false)}
                  className="text-blue-600 underline"
                >
                  Register here.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
