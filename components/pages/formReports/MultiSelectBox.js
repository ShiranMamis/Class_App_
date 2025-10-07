import React, { useState } from "react";
import Select from "react-select";

export default function MultiSelectBox({
  options,
  name,
  handleChangeProp,
  placeholder,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  function handleChange(selectedOptions) {
    if (selectedOptions) {
      setSelectedOption(selectedOptions);
      const values = selectedOptions.map((option) => option.value);
      handleChangeProp({
        target: {
          name: name,
          value: values,
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
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderWidth: 1.5,
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderColor: "rgba(59, 68, 92, 1)",
      borderWidth: "1px",
      borderRadius: 0,
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgba(59, 68, 92, 1)",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      borderTop: "none",
      borderBottom: "none",
      color: "rgba(59, 68, 92, 1)",
      "&:hover": {
        borderColor: "rgba(59, 68, 92, 1)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(59, 68, 92, 1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused && "rgba(59, 68, 92, 0.1)",
      color: "rgba(59, 68, 92, 1)",
      padding: 10,
      cursor: "pointer",
      ":active": {
        backgroundColor: "rgba(59, 68, 92, 0.3)",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(59, 68, 92, 0.1)",
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "rgba(59, 68, 92, 1)",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "rgba(59, 68, 92, 1)",
      ":hover": {
        backgroundColor: "rgba(59, 68, 92, 0.3)",
        color: "white",
      },
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
        isMulti
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
    </>
  );
}
