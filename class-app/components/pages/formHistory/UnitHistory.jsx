import React, { useEffect, useState } from "react";
import ViewForm from "./ViewForm";
import axios from "@/lib/axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function UnitHistory({
  unitNum,
  onItemClick,
  isClicked,
  selectedItem,
  hasName,
  data,
  foundId,
}) {
  const [name, setName] = useState("");
  function handleClick(id, date) {
    onItemClick(unitNum, id, date);
  }
  const setUnitName = async (id) => {
    if (hasName) {
      try {
        const result = await axios.get(`units/${id}`);
        setName(result?.data.name);
      } catch (error) {
        toast.error(error?.response.data);
        console.error(error);
      }
    }
  };
  function scrollToResult(id) {
    let idsArray = data.map((element) => Number(element.id));
    if (!idsArray.includes(id)) {
      return;
    } else {
      const el = document.getElementById(id);
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
  useEffect(() => {
    setUnitName(unitNum);
  }, []);
  useEffect(() => {
    scrollToResult(foundId);
  }, [foundId]);
  return (
    <>
      {hasName && (
        <h1 className="text-center text-[#3B445C] font-medium mt-1 py-2 text-xl">
          {name}
        </h1>
      )}
      <div
        className={`w-full custom-scrollbar scrollbar-small p-0 overflow-y-auto items-center max-h-[18em] mt-4`}
      >
        <div className="flex flex-col gap-4 w-full">
          {data?.map((row, index) => (
            <ViewForm
              key={index}
              isSelected={isClicked && selectedItem === row.id}
              handleClickProp={() => handleClick(row.id, row.created_at)}
              date={row.created_at}
              num={row.num}
              id={Number(row.num)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
