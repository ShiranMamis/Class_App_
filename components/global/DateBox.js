import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import heLocale from "date-fns/locale/he";
import { Calendar } from "lucide-react";

export default function DateBox({
  placeholder,
  min,
  max,
  name,
  handleChangeProp,
  dateError,
  dateChanged = false,
  isClicked,
}) {
  const [validationText, setValidationText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (dateError?.length > 0) {
      setValidationText(dateError);
    } else {
      setValidationText("");
    }
  }, [dateError]);

  useEffect(() => {
    if (dateChanged && name === "endDate") {
      setSelectedDate(null);
    }
  }, [dateChanged, name]);

  useEffect(() => {
    if (isClicked && !selectedDate) {
      setValidationText("לא ניתן להשאיר שדה זה ריק");
    }
  }, [isClicked, selectedDate]);

  const handleDateChange = (date) => {
    setValidationText("");
    setSelectedDate(date);
    if (handleChangeProp) {
      handleChangeProp({ target: { name, value: date } });
    }
  };

  const openDatePicker = () => {
    if (name === "endDate" && !min) {
      setValidationText("יש למלא תאריך התחלה");
      return;
    }
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between mb-1 p-1 ${
          validationText
            ? "border-b-4 border-b-red-600"
            : "border-b border-b-dark_text"
        }`}
      >
        <DatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          locale={heLocale}
          placeholderText={placeholder}
          name={name}
          readOnly={name === "endDate" && !min}
          autoComplete="off"
          onInputClick={() => {
            if (name === "endDate" && !min) {
              setValidationText("יש למלא תאריך התחלה");
              return;
            }
          }}
          minDate={
            name === "startDate" ? new Date() : min ? new Date(min) : undefined
          }
          maxDate={
            name === "startDate"
              ? new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000)
              : max
              ? new Date(max)
              : undefined
          }
          className={`outline-none placeholder:text-dark_text focus:placeholder:text-gray-400 disabled:bg-transparent `}
        />
        <Calendar onClick={openDatePicker} />
      </div>
      {validationText && <p className="text-red-600">{validationText}</p>}
    </>
  );
}
