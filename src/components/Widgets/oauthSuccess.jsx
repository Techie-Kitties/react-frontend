import React, { useEffect, useState } from "react";

export function OAuthSuccess() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Get cookies from document.cookie
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    // Extract relevant data
    const userData = {
      id: cookies.id,
      email: cookies.email,
      name: cookies.name,
      picture: cookies.picture,
    };

    // Store in localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    setData(userData);

    // Redirect to home
    window.location.href = "/";
  }, []);

  return <div>Callback Page</div>;
}
