/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { X } from "lucide-react";
import InputBox from "./InputBox";
import {
  isValidHebrew,
  isValidHebrewWithNumbers,
} from "@/utilities/validations";
import "react-toastify/dist/ReactToastify.css";
export default function EditPopUp({
  HandleClose,
  type,
  name,
  HandleSave,
  handleChange,
}) {
  const [inputValue, setInputValue] = useState(
    type === "kabam" || type === "mashak" ? name.slice(5, name.length) : name
  );
  const [textError, setTextError] = useState("");
  function handleClickClose() {
    HandleClose();
  }
  function handleInputChange(event) {
    setTextError("");
    setInputValue(event.target.value);
  }

  function handleClickSave() {
    if (inputValue.length < 4) {
      setTextError(
        inputValue.length === 0
          ? "לא ניתן להשאיר שדה זה ריק"
          : "מינימום 4 תווים"
      );
      return;
    } else if (
      (type === "industry" || type === "unit") &&
      !isValidHebrewWithNumbers(inputValue)
    ) {
      setTextError("יש להזין רק שדות בעברית");
      return;
    } else if (
      !isValidHebrew(inputValue) &&
      type !== "industry" &&
      type !== "unit"
    ) {
      setTextError("יש להזין רק שדות בעברית");
      return;
    }
    HandleSave();
    handleClickClose();
  }
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
      <div className="w-1/4 h-1/4 bg-white rounded-lg shadow-lg">
        <div className="relative w-full h-full flex flex-col">
          <div className=" h-3/4">
            <button
              onClick={handleClickClose}
              className="absolute left-1.5 top-1.5"
            >
              <X className="text-gray-300 text-sm" />
            </button>
            <div className="h-full flex flex-col items-center justify-center gap-4 text-right">
              <div>
                <h1 className="text-[#3B445C] font-medium text-2xl">
                  עריכת{" "}
                  {type === "unit"
                    ? "יחידה"
                    : type === "kabam"
                    ? 'קב"ם'
                    : type === "mashak"
                    ? 'מש"ק ב"מ'
                    : type === "industry" && "תעשיות"}
                </h1>
                <p className="font-light rtl text-lg text-[#888888]">
                  {type === "kabam"
                    ? 'האם ברצונך לערוך את תפקיד הקב"מ?'
                    : type === "mashak"
                    ? 'האם ברצונך לערוך את תפקיד מש"ק הב"מ?'
                    : `האם ברצונך לערוך את שם ה${
                        type === "industry" ? "תעשייה" : "יחידה"
                      }?`}
                </p>
                <InputBox
                  defaultValue={
                    type === "kabam"
                      ? name.slice(5, name.length)
                      : type === "mashak"
                      ? name.slice(9, name.length)
                      : name
                  }
                  textError={textError}
                  handleChangeProp={(event) => {
                    handleChange(event);
                    handleInputChange(event);
                  }}
                  hasSpan={true}
                  spanName={
                    type === "kabam"
                      ? 'קב"ם'
                      : type === "mashak"
                      ? 'מש"ק ב"מ'
                      : ""
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`flex gap-3 h-1/4  items-center p-4 ${
              type === "unit" || type === "kabam" || type === "mashak"
                ? "justify-end"
                : "justify-start"
            } rounded-lg bg-[#F4F4F4]`}
          >
            {type === "industry" ? (
              <>
                <button
                  onClick={handleClickSave}
                  className="flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
                >
                  שמור
                </button>

                <button
                  onClick={handleClickClose}
                  className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
                >
                  ביטול
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleClickClose}
                  className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
                >
                  ביטול
                </button>
                <button
                  onClick={handleClickSave}
                  className="flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
                >
                  שמור
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
