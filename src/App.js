<<<<<<< HEAD
import { Nav } from "./components/Widgets/nav";
import { Login } from "./components/Pages/login";
import { Example } from "./components/ReactStarter/example";
=======
import { createRoot } from "react-dom/client";

>>>>>>> b3f9d7bdf228a9bb793e40c23d16214fa8eaa2d3
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Tour } from "./components/ThreeJS/tour";

import React from "react";
import { Nav } from "./components/Widgets/nav";
import { Login } from "./components/Pages/login";
import { Example } from "./components/ReactStarter/example";
import { Home } from "./components/Pages/home";
import { About } from "./components/Pages/about";
import { Eulogy } from "./components/Pages/eulogy";
import { NotFound } from "./components/Pages/notfound";
<<<<<<< HEAD
import { OAuthSuccess } from "./components/Widgets/oauthSuccess";
=======
import { Packages } from "./components/Pages/packages";
//import { Tour } from "./components/ThreeJS/tour";

>>>>>>> b3f9d7bdf228a9bb793e40c23d16214fa8eaa2d3
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/eulogy" element={<Eulogy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<OAuthSuccess />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/packages" element={<Packages />} />
      </Routes>
    </BrowserRouter>
  );
}
