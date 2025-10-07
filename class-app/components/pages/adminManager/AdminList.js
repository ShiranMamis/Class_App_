"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import InputBox from "../../global/InputBox";
import DeletePopUp from "../../global/DeletePopUp";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAdmin from "./AddAdmin";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function AdminList({ data = [], refreshProp, isSkeleton }) {
  const { user } = useAuth({ middleware: "auth" });
  const deleteNotify = () => {
    toast.success("מחיקה התבצעה בהצלחה", {});
  };
  const [formDetails, setFormDetails] = useState([]);
  const setData = async () => {
    try {
      const result = await refreshProp();
      setFormDetails(
        result?.map((admin) => {
          return {
            id: admin.id,
            name: admin.full_name,
            personalNumber: admin.personal_number,
          };
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(err?.response.data);
    }
  };
  useEffect(() => {
    setData();
  }, []);
  const [adminIndex, setAdminIndex] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [popup, setPopUp] = useState({
    add: false,
    delete: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleOpen(e) {
    setAdminName(e.currentTarget.name);
    setAdminIndex(e.currentTarget.id);
    e.currentTarget.value === "delete"
      ? setPopUp((prev) => ({ ...prev, delete: true }))
      : e.currentTarget.value === "add" &&
        setPopUp((prev) => ({ ...prev, add: true }));
  }
  function handleClose() {
    setAdminName("");
    setAdminIndex(null);
    popup.delete
      ? setPopUp((prev) => ({ ...prev, delete: false }))
      : popup.add && setPopUp((prev) => ({ ...prev, add: false }));
  }
  async function handleDelete(id) {
    setIsLoading(true);
    try {
      await axios.delete(`users/delete-admin/${id}`);
      setData();
      deleteNotify();
    } catch (err) {
      toast.error(err?.response.data);
      console.error(err);
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
        הוסף מנהל מערכת
      </button>
      {formDetails?.length === 0 && !isSkeleton && (
        <div className="w-full h-full flex items-center justify-center ">
          <p className="text-gray-500 text-xl mt-2">לא קיימים מנהלי מערכת</p>
        </div>
      )}
      {isSkeleton && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="w-full  flex flex-row items-center justify-center mt-4 gap-2">
            <Skeleton count={8} height={35} width={360} className="mt-4" />
            <Skeleton count={8} height={35} width={360} className="mt-4" />
          </div>
        </div>
      )}
      <div className="custom-scrollbar overflow-y-auto max-h-[32rem] mt-3">
        {formDetails?.map((row, index) => {
          return (
            <div
              key={index}
              className="flex gap-y-2 gap-x-12 mt-8 w-3/4 mx-auto"
            >
              <div className="w-full">
                <div className="flex gap-3">
                  <div className="w-full">
                    <InputBox
                      isDisabled={true}
                      defaultValue={row.personalNumber}
                    />
                  </div>
                  <div className="w-full">
                    <InputBox isDisabled={true} defaultValue={row.name} />
                  </div>

                  <button
                    id={row.id}
                    onClick={(e) => {
                      if (user?.personal_number === row.personalNumber) {
                        toast.error(
                          "לא ניתן למחוק את המשתמש אליו אתה מחובר",
                          {}
                        );
                        return;
                      }
                      handleOpen(e);
                    }}
                    name={row.name}
                    value="delete"
                  >
                    <Trash2
                      className={`ml-5 text-footer_blue ${
                        user?.personal_number === row.personalNumber &&
                        "cursor-not-allowed"
                      }`}
                    />
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
          handleDeleteProp={() => handleDelete(adminIndex)}
          type="admin"
          name={adminName}
        />
      )}
      {popup.add && (
        <AddAdmin
          HandleClose={handleClose}
          refreshOptionList={() => setData()}
        />
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
}
