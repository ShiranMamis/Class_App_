"use client";
import React from "react";

import SelectBox from "./SelectBox";
import InputBox from "../../global/InputBox";
import DateBox from "../../global/DateBox";

export default function Form({
  isDisabled = false,
  handleChangeProp,
  details,
  errors,
  isClicked,
  industries,
  maxDate,
  minDate,
  dateChanged,
}) {
  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    return dateString.replaceAll("-", "/");
  }
  return (
    <div className="grid grid-cols-2 gap-y-7 gap-x-28">
      <div className="col-span-full">
        {!isDisabled ? (
          <SelectBox
            options={industries}
            placeholder="תעשייה רצויה"
            handleChangeProp={handleChangeProp}
            name="industry"
            isDisabled={isDisabled}
            isClicked={isClicked[0]}
            textError={errors?.industry_id?.join("")}
          />
        ) : (
          <InputBox
            isDisabled={isDisabled}
            hasUnderText={true}
            underText="תעשייה רצויה"
            placeholder="תעשייה רצויה"
            defaultValue={details.industry}
          />
        )}
      </div>

      <div className="col-span-1">
        {!isDisabled ? (
          <DateBox
            id="start"
            name="startDate"
            placeholder="תאריך התחלה"
            isClicked={isClicked[1] || isClicked[0]}
            handleChangeProp={handleChangeProp}
            dateError={errors?.start_date || ""}
          />
        ) : (
          <InputBox
            isDisabled={true}
            hasUnderText={true}
            underText="תאריך התחלה"
            defaultValue={formatDate(details.start_date)}
          />
        )}
      </div>
      <div className="col-span-1">
        {!isDisabled ? (
          <DateBox
            id="end"
            name="endDate"
            placeholder="תאריך סיום"
            isClicked={isClicked[1] || isClicked[0]}
            handleChangeProp={handleChangeProp}
            defaultValue={isDisabled && details.end_date}
            dateError={errors?.end_date || ""}
            dateChanged={dateChanged}
            max={maxDate}
            min={minDate}
          />
        ) : (
          <InputBox
            isDisabled={true}
            hasUnderText={true}
            underText="תאריך סיום"
            defaultValue={formatDate(details.end_date)}
          />
        )}
      </div>
      <div className="col-span-full">
        <InputBox
          name="visitTopic"
          placeholder="סיבת הביקור"
          isDisabled={isDisabled}
          hasUnderText={true}
          hasIcon={true}
          underTextColor={!isDisabled ? "red-600" : "footer_blue"}
          underText={
            isDisabled ? "סיבת הביקור" : 'נא לכתוב מידע בסיווג בלמ"ס בלבד'
          }
          handleChangeProp={handleChangeProp}
          defaultValue={isDisabled && details.visit_topic}
          textError={errors?.visit_topic || ""}
          isClicked={isDisabled ? false : isClicked[1]}
        />
      </div>
      <div className="col-span-1">
        <InputBox
          name="contactName"
          placeholder="שם איש קשר"
          hasUnderText={true}
          underText={isDisabled ? "שם איש קשר" : "לפחות 4 תווים, ללא סימנים"}
          isDisabled={isDisabled}
          handleChangeProp={handleChangeProp}
          defaultValue={isDisabled && details.contact_name}
          textError={errors?.contact_name || ""}
          isClicked={isDisabled ? false : isClicked[1]}
        />
      </div>
      <div className="col-span-1">
        <InputBox
          name="contactPhone"
          placeholder="מס' טלפון איש קשר"
          hasUnderText={true}
          underText={isDisabled ? "מס' טלפון איש קשר" : "טלפון נייד בלבד"}
          isDisabled={isDisabled}
          handleChangeProp={handleChangeProp}
          defaultValue={isDisabled && details.contact_phone}
          textError={errors?.contact_phone || ""}
          isClicked={isDisabled ? false : isClicked[1]}
        />
      </div>
    </div>
  );
}
