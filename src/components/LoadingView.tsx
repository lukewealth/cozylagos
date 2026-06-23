import React from 'react';
import { motion } from 'motion/react';

export default function LoadingView() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-parchment">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 font-serif italic text-gold-dark text-xl"
      >
        Preparing your luxury experience...
      </motion.p>
    </div>
  );
}
