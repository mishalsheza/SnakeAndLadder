import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Dice3D.css";

const Dice3D = ({ rolling, value }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (rolling) {
      controls.start({
        rotateX: [0, 360],
        rotateY: [0, 360],
        transition: { duration: 1, ease: "linear", repeat: Infinity },
      });
    } else {
      const rotations = {
        1: { rotateX: 0, rotateY: 0 },    // Front
        2: { rotateX: 90, rotateY: 0 },   // Bottom
        3: { rotateX: 0, rotateY: 90 },   // Left
        4: { rotateX: 0, rotateY: -90 },  // Right
        5: { rotateX: -90, rotateY: 0 },  // Top
        6: { rotateX: 180, rotateY: 0 },  // Back
      };

      const target = rotations[value] || rotations[1];
      
      controls.start({
        rotateX: target.rotateX,
        rotateY: target.rotateY,
        transition: { duration: 0.8, type: "spring", stiffness: 40, damping: 10 },
      });
    }
  }, [rolling, value, controls]);

  // Helper to render dots based on number
  const renderFaceContent = (num) => {
      // 1-6 standard dice patterns using 3x3 grid
      // 0 1 2
      // 3 4 5
      // 6 7 8
      const dotPatterns = {
          1: [4],
          2: [0, 8],
          3: [0, 4, 8],
          4: [0, 2, 6, 8],
          5: [0, 2, 4, 6, 8],
          6: [0, 2, 3, 5, 6, 8]
      };
      
      const dots = dotPatterns[num] || [];
      
      return (
          <div className="dice-face-grid">
              {[...Array(9)].map((_, i) => (
                  <div key={i} className={`dice-dot-slot`}>
                      {dots.includes(i) && <div className="dice-dot" />}
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="scene">
      <motion.div className="cube" animate={controls}>
        <div className="cube__face cube__face--front">
            {renderFaceContent(1)}
        </div>
        <div className="cube__face cube__face--back">
            {renderFaceContent(6)}
        </div>
        <div className="cube__face cube__face--right">
            {renderFaceContent(4)}
        </div>
        <div className="cube__face cube__face--left">
            {renderFaceContent(3)}
        </div>
        <div className="cube__face cube__face--top">
            {renderFaceContent(5)}
        </div>
        <div className="cube__face cube__face--bottom">
            {renderFaceContent(2)}
        </div>
      </motion.div>
    </div>
  );
};

export default Dice3D;
