import { Footer } from "../Widgets/footer";
import { Nav } from "../Widgets/nav";

export function Home() {
  return (
    <div className="min-h-screen z-10 flex flex-col">
      <Nav />
      <div className="flex flex-col sm:flex-row bg-[#2F4754] max-w-screen overflow-x-hidden">
        <div className="hero z-10 sm:h-96 bg-[#2F4754] flex pl-8 sm:pl-32 pt-16 sm:pt-32 md:text-5xl text-white font-bold">
          Insert Text Here....
        </div>
        <img className="w-full sm:w-auto sm:bg-[#2F4754]" src="/test_1.png" />
      </div>
      <div className="bg-[#161E22] md:flex space-y-12 flex-1 md:space-y-0 z-20 justify-evenly md:max-h-[350px] text-white px-4">
        <div className="flex md:-mt-12 flex-col shadow-xl shadow-black rounded-xl w-full sm:w-[20vw]">
          <img
            className="brightness-50 rounded-t-xl pb-12"
            src="/package1.png"
          />
          <div className="text-center pb-8">Funeral packages</div>
          <div className="pb-7">
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
                  stroke-opacity="0.3"
                />
                <path
                  d="M7.91675 18.0132H30.0834M30.0834 18.0132L19.0001 7.50549M30.0834 18.0132L19.0001 28.5208"
                  stroke="#F3F3F3"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="flex md:-mt-12 flex-col shadow-xl shadow-black rounded-xl w-full sm:w-[20vw]">
          <img
            className="brightness-50 rounded-t-xl pb-12"
            src="/package1.png"
          />
          <div className="text-center pb-8">Virtual Gravesite Tours</div>
          <div className="pb-7">
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
                  stroke-opacity="0.3"
                />
                <path
                  d="M7.91675 18.0132H30.0834M30.0834 18.0132L19.0001 7.50549M30.0834 18.0132L19.0001 28.5208"
                  stroke="#F3F3F3"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="flex md:-mt-12 flex-col shadow-xl shadow-black rounded-xl w-full sm:w-[20vw]">
          <img
            className="brightness-50 rounded-t-xl pb-12"
            src="/package1.png"
          />
          <div className="text-center md:pb-8">Ai Generated Eulogy</div>
          <div className="pb-7">
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
                  stroke-opacity="0.3"
                />
                <path
                  d="M7.91675 18.0132H30.0834M30.0834 18.0132L19.0001 7.50549M30.0834 18.0132L19.0001 28.5208"
                  stroke="#F3F3F3"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#161E22] flex-1"></div>
    </div>
  );
}
