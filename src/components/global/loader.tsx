"use client";

import React, { useEffect, useState } from "react";

interface LoaderProps {
  text?: string; // Loader text, default "Generating"
  size?: number; // Diameter in px, default 250
  visible?: boolean; // Control visibility with fade
}

const Loader: React.FC<LoaderProps> = ({
  text = "Generating",
  size = 250,
  visible = true,
}) => {
  const [show, setShow] = useState(visible);

  // Handle fade-in/out
  useEffect(() => {
    setShow(visible);
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-500 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size, fontFamily: "Inter, sans-serif" }}
      >
        {/* Rotating loader circle */}
        <div className="absolute top-0 left-0 w-full aspect-square rounded-full animate-loader-rotate"></div>

        {/* Optional animated text */}
        <span
          className="absolute text-white font-light text-lg"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {text}
        </span>
      </div>

      <style jsx>{`
        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg) scale(1);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 36px 0 #ad5fff inset,
              0 72px 72px 0 #471eec inset;
          }
          50% {
            transform: rotate(270deg) scale(1.05);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 12px 0 #d60a47 inset,
              0 48px 72px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg) scale(1);
            box-shadow: 0 12px 24px 0 #fff inset, 0 24px 36px 0 #ad5fff inset,
              0 72px 72px 0 #471eec inset;
          }
        }

        .animate-loader-rotate {
          animation: loader-rotate 2s linear infinite;
          background-color: transparent;
          border-radius: 50%;
          transition: transform 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Loader;
