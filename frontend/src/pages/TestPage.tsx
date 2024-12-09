import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* SVG Background */}
      <motion.img
        src="/assets/Vector.svg"
        alt="Background Animation"
        className="absolute inset-0 w-full h-full object-cover z-0"
        animate={{
          opacity: [1, 0.8, 0.4, 0.2, 0.4, 0.8, 1],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="w-full bg-opacity-0 bg-gray-800 text-white py-4 px-8">
          <ul className="flex justify-between">
            <li className="font-bold">Logo</li>
            <li>
              <a href="#about" className="px-4">About</a>
              <a href="#services" className="px-4">Services</a>
              <a href="#contact" className="px-4">Contact</a>
            </li>
          </ul>
        </nav>

        {/* Landing Content */}
        <header className="flex items-center justify-center h-[80vh] text-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold">Welcome to My Landing Page</h1>
            <p className="text-lg md:text-xl mt-4">Animated background with SVG and Tailwind</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">
              Get Started
            </button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default LandingPage;
