/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import Footer from "@/components/global/Footer";
import { Jockey_One } from "next/font/google";
import Form from "@/components/pages/formCreation/Form";
import TotalHistory from "@/components/pages/formHistory/TotalHistory";
import axios from "@/lib/axios";
import PeopleDetails from "@/components/pages/formHistory/PeopleDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/global/LoadingSpinner";

const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "font-jockey",
});

export default function page() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [headerName, setHeaderName] = useState("");
  const [selectedItemDate, setSelectedItemDate] = useState(null);
  const [mainForm, setMainForm] = useState({});
  const [peopleDetails, setPeopleDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth({ middleware: "auth" });
  const successNotify = () => {
    toast.success("הורדה התבצעה בהצלחה", {});
  };
  const setDetails = async (item) => {
    try {
      const result = await axios.get(`forms/${item}`);
      setMainForm({
        industry: result?.data.industry,
        start_date: result?.data.start_date,
        end_date: result?.data.end_date,
        visit_topic: result?.data.visit_purpose,
        contact_name: result?.data.contact_name,
        contact_phone: result?.data.contact_phone,
      });
      setHeaderName(result?.data.associated_unit);
      setPeopleDetails(result?.data.allowed_users);
    } catch (error) {
      console.error(error);
      toast.error(error?.response.data);
    }
  };
  function handleItemClick(unitId, itemId, itemDate) {
    setSelectedUnit(unitId);
    setSelectedItem(itemId);
    setSelectedItemDate(itemDate);
    setDetails(itemId);
  }
  const downloadForm = async (id) => {
    try {
      setIsLoading(true);
      const result = await axios.get(`forms/pdf/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([result?.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      successNotify();
    } catch (error) {
      toast.error(error?.response.data);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) {
    return <></>;
  }
  return (
    <>
      <div className="w-full px-20 py-5 relative">
        <div className=" grid grid-cols-2 gap-16 ">
          <div className="col-span-1 grid gap-2">
            <div className="flex flex-col gap-1 items-center">
              <h1 className={`${jockeyOne.className} text-5xl`}>CLASS</h1>
              <p className=" font-medium text-2xl"> היסטוריית טפסים </p>

              <div className="w-full">
                <TotalHistory
                  handleItemClick={handleItemClick}
                  selectedItem={selectedItem}
                  selectedUnit={selectedUnit}
                  selectedItemDate={selectedItemDate}
                />
              </div>
              <div className="flex items-end justify-center mt-16">
                <Footer />
              </div>
            </div>
          </div>
          <div className="col-span-1 grid gap-12">
            <div className="text-center mt-4">
              {" "}
              <h1 className={`text-dark_text font-medium text-2xl`}>
                {!selectedItem
                  ? "אנא בחר טופס"
                  : `${headerName} - טופס #${selectedItem}`}
              </h1>
              <p className="text-footer_blue font-normal text-lg">
                {selectedItemDate ? selectedItemDate : ""}
              </p>
            </div>
            {selectedItem && (
              <>
                <Form isDisabled={true} details={mainForm} />
                <div className="mt-10 mb-2">
                  <div className="text-center mb-6">
                    <p className="font-bold text-2xl text-dark_text">
                      רשימת נלווים
                    </p>
                  </div>
                  <div>
                    <PeopleDetails formDetails={peopleDetails} />
                    <div className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => downloadForm(selectedItem)}
                        className="bg-footer_blue text-white rounded-md flex flex-col justify-center p-2 mt-6"
                      >
                        הורד טופס
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}
