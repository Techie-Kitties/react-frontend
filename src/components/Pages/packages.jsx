import { useEffect, useState } from "react";
import { Footer } from "../Widgets/footer";
import { Nav } from "../Widgets/nav";
import { PackageDetails } from "./package-details";
import { useAuth } from "../Context/authhandler";


export function Packages() {
  const { isLoggedIn } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/packages");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchPackages();
  }, []);


  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };


  const handlePurchase = () => {
    if (isLoggedIn) {
      alert("Package successfully purchased"); // mock purchase
      closeModal();
      return;
    }
    window.location.href = "/login";
  };


  const Modal = ({ isOpen, onClose, package: pkg }) => {
    if (!isOpen || !pkg) return null;


    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-800 to-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>


          <div className="text-2xl sm:text-3xl font-bold mb-4 text-[#2F4754] text-center sm:text-left">
            {pkg.name}
          </div>
          <div className="text-gray-600 mb-6 text-center sm:text-left">
            {pkg.description}
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-lg sm:text-xl font-semibold mb-4 text-[#2F4754] text-center sm:text-left">
                Main Services
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="font-medium">Body Preparation:</div>
                  <div className="pl-4">{pkg.body_preparation}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Funeral Transport:</div>
                  <div className="pl-4">{pkg.funeral_transport}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Family Transport:</div>
                  <div className="pl-4">{pkg.family_transport}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Floral Wreath:</div>
                  <div className="pl-4">{pkg.floral_wreath}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Memorial Programs:</div>
                  <div className="pl-4">{pkg.memorial_program}</div>
                </div>
              </div>
            </div>


            <div>
              <div className="text-lg sm:text-xl font-semibold mb-4 text-[#2F4754] text-center sm:text-left">
                Additional Services
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="font-medium">Prayer Room:</div>
                  <div className="pl-4">
                    {pkg.prayer_room ? "Included" : "Not Included"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Professional Officiant:</div>
                  <div className="pl-4">
                    {pkg.professional_officiant ? "Included" : "Not Included"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Social Media Announcement:</div>
                  <div className="pl-4">
                    {pkg.social_media_announcement
                      ? "Included"
                      : "Not Included"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Multimedia Slideshow:</div>
                  <div className="pl-4">
                    {pkg.multimedia_slideshow ? "Included" : "Not Included"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Grave Marker:</div>
                  <div className="pl-4">
                    {pkg.grave_marker ? "Included" : "Not Included"}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="text-3xl sm:text-4xl flex justify-between font-bold text-[#DD6E42] mt-6 sm:mt-8 text-center sm:text-left">
            ${pkg.price.toLocaleString()}
            <button
              className="bg-[#DD6E42] text-black rounded-xl text-xl p-3"
              onClick={handlePurchase}
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen z-10 relative flex flex-col">
      <Nav />
      <div className="flex flex-col sm:flex-row bg-[#2F4754] max-w-screen overflow-x-hidden">
        <div className="hero z-10 sm:h-80 bg-[#2F4754] flex pl-8 sm:pl-32 pt-16 sm:pt-32 md:text-5xl text-white font-bold">
          <div className="text-right sm:text-left text-lg sm:text-xl md:text-xl ml-85 max-w-3xl px-8 pt-8">
            "Honoring Legacies with Thoughtful Memorial Packages" Find the
            perfect memorial package to cherish and celebrate your loved one's
            legacy with care and dignity."
          </div>
          <img
            src="/casket.png"
            style={{
              position: "absolute",
              left: 0,
              top: "70px",
              width: "35%",
            }}
            alt="Casket"
          />
        </div>
      </div>
      <div className="bg-[#161E22] md:flex space-y-12 flex-1 md:space-y-10 z-20 justify-evenly md:max-h-[500px] text-white px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">LOADING</div>
        ) : (
          packages.map((pkg, index) => (
            <div
              key={index}
              className="flex mt-4 flex-col shadow-xl shadow-black rounded-xl w-full h-full sm:w-[20vw]"
            >
              <img
                className="brightness-80 rounded-t-xl pb-12"
                src="/package1.png"
                alt={`Package ${index + 1}`}
              />
              <div className="text-center pb-8">{pkg.name}</div>
              <div className="pb-7 flex justify-center items-center">
                <button
                  onClick={() => openModal(pkg)}
                  className="focus:outline-none flex justify-center items-center"
                >
                  <svg
                    className="mx-auto"
                    width="38"
                    height="37"
                    viewBox="0 0 38 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.5 18.5C37.5 28.4516 29.612 36.5 19.9048 36.5C10.1976 36.5 2.30957 28.4516 2.30957 18.5C2.30957 8.54839 10.1976 0.5 19.9048 0.5C29.612 0.5 37.5 8.54839 37.5 18.5Z"
                      fill="#DD6E42"
                      stroke="#DD6E42"
                    />
                    <g opacity="0.7">
                      <rect
                        x="0.5"
                        y="0.5"
                        width="37"
                        height="35.0263"
                        stroke="black"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M7.91675 18.0132H30.0834M30.0834 18.0132L19.0001 7.50549M30.0834 18.0132L19.0001 28.5208"
                        stroke="#F3F3F3"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-[#161E22] flex-1"></div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        package={selectedPackage}
      />
    </div>
  );
}



