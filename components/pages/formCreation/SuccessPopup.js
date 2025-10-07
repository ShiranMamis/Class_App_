/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { X, Check } from "lucide-react";
export default function SuccessPopup({ handleDownloadProp }) {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
      <div className="w-[25%] h-1/5 bg-white rounded-lg shadow-lg">
        <div className="relative w-full h-full flex flex-col">
          <div className=" h-3/4">
            <button
              type="reset"
              onClick={() => location.reload()}
              className="absolute left-1.5 top-1.5"
            >
              <X className="text-gray-300 text-sm" />
            </button>
            <div className="h-full flex flex-row items-center justify-center gap-4 text-right">
              <div className="bg-[#E5F4E5] rounded-full p-3 m-2">
                <Check className=" flex items-center  text-green-600 h-8 w-8 " />
              </div>
              <div className="text-right">
                <h1 className="text-[#3B445C] font-medium text-2xl">
                  הטופס הופק בהצלחה
                </h1>
                <p className="font-light text-lg text-[#888888] text-pretty">
                  על מנת להציג את הטופס, לחץ על "הצג"
                </p>
              </div>
            </div>
            <button
              className="absolute left-6
             bottom-5 text-white bg-[#3B445C] px-3 py-2  rounded-[7px]"
              onClick={handleDownloadProp}
            >
              הצג
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
