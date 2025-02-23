import { useState } from "react";
import axios from "axios";
import { Nav } from "../Widgets/nav";

export function Eulogy() {
  const [eulogy, setEulogy] = useState("");
  const [editedEulogy, setEditedEulogy] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const saveToPDF = () => {
    //todo
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setLoading((prev) => !prev);
      const response = await axios.post(
        "http://localhost:8080/api/generateEulogy",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEulogy((prev) => (prev = response.data));
      setEditedEulogy((prev) => (prev = response.data));
      setLoading((prev) => !prev);
      setModalOpen((prev) => !prev);
      console.log(eulogy);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center min-h-screen max-w-screen bg-gray-800">
        {modalOpen && (
          <div
            className="fixed inset-0 flex max-w-screen h-screen bg-black/50 z-100 justify-center items-center flex-col"
            onClick={() => setModalOpen((prev) => !prev)}
          >
            <div
              id="saveable"
              className="bg-[#CCCCCC]  opacity-100 flex w-[90vw] max-w-screen lg:w-[80vw] h-[90vh] lg:h-[80vh] rounded-t-lg overflow-hidden flex-col lg:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-0 right-5 lg:text-black text-2xl font-bold hover:text-red-600 text-red-600"
                onClick={() => setModalOpen((prev) => !prev)}
              >
                x
              </button>
              <div className="mx-auto lg:pt-6 h-full max-w-screen flex flex-col ">
                <div className="lg:px-64  whitespace-pre-line overflow-y-scroll  flex flex-col flex-1">
                  <img src="/logo.png" className="w-16 h-16 mx-auto" />
                  <div className="font-semibold text-center pb-2">
                    In Loving Memory of
                  </div>
                  <div className="font-bold text-xl text-center pb-2">
                    {formData.first_name} {formData.middle_name}{" "}
                    {formData.last_name}
                  </div>
                  <div
                    className="lg:p-0 px-4 whitespace-pre-line w-full h-full bg-transparent outline-none"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onInput={(e) =>
                      setEditedEulogy(e.currentTarget.textContent)
                    }
                  >
                    {eulogy}
                  </div>
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
                <button className="p-3  w-32 bg-orange-500 text-white font-bold rounded-xl">
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
                >
                  Download
                </button>
              </div>
            )}
          </div>
        )}
        <div className="bg-[#D9D9D9] xl:w-1/3 lg:w-2/3 lg:p-8 lg:mt-[10vh] mt-[15vh] py-4  w-[90vw] rounded-xl shadow-lg flex  flex-col">
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
            <div className="flex lg:space-x-4 flex-col lg:flex-row lg:space-y-4">
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
            {loading ? (
              <button
                type="submit"
                disabled
                className="p-3   bg-orange-500 text-white font-bold flex  justify-center rounded-full"
              >
                <svg
                  className="mr-3 size-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="p-3  bg-orange-500 text-white font-bold rounded-full"
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
    `}
      </style>
    </>
  );
}
