import React, { useEffect, useState } from "react";
import { Trash2, Pen } from "lucide-react";
import DeletePopUp from "../../global/DeletePopUp";
import EditPopUp from "../../global/EditPopUp";
import AddUnitPopUp from "@/components/global/AddUnitPopUp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UnitForm({
  trigger,
  selectUnit,
  data = [],
  selectUnitId,
  refreshProp,
  unitId,
  isSkeleton,
  isClicked,
  deleteTrigger,
}) {
  const [unitIndex, setunitIndex] = useState(null);
  const [unitName, setUnitName] = useState("");
  const [input, setInput] = useState("");
  const [formDetails, setFormDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopUp] = useState({
    edit: false,
    delete: false,
    add: false,
  });
  async function setData() {
    try {
      const result = await refreshProp();
      setFormDetails(
        result?.map((unit) => ({
          id: unit.id,
          name: unit.name,
          isSelected: unitId === unit.id,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  }
  const deleteNotify = () => {
    toast.success("מחיקה התבצעה בהצלחה");
  };
  const editNotify = () => {
    toast.success("עריכה התבצעה בהצלחה");
  };
  useEffect(() => {
    let units = [];
    data?.map((unit) => {
      units.push({
        id: unit.id,
        name: unit.name,
        isSelected: false,
      });
    });
    setFormDetails(units);
  }, []);
  async function handleDelete(id) {
    setIsLoading(true);
    try {
      await axios.delete(`units/${id}`);
      deleteNotify();
      setData();
      deleteTrigger();
    } catch (err) {
      console.error(err);
      toast.error(err?.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInput(e) {
    setInput(e.currentTarget.value);
  }
  async function handleEdit(id) {
    if (input === unitName) {
      editNotify();
      setData();
      setInput("");
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`units/${id}`, {
        name: input,
      });
      editNotify();
      setData();
      setInput("");
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  function handleClick(id) {
    const newFormDetails = formDetails.map((bar) => {
      if (bar.id === id && bar.isSelected === false) {
        return {
          ...bar,
          isSelected: !bar.isSelected,
        };
      } else if (bar.id === id && bar.isSelected === true) {
        return bar;
      } else {
        return {
          ...bar,
          isSelected: false,
        };
      }
    });
    setFormDetails(newFormDetails);
  }
  function handleOpen(e) {
    setunitIndex(e.currentTarget.id);
    setUnitName(e.currentTarget.name);
    setInput(e.currentTarget.name);
    e.currentTarget.value === "edit"
      ? setPopUp((prev) => ({ ...prev, edit: true }))
      : e.currentTarget.value === "delete"
      ? setPopUp((prev) => ({ ...prev, delete: true }))
      : isClicked && setPopUp((prev) => ({ ...prev, add: true }));
  }

  function handleClose() {
    setUnitName("");
    setInput("");
    setunitIndex(null);
    popup.delete
      ? setPopUp((prev) => ({ ...prev, delete: false }))
      : popup.edit
      ? setPopUp((prev) => ({ ...prev, edit: false }))
      : popup.add && setPopUp((prev) => ({ ...prev, add: false }));
  }
  function handleInput(e) {
    setInput(e.currentTarget.value);
  }
  useEffect(() => {
    if (trigger === 0) return;
    fetchUnits();
  }, [trigger]);
  useEffect(() => {
    if (isClicked) {
      handleOpen(event);
    }
  }, [isClicked]);
  return (
    <>
      {isSkeleton && (
        <div className="w-full h-full flex flex-col items-center justify-center ">
          <div className="w-3/4 flex flex-col mt-1">
            <Skeleton count={10} height={40} />
          </div>
        </div>
      )}
      {!isSkeleton &&
        formDetails?.map((row, index) => {
          return (
            <div key={index} className="flex items-center p-2 mr-4">
              <div
                onClick={() => {
                  handleClick(row.id);
                  selectUnit(row.name);
                  selectUnitId(row.id);
                }}
                className={`rounded-xl mx-5 py-3 w-full flex items-center justify-end px-5 cursor-pointer ${
                  row.isSelected ? "bg-[#94A8D4]" : "bg-[#EDF0F7]"
                }`}
              >
                <h1 className="font-semibold text-xl h-6 text-[#3B445C]">
                  {row.name}
                </h1>
              </div>
              <button
                id={row.id}
                name={row.name}
                className="w-10"
                value="delete"
                onClick={(e) => handleOpen(e, index)}
              >
                <Trash2 className="justify-end text-footer_blue" />
              </button>
              <button
                name={row.name}
                value="edit"
                id={row.id}
                onClick={handleOpen}
              >
                <Pen className="w-8 ml-2 justify-start text-footer_blue" />
              </button>
            </div>
          );
        })}
      {popup.delete && (
        <DeletePopUp
          handleDeleteProp={() => handleDelete(unitIndex)}
          HandleClose={handleClose}
          type={"unit"}
          name={unitName}
        />
      )}
      {popup.edit && (
        <EditPopUp
          HandleClose={handleClose}
          handleChange={handleInput}
          HandleSave={() => handleEdit(unitIndex)}
          type={"unit"}
          name={input}
        />
      )}
      {popup.add && (
        <AddUnitPopUp
          HandleClose={handleClose}
          refreshOptionList={setData}
          type={"יחידה"}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
}
