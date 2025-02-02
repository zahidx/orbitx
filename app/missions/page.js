"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsSearch } from 'react-icons/bs'; // Search icon

const SpaceMissions = () => {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch NASA missions data
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        if (!res.ok) throw new Error('Unable to retrieve space missions data');
        const data = await res.json();
        setMissions([data]); // Example of mission data format
        setFilteredMissions([data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Search and filter missions
  useEffect(() => {
    let results = missions;

    if (searchQuery) {
      results = results.filter(mission =>
        mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mission.explanation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'past') {
      results = results.filter(mission => new Date(mission.date) < new Date());
    } else if (filter === 'future') {
      results = results.filter(mission => new Date(mission.date) > new Date());
    }

    setFilteredMissions(results);
  }, [searchQuery, filter, missions]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0E1628] to-[#380643] text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
        NASA Missions Timeline
      </h1>
      <p className="text-center text-lg mb-8">
        Explore past, present, and future space missions by NASA.
      </p>

      {/* Search Bar and Filter */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="relative w-1/2 sm:w-1/3">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Missions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <BsSearch className="absolute right-4 top-3 text-gray-400" />
        </div>
        <select
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Missions</option>
          <option value="past">Past Missions</option>
          <option value="future">Future Missions</option>
        </select>
      </div>

      {/* Loading or Error message */}
      {loading ? (
        <div className="text-center text-xl flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
          <span>Loading missions...</span>
        </div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">Unable to retrieve space missions data: {error}</div>
      ) : (
        <div className="space-missions grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMissions.map((mission, index) => (
            <div key={index} className="mission-card bg-gray-800 rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-4">{mission.title || 'Mission Title'}</h3>
              <p className="mb-4 text-sm">{mission.explanation || 'Mission description goes here.'}</p>
              <Link
                href={`/missions/${index}`}
                className="text-blue-400 hover:text-blue-500"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Learn More Button */}
      <div className="learn-more text-center mt-10">
        <Link
          href="https://www.nasa.gov/missions"
          className="bg-blue-600 text-white py-3 px-6 rounded-full text-xl hover:bg-blue-700 transition duration-300"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
};

export default SpaceMissions;
