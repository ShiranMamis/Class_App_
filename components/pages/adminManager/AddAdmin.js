import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectBox from "../formCreation/SelectBox";
import LoadingSpinner from "@/components/global/LoadingSpinner";
export default function AddAdmin({ HandleClose, refreshOptionList }) {
  const addNotify = () => {
    toast.success("פעולה התבצעה בהצלחה", {});
  };
  const [optionId, setOptionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usersOptions, setUsersOptions] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const fetchUsers = async () => {
    try {
      const result = await axios.get("users");
      const transformedData = result?.data.map((option) => ({
        value: option.id,
        label: option.personal_number,
      }));

      setUsersOptions(transformedData);
    } catch (error) {
      console.error(error);
      toast.error(err?.response.data);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (isClicked) setIsClicked(false);
  }, [isClicked]);
  async function handleAdd() {
    if (optionId === null) {
      setIsClicked(true);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`users/add-admin/${optionId}`);
      addNotify();
      setOptionId(null);
      HandleClose();
      refreshOptionList();
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#7272729c] backdrop:blur-md">
        <div className="w-1/4 h-1/4 bg-white rounded-lg shadow-lg">
          <div className="relative w-full h-full flex flex-col">
            <div className="h-3/4">
              <button
                onClick={() => HandleClose()}
                className="absolute left-1.5 top-1.5"
              >
                <X className=" text-gray-300 text-sm" />
              </button>
              <h1 className="text-right mt-1 mr-2 p-2 font-medium text-dark_text text-2xl">
                הוספת מנהל מערכת
              </h1>
              <div className="p-3 w-full mt-3">
                <div>
                  <SelectBox
                    options={usersOptions}
                    value={optionId}
                    hasTrash={true}
                    isDisabled={false}
                    isClicked={isClicked}
                    placeholder="מספר אישי"
                    handleChangeProp={(e) => setOptionId(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 h-1/4 items-center p-4 justify-start rounded-lg bg-[#F4F4F4]">
              <button
                onClick={() => handleAdd()}
                className=" flex px-3 rounded-md text-white h-9 justify-center items-center bg-dark_text"
              >
                שמור
              </button>
              <button
                onClick={() => HandleClose()}
                className=" flex rounded-md border border-gray-300 items-center bg-white outline-[#D1D1D1] h-9 p-3"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </>
  );
}
