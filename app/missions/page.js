"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Animation Library
import { Loader2, Search, Filter, ArrowUpDown } from "lucide-react"; // Icons

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
        );
        setMissions(response.data.rovers);
        setFilteredMissions(response.data.rovers);
      } catch (err) {
        setError("🚨 Failed to fetch mission data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Search & filter missions
  useEffect(() => {
    let filtered = missions.filter((mission) =>
      mission.name.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((mission) => mission.status === statusFilter);
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => new Date(a.launch_date) - new Date(b.launch_date));
    } else {
      filtered.sort((a, b) => new Date(b.launch_date) - new Date(a.launch_date));
    }

    setFilteredMissions(filtered);
  }, [search, statusFilter, sortOrder, missions]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">🚀 NASA Mars Missions</h1>

      {/* Filters & Sorting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0"
      >
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search missions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 pl-10 w-full bg-gray-200 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 pl-10 bg-gray-200 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-2 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 pl-10 bg-gray-200 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-yellow-500"
            >
              <option value="asc">Oldest First</option>
              <option value="desc">Newest First</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-400 w-10 h-10" />
          <p className="ml-2 text-yellow-400">Loading missions...</p>
        </div>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Mission Cards */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id || index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="p-5 border border-gray-300 rounded-lg bg-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h2 className="text-2xl font-semibold text-blue-400">{mission.name}</h2>

                {/* Image (if available) */}
                {mission.photos && mission.photos.length > 0 && (
                  <img
                    src={mission.photos[0].img_src}
                    alt={`${mission.name} image`}
                    className="w-full h-auto mt-4 rounded-lg"
                  />
                )}

                {/* Properly formatted mission details */}
                <ul className="text-gray-600 mt-3 space-y-1 dark:text-gray-400">
                  <li>
                    <span className=" text-black dark:text-white">Launch Date:</span>{" "}
                    {mission.launch_date || "N/A"}
                  </li>
                  <li>
                    <span className=" text-black dark:text-white">Landing Date:</span>{" "}
                    {mission.landing_date || "N/A"}
                  </li>
                  <li>
                    <span className=" text-black dark:text-white">Status:</span> {mission.status || "Unknown"}
                  </li>
                  <li>
                    <span className=" text-black dark:text-white">Total Photos:</span>{" "}
                    {mission.total_photos?.toLocaleString() || "N/A"}
                  </li>
                  <li>
                    <span className=" text-black dark:text-white">Cameras:</span>{" "}
                    {mission.cameras?.map((cam) => cam.name).join(", ") || "N/A"}
                  </li>
                </ul>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400">No missions found.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
