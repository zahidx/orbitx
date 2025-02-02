"use client"; // Ensure this file is a client-side component

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Loader, X, Play, Pause, Download, Copy } from "lucide-react"; 
import { Share2 } from "lucide-react";

import toast from 'react-hot-toast'; // Import toast for notifications
import dynamic from 'next/dynamic';

// Dynamically import ShareOptions component
const ShareOptions = dynamic(() => import('./ShareOptions'), { ssr: false });

const EarthView = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for showing tooltip

  const shareRef = useRef(null); // Reference for share options

  useEffect(() => {
    const fetchEarthImages = async () => {
      const cachedImages = localStorage.getItem("earthImages");
      if (cachedImages) {
        setImages(JSON.parse(cachedImages));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.nasa.gov/EPIC/api/natural/images?api_key=DEMO_KEY`
        );
        if (!res.ok) throw new Error("Failed to fetch Earth images.");
        const data = await res.json();
        setImages(data);
        localStorage.setItem("earthImages", JSON.stringify(data));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthImages();
  }, []);

  const closeImageView = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextImage();
      }, 3000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedImage;
    link.download = `earth_image_${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(selectedImage).then(() => {
      toast.success("Link copied!");
      setTooltipVisible(true); // Show the tooltip after copy
      setTimeout(() => setTooltipVisible(false), 2000); // Hide the tooltip after 2 seconds
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 tracking-wide">
        🌍 Earth View
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-500" size={48} />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.slice(0, 9).map((img, index) => {
            const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${img.date
              .split(" ")[0]
              .replace(/-/g, "/")}/png/${img.image}.png`;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => {
                  setSelectedImage(imageUrl);
                  setCurrentIndex(index);
                }}
              >
                <Image
                  src={imageUrl}
                  alt="Earth from Space"
                  width={500}
                  height={500}
                  className="rounded-lg w-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/blur-placeholder.png"
                />
                <p className="text-center mt-2 text-sm opacity-80">
                  Captured on {img.date}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-md transition-opacity duration-300"
          onClick={closeImageView}
        >
          <div
            className="relative p-4 bg-black rounded-lg max-w-[90%] max-h-[90vh] shadow-lg border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeImageView();
              }}
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-red-500 transition-all z-60"
            >
              <X size={24} />
            </button>

            <div className="relative">
              <Image
                src={selectedImage}
                alt="Earth Full View"
                width={800}
                height={800}
                className="rounded-lg max-w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-blue-500 transition-all"
              >
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-blue-500 transition-all"
              >
                &gt;
              </button>
            </div>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
              {currentIndex + 1} / {images.length}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-green-500 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Download Button */}
            <div className="absolute top-2 left-2 bg-gray-700 text-white p-2 rounded-full hover:bg-blue-500 transition-all">
              <Download size={20} onClick={handleDownload} />
            </div>

            {/* Share Button */}
            <div
              className="absolute bottom-10 left-2 bg-gray-700 text-white p-2 rounded-full hover:bg-green-500 transition-all"
              onClick={() => setShowShareOptions(!showShareOptions)}
            >
              <Share2 size={20} />
            </div>

            {/* Share Options */}
            <ShareOptions
              selectedImage={selectedImage}
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
            />

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="absolute top-2 right-14 bg-gray-700 text-white p-2 rounded-full hover:bg-yellow-500 transition-all"
            >
              <Copy size={24} />
            </button>

            {tooltipVisible && (
              <div className="absolute top-2 right-8 bg-black text-white text-xs p-1 rounded-md">
                Link copied!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthView;
