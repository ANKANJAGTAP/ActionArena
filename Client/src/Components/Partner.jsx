import React from "react";

const corporateImages = [
  "https://images.unsplash.com/photo-1592318343309-853bcb2213ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592318343309-853bcb2213ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592318343309-853bcb2213ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592318343309-853bcb2213ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592318343309-853bcb2213ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    <div className="bg-gray-100 flex justify-center py-10 mt-16 rounded-3xl"> {/* Added margin-top */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-11/12 md:w-4/5 border border-gray-200"> {/* Enhanced styling */}
        
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Corporate Partnerships
        </h2>

        {/* Images Section */}
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-2">
          {corporateImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Corporate Event ${index + 1}`}
              className="rounded-lg w-64 h-40 object-cover flex-none"
            />
          ))}
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 mt-8 justify-items-center">
          {corporatePartners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={partner.name}
              className="h-10 object-contain"
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
