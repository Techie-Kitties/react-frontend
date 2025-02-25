import React, { useEffect, useState } from "react";

export function OAuthSuccess() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/fetchUser", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setData((prev) => data);
        localStorage.setItem("userData", JSON.stringify(data));
        window.location.href = "/";
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return <div>Callback Page</div>;
}
