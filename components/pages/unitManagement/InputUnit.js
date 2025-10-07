import React, { useEffect, useState } from "react";
import InputBox from "../../global/InputBox";

export default function InputUnit({
  unitName,
  kabamName,
  mashakName,
  deleteTrigger,
}) {
  const [kabamNames, setKabamNames] = useState("");
  const [mabamNames, setMabamNames] = useState("");
  const [unit, setUnit] = useState("");
  useEffect(() => {
    if (deleteTrigger) {
      setKabamNames("");
      setMabamNames("");
      setUnit("");
    }
  }, [deleteTrigger]);
  useEffect(() => {
    setKabamNames(kabamName?.toString());
  }, [kabamName]);
  useEffect(() => {
    setMabamNames(mashakName?.toString());
  }, [mashakName]);
  useEffect(() => {
    setUnit(unitName);
  }, [unitName]);
  return (
    <div className="grid grid-cols-2 w-full gap-y-4 gap-x-28">
      <>
        <div className="col-span-full">
          <InputBox
            placeholder=" שם היחידה"
            isDisabled={true}
            defaultValue={unit}
          />
        </div>
        <div className="col-span-1">
          <InputBox
            placeholder='קב"ם'
            isDisabled={true}
            defaultValue={kabamNames}
          />
        </div>
        <div className=" col-span-1">
          <InputBox
            placeholder='משק"י ב"מ'
            isDisabled={true}
            defaultValue={mabamNames}
          />
        </div>
      </>
    </div>
  );
}
