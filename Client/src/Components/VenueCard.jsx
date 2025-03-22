import React from "react";
import { FaStar } from "react-icons/fa";

const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={venue.image || "https://via.placeholder.com/600x400?text=No+Image"}
        alt={venue.name}
        className="w-full h-40 object-fit"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{venue.name || "Unknown Venue"}</h2>
        <p className="text-gray-500">{venue.location || "Location not available"}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mt-2">
          <FaStar className="text-yellow-500" />
          <span>{venue.rating ? venue.rating.toFixed(2) : "N/A"}</span>
          <span className="text-gray-500">
            ({venue.reviews !== undefined ? venue.reviews : "No reviews"})
          </span>
        </div>

        {/* Bookable Badge */}
        {venue.bookable ? (
  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-md mt-2 inline-block cursor-pointer" onClick={() => window.location.href = `/book/${venue._id}`}>
    Bookable
  </span>
) : (
  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md mt-2 inline-block cursor-not-allowed">
    Temporary Closed
  </span>
)}

      </div>
    </div>
  );
};

export default VenueCard;
