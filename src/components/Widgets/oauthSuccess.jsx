import React, { useEffect } from "react";
import { Nav } from "./nav";
import { useAuth } from "../Context/authhandler";

export function OAuthSuccess() {
  const { login } = useAuth();

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    if (cookies.id) {
      console.log(cookies.id);
      const userData = {
        id: cookies.id,
        email: cookies.email,
        name: cookies.name,
        username: cookies.username,
        picture: cookies.picture,
      };

      login(userData);
      setTimeout(() => {
        window.location.href = "/";
      }, 50);
    }
  }, []);

  return (
    <>
      <Nav />
      <div className="flex flex-col space-y-4 justify-center text-center bg-gray-800 h-screen text-white">
        <div className="text-5xl font-bold">Logging you in...</div>
        <div className="text-3xl font-light">Please wait..</div>
      </div>
    </>
  );
}
