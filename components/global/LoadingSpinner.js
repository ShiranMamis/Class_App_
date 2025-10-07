"use client";
import React from "react";
import { FadeLoader } from "react-spinners";

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
      <FadeLoader color="rgba(116, 137, 196, 1)" />
      <p className="text-xl mt-1 mr-4 font-normal">טוען...</p>
    </div>
  );
}

export default LoadingSpinner;
