import { Nav } from "../Widgets/nav";

export function NotFound() {
  const text = [
    "Unable to find a proper resting place for this page",
    "This page is no longer with us",
    "All paths lead to a resting place, but this one leads to nowhere",
  ];

  const randomText = text[Math.floor(Math.random() * text.length)];

  return (
    <>
      <Nav />
      <div className="flex flex-col space-y-4 justify-center text-center bg-gray-800 h-screen text-white">
        <div className="text-5xl font-bold">404 - Page not found</div>
        <div className="text-3xl font-light">{randomText}</div>
        <a
          href="/"
          className="text-3xl bg-orange-600 p-3 lg:w-96 sm:w-52 md:w-72 rounded-xl mx-auto"
        >
          Back to Home page
        </a>
      </div>
    </>
  );
}
