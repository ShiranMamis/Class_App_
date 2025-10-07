import React, { useState, useRef } from "react";
import axios from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import useSWR from "swr";
import "react-loading-skeleton/dist/skeleton.css";
import UnitHistory from "./UnitHistory";

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export default function TotalHistory({
  handleItemClick,
  selectedItem,
  selectedUnit,
  selectedItemDate,
}) {
  const { user } = useAuth({ middleware: "guest" });
  const [searchInput, setSearchInput] = useState("");
  const [foundId, setFoundId] = useState(null);
  const searchRef = useRef(null);

  const { data: formsData, isLoading } = useSWR(() => {
    if (user) {
      if (user.roles[0].name === "admin") {
        return "forms/admin";
      } else if (
        user.roles[0].name === "kabam" ||
        user.roles[0].name === "mabam"
      ) {
        return "forms/bam";
      } else if (user.roles[0].name === "user") {
        return "forms/user";
      }
    }
    return null;
  }, fetcher);

  const dataArray = formsData ? groupForms(formsData) : [];

  function groupForms(forms) {
    const groups = {};
    forms.forEach((form) => {
      if (!groups[form.associated_unit]) {
        groups[form.associated_unit] = [];
      }
      groups[form.associated_unit].push({
        id: form.id,
        created_at: formatDate(form.created_at),
        isSelected: false,
        num: form.id,
        unit: form.associated_unit,
      });
    });

    Object.keys(groups).forEach((unit) => {
      groups[unit].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      groups[unit].reverse();
    });

    return Object.values(groups);
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    const date = dateString instanceof Date ? dateString : new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function handleSearch() {
    let selectedId = null;
    dataArray.forEach((subArray) => {
      subArray.forEach((element) => {
        if (Number(element.id) === Number(searchInput)) {
          selectedId = element.id;
        }
      });
    });

    if (selectedId === null) {
      setFoundId(null);
      toast.error("אין תוצאות");
      return;
    }
    setFoundId(selectedId);
  }

  return (
    <>
      <div
        className="flex items-center justify-between h-10 mr-16 w-[85%] p-2 border rounded-lg border-dark_text cursor-text"
        onClick={() => searchRef.current.focus()}
      >
        <input
          autoComplete="off"
          placeholder="חיפוש לפי מספר טופס"
          className="focus:outline-none w-[90%]"
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              searchRef.current.blur();
            }
          }}
          ref={searchRef}
        />
        <button onClick={handleSearch}>
          <Search />
        </button>
      </div>
      {!formsData && !isLoading && (
        <p className="h-full text-stone-400 flex text-xl mr-2 justify-center items-center">
          לא קיימים טפסים להצגה
        </p>
      )}

      <div className="w-full custom-scrollbar overflow-y-auto max-h-[37.5rem] p-5">
        <div className={`w-full flex flex-col justify-center gap-1`}>
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <FadeLoader color="rgba(116, 137, 196, 1)" />
            </div>
          )}
          {!isLoading &&
            dataArray.map((row, index) => (
              <UnitHistory
                key={index}
                unitNum={row[0].unit}
                onItemClick={handleItemClick}
                isClicked={selectedUnit === row[0].unit}
                hasName={user && user.roles[0].name !== "user"}
                selectedItem={selectedItem}
                selectedItemDate={selectedItemDate}
                data={row}
                foundId={foundId}
              />
            ))}
        </div>
      </div>
    </>
  );
}
