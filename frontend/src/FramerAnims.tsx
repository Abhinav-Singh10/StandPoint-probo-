// import Homepage from "./pages/Homepage"
import { motion } from "framer-motion";

function FramerAnims() {
  const sectionVarinatOptions = {
    var1: {
      opacity: 0,
    }, // to tell just before the anim will run the opacity will  be the value
    var2: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, // this will allow each children of the components appear one after another
      },
    },
  };

  const divVarinatOptions = {
    var1: {
      opacity: 0,
    }, // to tell just before the anim will run the opacity will  be the value
    var2: {
      opacity: 1,
    },
  };

  return (
    <>
      {/* <Homepage/> */}
      <div className="flex flex-col gap-10 overflow-x-hidden">
        <motion.section
          variants={sectionVarinatOptions}
          initial="var1"
          animate="var2"
          className=" grid grid-cols-3 p-10 gap-10"
        >
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          >
            <motion.div
              className="w-20 h-20 bg-stone-100 rounded-lg"
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{ duration: 1, ease: "backInOut", repeatDelay:1 , delay: 0.2, repeat:3 }}
              
            />
            <motion.div
              className="w-20 h-20 bg-stone-100 rounded-full"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeIn", delay: 0.4 }}
            />
          </motion.div>
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          >
            <motion.div
              className="w-1/3 h-1/3 shadow-md bg-rose-400"
              animate={{
                scale: [1, 2, 2, 1],
                rotate: [0, 90, 90, 0],
                borderRadius: ["10%", "10%", "50%", "10%"],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: 3,
                repeatDelay: 1,
              }}
            />
          </motion.div>
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "#d1d5db",
                color: "black",
              }}
              transition={{ bounceDamping: 10, bounceStiffness: 600 }}
              className="bg-emerald-400 w-1/2 py-4 rounded-lg text-2xl text-gray-100 font-light tracking-wide"
            >
              Subscribe
            </motion.button>
          </motion.div>
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          >
            <motion.div
              className="w-1/3 h-1/3 bg-orange-500 rounded-3xl cursor-grab"
              drag
              dragConstraints={{
                top: -125,
                right: 125,
                bottom: 125,
                left: -125,
              }}
              dragTransition={{bounceStiffness:600, bounceDamping:100}}
            />
          </motion.div>
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          ></motion.div>
          <motion.div
            variants={divVarinatOptions}
            className="bg-slate-800 aspect-square rounded-lg justify-center flex items-center gap-10"
          ></motion.div>
        </motion.section>
      </div>
    </>
  );
}

export default FramerAnims;
