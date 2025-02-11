import { createRoot } from "react-dom/client";
import { Tour } from "./components/ThreeJS/tour";
import { Nav } from "./components/Widgets/nav";
import { Login } from "./components/Pages/login";
import { Example } from "./components/ReactStarter/example";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
export default function App() {
  return (
    <Example></Example>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/tour" element={<Tour />} />
    //     <Route path="/login" element={<Login />} />
    //   </Routes>
    // </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
