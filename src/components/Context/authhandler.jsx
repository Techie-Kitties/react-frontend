import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("userData");

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (!user) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem("userData");
        }
      } else if (!user && document.cookie) {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
          const [key, value] = cookie.split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

        if (cookies.id) {
          const userData = {
            id: cookies.id,
            email: cookies.email,
            name: cookies.name,
            username: cookies.username,
            picture: cookies.picture,
          };

          setUser(userData);
          setIsLoggedIn(true);
        }
      }

      setAuthChecked(true);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user || user.role !== undefined) return;

      try {
        const response = await axios.get("http://localhost:8080/identity", {
          withCredentials: true,
        });

        const { role } = response.data;

        const updatedUser = { ...user, role };

        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Failed to fetch role from /identity", err);
      }
    };

    fetchRole();
  }, [user]);

  const login = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUser(data);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userData");
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; Max-Age=0; path=/; domain=localhost;`;
      });
      setUser(null);
      setIsLoggedIn(false);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
