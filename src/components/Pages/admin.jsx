import { useState, useEffect, useRef } from "react";
import { Nav } from "../Widgets/nav";
import { useAuth } from "../Context/authhandler";
import axios from "axios";

export function Admin() {
  const [packages, setPackages] = useState([]);
  const { isLoggedIn, authChecked } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [addImageModalOpen, setAddImageModalOpen] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [removePanoramaModalOpen, setRemovePanoramaModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [panoramas, setPanoramas] = useState([]);
  const [customPrices, setCustomPrices] = useState({
    base_price: 0,
    cemetery_plot_price: 0,
    grave_marker_price: 0,
    body_preparation_price: 0,
    funeral_transport_price: 0,
    family_transport_price: 0,
    safekeeping_price_per_day: 0,
    prayer_room_price: 0,
    memorial_program_price_per_copy: 0,
    custom_programs_price: 0,
    social_media_announcement_price: 0,
    multimedia_slideshow_price: 0,
    floral_wreath_price: 0,
    custom_floral_sprays_price: 0,
    additional_flower_arrangements_price: 0,
    professional_officiant_price: 0,
    casket_price: 0,
    permanent_casket_price: 0,
  });

  useEffect(() => {
    if (!isLoggedIn && authChecked) {
      window.location.href = "/login";
    }
  }, [isLoggedIn, authChecked]);

  const closeAddImageModal = () => {
    setAddImageModalOpen(false);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
  };

  const closePriceModal = () => {
    setPriceModalOpen(false);
  };

  const closeRemovePanoramaModal = () => {
    setRemovePanoramaModalOpen(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedPackage(null);
  };

  useEffect(() => {
    const verifyIdentity = async () => {
      try {
        const response = await axios.get("http://localhost:8080/identity", {
          withCredentials: true,
        });
        const data = response.data;
        console.log(data);

        if (!data || data.role >= 2) {
          console.error("user not admin, redirecting.");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Verification failed:", error);
        window.location.href = "/";
      }
    };

    verifyIdentity();
  }, []);

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

  const fetchCustomPrices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/getCustomPrices");
      if (!response.ok) {
        throw new Error("Failed to fetch custom prices");
      }
      const data = await response.json();
      setCustomPrices(data.package);
    } catch (error) {
      console.error("Error fetching custom prices:", error);
    }
  };

  useEffect(() => {
    const fetchPanoramas = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getImages");
        if (!response.ok) {
          throw new Error("Failed to fetch panoramas");
        }
        const data = await response.json();
        setPanoramas(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching panoramas:", error);
      }
    };

    fetchPackages();
    fetchCustomPrices();
    fetchPanoramas();
  }, []);

  const handleRemovePackage = async (packageId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/removepackage/${packageId}`,
        {
          method: "DELETE",
          credentials: "include",
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

  const handleRemovePanorama = async (imageUrl) => {
    try {
      const filename = imageUrl.split("/").pop();
      const response = await fetch(
        `http://localhost:8080/api/removeImage/${filename}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete panorama");
      }

      setPanoramas(panoramas.filter((panorama) => panorama !== imageUrl));
    } catch (error) {
      console.error("Error deleting panorama:", error);
      alert("Failed to delete panorama. Please try again.");
    }
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setEditModalOpen(true);
  };

  const EditModal = ({ isOpen, onClose }) => {
    const [selectedPackageId, setSelectedPackageId] = useState("");
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

    useEffect(() => {
      if (selectedPackageId) {
        const pkg = packages.find((p) => p.id === selectedPackageId);
        if (pkg) {
          setLocalFormData({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            body_preparation: pkg.body_preparation,
            funeral_transport: pkg.funeral_transport,
            family_transport: pkg.family_transport,
            floral_wreath: pkg.floral_wreath,
            memorial_program: pkg.memorial_program,
            prayer_room: pkg.prayer_room,
            professional_officiant: pkg.professional_officiant,
            social_media_announcement: pkg.social_media_announcement,
            multimedia_slideshow: pkg.multimedia_slideshow,
            grave_marker: pkg.grave_marker,
          });
        }
      }
    }, [selectedPackageId, packages]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setLocalFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handlePackageSelect = (e) => {
      setSelectedPackageId(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedPackageId) return;

      try {
        const response = await fetch("http://localhost:8080/api/package/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...localFormData,
            id: selectedPackageId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update package");
        }

        const updatedResponse = await fetch(
          "http://localhost:8080/api/packages"
        );
        const updatedData = await updatedResponse.json();
        setPackages(updatedData);
        setSelectedPackageId("");
        onClose();
      } catch (error) {
        console.error("Error updating package:", error);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-[#161E22] bg-opacity-50 z-50 flex justify-center items-center p-4">
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
              <div className="">Select Package to Edit</div>
              <select
                value={selectedPackageId}
                onChange={handlePackageSelect}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Select a Package --</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} (${pkg.price})
                  </option>
                ))}
              </select>
            </div>

            {selectedPackageId && (
              <>
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
                        <div className="font-medium">
                          Professional Officiant:
                        </div>
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
                  className="mt-6 w-full bg-orange-500 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors"
                >
                  Update Package
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    );
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
          credentials: "include",
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
      <div className="fixed inset-0 bg-[#161E22] bg-opacity-50 z-50 flex justify-center items-center p-4">
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
              className="mt-6 w-full bg-orange-500 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors"
            >
              Save Package
            </button>
          </form>
        </div>
      </div>
    );
  };
  const AddImageModal = ({ isOpen, onClose }) => {
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.target.classList.add("border-dashed", "border-4", "border-blue-500");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.target.classList.remove("border-dashed", "border-4", "border-blue-500");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.target.classList.remove("border-dashed", "border-4", "border-blue-500");

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    };

    const handleFileInput = (e) => {
      const files = Array.from(e.target.files);
      handleFiles(files);
    };

    const handleFiles = (files) => {
      const validImages = files.filter((file) =>
        file.type.startsWith("image/")
      );

      const imagePreviews = validImages.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setImages((prevImages) => [...prevImages, ...imagePreviews]);
    };

    const removeImage = (index) => {
      const newImages = [...images];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      setImages(newImages);
    };

    const handleImageSubmit = async () => {
      try {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("panorama", image);
        });

        const response = await fetch("http://localhost:8080/api/addImage", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload images");
        }

        console.log("Images uploaded successfully!");

        images.forEach((image) => URL.revokeObjectURL(image.preview));
        setImages([]);
        onClose();
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    };

    useEffect(() => {
      return () => {
        images.forEach((image) => URL.revokeObjectURL(image.preview));
      };
    }, [images]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-[#161E22] bg-opacity-50 z-50 flex justify-center items-center p-4">
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

          <h2 className="text-2xl font-bold mb-6 text-[#2F4754]">Add Images</h2>

          <div
            className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-gray-400 bg-gray-100 mb-4 rounded-lg"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-gray-600 mb-2">Drag and drop images here</div>
            <div className="text-gray-600 mb-4">or</div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Select Images
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept="image/*"
              multiple
            />
          </div>

          <div className="mt-4">
            {images.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    Selected Images ({images.length})
                  </h3>
                  <button
                    onClick={() => {
                      images.forEach((image) =>
                        URL.revokeObjectURL(image.preview)
                      );
                      setImages([]);
                    }}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <div className="text-xs truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No images selected
              </div>
            )}
          </div>

          <button
            onClick={handleImageSubmit}
            disabled={images.length === 0}
            className={`mt-6 w-full text-white p-3 rounded-2xl transition-colors ${
              images.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {images.length === 0
              ? "Upload Images"
              : `Upload ${images.length} Image${
                  images.length !== 1 ? "s" : ""
                }`}
          </button>
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

  const PriceModal = ({ isOpen, onClose }) => {
    const [localPrices, setLocalPrices] = useState(customPrices);

    useEffect(() => {
      setLocalPrices(customPrices);
    }, [customPrices]);

    const handlePriceChange = (e) => {
      const { name, value } = e.target;
      setLocalPrices((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          "http://localhost:8080/api/setCustomPrices",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(localPrices),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update prices");
        }

        const data = await response.json();
        setCustomPrices(data.package);
        onClose();
      } catch (error) {
        console.error("Error updating prices:", error);
        alert("Failed to update prices. Please try again.");
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-[#161E22] bg-opacity-50 z-50 flex justify-center items-center p-4">
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

          <h2 className="text-2xl font-bold mb-6 text-[#2F4754]">
            Update Custom Prices
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(localPrices).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <label className="w-48 font-medium text-gray-700">
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    :
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handlePriceChange}
                    className="border p-2 rounded w-24"
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-orange-500 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors"
            >
              Update Prices
            </button>
          </form>
        </div>
      </div>
    );
  };

  const RemovePanoramaModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-[#161E22] bg-opacity-50 z-50 flex justify-center items-center p-4">
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
            Remove Panoramas
          </div>

          {panoramas.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No panoramas found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {panoramas.map((panorama, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={"http://localhost:8080" + panorama}
                    alt={`Panorama ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 truncate">
                      {panorama.split("/").pop()}
                    </div>
                    <button
                      onClick={() => handleRemovePanorama(panorama)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />
      <div className="bg-gray-800 h-screen flex flex-col">
        <div className="text-white pt-32 font-bold lg:text-left mx-auto text-center lg:text-3xl text-lg">
          Manage Service Packages
        </div>

        <div className="text-white pt-16 border-b-[#CCCCCC] border-b pb-16 text-left font-bold lg:text-3xl text-md flex flex-row justify-evenly w-full">
          <div
            className="flex bg-[#161E22] text-white xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setPriceModalOpen(true)}
          >
            Update Custom Prices
          </div>
          <div
            className="flex bg-[#161E22] xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setAddModalOpen(true)}
          >
            Add Package
          </div>
          <div
            className="flex bg-[#161E22] xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setEditModalOpen(true)}
          >
            Update/Edit
          </div>
          <div
            className="flex bg-[#161E22] xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors"
            onClick={() => setRemoveModalOpen(true)}
          >
            Remove Package
          </div>
        </div>
        <div className="text-white mx-auto font-bold lg:text-left pt-2 text-center lg:text-3xl text-lg">
          Manage Tour
        </div>
        <div className="text-white pt-16 pb-16 text-left font-bold lg:text-3xl text-md flex flex-row justify-evenly w-full">
          <div className="flex bg-[#161E22] text-white xl:p-16 p-2 rounded-2xl justify-center">
            Manage Plots
          </div>
          <a href="/tour">
            <div className="flex bg-[#161E22] text-white xl:p-16 p-2 rounded-2xl hover:bg-[#2F4754] transition-colors justify-between">
              Manage Virtual Tour
            </div>
          </a>
          <div
            className="flex bg-[#161E22] text-white xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors justify-between"
            onClick={() => setAddImageModalOpen(true)}
          >
            Add Panoramas
          </div>
          <div
            className="flex bg-[#161E22] text-white xl:p-16 p-2 rounded-2xl cursor-pointer hover:bg-[#2F4754] transition-colors justify-between"
            onClick={() => setRemovePanoramaModalOpen(true)}
          >
            Remove Panoramas
          </div>
        </div>
      </div>

      <AddModal isOpen={addModalOpen} onClose={closeAddModal} />
      <EditModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        packageToEdit={selectedPackage}
      />
      <RemoveModal isOpen={removeModalOpen} onClose={closeRemoveModal} />
      <AddImageModal isOpen={addImageModalOpen} onClose={closeAddImageModal} />
      <PriceModal isOpen={priceModalOpen} onClose={closePriceModal} />
      <RemovePanoramaModal
        isOpen={removePanoramaModalOpen}
        onClose={closeRemovePanoramaModal}
      />
    </>
  );
}
