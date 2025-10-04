"use client";

import React from "react";

interface LoaderProps {
  text?: string; // Loader text, default "Generating"
  size?: number; // Diameter in px, default 250
}

const Loader: React.FC<LoaderProps> = ({ text = "Generating", size = 250 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[9999]">
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size, fontFamily: "Inter, sans-serif" }}
      >
        {/* Rotating loader circle */}
        <div className="absolute top-0 left-0 w-full aspect-square rounded-full animate-loader-rotate"></div>
      </div>

      <style jsx>{`
        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 36px 0 #ad5fff inset,
              0 72px 72px 0 #471eec inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 12px 0 #d60a47 inset,
              0 48px 72px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 36px 0 #ad5fff inset,
              0 72px 72px 0 #471eec inset;
          }
        }

        @keyframes loader-letter-anim {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.2);
          }
          40% {
            opacity: 0.7;
            transform: translateY(-3px);
          }
        }

        .animate-loader-rotate {
          animation: loader-rotate 2s linear infinite;
          background-color: transparent;
        }

        .animate-loader-letter {
          animation: loader-letter-anim 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
