import { useEffect, useRef, useState } from "react";
import { Footer } from "../Widgets/footer";
import { Nav } from "../Widgets/nav";

export function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [quote, setQuote] = useState("");

  const headings = ["Our Dedication", "Our Services", "Why Choose us"];
  const pararaphs = [
    "We dedicate ourselves to providing comfort, understanding, and peace of mind to families in their time of need. With compassion at our core, we honor every life with dignity, offering a guiding hand through remembrance and farewell.",
    "At Eternal Echoes, we are committed to providing comfort and ease of mind to families during life’s most difficult moments. We offer dignified graveside funeral services, ensuring a peaceful and respectful farewell. Our virtual gravesite tours allow families to experience the resting place with ease, no matter where they are. Additionally, our AI-generated eulogies provide a heartfelt tribute, honoring loved ones with words that truly reflect their legacy. With compassion at the heart of everything we do, we are here to support you every step of the way.",
    "At Eternal Echoes, we understand the importance of honoring a loved one with respect and care. Our commitment to compassion ensures that every family is supported with ease during difficult times. From personalized graveside funeral options to the convenience of virtual tours and AI-generated eulogies, we provide thoughtful solutions that bring peace of mind. With us, you can trust that your loved one’s memory will be cherished and celebrated with the utmost dignity and care.",
  ];
  const quotes = ["“Dedicated to Serving with Compassion”", "", ""];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    //shoul disable scrolling if modal open
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex w-screen h-screen bg-black/50 z-[100] justify-center items-center overflow-hidden"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <div
            className="bg-white opacity-100 flex w-[90vw] lg:w-[80vw] h-[90vh] lg:h-[80vh] rounded-lg overflow-hidden flex-col lg:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 lg:text-black text-2xl font-bold hover:text-red-600 text-red-600"
              onClick={() => setIsModalOpen((prev) => !prev)}
            >
              x
            </button>
            <img
              className="w-full lg:w-2/3 h-1/3 lg:h-full object-cover"
              src="/login.jpeg"
              alt="Login"
            />
            <div className="w-full flex-col lg:w-1/2 h-2/3 lg:h-full flex p-4 lg:p-6 overflow-y-auto">
              <div className="text-2xl lg:text-4xl font-bold text-center pb-4 pt-6 lg:pt-10">
                {heading}
              </div>
              <div className="font-semibold text-center text-lg lg:text-2xl">
                {quote}
              </div>
              <div className="text-sm lg:text-base xl:leading-[44px] xl:pt-24 lg:pt-20 md:pt-16 pt-12">
                {paragraph}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen z-10 flex flex-col overflow-x-hidden">
        <Nav />
        <div className="relative w-full h-[60vh] bg-[#2F4754] overflow-hidden">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
            src="/testvid.mp4"
            autoPlay
            loop
            muted
          ></video>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40 px-6">
            <div className="font-bold text-4xl sm:text-5xl lg:text-6xl drop-shadow-lg">
              About Us
            </div>
            <div className="font-semibold text-lg sm:text-2xl lg:text-xl mt-3 max-w-2xl">
              Honouring Lives, Cherishing Memories, Providing Peace
            </div>
          </div>
        </div>
        <div className="bg-[#161E22] flex flex-wrap justify-center gap-6 md:gap-8 py-6 flex-1 px-4 md:px-12">
          {[
            //think we have to use a map here for index to load data into the modal, would be open to a better suggestion
            { title: "Our Dedication", img: "/package1.png" },
            { title: "Our Services", img: "/package1.png" },
            { title: "Why Choose Us?", img: "/package1.png" },
          ].map((service, index) => (
            <div
              key={index}
              className="flex flex-col shadow-lg shadow-black rounded-2xl w-full sm:w-[60%] md:w-[30%] max-w-xs transition-transform transform hover:scale-105 bg-[#1F2A30] overflow-hidden"
            >
              <div className="relative">
                <img
                  className="w-full h-[180px] object-cover brightness-75"
                  src={service.img}
                  alt={service.title}
                />
              </div>

              <div className="flex flex-col items-center justify-center p-6">
                <div className="text-center text-xl font-semibold text-white">
                  {service.title}
                </div>
                <button
                  className="mt-4 w-12 h-12 flex items-center justify-center bg-[#DD6E42] text-white rounded-full hover:animate-pulse transition"
                  onClick={() => {
                    setIsModalOpen((prev) => !prev);
                    setQuote(quotes[index]);
                    setParagraph(pararaphs[index]);
                    setHeading(headings[index]);
                  }}
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
          ))}
        </div>
      </div>
    </>
  );
}
