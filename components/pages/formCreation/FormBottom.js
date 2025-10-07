/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { UserRoundPlus } from "lucide-react";
import RowCreation from "../../global/RowCreation";

export default function FormBottom({
  handleAddProp,
  handleDeleteProp,
  handleChangeProp,
  isTryToAdd,
  formDetails,
}) {
  let isFirst = formDetails.length === 1;

  const prevFormDetailsLengthRef = useRef(formDetails.length);

  useEffect(() => {
    const el = document.getElementById("scroll");
    if (formDetails.length > prevFormDetailsLengthRef.current && !isTryToAdd) {
      el.scrollIntoView({
        block: "end",
        inline: "center",
      });
    }
    prevFormDetailsLengthRef.current = formDetails.length;
  }, [formDetails, isTryToAdd]);

  return (
    <>
      <div
        className={`custom-scrollbar scrollbar-small overflow-y-auto max-h-[7.5rem] p-1`}
      >
        <div id="scroll" className={`grid grid-cols-8 gap-x-3 gap-y-2`}>
          {formDetails.map((row, index) => (
            <RowCreation
              key={row.id}
              index={index}
              data={formDetails[index]}
              handleChangeProp={(event, index) =>
                handleChangeProp(event, index)
              }
              isFirst={isFirst}
              handleDeleteProp={() => handleDeleteProp(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center p-4 ">
        {formDetails.length < 10 && (
          <button
            type="button"
            onClick={handleAddProp}
            className="flex items-center justify-center gap-2 py-1.5 bg-[#EDF0F7] w-28 rounded-md text-footer_blue"
          >
            <UserRoundPlus className="w-5" /> הוסף
          </button>
        )}
      </div>
    </>
  );
}
