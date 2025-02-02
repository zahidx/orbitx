"use client";

import { useState } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll"; // Import ScrollLink from react-scroll

// Dark Mode Toggle Component
const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="absolute top-6 right-6 bg-gradient-to-r from-blue-400 to-indigo-500 p-2 rounded-full transition-all duration-300 hover:scale-110"
    >
      {isDarkMode ? "🌙" : "🌞"}
    </button>
  );
};

export default function Home() {
  return (
    <main
      className="bg-cover bg-center text-foreground min-h-screen transition-all duration-300"
      style={{
        backgroundImage: "url('/earth-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Hero Section with Color Gradient */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 bg-gradient-to-r from-[#06d3cd] to-[#04bfbf] dark:bg-gradient-to-r dark:from-[#111C2D] dark:to-[#0A0A0A]">
        <div className="absolute inset-0 animate-fadeIn">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/earth-image.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
        </div>

        <div className="relative z-10 text-[#e2f62f]">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight transform transition-transform duration-300 hover:scale-105">
            Explore the Universe with <span className="text-[#fcf9f5] dark:text-blue-500">OrbitX</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-80">
            Track the ISS, discover exoplanets, monitor asteroids, and more.
          </p>
          {/* Use ScrollLink here to scroll down to Live ISS Tracking */}
          <ScrollLink
            to="iss-tracker-section"
            smooth={true}
            duration={1000}
            className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 rounded-lg text-lg font-semibold hover:from-blue-400 hover:to-indigo-400 transition-all duration-300 transform hover:scale-105"
          >
            Start Exploring 🚀
          </ScrollLink>
        </div>
      </section>

      {/* Live ISS Tracker Section with an ID to target for scrolling */}
      <section id="iss-tracker-section" className="pt-32 py-16 px-6 text-center bg-gray-100 dark:bg-gray-900 transition-all duration-300">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">🌍 Live ISS Tracking</h2>
        <p className="mt-2 opacity-80 text-gray-600 dark:text-gray-300">See where the International Space Station is right now.</p>
        <Link
          href="/iss-tracker"
          className="mt-4 inline-block text-blue-500 dark:text-blue-400 font-semibold hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300"
        >
          View ISS Tracker →
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800 transition-all duration-300">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">✨ Features</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Near-Earth Object Tracker"
            description="Monitor asteroids approaching Earth in real-time."
            link="/neo-tracker"
          />
          <FeatureCard
            title="Exoplanet Explorer"
            description="Discover new planets beyond our solar system."
            link="/exoplanets"
          />
          <FeatureCard
            title="Space Weather Dashboard"
            description="Get live updates on solar storms and geomagnetic activity."
            link="/space-weather"
          />
          <FeatureCard
            title="Earth Satellite View"
            description="See real-time satellite imagery of any location on Earth."
            link="/earth-view"
          />
          <FeatureCard
            title="NASA Missions Timeline"
            description="Explore past, present, and future space missions."
            link="/missions"
          />
        </div>
      </section>

      {/* Latest Space News Section */}
      <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900 transition-all duration-300">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">📰 Latest Space News</h2>
        <p className="mt-2 text-center opacity-80 text-gray-600 dark:text-gray-300">Stay updated with recent NASA discoveries.</p>
        <Link
          href="/news"
          className="mt-4 block text-center text-blue-500 dark:text-blue-400 font-semibold hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300"
        >
          Read More →
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white dark:bg-gray-800 text-center opacity-70 hover:opacity-100 transition-all duration-300">
        <p className="text-gray-900 dark:text-white">© {new Date().getFullYear()} OrbitX. All rights reserved.</p>
      </footer>
    </main>
  );
}

// Feature Card Component
const FeatureCard = ({ title, description, link }) => (
  <Link
    href={link}
    className="block bg-gray-100 dark:bg-gray-700 p-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
  >
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    <span className="mt-3 block text-blue-500 dark:text-blue-400 font-semibold hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300">
      Learn More →
    </span>
  </Link>
);
