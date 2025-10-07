import React from "react";

export default function Report({ text, subText, handleClick }) {
  return (
    <div className="flex flex-row justify-between items-center bg-[#EDF0F7] rounded-md w-full  p-3">
      <button
        onClick={handleClick}
        className="text-white bg-[#7489C4] text-right font-normal rounded-md p-1.5"
      >
        Excel ייצא לקובץ
      </button>
      <div className="flex flex-col items-end justify-center gap-1">
        <h1 className="text-dark_text font-semibold text-2xl">{text}</h1>
        <p className="text-[#7489C4] font-normal text-xl">{subText}</p>
      </div>
    </div>
  );
}
