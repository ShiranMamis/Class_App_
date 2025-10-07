/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import Image from "next/image";
import Footer from "@/components/global/Footer";
import { Jockey_One } from "next/font/google";
import useAuth from "@/hooks/useAuth";
import axios from "@/lib/axios";
import useSWR from "swr";
import AdminList from "@/components/pages/adminManager/AdminList";
import ErrorPage from "@/components/global/Error";

const jockeyOne = Jockey_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "font-jockey",
});

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export default function page() {
  const { data: admins, isLoading, mutate } = useSWR("users/admins", fetcher);
  const { user } = useAuth({ middleware: "auth" });

  if (user?.roles[0].name !== "admin") {
    return <ErrorPage />;
  }

  return (
    <div className="w-full h-full flex flex-row justify-between px-36">
      <div className="flex flex-col flex-1 justify-start items-center gap-3">
        <div className=" absolute w-1/2 mt-10  my-auto">
          <h1 className={`${jockeyOne.className} text-5xl flex justify-center`}>
            CLASS
          </h1>
          <p className=" text-dark_text font-medium text-2xl flex justify-center">
            ניהול מנהלי מערכת
          </p>
          <div>
            <AdminList
              data={admins}
              refreshProp={() => mutate()}
              isSkeleton={isLoading}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 gap-20 items-center justify-center">
        <Image
          src={"/IndustrialImage.png"}
          height={657}
          width={483}
          alt="people"
        />
        <Footer />
      </div>
    </div>
  );
}
