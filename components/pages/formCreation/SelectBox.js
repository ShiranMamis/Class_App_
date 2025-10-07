import React, { useEffect, useState } from "react";
import Select from "react-select";

export default function SelectBox({
  options,
  name,
  handleChangeProp,
  isMulti = false,
  placeholder,
  isClicked,
  textError,
  errorPosition = "right",
}) {
  const [error, setError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  function handleChange(selectedOption) {
    setError(false);
    if (selectedOption?.value) {
      setSelectedOption(selectedOption);
      handleChangeProp({
        target: {
          name: name,
          value: selectedOption.value,
        },
      });
    } else {
      handleChangeProp({
        target: {
          name: name,
          value: null,
        },
      });
    }
  }
  useEffect(() => {
    if (isClicked && (!selectedOption?.value || textError)) {
      setError(true);
    } else if (isClicked && selectedOption?.value && !textError) {
      setError(false);
    }
  }, [isClicked]);
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderWidth: 1.5,
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderColor: error ? "#DC2626" : "rgba(59,   68,   92,   1)",
      borderWidth: error ? "2px" : "1px",
      borderRadius: 0,
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgba(59,   68,   92,   1)",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      borderTop: "none",
      borderBottom: "none",
      color: "rgba(59,   68,   92,   1)",
      "&:hover": {
        borderColor: "rgba(59,   68,   92,   1)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(59,   68,   92,   1)",
    }),
  };
  const displayPlaceholder = selectedOption?.value ? "" : placeholder;

  return (
    <>
      <Select
        options={options}
        name={name}
        onChange={handleChange}
        classNamePrefix="react-select"
        isSearchable
        isMulti={isMulti}
        isClearable
        placeholder={displayPlaceholder}
        noOptionsMessage={() => "אין תוצאות"}
        styles={customStyles}
        isRtl
        isLoading={options?.length === 0}
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      {error && (
        <p className={`text-red-600 text-${errorPosition}`}>
          לא ניתן להשאיר שדה זה ריק
        </p>
      )}
    </>
  );
}
