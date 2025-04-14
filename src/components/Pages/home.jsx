import { useEffect } from "react";
import { Nav } from "../Widgets/nav";
import { useAuth } from "../Context/authhandler";


export function Home() {
  const { isLoggedIn } = useAuth();


  const packagesLink = isLoggedIn ? "/packages" : "/login";
  const tourLink = isLoggedIn ? "/tour" : "/login";
  const eulogyLink = isLoggedIn ? "/eulogy" : "/login";


  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex flex-col bg-[#2F4754] relative overflow-hidden">
        <div className="flex flex-col px-4 py-20 md:py-32 z-10">
          <h1 className="text-3xl md:text-5xl pl-8 pt-16 text-white font-bold max-w-md">
            Cherishing your loved ones
          </h1>
        </div>
        <div className="flex justify-end">
          <img
            src="/hero-img.png"
            className="absolute right-0 top-0 md:top-[70px] max-w-[80%] md:max-w-[50%] opacity-70 hidden md:flex md:opacity-100"
          />
        </div>
      </div>
      <div className="flex flex-col bg-[#161E22] z-20 px-4 py-10">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div className="flex flex-col w-full md:w-1/3 max-w-xs shadow-xl shadow-black rounded-xl md:-mt-12 transform transition-transform duration-300 hover:scale-105 mb-8 md:mb-0">
            <img
              className="brightness-80 rounded-t-xl w-full object-cover h-48"
              src="/package1.png"
              alt="Funeral packages"
            />
            <div className="flex flex-col p-4 text-white">
              <div className="text-center pb-3">Funeral packages</div>
              <a href={packagesLink} className="flex justify-center">
                <img className="mx-auto" src="/arrow.svg" alt="View packages" />
              </a>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/3 max-w-xs shadow-xl shadow-black rounded-xl md:-mt-12 transform transition-transform duration-300 hover:scale-105 mb-8 md:mb-0">
            <img
              className="brightness-80 rounded-t-xl w-full object-cover h-48"
              src="/graveyardCard.jpg"
              alt="Virtual Gravesite Tours"
            />
            <div className="flex flex-col p-4 text-white">
              <div className="text-center pb-3">Virtual Gravesite Tours</div>
              <a href={tourLink} className="flex justify-center">
                <img className="mx-auto" src="/arrow.svg" alt="Go to tour" />
              </a>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/3 max-w-xs shadow-xl shadow-black rounded-xl md:-mt-12 transform transition-transform duration-300 hover:scale-105">
            <img
              className="brightness-80 rounded-t-xl w-full object-cover h-48"
              src="/eulogyCard.avif"
              alt="AI Generated Eulogy"
            />
            <div className="flex flex-col p-4 text-white">
              <div className="text-center pb-3">AI Generated Eulogy</div>
              <a href={eulogyLink} className="flex justify-center">
                <img
                  className="mx-auto"
                  src="/arrow.svg"
                  alt="Generate eulogy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#161E22]"></div>
    </div>
  );
}





