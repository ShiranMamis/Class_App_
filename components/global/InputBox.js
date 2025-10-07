"use client";
import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

export default function InputBox({
  placeholder,
  underText,
  name,
  pattern,
  hasUnderText = false,
  textAlign = "right",
  isDisabled = false,
  defaultValue,
  hasTrash = false,
  handleChangeProp,
  underTextColor = "footer_blue",
  hasIcon = true,
  hasSpan = false,
  textError,
  spanName = "",
  minLength = 4,
  maxLength,
  isClicked,
}) {
  const [value, setValue] = useState("");
  const [validationText, setValidationText] = useState("");
  useEffect(() => {
    if (textError) {
      setValidationText(textError);
    } else {
      setValidationText("");
    }
  }, [textError]);
  useEffect(() => {
    if (isClicked && value === "") {
      setValidationText("לא ניתן להשאיר שדה זה ריק");
    }
  }, [isClicked, value]);
  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);
  function handleChange(e) {
    e.preventDefault();
    setValidationText("");
  }
  function handleInvalid(e) {
    e.preventDefault();
    if (value.length === 0) {
      setValidationText(
        name === "personPN" ? "מ.א ריק" : "לא ניתן להשאיר שדה זה ריק"
      );
    } else if (value.length <= 3 && name === "contactPhone") {
      setValidationText("טלפון של איש קשר לא תקין");
    } else if (
      value.length > 0 &&
      value.length < minLength &&
      name !== "contactPhone"
    ) {
      setValidationText(
        name === "personPN" ? "מ.א לא תקין" : "מינימום 4 תווים"
      );
    }
  }

  return (
    <>
      <div
        className={`flex items-center justify-between mb-1 py-1 ${
          validationText
            ? "border-b-4 border-b-red-600"
            : "border-b border-b-dark_text"
        }`}
        dir="rtl"
      >
        {hasTrash && value.length > 0 && (
          <XCircle
            className="cursor-pointer ml-3 size-"
            onClick={() => {
              setValue("");
            }}
          />
        )}
        {hasSpan && (
          <p className="text-right pl-1 text-[14px] shrink-0">{spanName}</p>
        )}
        <input
          placeholder={placeholder}
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
            handleChange(e);
            if (handleChangeProp) {
              handleChangeProp(e);
            }
          }}
          className={`outline-none placeholder:text-dark_text focus:placeholder:text-gray-400 w-full disabled:bg-transparent text-${textAlign} text-[15px] ${
            name === "personName" && "truncate"
          }`}
          pattern={pattern}
          disabled={isDisabled}
          onInvalid={(e) => handleInvalid(e)}
          minLength={minLength}
          maxLength={maxLength !== undefined ? maxLength : "false"}
          required
          autoComplete="off"
        />
      </div>

      <p
        className={`${
          validationText !== "" ? "text-red-600" : `text-${underTextColor}`
        } mr-1 mt-0.5 text-sm ${
          isDisabled && !hasIcon && "text-center text-[13px]"
        }`}
      >
        {hasUnderText && validationText === "" && hasIcon && (
          <span className="ml-1">&#9432;</span>
        )}
        {validationText !== "" ? validationText : underText}
      </p>
    </>
  );
}
