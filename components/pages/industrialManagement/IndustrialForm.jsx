"use client";
import React, { useEffect, useState } from "react";
import { Trash2, Pen } from "lucide-react";
import InputBox from "../../global/InputBox";
import DeletePopUp from "../../global/DeletePopUp";
import EditPopUp from "@/components/global/EditPopUp";
import AddUnitPopUp from "@/components/global/AddUnitPopUp";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function IndustrialForm({ refreshProp, isSkeleton, data }) {
  const deleteNotify = () => {
    toast.success("מחיקה התבצעה בהצלחה");
  };
  const editNotify = () => {
    toast.success("עריכה התבצעה בהצלחה");
  };
  const [formDetails, setFormDetails] = useState([]);

  const setData = async () => {
    try {
      const result = await refreshProp();
      setFormDetails(
        result?.map((industry) => {
          return {
            id: industry.id,
            name: industry.name,
          };
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    setData();
  }, []);
  const [industrialsIndex, setIndustrialsIndex] = useState(null);
  const [industrialName, setIndustrialName] = useState("");
  const [modalName, setModalName] = useState("");
  const [popup, setPopUp] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  function handleOpen(e) {
    setIndustrialName(e.currentTarget.name);
    setModalName(e.currentTarget.name);
    setIndustrialsIndex(e.currentTarget.id);
    e.currentTarget.value === "edit"
      ? setPopUp((prev) => ({ ...prev, edit: true }))
      : e.currentTarget.value === "delete"
      ? setPopUp((prev) => ({ ...prev, delete: true }))
      : e.currentTarget.value === "add" &&
        setPopUp((prev) => ({ ...prev, add: true }));
  }
  function handleClose() {
    setIndustrialName("");
    setModalName("");
    setIndustrialsIndex(null);
    popup.delete
      ? setPopUp((prev) => ({ ...prev, delete: false }))
      : popup.edit
      ? setPopUp((prev) => ({ ...prev, edit: false }))
      : popup.add && setPopUp((prev) => ({ ...prev, add: false }));
  }
  async function handleDelete(id) {
    setIsLoading(true);
    try {
      await axios.delete(`industries/${id}`);
      setData();
      deleteNotify();
    } catch (err) {
      console.error(err);
      toast.error(err?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  function handleInput(e) {
    setIndustrialName(e.currentTarget.value);
  }

  async function handleEdit(id) {
    if (modalName === industrialName) {
      editNotify();
      setData();
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`industries/${id}`, {
        name: industrialName,
      });
      editNotify();
      setData();
    } catch (error) {
      console.error(error);
      toast.error(err?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <button
        value="add"
        className="flex text-center mt-3 bg-footer_blue text-white rounded-md items-center justify-center h-10 w-40 mx-auto"
        onClick={handleOpen}
      >
        הוסף תעשייה
      </button>
      {formDetails?.length === 0 && !isSkeleton && (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-xl mt-2">לא קיימות תעשיות</p>
        </div>
      )}
      {isSkeleton && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Skeleton count={10} height={30} width={720} className="mt-4" />
        </div>
      )}
      <div className="custom-scrollbar overflow-y-auto max-h-[32rem]">
        {formDetails?.map((row, index) => {
          return (
            <div
              key={index}
              className="flex gap-y-2 gap-x-12 mt-8 w-3/4 mx-auto"
            >
              <div className="w-full">
                <div className="flex">
                  <div className="w-full">
                    <InputBox isDisabled={true} defaultValue={row.name} />
                  </div>
                  <button
                    id={row.id}
                    onClick={(e) => handleOpen(e)}
                    name={row.name}
                    value="delete"
                  >
                    <Trash2 className="ml-5 text-footer_blue" />
                  </button>
                  <button
                    name={row.name}
                    value="edit"
                    onClick={handleOpen}
                    id={row.id}
                  >
                    <Pen className="w-8 ml-2 justify-start text-footer_blue" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {popup.delete && (
        <DeletePopUp
          HandleClose={handleClose}
          handleDeleteProp={() => handleDelete(industrialsIndex)}
          type="industry"
          name={industrialName}
        />
      )}
      {popup.edit && (
        <EditPopUp
          HandleClose={handleClose}
          HandleSave={() => handleEdit(industrialsIndex)}
          type="industry"
          name={industrialName}
          handleChange={handleInput}
        />
      )}
      {popup.add && (
        <AddUnitPopUp
          HandleClose={handleClose}
          type="תעשייה"
          refreshOptionList={setData}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
}
