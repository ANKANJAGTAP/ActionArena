import React, { useState } from "react";

const cities = [
  { name: "Bangalore" },
  { name: "Hyderabad" },
  { name: "Vijayawada" },
  { name: "Delhi NCR" },
  { name: "Guntur" },
  { name: "Dubai", flag: "🇦🇪" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Chennai" },
  { name: "Pune" },
  { name: "Mumbai" },
  { name: "Visakhapatnam" },
  { name: "Kochi" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Oman", flag: "🇴🇲" },
];

const SportsComplex = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-gray-100 flex flex-col items-center py-10 min-h-screen rounded-2xl mt-20 px-4 sm:px-6 lg:px-8">
      {/* Green Banner */}
      <div className="bg-green-500 text-white text-center w-full max-w-4xl p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold">
          Get the ArenaX app for a seamless experience!
        </h2>
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            className="h-12 cursor-pointer"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png"
            alt="App Store"
            className="h-12 cursor-pointer"
          />
        </div>
      </div>

      {/* Sports Complex Section */}
      <div className="bg-white w-full max-w-3xl p-6 mt-12 rounded-xl shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-700">
          Top Sports Complexes in Cities
        </h3>

        {/* City List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cities.map((city, index) => (
            <div key={index} className="relative">
              <button
                className="flex justify-between items-center w-full bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="text-gray-900 text-lg font-medium">
                  {city.flag && <span className="mr-2">{city.flag}</span>}
                  {city.name}
                </span>
                <span
                  className={`text-gray-400 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="bg-gray-50 p-3 mt-2 rounded-lg shadow-md border border-gray-300 text-sm text-gray-600">
                  More details about {city.name} sports complexes...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsComplex;
