import React from "react";

const corporateImages = [
  "https://cdn.ca.emap.com/wp-content/uploads/sites/9/2022/08/shutterstock_1757511395-WSP-scaled.jpg",
  "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/groww.png",
  "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/accenture.png",
  "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/deloitte.png",
  "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/swiggy.png",
];

const corporatePartners = [
  { name: "WSP", logo: "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/wsp_global_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "KPMG", logo: "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/kpmg_logo.svg" },
  { name: "Accenture", logo: "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/accenture_logo.svg" },
  { name: "Deloitte", logo: "https://playo-website.gumlet.io/playo-website-v3/corporate-partners/deloitte_logo.svg" },
  { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
];

const Partner = () => {
  return (
    <div className="bg-gray-100 flex justify-center py-10 mt-16 rounded-3xl px-4 sm:px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl border border-gray-200">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Corporate Partnerships
        </h2>

        {/* Images Section */}
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-2">
          {corporateImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Corporate Event ${index + 1}`}
              className="rounded-lg w-56 sm:w-64 h-32 sm:h-40 object-cover flex-none"
            />
          ))}
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mt-8 justify-items-center">
          {corporatePartners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={partner.name}
              className="h-8 sm:h-10 object-contain"
            />
          ))}
        </div>

        {/* Contact Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition">
            GET IN TOUCH
          </button>
        </div>

      </div>
    </div>
  );
};

export default Partner;
