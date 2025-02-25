import { Nav } from "./components/Widgets/nav";
import { Login } from "./components/Pages/login";
import { Example } from "./components/ReactStarter/example";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Tour } from "./components/ThreeJS/tour";

import React from "react";
import { Home } from "./components/Pages/home";
import { About } from "./components/Pages/about";
import { Eulogy } from "./components/Pages/eulogy";
import { NotFound } from "./components/Pages/notfound";
import { OAuthSuccess } from "./components/Widgets/oauthSuccess";
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
      </Routes>
    </BrowserRouter>
  );
}
