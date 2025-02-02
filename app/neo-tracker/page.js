"use client";

import { Loader, RefreshCcw, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function NEOWTracker() {
  const [neoData, setNeoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // Default 30 seconds
  const [isPremium, setIsPremium] = useState(false); // For premium features
  const [showGraph, setShowGraph] = useState(false); // Toggle for graph visibility

  const fetchNEOData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-02-01&end_date=2025-02-01&api_key=DEMO_KEY`
      );
      if (!response.ok) throw new Error("Failed to fetch NEO data");
      const data = await response.json();
      const todayNEOs = data.near_earth_objects["2025-02-01"];

      setNeoData(todayNEOs);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError("Error fetching NEO data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNEOData();

    const timeout = setInterval(() => {
      fetchNEOData();
    }, refreshInterval); // Use the user-defined interval

    return () => clearInterval(timeout); // Cleanup interval on component unmount
  }, [refreshInterval]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1f2d3b] to-[#080c15] text-white flex flex-col items-center justify-center p-8 transition-all">
      <h1 className="text-4xl font-bold text-center mb-4 tracking-wider">
        🌟 NEO Tracker
      </h1>
      <p className="text-lg opacity-80 mb-8 text-center">
        Track Near-Earth Objects and their details.
      </p>

      {error ? (
        <p className="text-red-400 mb-4">{error}</p>
      ) : (
        <div className="w-full max-w-5xl bg-gradient-to-r from-[#2e3b4e] to-[#1e2834] p-6 rounded-2xl shadow-xl transition-all">
          {loading ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-500">
                <Loader className="animate-spin inline-block mr-2" size={20} />
                Fetching NEO data...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                🌍 Near-Earth Objects Today
              </h2>

              {/* Graph Toggle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setShowGraph(!showGraph)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 text-sm"
                >
                  {showGraph ? "Hide Graph" : "Show Graph"}
                </button>
              </div>

              {/* Display Graph if toggled on */}
              {showGraph && (
                <div className="w-full max-w-xl bg-gray-800 p-4 rounded-xl mb-6">
                  {/* Replace with actual interactive graph/chart component */}
                  <p className="text-center text-gray-400">
                    Interactive Graph of NEO Data (Graph Feature Coming Soon!)
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {neoData && neoData.length > 0 ? (
                  neoData.map((neo, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
                      onClick={() => alert(`More info about ${neo.name}`)} // Handle modal or detailed view
                    >
                      <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
                        <span className="flex items-center">
                          <Star size={20} className="mr-2" />
                          {neo.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {neo.close_approach_data[0].close_approach_date_full}
                        </span>
                      </h3>
                      <p>
                        <span className="font-semibold">Size:</span>{" "}
                        {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                          2
                        )}{" "}
                        km
                      </p>
                      <p>
                        <span className="font-semibold">Miss Distance:</span>{" "}
                        {parseFloat(
                          neo.close_approach_data[0].miss_distance.kilometers
                        ).toLocaleString()}{" "}
                        km
                      </p>
                      <p>
                        <span className="font-semibold">Velocity:</span>{" "}
                        {parseFloat(
                          neo.close_approach_data[0].relative_velocity
                            .kilometers_per_second
                        ).toFixed(2)}{" "}
                        km/s
                      </p>
                      <p>
                        <span className="font-semibold">Hazardous:</span>{" "}
                        {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                      </p>

                      {/* Premium Features */}
                      {isPremium && (
                        <div className="mt-4">
                          <p>
                            <span className="font-semibold">
                              Discovery Date:
                            </span>{" "}
                            {neo.orbital_data.discovery_date}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Orbital Period:
                            </span>{" "}
                            {neo.orbital_data.orbital_period} days
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">
                    No NEO data available for today.
                  </p>
                )}
              </div>

              {/* Premium Feature Toggle */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  className="px-6 py-3 bg-blue-800 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 text-sm"
                >
                  {isPremium ? "Disable Premium View" : "Enable Premium View"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-6 mt-8">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 text-sm"
                >
                  <RefreshCcw size={18} />
                  <span>Refresh</span>
                </button>

                {/* Refresh Interval Selector */}
                <select
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  value={refreshInterval}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                  <option value={30000}>30 Seconds</option>
                  <option value={60000}>1 Minute</option>
                  <option value={180000}>3 Minutes</option>
                  <option value={300000}>5 Minutes</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
