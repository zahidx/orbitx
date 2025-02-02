"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown button and menu
  const dropdownMenuRef = useRef(null); // Ref for dropdown menu

  useEffect(() => {
    // Load user preference from localStorage on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Apply dark or light theme based on the darkMode state
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setDropdownOpen(false); // Close the dropdown if click is outside
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gradient-to-r dark:from-[#0E1628] dark:to-[#380643] text-black dark:text-white fixed w-full z-50 shadow-md transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-wide flex items-center space-x-2 text-black dark:text-yellow-400">
          <span>🚀 OrbitX</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavItem href="/" hoverColor="hover:text-yellow-500">Home</NavItem>
          <NavItem href="/iss-tracker" hoverColor="hover:text-yellow-500">ISS Tracker</NavItem>
          <NavItem href="/neo-tracker" hoverColor="hover:text-yellow-500">NEO Tracker</NavItem>

          {/* Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 text-black dark:text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              <span>Explore</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div ref={dropdownMenuRef} className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg py-2 transition-all">
                <DropdownItem href="/exoplanets" hoverColor="hover:bg-yellow-500">Exoplanets</DropdownItem>
                <DropdownItem href="/earth-view" hoverColor="hover:bg-yellow-500">Earth View</DropdownItem>
                <DropdownItem href="/space-weather" hoverColor="hover:bg-yellow-500">Space Weather</DropdownItem>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 bg-opacity-90 transition-all duration-300">
          <div className="flex flex-col items-center py-4 space-y-4">
            <NavItem href="/" mobile hoverColor="hover:text-yellow-500">Home</NavItem>
            <NavItem href="/iss-tracker" mobile hoverColor="hover:text-yellow-500">ISS Tracker</NavItem>
            <NavItem href="/neo-tracker" mobile hoverColor="hover:text-yellow-500">NEO Tracker</NavItem>

            {/* Mobile Dropdown */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 text-lg text-black dark:text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              <span>Explore</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="flex flex-col items-center space-y-2">
                <DropdownItem href="/exoplanets" mobile hoverColor="hover:bg-yellow-500">Exoplanets</DropdownItem>
                <DropdownItem href="/earth-view" mobile hoverColor="hover:bg-yellow-500">Earth View</DropdownItem>
                <DropdownItem href="/space-weather" mobile hoverColor="hover:bg-yellow-500">Space Weather</DropdownItem>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={30} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ href, children, hoverColor, mobile }) => (
  <Link
    href={href}
    className={`${
      mobile
        ? "block py-2 text-lg"
        : `text-black dark:text-white hover:text-gray-700 dark:hover:text-yellow-400 transition-all duration-300 ${hoverColor}` 
    }`}
  >
    {children}
  </Link>
);

const DropdownItem = ({ href, children, hoverColor, mobile }) => (
  <Link
    href={href}
    className={`block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 ${hoverColor} transition ${mobile ? "text-lg" : ""}`}
  >
    {children}
  </Link>
);

export default Navbar;
