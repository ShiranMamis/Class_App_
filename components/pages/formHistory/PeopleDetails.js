import React from "react";
import InputBox from "@/components/global/InputBox";

export default function PeopleDetails({ formDetails }) {
  return (
    <div className="custom-scrollbar scrollbar-small overflow-y-auto flex flex-col max-h-[15rem] scroll-mt-0 p-2 w-full">
      {formDetails?.map((row, index) => (
        <div key={index} className="flex  flex-row gap-x-10 gap-y-5">
          <div>
            <InputBox
              isDisabled={true}
              placeholder=" מס' טלפון"
              type="text"
              textAlign="center"
              defaultValue={row.phone}
              hasUnderText={true}
              hasIcon={false}
              underText="מס' טלפון"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              placeholder=" ת.תחילת סיווג"
              type="text"
              textAlign="center"
              defaultValue={row.class_start_date.split("-").join("/")}
              hasUnderText={true}
              hasIcon={false}
              underText="תחילת סיווג"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              placeholder=" סיווג"
              type="text"
              textAlign="center"
              defaultValue={row.classification}
              hasUnderText={true}
              hasIcon={false}
              underText="סיווג"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              placeholder=" דרגה"
              type="text"
              textAlign="center"
              defaultValue={row.rank}
              hasUnderText={true}
              hasIcon={false}
              underText="דרגה"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              placeholder=" שם מלא"
              type="text"
              textAlign="center"
              defaultValue={row.full_name}
              hasUnderText={true}
              hasIcon={false}
              underText="שם מלא"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              textAlign="center"
              type="text"
              placeholder="ת.ז"
              defaultValue={row.personal_id}
              hasUnderText={true}
              hasIcon={false}
              underText="ת.ז"
            />
          </div>
          <div>
            <InputBox
              isDisabled={true}
              placeholder="מספר אישי"
              type="text"
              textAlign="center"
              defaultValue={row.personal_number}
              hasUnderText={true}
              hasIcon={false}
              underText="מספר אישי"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
