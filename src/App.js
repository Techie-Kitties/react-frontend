import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Nav } from "./components/Widgets/nav";
import { Login } from "./components/Pages/login";
import { Example } from "./components/ReactStarter/example";
import { Home } from "./components/Pages/home";
import { About } from "./components/Pages/about";
import { Eulogy } from "./components/Pages/eulogy";
import { NotFound } from "./components/Pages/notfound";
import { OAuthSuccess } from "./components/Widgets/oauthSuccess";
import { Packages } from "./components/Pages/packages";
import { PackageDetails } from "./components/Pages/package-details";
import { Admin } from "./components/Pages/admin";
import { Tour } from "./components/ThreeJS/tour";
import { Contact } from "./components/Pages/contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/eulogy" element={<Eulogy />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package-details" element={<PackageDetails />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/" element={<Tour />} />
        <Route path="/auth" element={<OAuthSuccess />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
