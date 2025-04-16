import { useState } from "react";
import axios from "axios";
import { Nav } from "../Widgets/nav";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";
import { useAuth } from "../Context/authhandler";

export function Eulogy() {
  const { isLoggedIn, user, logout, authChecked } = useAuth();

  const [eulogy, setEulogy] = useState("");
  const [editedEulogy, setEditedEulogy] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: "",
    death_date: "",
    relationships: "",
    occupation: "",
    personality_traits: "",
    hobbies: "",
    accomplishments: "",
    anecdotes: "",
    tone: "",
  });

  useEffect(() => {
    if (!isLoggedIn && authChecked) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  //found on stackoverflow, edited slightly
  const saveToPDF = () => {
    try {
      const element = document.getElementById("saveable");
      if (!element) {
        throw new Error("Element to save not found");
      }

      const clonedElement = element.cloneNode(true);
      const closeBtn = clonedElement.querySelector("button.absolute");
      if (closeBtn) closeBtn.remove();
      const wrapper = document.createElement("div");
      wrapper.appendChild(clonedElement);
      wrapper.style.width = "210mm";
      wrapper.style.margin = "0";
      wrapper.style.padding = "0";

      clonedElement.style.height = "auto";
      clonedElement.style.maxHeight = "none";
      clonedElement.style.overflow = "visible";
      clonedElement.style.width = "100%";
      clonedElement.style.padding = "20mm";
      clonedElement.style.boxSizing = "border-box";
      clonedElement.style.backgroundColor = "white";

      const contentDiv = clonedElement.querySelector(".lg\\:px-64");
      if (contentDiv) {
        contentDiv.style.overflow = "visible";
        contentDiv.style.width = "100%";
        contentDiv.style.height = "auto";
        contentDiv.style.padding = "0";
        contentDiv.classList.remove("lg:px-64");
      }

      const opt = {
        margin: 0,
        filename: "eulogy.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: -window.scrollY,
          backgroundColor: "white",
          letterRendering: true,
          windowWidth: 1000,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
          pdfCallback: (pdf) => {
            pdf.internal.pageSize.height = 297;
            pdf.internal.pageSize.width = 210;
          },
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break-before",
          after: ".page-break-after",
          avoid: ".page-break-avoid",
        },
      };

      wrapper.style.borderRadius = "0";
      document.body.appendChild(wrapper);

      html2pdf()
        .from(clonedElement)
        .set(opt)
        .save()
        .then(() => {
          document.body.removeChild(wrapper);
        })
        .catch((err) => {
          document.body.removeChild(wrapper);
          setError("Failed to download eulogy. Please try again.");
          setTimeout(() => setError(null), 5000);
        });
    } catch (err) {
      setError("An error occurred while generating the PDF");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError("First name and last name are required");
      return false;
    }

    if (!formData.birth_date || !formData.death_date) {
      setError("Both birth date and death date are required");
      return false;
    }

    if (new Date(formData.death_date) < new Date(formData.birth_date)) {
      setError("Death date must be after birth date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setTimeout(() => setError(null), 5000);
      return;
    }

    const fullName =
      `${formData.first_name} ${formData.middle_name} ${formData.last_name}`.trim();

    const payload = {
      name: fullName,
      birth_date: formData.birth_date,
      death_date: formData.death_date,
      relationships: formData.relationships,
      occupation: formData.occupation,
      personality_traits: formData.personality_traits,
      hobbies: formData.hobbies,
      accomplishments: formData.accomplishments,
      anecdotes: formData.anecdotes,
      tone: formData.tone,
    };

    try {
      setLoading(true);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const response = await Promise.race([
        axios.post("http://localhost:8080/api/generateEulogy", payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }),
        timeoutPromise,
      ]);

      if (!response.data) {
        throw new Error("Empty response from server");
      }

      setEulogy(response.data);
      setEditedEulogy(response.data);
      setModalOpen(true);
    } catch (error) {
      let errorMessage = "An error occurred while generating the eulogy";
      if (error.message === "Request timeout") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response) {
        if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center min-h-screen max-w-screen bg-gray-800">
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <div className="p-4 rounded-lg shadow-lg bg-red-500 text-white">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-4 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <div
            className="fixed inset-0 flex max-w-screen h-screen bg-black/50 z-100 justify-center items-center flex-col"
            onClick={() => setModalOpen((prev) => !prev)}
          >
            <div
              id="saveable"
              className="bg-[#CCCCCC] opacity-100 flex w-[90vw] max-w-screen lg:w-[80vw] h-[90vh] lg:h-[80vh] rounded-t-lg overflow-hidden flex-col lg:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-0 right-5 lg:text-black text-2xl font-bold hover:text-red-600 text-red-600"
                onClick={() => setModalOpen((prev) => !prev)}
              >
                ×
              </button>
              <div className="mx-auto lg:pt-6 h-full max-w-screen flex flex-col w-full">
                <div className="lg:px-64 whitespace-pre-line overflow-y-scroll flex flex-col flex-1 w-full">
                  <img
                    src="/logo.png"
                    className="w-16 h-16 mx-auto"
                    alt="Logo"
                  />
                  <div className="font-semibold text-center pb-2">
                    In Loving Memory of
                  </div>
                  <div className="font-bold text-xl text-center pb-2">
                    {formData.first_name} {formData.middle_name}{" "}
                    {formData.last_name}
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse text-gray-600">
                        Loading eulogy...
                      </div>
                    </div>
                  ) : (
                    <div
                      className="lg:p-0 px-4 whitespace-pre-line w-full bg-transparent outline-none"
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onInput={(e) =>
                        setEditedEulogy(e.currentTarget.textContent)
                      }
                    >
                      {eulogy}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isEditing ? (
              <div className="flex justify-center md:space-x-12 space-x-2 bg-[#CCCCCC] w-[90vw] border-t border-orange-500 rounded-b-lg lg:w-[80vw] text-center py-4">
                <button
                  onClick={(e) => {
                    setIsEditing((prev) => !prev);
                    setEulogy((prev) => editedEulogy);
                    e.stopPropagation();
                  }}
                  className="p-3 w-32  bg-orange-500 text-white font-bold rounded-xl"
                >
                  Save
                </button>
                <button
                  className="p-3  w-32 bg-orange-500 text-white font-bold rounded-xl"
                  onClick={(e) => {
                    setIsEditing((prev) => !prev);
                    setEditedEulogy(eulogy);
                    e.stopPropagation();
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-center md:space-x-12 space-x-2 bg-[#CCCCCC] border-t border-orange-500 rounded-b-lg w-[90vw] lg:w-[80vw] text-center py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing((prev) => !prev);
                  }}
                  className="p-3 w-32  bg-orange-500 text-white font-bold rounded-xl"
                >
                  Edit
                </button>
                <button
                  className="p-3  w-32 bg-orange-500 text-white font-bold rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveToPDF();
                  }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Download"}
                </button>
              </div>
            )}
          </div>
        )}
        <div className="bg-[#D9D9D9] xl:w-1/3 lg:w-2/3 lg:p-8 lg:mt-[10vh] mt-[15vh] py-4  w-[90vw] rounded-xl shadow-lg flex overflow-y-scr flex-col">
          <div className="lg:text-xl text-lg font-bold text-center">
            AI Eulogy Form
          </div>
          <div className="lg:text-sm px-4  text-xs text-center text-gray-600 pb-4">
            Please Fill Out the Form Below to Help Us Honor and Celebrate Your
            Loved One's Life.
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:space-y-4 space-y-3 w-[90%] lg:w-full mx-auto"
          >
            <div className="font-semibold text-md border-b  text-center md:text-left">
              Personal Information of the Deceased
            </div>
            <div className="font-semibold">Name</div>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              className="p-2 rounded w-full  bg-[#CCCCCC]"
              required
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name (Optional)"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC]"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC]"
              required
            />
            <div className="font-semibold">Dates</div>
            <div className="flex lg:space-x-4 flex-col lg:flex-row lg:space-y-0 space-y-4">
              <div className=" lg:w-1/2 flex flex-col  ">
                <div className="">Date of Birth</div>
                <input
                  type="date"
                  name="birth_date"
                  onChange={handleChange}
                  className="p-2 flex rounded bg-[#CCCCCC]"
                  required
                />
              </div>
              <div className=" lg:w-1/2 flex flex-col  ">
                <div className="">Date of Passing</div>
                <input
                  type="date"
                  name="death_date"
                  onChange={handleChange}
                  className="p-2 rounded flex bg-[#CCCCCC] w-full "
                  required
                />
              </div>
            </div>
            <div className="font-semibold">Family and Relationships</div>
            <textarea
              name="relationships"
              placeholder="Relationships (Spouse, Children, Grandchildren, etc.)"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC] resize-none"
            />
            <div className="font-semibold">Career</div>
            <textarea
              name="occupation"
              placeholder="Occupation and Career Details"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC] resize-none"
            />
            <div className="font-semibold">Hobbies</div>
            <textarea
              name="hobbies"
              placeholder="Hobbies and Interests"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC] resize-none"
            />
            <div className="font-semibold">Anecdotes</div>
            <textarea
              name="anecdotes"
              placeholder="Memorable Stories or Moments"
              onChange={handleChange}
              className="p-2  rounded w-full bg-[#CCCCCC] resize-none"
            />
            {loading ? (
              <button
                type="button"
                disabled
                className="p-3 bg-orange-500 text-white font-bold flex justify-center rounded-full opacity-75"
              >
                <svg
                  className="mr-3 size-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Eulogy...
              </button>
            ) : (
              <button
                type="submit"
                className="p-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors"
                disabled={loading}
              >
                Generate Eulogy
              </button>
            )}
          </form>
        </div>
      </div>
      <style>
        {`
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background: transperent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-orange-500);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #444;
      }
      
      @media print {
        body * {
          visibility: hidden;
        }
        #saveable, #saveable * {
          visibility: visible;
        }
        #saveable {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          overflow: visible;
          background-color: #CCCCCC !important;
          padding: 20mm;
          margin: 0;
          box-sizing: border-box;
        }
        #saveable button.absolute {
          display: none !important;
        }
      }
    `}
      </style>
    </>
  );
}
