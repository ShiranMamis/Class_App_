import React from "react";

export default function ViewForm({
  isSelected = false,
  handleClickProp,
  date = "01/10/2024",
  num = 122,
  id,
}) {
  return (
    <div
      id={id}
      onClick={handleClickProp}
      className={`rounded-xl mx-4 py-2 flex items-center justify-between px-2 cursor-pointer ${
        isSelected ? "bg-[#94A8D4]" : " bg-[#EDF0F7]"
      }`}
    >
      <p className={`${isSelected ? "text-white" : "text-footer_blue"}`}>
        {date}
      </p>

      <h1 className="font-semibold text-xl text-[#3B445C]">טופס {num}</h1>
    </div>
  );
}
