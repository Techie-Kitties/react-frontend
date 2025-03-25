import { useState, useEffect } from "react";
import { Nav } from "../Widgets/nav";

export function Admin() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
  };

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
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleRemovePackage = async (packageId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/removepackage/${packageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete package");
      }

      const updatedResponse = await fetch("http://localhost:8080/api/packages");
      const updatedData = await updatedResponse.json();
      setPackages(updatedData);
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const AddModal = ({ isOpen, onClose }) => {
    const [localFormData, setLocalFormData] = useState({
      name: "",
      description: "",
      price: "",
      body_preparation: "",
      funeral_transport: "",
      family_transport: "",
      floral_wreath: "",
      memorial_program: "",
      prayer_room: false,
      professional_officiant: false,
      social_media_announcement: false,
      multimedia_slideshow: false,
      grave_marker: false,
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setLocalFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8080/api/addpackage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localFormData),
        });

        if (!response.ok) {
          throw new Error("Failed to create package");
        }

        setLocalFormData({
          name: "",
          description: "",
          price: "",
          body_preparation: "",
          funeral_transport: "",
          family_transport: "",
          floral_wreath: "",
          memorial_program: "",
          prayer_room: false,
          professional_officiant: false,
          social_media_announcement: false,
          multimedia_slideshow: false,
          grave_marker: false,
        });
        onClose();
      } catch (error) {
        console.error("Error creating package:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
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

          <form onSubmit={handleSubmit}>
            <div className="font-bold mb-4 text-[#2F4754] text-center sm:text-left">
              <div className="">Package Name</div>
              <input
                type="text"
                name="name"
                value={localFormData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="font-bold text-[#2F4754] text-center sm:text-left">
              Package Description
            </div>
            <textarea
              name="description"
              value={localFormData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-6"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="text-lg sm:text-xl font-semibold mb-4 text-[#2F4754]">
                  Main Services
                </div>
                <div className="space-y-2">
                  <label className="flex justify-between">
                    <div className="font-medium">Body Preparation:</div>
                    <input
                      type="text"
                      name="body_preparation"
                      value={localFormData.body_preparation}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Funeral Transport:</div>
                    <input
                      type="text"
                      name="funeral_transport"
                      value={localFormData.funeral_transport}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Family Transport:</div>
                    <input
                      type="text"
                      name="family_transport"
                      value={localFormData.family_transport}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Floral Wreath:</div>
                    <input
                      type="text"
                      name="floral_wreath"
                      value={localFormData.floral_wreath}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Memorial Programs:</div>
                    <input
                      type="number"
                      name="memorial_program"
                      value={localFormData.memorial_program}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  </label>
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-semibold mb-4 text-[#2F4754]">
                  Additional Services
                </div>
                <div className="space-y-2">
                  <label className="flex justify-between">
                    <div className="font-medium">Prayer Room:</div>
                    <input
                      type="checkbox"
                      name="prayer_room"
                      checked={localFormData.prayer_room}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Professional Officiant:</div>
                    <input
                      type="checkbox"
                      name="professional_officiant"
                      checked={localFormData.professional_officiant}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">
                      Social Media Announcement:
                    </div>
                    <input
                      type="checkbox"
                      name="social_media_announcement"
                      checked={localFormData.social_media_announcement}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Multimedia Slideshow:</div>
                    <input
                      type="checkbox"
                      name="multimedia_slideshow"
                      checked={localFormData.multimedia_slideshow}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="flex justify-between">
                    <div className="font-medium">Grave Marker:</div>
                    <input
                      type="checkbox"
                      name="grave_marker"
                      checked={localFormData.grave_marker}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="flex justify-between font-bold mt-2 text-center sm:text-left">
                  Price
                  <div className="">
                    $
                    <input
                      type="number"
                      name="price"
                      value={localFormData.price}
                      onChange={handleChange}
                      className="w-24 border rounded text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 transition-colors"
            >
              Save Package
            </button>
          </form>
        </div>
      </div>
    );
  };

  const RemoveModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
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

          <div className="text-2xl font-bold mb-6 text-[#2F4754]">
            Remove Packages
          </div>

          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xl font-semibold text-[#2F4754]">
                      {pkg.name}
                    </div>
                    <div className="text-gray-600 mt-1">{pkg.description}</div>
                    <div className="text-lg font-bold text-orange-500 mt-2">
                      ${pkg.price}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePackage(pkg.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold text-[#2F4754]">
                      Main Services
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Body Preparation: {pkg.body_preparation}</div>
                      <div>Funeral Transport: {pkg.funeral_transport}</div>
                      <div>Family Transport: {pkg.family_transport}</div>
                      <div>Floral Wreath: {pkg.floral_wreath}</div>
                      <div>Memorial Programs: {pkg.memorial_program}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#2F4754]">
                      Additional Services
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Prayer Room: {pkg.prayer_room ? "Yes" : "No"}</div>
                      <div>
                        Professional Officiant:{" "}
                        {pkg.professional_officiant ? "Yes" : "No"}
                      </div>
                      <div>
                        Social Media Announcement:{" "}
                        {pkg.social_media_announcement ? "Yes" : "No"}
                      </div>
                      <div>
                        Multimedia Slideshow:{" "}
                        {pkg.multimedia_slideshow ? "Yes" : "No"}
                      </div>
                      <div>Grave Marker: {pkg.grave_marker ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />
      <div className="bg-black h-screen flex flex-col">
        <div className="text-white pt-64 font-bold lg:text-left lg:pl-48 text-center lg:text-3xl text-lg">
          Manage Service Packages
        </div>

        <div className="text-white pt-16 border-b-[#CCCCCC] border-b pb-16 text-left font-bold lg:text-3xl text-md flex flex-row justify-evenly w-full">
          <div
            className="flex bg-[#212D33E5] xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setAddModalOpen(true)}
          >
            Add Package
          </div>
          <div className="flex bg-[#212D33E5] xl:p-16 p-2 rounded-2xl">
            Update/Edit
          </div>
          <div
            className="flex bg-[#212D33E5] xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setRemoveModalOpen(true)}
          >
            Remove
          </div>
        </div>

        <div className="text-white pt-16 pb-16 text-left font-bold lg:text-3xl text-md flex flex-row justify-evenly w-full">
          <div className="flex bg-[#212D33E5] text-white xl:p-16 p-2 rounded-2xl justify-center">
            Manage Plots
          </div>
          <div className="flex bg-[#212D33E5] text-white xl:p-16 p-2 rounded-2xl justify-between">
            Manage Virtual Tour
          </div>
        </div>
      </div>
      <AddModal isOpen={addModalOpen} onClose={closeAddModal} />
      <RemoveModal isOpen={removeModalOpen} onClose={closeRemoveModal} />
    </>
  );
}
