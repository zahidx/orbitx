'use client';

import { useState, useEffect } from 'react';
import { MapPin, RefreshCcw, Loader, Satellite } from 'lucide-react';

export default function ISSTracker() {
  const [issData, setIssData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch ISS location
  const fetchISSLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (!response.ok) throw new Error('Failed to fetch ISS location');
      const data = await response.json();

      setIssData({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        altitude: parseFloat(data.altitude),
        velocity: parseFloat(data.velocity),
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Error fetching ISS location. Please try again.');
    }
    setLoading(false);
  };

  // Fetch ISS location on component mount and set interval for auto-refresh
  useEffect(() => {
    fetchISSLocation();
    const intervalId = setInterval(fetchISSLocation, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 pt-12 transition-all">
      <h1 className="text-3xl font-bold text-center mb-2">🚀 Live ISS Tracker</h1>
      <p className="text-base opacity-80 mt-1 text-center mb-6">
        Track the real-time location of the International Space Station.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all">
        {loading ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400">
              <Loader className="animate-spin inline-block mr-2" size={18} />
              Fetching ISS location...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-6 text-center sm:text-left">
              {/* ISS Data */}
              <div
                className="relative w-full sm:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
                onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Satellite size={20} className="mr-2" />
                  ISS Data
                </h2>
                <p>
                  <span className="font-semibold">Latitude:</span> {issData.latitude.toFixed(4)}
                </p>
                <p>
                  <span className="font-semibold">Longitude:</span> {issData.longitude.toFixed(4)}
                </p>
                <p>
                  <span className="font-semibold">Altitude:</span> {issData.altitude.toFixed(2)} km
                </p>
                <p>
                  <span className="font-semibold">Speed:</span> {issData.velocity.toFixed(2)} km/h
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Last updated: {lastUpdated}
                </p>
              </div>

              {/* ISS Location Map */}
              <div
                className="relative w-full sm:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
                onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
              >
                <h2 className="text-xl font-semibold mb-4">🌍 ISS Live Location on Map</h2>
                {issData && (
                  <iframe
                    src={`https://maps.google.com/maps?q=${issData.latitude},${issData.longitude}&output=embed`}
                    className="w-full h-48 rounded-lg border"
                    loading="lazy"
                  ></iframe>
                )}
              </div>

              {/* ISS Info */}
              <div
                className="relative w-full sm:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
                onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
              >
                <h2 className="text-xl font-semibold mb-4">🚀 ISS Info</h2>
                <p>
                  <span className="font-semibold">Altitude:</span> {issData.altitude.toFixed(2)} km
                </p>
                <p>
                  <span className="font-semibold">Speed:</span> {issData.velocity.toFixed(2)} km/h
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <a
                href={`https://www.google.com/maps?q=${issData.latitude},${issData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
              >
                <MapPin size={18} />
                <span>View on Google Maps</span>
              </a>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all text-sm"
              >
                <RefreshCcw size={18} />
                <span>Refresh</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
  <div className="absolute top-[100px] right-6 transform -translate-y-1/2 bg-[#17A2B8] text-white text-sm p-3 rounded-lg shadow-lg  transition-all duration-500 ease-in-out opacity-100 translate-x-4">
    <span className="font-semibold">Info:</span> Auto-refresh every 30 seconds!
  </div>
)}

    </div>
  );
}
