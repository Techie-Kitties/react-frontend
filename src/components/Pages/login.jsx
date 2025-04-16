import { useState } from "react";

export function Login() {
  const [isFlipped, setIsFlipped] = useState(true);
  const local = localStorage.getItem("accounts.google.com");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  console.log(local);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const payload = {
      username: username,
      password: password,
    };

    fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then((errorData) => {
          throw new Error(errorData.msg || "Login failed");
        });
      })
      .then((data) => {
        console.log("Login response:", data);
        window.location.href = "http://localhost:3000/auth";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Login failed: " + error.message);
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const payload = {
      username: username,
      password: password,
    };

    fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          setIsSuccess(true);
          return res.json();
        }
        setIsSuccess(false);
        throw new Error("Registration failed");
      })
      .then((data) => {
        setMessage("Registration Successful");
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("User Already Exists");
      });
  };

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
              className="absolute w-full h-full p-4 flex flex-col justify-center space-y-4"
              style={{ backfaceVisibility: "hidden" }}
            >
              {message && (
                <div
                  className={`${
                    isSuccess
                      ? "bg-green-200 text-green-800 border-green-400"
                      : "bg-red-200 text-red-800 border-red-400"
                  } p-4 rounded-lg`}
                >
                  {message}
                </div>
              )}
              <div className="text-xl font-semibold text-center">Register</div>
              <form onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border-b bg-transparent py-2 focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b bg-transparent py-2 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full p-2 mt-4 bg-black text-white rounded-lg"
                >
                  Register
                </button>
              </form>
              <a
                href="http://localhost:8080/login_google"
                className="w-full p-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-2"
              >
                <img className="w-8 h-8" src="/google.svg" />
                <span>Login with Google</span>
              </a>
              <div className="text-sm text-center">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setIsFlipped((prev) => !prev);
                  }}
                  className="text-blue-600 underline"
                >
                  Login here.
                </button>
              </div>
            </div>

            <div
              className="absolute w-full h-full p-4 rounded-lg flex flex-col justify-center space-y-4"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {message && (
                <div
                  className={`${
                    isSuccess
                      ? "bg-green-200 text-green-800 border-green-400"
                      : "bg-red-200 text-red-800 border-red-400"
                  } p-4 rounded-lg`}
                >
                  {message}
                </div>
              )}
              <div className="text-xl font-semibold text-center">Login</div>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border-b py-2 focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b py-2 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full p-2 mt-4 bg-black text-white rounded-lg"
                >
                  Login
                </button>
              </form>
              <a
                href="http://localhost:8080/login_google"
                className="w-full p-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-2"
              >
                <img className="w-8 h-8" src="/google.svg" />
                <span>Login with Google</span>
              </a>
              <div className="text-sm text-center">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setIsFlipped((prev) => !prev);
                  }}
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
