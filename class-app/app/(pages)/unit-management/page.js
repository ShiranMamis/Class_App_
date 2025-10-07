/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import useSWR from "swr";
import Footer from "@/components/global/Footer";
import { Jockey_One } from "next/font/google";
import UnitForm from "@/components/pages/unitManagement/UnitForm";
import InputUnit from "@/components/pages/unitManagement/InputUnit";
import ListUnit from "@/components/pages/unitManagement/ListUnit";
import useAuth from "@/hooks/useAuth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorPage from "@/components/global/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "font-jockey",
});

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(err);
    toast.error(err?.response.data);
  }
};

export default function Page() {
  const [unitFormTrigger, setUnitFormTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedKabam, setSelectedKabam] = useState([]);
  const [selectedMabam, setSelectedMabam] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const { user } = useAuth({ middleware: "guest" });

  const {
    data: units,
    isLoading: unitsLoading,
    mutate: mutateUnits,
  } = useSWR("units", fetcher);
  const { data: bam, error: bamError } = useSWR("bam/show-all-bams", fetcher);

  const isSkeleton = !units || !bam || unitsLoading || bamError;

  useEffect(() => {
    if (isClicked) {
      setIsClicked(false);
    }
  }, [isClicked]);

  useEffect(() => {
    if (deleteTrigger) {
      setDeleteTrigger(false);
    }
  }, [deleteTrigger]);

  function setInputValue(currentData) {
    const selectedItems = currentData?.filter(
      (item) => item.isSelected === true
    );
    const arr = selectedItems?.map((item) => item.fullName);
    return arr;
  }

  if (!user || user.roles[0].name !== "admin") {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="w-full h-full flex flex-row justify-around px-36 gap-x-16">
        <div className="flex flex-col w-1/3 justify-between m-2 mb-auto">
          <div>
            <h1
              className={`${jockeyOne.className} text-5xl flex justify-center`}
            >
              CLASS
            </h1>
            <p className="text-dark_text font-medium text-2xl flex justify-center">
              ניהול יחידות
            </p>
            <button
              className="flex text-center bg-footer_blue text-white rounded-md items-center justify-center h-10 w-40 mx-auto mb-1"
              onClick={() => setIsClicked(true)}
            >
              הוסף יחידה
            </button>
          </div>
          <div>
            <div className="w-full custom-scrollbar mt-2 overflow-y-auto max-h-[40rem]">
              {units && (
                <UnitForm
                  trigger={unitFormTrigger}
                  selectUnit={(unitName) => setSelectedUnit(unitName)}
                  selectUnitId={(unitId) => setSelectedUnitId(unitId)}
                  refreshProp={() => mutateUnits()}
                  unitId={selectedUnitId}
                  data={units}
                  isSkeleton={unitsLoading}
                  isClicked={isClicked}
                  deleteTrigger={() => setDeleteTrigger(true)}
                />
              )}
            </div>
            <div className="absolute bottom-12 left-[75%] translate-x-[-50%]">
              <Footer />
            </div>
          </div>
        </div>
        <div className="flex-1 relative h-full flex flex-col gap-10 items-center justify-center">
          <div className="absolute flex flex-col w-4/5 justify-center gap-24 top-10">
            <p className="text-dark_text font-medium w-full text-2xl mt-3 flex justify-center">
              ניהול קב"ם
            </p>
            {isSkeleton ? (
              <div className="grid grid-cols-2 w-full gap-y-4 gap-x-28">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ) : (
              <InputUnit
                unitId={selectedUnitId}
                unitName={selectedUnit}
                kabamName={selectedKabam}
                mashakName={selectedMabam}
                deleteTrigger={deleteTrigger}
              />
            )}

            <ListUnit
              data={{ kabams: bam?.kabams, mabams: bam?.mabams }}
              unitId={selectedUnitId}
              selectedUnit={selectedUnit}
              kabamInputValues={(arr) => setSelectedKabam(setInputValue(arr))}
              mashakInputValue={(arr) => setSelectedMabam(setInputValue(arr))}
              setUnitId={(id) => setSelectedUnitId(id)}
              isSkeleton={isSkeleton}
              deleteTrigger={deleteTrigger}
            />
          </div>
        </div>
      </div>
    </>
  );
}
