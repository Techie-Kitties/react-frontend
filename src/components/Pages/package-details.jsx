import { Footer } from "../Widgets/footer";
import { Nav } from "../Widgets/nav";

export function PackageDetails() {
  return (
    <div className="min-h-screen z-10 relative flex flex-col">
      <Nav />
      <div className="flex flex-col sm:flex-row bg-[#2F4754] max-w-screen overflow-x-hidden">
        <div className="hero z-10 sm:h-50 bg-[#2F4754] flex pl-8 sm:pl-32 pt-16 sm:pt-32 md:text-5xl text-white font-bold">
          <div className="text-right sm:text-left text-lg sm:text-xl md:text-xl ml-85 max-w-3xl px-8 pt-8"></div>
        </div>
      </div>

      <div className="bg-[#161E22] md:flex flex-col items-center text-white px-4 py-10">
        {/* Orange Rectangle */}
        <div className="w-48 h-12 bg-orange-500 rounded-xl mb-8"></div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center md:space-x-6 w-full">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col shadow-xl shadow-black rounded-xl w-full sm:w-[20vw] max-h-[360px] p-6 bg-[#1E2A30] m-4"
            >
              <div className="pb-7">
                <svg
                  className="mx-auto"
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ></svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Card {index + 1}</h3>
                <p className="text-sm text-gray-300">
                  This is a placeholder for card {index + 1}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161E22] flex-1"></div>
    </div>
  );
}
