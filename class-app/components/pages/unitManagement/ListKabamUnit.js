/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useRef } from "react";
import { Trash2, Search, UserRoundPlus, Pen } from "lucide-react";
import DeletePopUp from "../../global/DeletePopUp";
import AddPopUp from "../unitManagement/AddPopUp";
import EditPopUp from "../../global/EditPopUp";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function ListKabamUnit({
  data,
  unitId,
  markProp,
  inputProp,
  refreshProp,
  isSkeleton,
  deleteTrigger,
  formDetails,
  setFormDetails,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [roleInput, setRoleInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [kabamName, setKabamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const [popup, setPopUp] = useState({
    delete: false,
    add: false,
    edit: false,
  });
  async function setData() {
    const arrayOfSelected = formDetails.map((element) => {
      if (element.isSelected) {
        return element.id;
      }
    });
    try {
      const result = await refreshProp("kabams");
      setFormDetails(
        result?.map((kabam) => ({
          id: kabam.user_id,
          fullName: kabam.full_name,
          personalNumber: kabam.personal_number,
          roleName: kabam.role_name,
          isSelected: arrayOfSelected.includes(kabam.user_id),
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  }

  const deleteNotify = () => {
    toast.success("מחיקה התבצעה בהצלחה", {});
  };
  const editNotify = () => {
    toast.success("עריכה התבצעה בהצלחה", {});
  };
  useEffect(() => {
    const kabams = [];
    data?.map((kabam) => {
      kabams.push({
        id: kabam.user_id,
        fullName: kabam.full_name,
        personalNumber: kabam.personal_number,
        roleName: kabam.role_name,
        isSelected: false,
      });
    });
    setFormDetails(kabams);
  }, [data]);
  useEffect(() => {
    let newDetails = formDetails.map((item) => ({
      ...item,
      isSelected: false,
    }));
    if (deleteTrigger) {
      setFormDetails(newDetails);
    }
  }, [deleteTrigger]);
  function markSelected() {
    if (unitId !== null) {
      const arr = markProp;
      setFormDetails(
        formDetails.map((mabam) => {
          const isNameInArr = arr.some(
            (item) => mabam.personalNumber === item.personal_number
          );
          if (isNameInArr) {
            return {
              ...mabam,
              isSelected: true,
            };
          } else
            return {
              ...mabam,
              isSelected: false,
            };
        })
      );
    }
  }
  useEffect(() => {
    markSelected();
  }, [markProp]);
  useEffect(() => {
    inputProp(formDetails);
  }, [formDetails]);
  async function handleDelete(id) {
    setIsLoading(true);
    try {
      await axios.delete(`bam/delete-kabam/${id}`);
      setData();
      deleteNotify();
    } catch (err) {
      console.error(err);
      toast.error(err?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  function handleOpen(e) {
    setSelectedId(e.currentTarget.id);
    setRoleInput(e.currentTarget.name.slice(5, e.currentTarget.name.length));
    e.currentTarget.value === "delete"
      ? setPopUp((prev) => ({ ...prev, delete: true }))
      : e.currentTarget.value === "add"
      ? setPopUp((prev) => ({ ...prev, add: true }))
      : e.currentTarget.value === "edit" &&
        setPopUp((prev) => ({ ...prev, edit: true }));
    setKabamName(
      popup.edit
        ? e.currentTarget.name.slice(5, e.currentTarget.name.length)
        : e.currentTarget.name
    );
  }
  function handleClose() {
    setKabamName("");
    setRoleInput("");
    popup.delete
      ? setPopUp((prev) => ({ ...prev, delete: false }))
      : popup.add
      ? setPopUp((prev) => ({ ...prev, add: false }))
      : popup.edit && setPopUp((prev) => ({ ...prev, edit: false }));
  }
  function handleInputChange(e) {
    setSearchInput(e.currentTarget.value);
  }
  function handleRoleChange(e) {
    setRoleInput(e.currentTarget.value);
  }
  async function handleRoleEdit(id) {
    setIsLoading(true);
    try {
      await axios.put(`bam/update-kabam/${id}`, {
        role_name: `קב"ם ${roleInput}`,
      });
      setRoleInput("");
      setData();
      editNotify();
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    } finally {
      setIsLoading(false);
    }
  }
  function handleSearchTrigger(array) {
    if (searchInput !== "") {
      const obj = array.find((kabam) => kabam.fullName === searchInput);
      if (!obj) {
        toast.error("אין תוצאות");
        return;
      }
      const el = document.getElementById(`row ${obj.id}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }
      el.style.border = "4px solid #94A8D4";
      setTimeout(() => {
        el.style.border = "";
      }, 3000);
    }
  }
  function isSelectedFunction(id) {
    const newFormDetails1 = formDetails.map((arr) => {
      if (arr.id === id && arr.isSelected === false) {
        return {
          ...arr,
          isSelected: true,
        };
      } else if (arr.id === id && arr.isSelected === true) {
        return {
          ...arr,
          isSelected: false,
        };
      } else {
        return {
          ...arr,
        };
      }
    });
    setFormDetails(newFormDetails1);
  }
  return (
    <>
      <div>
        <div className="flex gap-2 items-center w-full mb-3">
          <div className="flex items-center justify-between h-8 w-full p-2 border rounded-md border-dark_text mr-2">
            <input
              autoComplete="off"
              placeholder="חיפוש"
              className="focus:outline-none"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchTrigger(formDetails);
                  searchRef.current.blur();
                }
              }}
              ref={searchRef}
            />
            <button onClick={() => handleSearchTrigger(formDetails)}>
              <Search />
            </button>
          </div>
          <button
            onClick={handleOpen}
            value="add"
            className="bg-[#EDF0F7] p-1 rounded-md"
          >
            <UserRoundPlus className="text-footer_blue" />
          </button>
        </div>
        {!isSkeleton && (!formDetails || formDetails.length === 0) && (
          <div className="w-full flex items-start justify-center">
            <p className="text-gray-500 text-lg mt-2 ml-20">לא קיימים קב"מים</p>
          </div>
        )}
        {isSkeleton && (
          <div className="w-full flex flex-col items-start">
            <div className="w-full flex flex-col">
              <Skeleton count={5} height={30} className="mt-2" />
            </div>
          </div>
        )}
        <div className="custom-scrollbar overflow-y-auto max-h-[28rem]">
          {!isSkeleton &&
            formDetails?.map((row, index) => {
              return (
                <div key={index} className="flex items-center p-2">
                  {row ? (
                    <div
                      id={`row ${row.id}`}
                      className={`rounded-xl mx-3 py-3  w-full flex items-center justify-end px-5 cursor-pointer`}
                    >
                      <p
                        name={row.fullName}
                        className="pr-4 rtl"
                      >{` ${row.roleName} (${row.fullName})`}</p>
                      <input
                        onClick={() => {
                          isSelectedFunction(row.id);
                        }}
                        disabled={!unitId}
                        checked={row.isSelected}
                        type="checkbox"
                        className="custom-radio font-semibold text-xl text-[#3B445C]"
                        name="kabam"
                      />
                    </div>
                  ) : (
                    <Skeleton height={30} />
                  )}
                  <button
                    className="w-10"
                    value="delete"
                    id={row.id}
                    name={row.fullName}
                    onClick={(e) => handleOpen(e, index)}
                  >
                    <Trash2 className=" justify-end text-footer_blue" />
                  </button>
                  <button
                    name={row.roleName}
                    value="edit"
                    onClick={handleOpen}
                    id={row.id}
                  >
                    <Pen className="w-8 ml-2 justify-start text-footer_blue" />
                  </button>
                </div>
              );
            })}
          {popup.edit && (
            <EditPopUp
              handleChange={handleRoleChange}
              HandleSave={() => handleRoleEdit(selectedId)}
              HandleClose={handleClose}
              type={"kabam"}
              name={kabamName}
            />
          )}
          {popup.add && (
            <AddPopUp
              type="kabam"
              HandleClose={handleClose}
              name="קבם"
              data={data}
              refreshKabamList={setData}
            />
          )}
        </div>
      </div>
      {popup.delete && (
        <DeletePopUp
          handleDeleteProp={() => handleDelete(selectedId)}
          HandleClose={handleClose}
          type={"kabam"}
          name={kabamName}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
}
