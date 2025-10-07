"use client";
import React from "react";
import InputBox from "./InputBox";
import { Trash2 } from "lucide-react";

export default function RowCreation({
  handleDeleteProp,
  handleChangeProp,
  index,
  data,
}) {
  function handleChange(event) {
    handleChangeProp(event, index);
  }
  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    return dateString.replaceAll("-", "/");
  }
  return (
    <>
      <div>
        <InputBox
          placeholder=" מס' טלפון"
          type="text"
          textAlign="center"
          isDisabled={true}
          name="personPhone"
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          defaultValue={data?.personPhone}
        />
      </div>

      <div>
        <InputBox
          placeholder=" ת.תחילת סיווג"
          type="text"
          textAlign="center"
          isDisabled={true}
          name="personClearanceDate"
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          defaultValue={formatDate(data?.personClearanceDate)}
        />
      </div>
      <div>
        <InputBox
          placeholder=" סיווג"
          type="text"
          textAlign="center"
          isDisabled={true}
          name="personClearance"
          handleChangeProp={handleChange}
          data-index={index}
          defaultValue={data?.personClearance}
        />
      </div>
      <div>
        <InputBox
          placeholder=" דרגה"
          type="text"
          textAlign="center"
          isDisabled={true}
          name="personRank"
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          defaultValue={data?.personRank}
        />
      </div>
      <div>
        <InputBox
          placeholder=" שם מלא"
          type="text"
          textAlign="center"
          name="personName"
          isDisabled={true}
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          defaultValue={data?.personName}
        />
      </div>
      <div>
        <InputBox
          placeholder="ת.ז"
          type="text"
          textAlign="center"
          isDisabled={true}
          name="personID"
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          defaultValue={data?.personID}
        />
      </div>
      <div>
        <InputBox
          placeholder="מספר אישי"
          type="text"
          textAlign="center"
          isDisabled={false}
          name="personPN"
          handleChangeProp={(e) => handleChange(e, e.target.dataset.index)}
          data-index={index}
          minLength={7}
          maxLength={7}
        />
      </div>
      <div className=" flex justify-center gap-2">
        <Trash2
          onClick={() => {
            handleDeleteProp();
          }}
          className="text-footer_blue"
        />
      </div>
    </>
  );
}
