import { FC } from "react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const LandingLogo: FC = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen w-screen bg-black">
      <motion.img
        src="./assets/Vector.svg"
        alt="Shooting Line from the origin at center"
        animate={{ opacity: [1, 0.8, 0.4, 0.2, 0.4, 0.8, 1] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        className="h-full w-full object-cover z-0 absolute"
      />

      <div>
        {/* Responsive Navigation */}
        <nav className="z-10 fixed left-1/2 transform -translate-x-1/2 p-2 flex w-full max-w-screen-2xl justify-between items-center">
          <motion.img
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 , cursor:"pointer"}}
            src="./assets/eye button.png"
            className="sm:hidden ml-5 mr-4 w-12 text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          />
          {/* STANDPOINT LGOG */}
          <div className="hidden sm:flex items-center justify-between pt-3  ">
            <img
              src="./assets/Logo.png"
              alt="StandPoint Logo"
              className="w-24 sm: mx-auto sm: pt-2"
            />
            <div className="hidden sm:block font-extrabold tracking-tighter text-2xl font-archivoBlack pb-4 text-white ">
              STANDPOINT
            </div>
          </div>

          {/* Dropdown Menu for Small Screens */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } sm:hidden absolute top-12 left-0 w-1/3 p-4 mt-7 space-y-2`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section1Ref)}
              className="block w-full font-archivoBlack px-4 py-1 text-white text-left z-2"
            >
              TRADING
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section2Ref)}
              className="block w-full px-4 py-1 text-white font-archivoBlack text-left"
            >
              REWARDS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section2Ref)}
              className="block w-full px-4 py-1 text-white font-archivoBlack text-left"
            >
              INSIGHTS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section2Ref)}
              className="block w-full px-4 py-1 text-white font-archivoBlack text-left"
            >
              INVESTING
            </motion.button>
          </div>

          {/* NAV LINKS  */}
          <div className="hidden lg:flex justify-center items-center space-x-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section1Ref)}
              className="font-archivoBlack text-white"
            >
              TRADING
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section2Ref)}
              className=" text-white font-archivoBlack"
            >
              REWARDS
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section3Ref)}
              className=" text-white font-archivoBlack"
            >
              INSIGHTS
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(section3Ref)}
              className=" text-white font-archivoBlack"
            >
              INVESTING
            </motion.button>
          </div>

          {/* SIGNUP BUTTON */}
          <div className="py-6 sm:flex items-center justify-between mr-10 ">
            <Button>START TRADING</Button>
          </div>
        </nav>

        {/* Sections */}
        <div
          ref={section1Ref}
          className="min-h-screen flex items-center justify-center -z-2"
        >
          <h1 className="text-white text-4xl">Section 1</h1>
        </div>
        <div
          ref={section2Ref}
          className="min-h-screen flex items-center justify-center bg-green-500"
        >
          <h1 className="text-white text-4xl">Section 2</h1>
        </div>
        <div
          ref={section3Ref}
          className="min-h-screen flex items-center justify-center bg-red-500"
        >
          <h1 className="text-white text-4xl">Section 3</h1>
        </div>
      </div>
    </div>
  );
};

export default LandingLogo;
