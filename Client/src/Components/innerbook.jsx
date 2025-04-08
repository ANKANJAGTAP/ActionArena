import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaStar, FaShareAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const SanasBadmintonCourt = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venue, setVenues] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${backendUrl}/bookvenues/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }
        const data = await response.json();
        setVenues(data);
      } catch (err) {
        console.error("Error fetching venue", err);
      }
    };

    fetchVenues();
  }, [id]);

  if (!venue) {
    return (
      <p className="text-center text-lg text-gray-600 py-10">
        Loading venue...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans mt-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center md:text-left">
          {venue.name}
        </h1>
        <div className="flex flex-col items-center md:items-end space-y-4 mt-4 md:mt-0">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={
                  i + 1 <= Math.round(venue.rating) ? "#FFD700" : "#e5e7eb"
                }
                size={22}
              />
            ))}
            <span className="ml-3 text-gray-700 font-semibold">
              {venue.rating} ({venue.reviews} ratings)
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 sm:px-6 rounded-lg shadow"
              onClick={() => navigate(`/book/${venue._id}/booknow`)}
            >
              Book Now
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 sm:px-6 rounded-lg shadow flex items-center">
              <FaShareAlt className="mr-2" /> Share
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 sm:px-6 rounded-lg shadow">
              Bulk / Corporate
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        <div className="flex-1">
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            className="rounded-lg shadow-lg"
          >
            {[venue.image, venue.image, venue.image].map((img, i) => (
              <div key={i}>
                <img
                  src={img}
                  alt={`Sanas Court View ${i + 1}`}
                  className="object-cover w-full h-60 sm:h-80 md:h-96 rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="w-full md:w-1/3 flex flex-col space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-800">Timing</h3>
              <h3 className="text-xl font-semibold text-gray-800">Cost Per Hour</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-700">{venue.time}</p>
              <p className="text-gray-700">₹ {venue.cost}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Location
            </h3>
            <p className="text-gray-700 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              {venue.name}, {venue.location}, {venue.city}, 444604
            </p>
            <div className="mt-4">
              <iframe
                title={venue.name}
                width="100%"
                height="200"
                className="border-0 rounded-lg"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC0BAM6_oSmcttQ2zfu2sVDY0mfZUn2DAU&q=${encodeURIComponent(
                  `${venue.name}, ${venue.location}, ${venue.city}`
                )}`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanasBadmintonCourt;
