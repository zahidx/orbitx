// components/ShareOptions.js
"use client"; // Ensure this file is a client-side component

import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaTwitter } from "react-icons/fa"; // Import icons from react-icons
import { Share2 } from "lucide-react"; // Import necessary icons

const ShareOptions = ({ showShareOptions, handleShare, shareRef }) => {
  if (!showShareOptions) return null;

  return (
    <div
      ref={shareRef}
      className="absolute bottom-16 left-2 bg-gray-800 text-white p-4 rounded-lg shadow-lg"
    >
      <button
        className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        onClick={() => handleShare("facebook")}
      >
        <FaFacebookF size={20} />
        <span>Facebook</span>
      </button>
      <button
        className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        onClick={() => handleShare("linkedin")}
      >
        <FaLinkedinIn size={20} />
        <span>LinkedIn</span>
      </button>
      <button
        className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        onClick={() => handleShare("whatsapp")}
      >
        <FaWhatsapp size={20} />
        <span>WhatsApp</span>
      </button>
      <button
        className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        onClick={() => handleShare("twitter")}
      >
        <FaTwitter size={20} />
        <span>Twitter</span>
      </button>
    </div>
  );
};

export default ShareOptions;
