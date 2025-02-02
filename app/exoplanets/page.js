"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

export default function ExoplanetTracker() {
  const [exoplanets, setExoplanets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExoplanetData = async () => {
    setLoading(true); // Ensure loading is true whenever fetching starts

    // Check localStorage for previously fetched data
    const storedData = localStorage.getItem("exoplanets");
    const storedTimestamp = localStorage.getItem("fetchTimestamp");

    const now = Date.now();
    
    if (storedData && storedTimestamp && now - storedTimestamp < 10 * 60 * 1000) {
      // If data exists and is fetched within the last 10 minutes, use it
      setExoplanets(JSON.parse(storedData));
      setLoading(false);
      return;
    }

    // Otherwise, fetch new data
    try {
      const response = await fetch(
        "https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isExoplanet,eq,true"
      );
      if (!response.ok) throw new Error("Failed to fetch Exoplanet data");

      const data = await response.json();
      
      // Limit the number of records to 100
      const limitedData = data.bodies.slice(0, 100);

      // Save the fetched data to localStorage
      localStorage.setItem("exoplanets", JSON.stringify(limitedData));
      localStorage.setItem("fetchTimestamp", now.toString());

      setExoplanets(limitedData);
      setError(null); // Reset error if data is fetched successfully
    } catch (err) {
      setError("Error fetching Exoplanet data. Please try again.");
    }
    setLoading(false); // Set loading to false after the fetch attempt
  };

  useEffect(() => {
    fetchExoplanetData();
    const interval = setInterval(fetchExoplanetData, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 pt-12">
      <h1 className="mt-40 text-3xl font-bold text-center mb-2">🌍 Exoplanet Tracker</h1>
      <p className="text-base opacity-80 mt-1 text-center mb-6">
        Track Exoplanets in our galaxy and their fascinating details.
      </p>

      {error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          {loading ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 dark:text-gray-400">
                <Loader className="animate-spin inline-block mr-2" size={18} />
                Fetching Exoplanet data...
              </p>
            </div>
          ) : (
            <div>
              {/* Display Exoplanet data if fetched successfully */}
              {exoplanets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {exoplanets.map((planet) => (
                    <div
                      key={planet.id}
                      className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                    >
                      <h2 className="text-xl font-semibold mb-4">{planet.name}</h2>
                      <p><span className="font-semibold">Discovery Method:</span> {planet.discoveryMethod}</p>
                      <p><span className="font-semibold">Orbital Period:</span> {planet.sideralOrbit || "N/A"} days</p>
                      <p><span className="font-semibold">Mass:</span> {planet.mass?.massValue || "N/A"} {planet.mass?.massExponent ? `x 10^${planet.mass.massExponent}` : ""} kg</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No Exoplanet data available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
