/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeletePopUp({
  HandleClose,
  type,
  name,
  handleDeleteProp,
}) {
  let multiTypetext =
    type === "unit"
      ? "היחידות"
      : type === "kabam"
      ? 'הקבמי"ם'
      : type === "mashak"
      ? 'מש"קי הב"מ'
      : type === "industry"
      ? "התעשיות"
      : type === "admin" && "מנהלי המערכת";
  function handleClickClose() {
    HandleClose();
  }
  function handleDelete() {
    handleDeleteProp();
  }

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
        <div className="w-3/12 h-1/4 bg-white rounded-lg shadow-lg">
          <div className="rtl relative w-full h-full flex flex-col">
            <div className=" h-3/4">
              <button
                onClick={handleClickClose}
                className="absolute left-1.5 top-1.5"
              >
                <X className=" text-gray-300 text-sm" />
              </button>
              <div className="h-full flex flex-row items-center justify-center gap-4 mx-2 text-right">
                <div className="bg-[#DC262633] rounded-full p-3">
                  <AlertTriangle className=" flex items-center text-red-600 h-8 w-8" />
                </div>
                <div className="text-right">
                  <h1 className="text-[#3B445C] font-medium text-2xl">
                    מחיקת{" "}
                    {type === "unit"
                      ? "יחידה"
                      : type === "kabam"
                      ? 'קב"ם'
                      : type === "mashak"
                      ? 'מש"ק ב"מ'
                      : type === "industry"
                      ? "תעשייה"
                      : type === "admin" && "מנהל מערכת"}
                  </h1>
                  <div className="font-light text-lg text-[#888888] text-pretty">
                    <p>האם אתה בטוח שאתה רוצה למחוק את '{name}' </p>
                    <p>מרשימת {multiTypetext} לצמיתות?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 h-1/4 items-center  p-4  justify-start rounded-lg bg-[#F4F4F4]">
              <button
                onClick={() => {
                  handleDelete();
                  handleClickClose();
                }}
                className=" flex px-3 rounded-md text-white h-9 justify-center items-center bg-[#DC2626]"
              >
                מחק {""}
                {type === "unit"
                  ? "יחידה"
                  : type === "kabam"
                  ? 'קב"ם'
                  : type === "mashak"
                  ? 'מש"ק ב"מ'
                  : type === "industry"
                  ? "תעשייה"
                  : type === "admin" && "מנהל מערכת"}
              </button>
              <button
                onClick={handleClickClose}
                className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
