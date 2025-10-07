/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Footer from "@/components/global/Footer";
import Report from "@/components/pages/formReports/Report";
import { Jockey_One } from "next/font/google";
import useAuth from "@/hooks/useAuth";
import React, { useState, useEffect } from "react";
import DateBox from "@/components/global/DateBox";
import MultiSelectBox from "@/components/pages/formReports/MultiSelectBox";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import ErrorPage from "@/components/global/Error";
import { format } from "date-fns";
const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "font-jockey",
});
const page = () => {
  const { user } = useAuth({ middleware: "guest" });

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = new Date()
    .toLocaleString("en-GB", options)
    .replace(/\//g, "/")
    .replace(",", "");

  const jsonData = [
    {
      id: 1,
      text: "דו”ח הנפקות טפסים",
      subText: "מציג את כמות הטפסים שהופקו במערכת",
      route: "reports/forms-counter",
      fileName: `class report - forms counter - ${formattedDate}.xlsx`,
    },
    {
      id: 2,
      text: "דו”ח סה”כ תעשיות",
      subText: "מציג את רשימת התעשיות במערכת",
      route: "reports/industries",
      fileName: `class report - industries list - ${formattedDate}.xlsx`,
    },
    {
      id: 3,
      text: "דו”ח הנפקת טפסים לפי תעשיות",
      subText: "מציג את כמות הטפסים שהופקו לכל תעשייה",
      route: "reports/forms-per-industries",
      fileName: `class report - forms per industries - ${formattedDate}.xlsx`,
    },
  ];
  const [excelData, setExcelData] = useState({
    filter_start: null,
    filter_end: null,
    units: [],
  });
  const [optionList, setOptionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  function handleChange(event) {
    setDateError("");
    let property = event.target.name;
    setExcelData((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  }
  async function fetchUnits() {
    try {
      const result = await axios.get("units/units-per-user");
      let list = result?.data.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setOptionList(list);
    } catch (err) {
      console.error(err);
      toast.error(err?.response.data);
    }
  }
  useEffect(() => {
    fetchUnits();
  }, []);
  async function exportReport(route, fileName) {
    setIsLoading(true);
    try {
      const postData =
        route !== "reports/industries"
          ? {
              start_date: excelData.filter_start
                ? format(excelData.filter_start, "dd-MM-yyyy")
                : null,
              end_date: excelData.filter_end
                ? format(excelData.filter_end, "dd-MM-yyyy")
                : null,
              unit_ids: excelData.units,
            }
          : {};
      const response = await axios.post(route, postData, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(response?.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("הורדה התבצעה בהצלחה");
    } catch (err) {
      if (err?.response?.status === 422) {
        setDateError("תאריכים לא תקינים");
      } else {
        console.error(err);
        toast.error(
          err?.response.status === 204
            ? "אין נתונים"
            : "קרתה שגיאה בעת ההורדה, אנא נסו שוב מאוחר יותר"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }
  if (user?.roles[0].name === "user") {
    return <ErrorPage />;
  }
  return (
    <>
      <div className="w-full flex flex-1 flex-col justify-center m-6 items-center gap-4">
        <div className="text-center">
          <h1 className={`${jockeyOne.className} text-5xl`}>CLASS</h1>
          <p className=" font-medium text-2xl">דוחות</p>
        </div>
        <div className="w-full flex flex-row justify-center items-center gap-6">
          <div className="w-[22%]">
            <DateBox
              placeholder="תאריך התחלה"
              name="filter_start"
              handleChangeProp={handleChange}
              max={new Date()}
            />
          </div>
          <div className={`w-[22%] ${dateError && "mt-6"}`}>
            <DateBox
              placeholder="תאריך סיום"
              name="filter_end"
              handleChangeProp={handleChange}
              dateError={dateError}
              max={new Date()}
            />
          </div>
          <div className="w-[22%] mb-[5px]">
            <MultiSelectBox
              placeholder="כל היחידות"
              name="units"
              options={optionList}
              handleChangeProp={handleChange}
            />
          </div>
        </div>
        <div className="w-3/4">
          {jsonData.length > 0 ? (
            <div className=" flex flex-col overflow-y-auto custom-scrollbar max-h-[34.5em] w-full gap-1.5 p-3">
              {jsonData.map((row) => {
                return (
                  <Report
                    key={row.id}
                    text={row.text}
                    subText={row.subText}
                    handleClick={() => exportReport(row.route, row.fileName)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-xl font-semibold">לא נמצאו דוחות להצגה</p>
          )}
        </div>
        <div className="w-full h-full flex justify-center items-end">
          <Footer />
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </>
  );
};

export default page;
