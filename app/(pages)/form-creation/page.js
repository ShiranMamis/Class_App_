"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/global/Footer";
import Form from "@/components/pages/formCreation/Form";
import { Jockey_One } from "next/font/google";
import FormBottom from "@/components/pages/formCreation/FormBottom";
import formCreationImage from "@/public/form-creation-image.png";
import SuccessPopup from "@/components/pages/formCreation/SuccessPopup";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import { format } from "date-fns";

const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "font-jockey",
});

function FormCreation() {
  const [popup, setPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [downloadId, setDownloadId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [canAddPeople, setCanAddPeople] = useState(true);
  const [isTryToAdd, setIsTryToAdd] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [form, setForm] = useState({
    industry: "",
    startDate: "",
    endDate: "",
    visitTopic: "",
    contactName: "",
    contactPhone: "",
    people: [],
  });
  const fetchIndustries = async () => {
    const industryArray = [];
    try {
      const result = await axios.get("industries");
      result?.data.map((industry) => {
        industryArray.push({
          label: industry.name,
          value: String(industry.id),
        });
      });
      setIndustries(industryArray);
    } catch (err) {
      console.error(err);
      toast.error(err?.response.data);
    }
  };
  useEffect(() => {
    fetchIndustries();
  }, []);
  useEffect(() => {
    if (isClicked) {
      setIsClicked(false);
    }
  }, [isClicked]);
  useEffect(() => {
    if (isTryToAdd) {
      setIsTryToAdd(false);
    }
  }, [isTryToAdd]);
  useEffect(() => {
    if (dateChanged) {
      setDateChanged(false);
    }
  }, [dateChanged]);
  useEffect(() => {
    if (
      form.industry !== "" &&
      form.startDate !== "" &&
      form.endDate !== "" &&
      form.visitTopic !== "" &&
      form.contactName !== "" &&
      form.contactPhone !== ""
    ) {
      setCanAddPeople(true);
    } else {
      setCanAddPeople(false);
    }
  }, [form]);
  const { user } = useAuth({ middleware: "auth" });

  const notify = () => {
    toast.error("משתמש לא קיים, טופס זה יוגש ללא מ.א זה", {});
  };

  function handleAddPerson() {
    setForm((prev) => {
      const newPeopleArray = [...prev.people];
      newPeopleArray.push({
        id: nanoid(),
        personPN: "",
        personID: "",
        personName: "",
        personRank: "",
        personClearance: "",
        personClearanceDate: "",
        personPhone: "",
      });
      return {
        ...prev,
        people: newPeopleArray,
      };
    });
  }
  function handleDeletePerson(index) {
    const updatedPeopleArray = [
      ...form.people.slice(0, index),
      ...form.people.slice(index + 1),
    ];
    setForm((prev) => ({
      ...prev,
      people: updatedPeopleArray,
    }));
  }
  const setValues = async (personPN, index) => {
    let pnlist = form.people?.map((person) => person.personPN);
    if (personPN.length === 7) {
      if (pnlist.includes(personPN)) {
        toast.error("מ.א זה כבר נוסף אל הטופס");
        return;
      }
      try {
        const result = await axios.get(`users/${personPN}`);
        setForm((prev) => {
          const updatedPeople = prev.people.map((person, i) => {
            if (i === index) {
              return {
                ...person,
                personPN: personPN,
                personID: result?.data.personal_id,
                personName: result?.data.full_name,
                personRank: result?.data.rank,
                personClearance: result?.data.classification,
                personClearanceDate: result?.data.class_start_date,
                personPhone: result?.data.phone,
              };
            }
            return person;
          });
          return { ...prev, people: updatedPeople };
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        notify();
        setForm((prev) => {
          const updatedPeople = prev.people.map((person, i) => {
            if (i === index) {
              return {
                ...person,
                personPN: personPN,
                personID: "",
                personName: "",
                personRank: "",
                personClearance: "",
                personClearanceDate: "",
                personPhone: "",
              };
            }
            return person;
          });
          return { ...prev, people: updatedPeople };
        });
      }
    } else {
      setForm((prev) => {
        const updatedPeople = prev.people.map((person, i) => {
          if (i === index) {
            return {
              ...person,
              personPN: personPN,
              personID: "",
              personName: "",
              personRank: "",
              personClearance: "",
              personClearanceDate: "",
              personPhone: "",
            };
          }
          return person;
        });

        return { ...prev, people: updatedPeople };
      });
    }
  };
  function handleChange(event) {
    const { name, value } = event.target;
    const isStartDate = name === "startDate";

    setForm((prev) => {
      const updatedState = { ...prev };
      if (isStartDate) {
        setDateChanged(true);
        updatedState.endDate = "";
      }
      updatedState[name] = value;
      return updatedState;
    });
  }
  function handleChangePeople(event, index) {
    let property = event.target.name;
    let value = event.target.value;
    if (property === "personPN") {
      setValues(value, index);
    } else {
      setForm((prev) => {
        const updatedPeople = prev.people.map((person, i) => {
          if (i === index) {
            return { ...person, [property]: value };
          }
          return person;
        });

        return { ...prev, people: updatedPeople };
      });
    }
  }
  function setPeople() {
    let array = [];
    form.people.map((person) => {
      array.push(person.personPN);
    });
    return array;
  }
  const sendForm = async () => {
    try {
      const result = await axios.post("forms", {
        industry_id: form.industry,
        start_date: format(form.startDate, "dd-MM-yyyy"),
        end_date: format(form.endDate, "dd-MM-yyyy"),
        visit_purpose: form.visitTopic,
        contact_name: form.contactName,
        contact_phone: form.contactPhone,
        allowed_users: setPeople(),
      });
      setPopup(true);
      setDownloadId(result?.data.form_id);
    } catch (error) {
      console.error(error);
      setFormErrors(error?.response.data.errors);
      toast.error(typeof error.response.data !== Array && error?.response.data);
    } finally {
      setIsLoading(false);
    }
  };
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
      <div className="w-full px-20">
        <div className="grid grid-cols-2 gap-x-4 h-full">
          <div className="col-span-1">
            <div className=" h-full flex flex-col items-center justify-between gap-24 pb-16">
              <Image
                src={formCreationImage}
                alt="form creation Image"
                className=" pt-10"
              />
              <Footer />
            </div>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendForm();
            }}
          >
            <div className="text-center text-dark_text py-10">
              <h1 className={`${jockeyOne.className} text-5xl`}>CLASS</h1>
              <p className="font-medium text-2xl">הנפקת אישורי סיווג לתעשיות</p>
            </div>
            <>
              <Form
                hasUnderText={true}
                handleChangeProp={(e) => handleChange(e)}
                errors={formErrors}
                isClicked={[isClicked, isTryToAdd]}
                industries={industries}
                dateChanged={dateChanged}
                minDate={
                  form.startDate &&
                  new Date(
                    new Date(form.startDate).getTime() + 1 * 24 * 60 * 60 * 1000
                  )
                }
                maxDate={
                  form.startDate &&
                  new Date(
                    new Date(form.startDate).getTime() +
                      14 * 24 * 60 * 60 * 1000
                  )
                }
              />
              <div className="mt-10 mb-2">
                <div className="text-center mb-6">
                  <p className="font-bold text-2xl text-dark_text">
                    אישורי כניסה (עד 10 אנשים לטופס)
                  </p>
                  <p className="text-footer_blue text-lg">
                    אזרחים עובדי צה”ל - ללא הספרות 90 בתחילת מספר אישי
                  </p>
                </div>
                <FormBottom
                  handleAddProp={() => {
                    const emptyPersonPNCount = form.people.filter(
                      (person) => person.personPN.trim() === ""
                    ).length;

                    if (!canAddPeople || emptyPersonPNCount >= 3) {
                      toast.error(
                        !canAddPeople && emptyPersonPNCount < 3
                          ? "לא ניתן להוסיף אנשים עד שהטופס לא מלא"
                          : "לא ניתן להוסיף אנשים ללא מילוי השאר"
                      );
                      setIsClicked(true);
                      setIsTryToAdd(true);
                      return;
                    }
                    handleAddPerson();
                  }}
                  formDetails={form.people}
                  handleDeleteProp={(index) => handleDeletePerson(index)}
                  isTryToAdd={isTryToAdd}
                  handleChangeProp={(e, index) => handleChangePeople(e, index)}
                />
              </div>
              <div className=" flex justify-center ">
                <button
                  type="submit"
                  className=" bg-dark_text p-2 text-white rounded-md w-36 "
                  onClick={() => setIsClicked(true)}
                >
                  הפק טופס אישור
                </button>
              </div>
            </>
          </form>
        </div>
        {isLoading && <LoadingSpinner />}
        {popup && (
          <SuccessPopup
            handleDownloadProp={() => downloadForm(downloadId)}
            handleClose={() => handleClose()}
          />
        )}
      </div>
    </>
  );
}

export default FormCreation;
