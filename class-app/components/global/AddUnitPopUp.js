import React, { useState } from "react";
import { X } from "lucide-react";
import InputBox from "./InputBox";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";
import { isValidHebrewWithNumbers } from "@/utilities/validations";
export default function AddUnitPopUp({ HandleClose, refreshOptionList, type }) {
  const addNotify = () => {
    toast.success("פעולה התבצעה בהצלחה");
  };
  const [optionName, setOptionName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd() {
    if (optionName === "") {
      setError("לא ניתן להשאיר שדה זה ריק");
    } else if (optionName !== "" && optionName.length < 4) {
      setError("מינימום 4 תווים");
    } else if (!isValidHebrewWithNumbers(optionName)) {
      setError("שדה לא תקין, רק עברית ומספרים");
    } else {
      setIsLoading(true);
      try {
        if (type === "יחידה")
          await axios.post("units", {
            name: optionName,
          });
        else
          await axios.post("industries", {
            name: optionName,
          });
        addNotify();
        setOptionName("");
        HandleClose();
        refreshOptionList();
      } catch (error) {
        console.error(error);
        toast.error(error.response.data);
      } finally {
        setIsLoading(false);
      }
    }
  }
  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
        <div className="w-1/4 h-1/4 bg-white rounded-lg shadow-lg">
          <div className="relative w-full h-full flex flex-col">
            <div className="h-3/4">
              <button
                onClick={() => HandleClose()}
                className="absolute left-1.5 top-1.5"
              >
                <X className=" text-gray-300 text-sm" />
              </button>
              <h1 className="text-right mt-1 mr-2 p-2 font-medium text-dark_text text-2xl">
                הוספת {type}
              </h1>
              <div
                className={`p-3 w-[90%] mt-4 flex items-center justify-center ${
                  type === "יחידה" ? "ml-9" : "mr-2"
                }`}
              >
                <div className="w-full">
                  <InputBox
                    value={optionName}
                    hasTrash={true}
                    isDisabled={false}
                    placeholder={`${
                      type === "מנהל מערכת" ? "שם מנהל המערכת" : `שם ה${type}`
                    }`}
                    handleChangeProp={(e) => {
                      setOptionName(e.target.value);
                      setError("");
                    }}
                    textError={error}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex gap-3 h-1/4 items-center p-4 ${
                type === "יחידה" ? "justify-end" : "justify-start"
              }
              rounded-lg bg-[#F4F4F4]`}
            >
              {type === "יחידה" ? (
                <>
                  <button
                    onClick={() => HandleClose()}
                    className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => handleAdd()}
                    className=" flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
                  >
                    שמור
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAdd()}
                    className=" flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
                  >
                    שמור
                  </button>
                  <button
                    onClick={() => HandleClose()}
                    className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
                  >
                    ביטול
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </>
  );
}
