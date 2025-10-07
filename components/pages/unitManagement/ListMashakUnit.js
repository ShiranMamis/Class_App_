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
export default function ListMashakUnit({
  data,
  unitId,
  markProp,
  inputProp,
  refreshProp,
  deleteTrigger,
  isSkeleton,
  formDetails,
  setFormDetails,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [mabamName, setMabamName] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  async function setData() {
    const arrayOfSelected = formDetails.map((element) => {
      if (element.isSelected) {
        return element.id;
      }
    });
    try {
      const result = await refreshProp("mabams");
      setFormDetails(
        result?.map((mabam) => ({
          id: mabam.user_id,
          fullName: mabam.full_name,
          personalNumber: mabam.personal_number,
          roleName: mabam.role_name,
          isSelected: arrayOfSelected.includes(mabam.user_id),
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
  const errorNofify = () => {
    toast.error("קרתה שגיאה בעת ביצוע הפעולה, אנא נסה שוב מאוחר יותר", {});
  };
  useEffect(() => {
    const mabams = [];
    data?.map((mabam) => {
      mabams.push({
        id: mabam.user_id,
        fullName: mabam.full_name,
        personalNumber: mabam.personal_number,
        roleName: mabam.role_name,
        isSelected: false,
      });
    });
    setFormDetails(mabams);
  }, [data]);
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
    let newDetails = formDetails.map((item) => ({
      ...item,
      isSelected: false,
    }));
    if (deleteTrigger) {
      setFormDetails(newDetails);
    }
  }, [deleteTrigger]);
  useEffect(() => {
    inputProp(formDetails);
  }, [formDetails]);
  async function handleDelete(id) {
    setIsLoading(true);
    try {
      await axios.delete(`bam/delete-mabam/${id}`);
      setData();
      deleteNotify();
    } catch (err) {
      console.error(err);
      errorNofify();
    } finally {
      setIsLoading(false);
    }
  }
  function handleInputChange(e) {
    setSearchInput(e.currentTarget.value);
  }
  function handleSearchTrigger(array) {
    if (searchInput !== "") {
      const obj = array.find((kabam) => kabam.fullName === searchInput);
      if (!obj) {
        toast.error("אין תוצאות", {});
        return;
      }
      const el = document.getElementById(`mashak ${obj.id}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
        el.style.border = "2px solid #94A8D4";
        setTimeout(() => {
          el.style.border = "";
        }, 3000);
      }
    }
  }
  const [popup, setPopUp] = useState({
    delete: false,
    add: false,
    edit: false,
  });
  function handleOpen(e) {
    setSelectedId(e.currentTarget.id);
    setUserId(e.currentTarget.id);
    setRoleInput(e.currentTarget.name.slice(5, e.currentTarget.name.length));
    e.currentTarget.value === "delete"
      ? setPopUp((prev) => ({ ...prev, delete: true }))
      : e.currentTarget.value === "add"
      ? setPopUp((prev) => ({ ...prev, add: true }))
      : e.currentTarget.value === "edit" &&
        setPopUp((prev) => ({ ...prev, edit: true }));
    setMabamName(
      popup.edit
        ? e.currentTarget.name.slice(5, e.currentTarget.name.length)
        : e.currentTarget.name
    );
  }
  function handleClose() {
    setUserId(null);
    setMabamName("");
    setRoleInput("");
    popup.delete
      ? setPopUp((prev) => ({ ...prev, delete: false }))
      : popup.add
      ? setPopUp((prev) => ({ ...prev, add: false }))
      : popup.edit && setPopUp((prev) => ({ ...prev, edit: false }));
  }
  function handleRoleChange(e) {
    setRoleInput(e.currentTarget.value);
  }
  async function handleRoleEdit(id) {
    setIsLoading(true);
    try {
      await axios.put(`bam/update-mabam/${id}`, {
        role_name: `מש"ק ${roleInput}`,
      });
      setRoleInput("");
      setData();
      editNotify();
    } catch (error) {
      console.error(error);
      errorNofify();
    } finally {
      setIsLoading(false);
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
      <div className="flex gap-2 items-center w-full mb-3">
        <div className="flex items-center justify-between h-8 w-full p-2 border rounded-md border-dark_text">
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
          <p className="text-gray-500 text-lg mt-2 ml-20">
            לא קיימים משק"י ב"מ
          </p>
        </div>
      )}
      {isSkeleton && (
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex flex-col">
            <Skeleton duration={2} count={5} height={30} className="mt-2" />
          </div>
        </div>
      )}
      <div className="custom-scrollbar overflow-y-auto max-h-[28rem]">
        {!isSkeleton &&
          formDetails?.map((row, index) => {
            return (
              <div key={index} className="flex items-center p-2">
                <div
                  id={`mashak ${row.id}`}
                  className={`rounded-xl mx-3 py-3 w-full flex items-center justify-end px-5 cursor-pointer`}
                >
                  <p
                    name={row.fullName}
                    className="pr-4 rtl"
                  >{`${row.roleName} (${row.fullName})`}</p>
                  <input
                    onClick={() => {
                      isSelectedFunction(row.id);
                    }}
                    disabled={!unitId}
                    checked={row.isSelected}
                    type="checkbox"
                    className="custom-radio font-semibold text-xl text-[#3B445C]"
                    name="mashak"
                  />
                </div>
                <button
                  value="delete"
                  id={row.id}
                  name={row.fullName}
                  onClick={(e) => handleOpen(e)}
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
            HandleClose={handleClose}
            type={"mashak"}
            name={mabamName}
            handleChange={handleRoleChange}
            HandleSave={() => handleRoleEdit(selectedId)}
          />
        )}
        {popup.add && (
          <AddPopUp
            type="mashak"
            HandleClose={handleClose}
            name={"משק"}
            refreshKabamList={setData}
          />
        )}
      </div>
      {popup.delete && (
        <DeletePopUp
          handleDeleteProp={() => handleDelete(selectedId)}
          HandleClose={handleClose}
          type={"mashak"}
          name={mabamName}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
}
