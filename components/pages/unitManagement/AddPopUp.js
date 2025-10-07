import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InputBox from "../../global/InputBox";
import SelectBox from "../formCreation/SelectBox";
import axios from "@/lib/axios";
import { isValidHebrew } from "@/utilities/validations";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddPopUp({
  HandleClose,
  type,
  isDisabled = false,
  refreshKabamList,
}) {
  const [usersNum, setUsersNum] = useState([]);
  const [textError, setTextError] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    if (isClicked) {
      setIsClicked(false);
    }
  }, [isClicked]);

  const errorNotify = (text) => {
    toast.error(text);
  };
  const addNotify = (text) => {
    toast.success(text);
  };

  const [details, setDetails] = useState({
    industry: "",
    input: "",
  });

  const handleSave = async () => {
    setIsClicked(true);
    if (details.input.length < 4) {
      setTextError(
        details.input.length === 0
          ? "לא ניתן להשאיר שדה זה ריק"
          : "מינימום 4 תווים"
      );
      return;
    } else if (!isValidHebrew(details.input)) {
      setTextError("להזין רק שדות בעברית");
      return;
    }

    if (type === "kabam") {
      try {
        await axios.post("bam/add-kabam", {
          user_id: details.industry.toString(),
          role_name: 'קב"ם' + " " + details.input,
        });
        addNotify('קב"ם התווסף בהצלחה');
        refreshKabamList();
        HandleClose();
      } catch (error) {
        console.error(error);
        errorNotify(error?.response.data[0]);
      }
    } else {
      try {
        await axios.post("bam/add-mabam", {
          user_id: details.industry.toString(),
          role_name: 'מש"ק ב"מ' + " " + details.input,
        });
        addNotify('מש"ק ב"ם התווסף בהצלחה');
        refreshKabamList();
        HandleClose();
      } catch (error) {
        console.error(error);
        errorNotify(error?.response.data[0]);
      }
    }
  };
  const fetchUsers = async () => {
    try {
      const result = await axios.get("users");
      setUsersNum(result?.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  };
  function handleChange(event) {
    let property = event.target.name;
    setDetails((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
        <div className="w-3/12 h-1/4 bg-white rounded-lg shadow-lg">
          <div className="relative w-full h-full flex flex-col">
            <div className="h-3/4">
              <button
                onClick={HandleClose}
                className="absolute left-1.5 top-1.5"
              >
                <X className=" text-gray-300 text-sm" />
              </button>
              <h1 className="text-right mt-1 mr-6 p-3 font-medium text-dark_text text-2xl">
                הוספת{" "}
                {type === "unit"
                  ? "יחידה"
                  : type === "kabam"
                  ? 'קב"ם'
                  : type === "mashak"
                  ? 'מש"ק ב"מ'
                  : type === "industry"
                  ? "תעשייה"
                  : ""}
              </h1>
              <div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className=" justify-between h-14 w-2/3 p-2 ">
                    <div className="col-span-full ">
                      <div>
                        <SelectBox
                          options={usersNum.map((user) => {
                            return {
                              label: user.personal_number,
                              value: user.id,
                            };
                          })}
                          isClicked={isClicked}
                          errorPosition="left"
                          handleChangeProp={handleChange}
                          name="industry"
                          isDisabled={isDisabled}
                          openMenuOnClick={false}
                          placeholder={`מספר אישי של ה${
                            type === "unit"
                              ? "יחידה"
                              : type === "kabam"
                              ? 'קב"ם'
                              : type === "mashak"
                              ? 'מש"ק ב"מ'
                              : type === "industry"
                              ? "תעשייה"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center mt-2">
                  <div className="justify-between h-14 w-2/3 mt-3 p-2 ">
                    <div className="col-span-full ">
                      <div>
                        <InputBox
                          hasSpan={true}
                          name="input"
                          spanName={
                            type === "kabam"
                              ? 'קב"ם'
                              : type === "mashak" && 'מש"ק ב"מ'
                          }
                          handleChangeProp={handleChange}
                          textError={textError}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 h-1/4 items-center p-4 justify-end rounded-lg bg-[#F4F4F4]">
              <button
                onClick={HandleClose}
                className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                className=" flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
