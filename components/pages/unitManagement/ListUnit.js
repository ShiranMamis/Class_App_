import React, { useState, useEffect, use } from "react";
import ListKabamUnit from "./ListKabamUnit";
import ListMashakUnit from "./ListMashakUnit";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ListUnit({
  data,
  unitId,
  setUnitId,
  kabamInputValues,
  mashakInputValue,
  selectedUnit,
  deleteTrigger,
  isSkeleton,
}) {
  const [kabamDetails, setKabamDetails] = useState(["", "", "", "", ""]);
  const [mabamDetails, setMabamDetails] = useState([]);
  const [comparedKabams, setComparedKabams] = useState([]);
  const [comparedMashaks, setComparedMashaks] = useState([]);
  const selectedArr = async () => {
    if (unitId !== null) {
      try {
        const result = await axios.get(`bam/show-kabams/${unitId}`);
        setComparedKabams(result?.data);
      } catch (error) {
        console.error(error);
        toast.error(error?.response.data);
      }
    }
  };
  const selectedMashakArr = async () => {
    if (unitId !== null) {
      try {
        const result = await axios.get(`bam/show-mabams/${unitId}`);
        setComparedMashaks(result?.data);
      } catch (error) {
        console.error(error);
        toast.error(error?.response.data);
      }
    }
  };
  useEffect(() => {
    if (unitId !== null) {
      selectedArr();
      selectedMashakArr();
    }
  }, [unitId]);

  const deleteBam = async (kabam_ids, mabam_ids) => {
    try {
      await axios.delete(`bam/delete-bam-of-unit`, {
        data: {
          kabam_ids: kabam_ids,
          mabam_ids: mabam_ids,
          unit_id: String(unitId),
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  };
  const add = async (kabam_ids, mabam_ids) => {
    try {
      await axios.post(`bam/add-bam-to-unit`, {
        kabam_ids: kabam_ids,
        mabam_ids: mabam_ids,
        unit_id: String(unitId),
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  };
  function scanBamArray(bigArray, smallArray) {
    let addArr = [];
    let deleteArr = [];
    for (const element of bigArray) {
      const existsInSmallArray = smallArray.some((obj) =>
        Object.values(obj).includes(element.id)
      );

      if (element.isSelected && !existsInSmallArray) {
        addArr.push(String(element.id));
      } else if (!element.isSelected && existsInSmallArray) {
        deleteArr.push(String(element.id));
      }
    }
    return [addArr, deleteArr];
  }

  async function refresh(role) {
    try {
      const result = await axios.get(`bam/show-all-bams`);
      return result?.data[role];
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  }
  async function updateBamToUnit() {
    let count = 0;
    let kabams = scanBamArray(kabamDetails, comparedKabams);
    let mabams = scanBamArray(mabamDetails, comparedMashaks);
    if (kabams[0].length !== 0 || mabams[0].length !== 0) {
      try {
        await add(kabams[0], mabams[0]);
        count++;
      } catch (error) {
        console.error(error);
        toast.error(error?.response.data);
      }
    }
    if (kabams[1].length !== 0 || mabams[1].length !== 0) {
      try {
        await deleteBam(kabams[1], mabams[1]);
        count++;
      } catch (error) {
        console.error(error);
        toast.error(error?.response.data);
      }
    }
    if (count >= 1) {
      toast.success("שינויים נשמרו בהצלחה");
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-1 w-full gap-14 h-[28rem]">
          <div className="flex-1">
            <ListKabamUnit
              unitId={unitId}
              data={data?.kabams}
              markProp={comparedKabams}
              inputProp={(arr) => kabamInputValues(arr)}
              unitName={selectedUnit}
              saveProp={(arr1, arr2, role) => scanBamArray(arr1, arr2, role)}
              refreshProp={(role) => refresh(role)}
              isSkeleton={isSkeleton}
              deleteTrigger={deleteTrigger}
              setFormDetails={(data) => setKabamDetails(data)}
              formDetails={kabamDetails}
            />
          </div>
          <div className="flex-1">
            <ListMashakUnit
              data={data?.mabams}
              unitId={unitId}
              markProp={comparedMashaks}
              inputProp={(arr) => mashakInputValue(arr)}
              unitName={selectedUnit}
              saveProp={(arr1, arr2, role) => scanBamArray(arr1, arr2, role)}
              refreshProp={(role) => refresh(role)}
              isSkeleton={isSkeleton}
              deleteTrigger={deleteTrigger}
              setFormDetails={(data) => setMabamDetails(data)}
              formDetails={mabamDetails}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex items-start justify-center">
        <button
          onClick={() => {
            let prevId = unitId;
            updateBamToUnit();
            setUnitId(null);
            setTimeout(() => {
              setUnitId(prevId);
            }, 100);
            clearTimeout();
          }}
          className="bg-dark_text p-2 text-white rounded-md w-36"
        >
          שמור שינויים
        </button>
      </div>
    </>
  );
}
