"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Loader, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const SpaceWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.nasa.gov/DONKI/notifications?type=all&api_key=DEMO_KEY`
        );
        const data = await res.json();
        const latestAlerts = data.slice(0, 10); // Cache latest 10 alerts
        setWeatherData(latestAlerts);
        localStorage.setItem("spaceWeather", JSON.stringify(latestAlerts));
      } catch (error) {
        console.error("Error fetching space weather:", error);
        const cachedData = localStorage.getItem("spaceWeather");
        if (cachedData) {
          setWeatherData(JSON.parse(cachedData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceWeather();
  }, []);

  const filteredAlerts = weatherData.filter((alert) =>
    alert.messageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to remove "##" from the message body
  const cleanMessage = (message) => {
    return message.replace(/##/g, "");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">🌌 Space Weather Alerts</h1>

      {/* Search Bar */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search alerts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-yellow-500" size={48} />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-yellow-500 cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedAlert(alert)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-yellow-500" size={24} />
                  <h2 className="text-xl font-semibold">{alert.messageType}</h2>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                  {cleanMessage(alert.messageBody).substring(0, 100)}...
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  📅 {new Date(alert.messageIssueTime).toLocaleString()}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-lg">No alerts found.</p>
          )}
        </motion.div>
      )}

      {/* Modal for Detailed View */}
      {selectedAlert && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedAlert(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedAlert(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedAlert.messageType}</h2>

            {/* Scrollable content with hidden scrollbar */}
            <div className="max-h-96 overflow-y-auto scrollbar-hidden">
              <p className="text-gray-700 dark:text-gray-300">
                {cleanMessage(selectedAlert.messageBody)}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              📅 {new Date(selectedAlert.messageIssueTime).toLocaleString()}
            </p>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        /* Hide Scrollbar but Keep Scrolling */
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default SpaceWeather;
