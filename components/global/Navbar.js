/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import logo from "../../public/logo.png";
import groupLogo from "../../public/groupLogo.png";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Mahbam from "@/public/Mahbam.png";

const Navbar = () => {
  const path = usePathname();
  const { user } = useAuth({ middleware: "guest" });

  return (
    <nav className="sticky mx-2 shadow-sm top-0 pt-2">
      <div className="flex bg-white w-full rounded-md px-2 justify-between">
        <div className="flex items-center">
          <div className="lg:flex lg:pl-8 hidden">
            <Image
              className="px w-11 h-11 mb-1 mt-1.5"
              alt="Logo"
              src={logo}
            ></Image>
            <Image
              className="mr-2 w-[52px] h-[52px]"
              alt="Group image"
              src={groupLogo}
            ></Image>
          </div>
          <ul className=" flex items-center gap-9 md:p-2 text-dark_text">
            {/*  Navbar Page */}
            <li className="text-center">
              {/* form creation Navbar*/}
              <Link
                className={`${
                  path === "/form-creation" &&
                  "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                }`}
                href={"/form-creation"}
              >
                יצירת טופס
              </Link>
            </li>
            <li className="text-center">
              {/* form history Navbar*/}
              <Link
                className={`${
                  path === "/form-history" &&
                  "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                }`}
                href={"/form-history"}
              >
                היסטוריית טפסים
              </Link>
            </li>
            {user?.roles[0].name !== "user" && (
              <>
                <li>
                  <Link
                    className={`${
                      path === "/industrial-management" &&
                      "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                    }`}
                    href={"/industrial-management"}
                  >
                    ניהול תעשיות
                  </Link>
                </li>
              </>
            )}
            {user && user.roles[0].name === "admin" && (
              <>
                <li>
                  <Link
                    className={`${
                      path === "/unit-management" &&
                      "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                    }`}
                    href={"/unit-management"}
                  >
                    ניהול יחידות
                  </Link>
                </li>

                <li className="text-center">
                  <Link
                    className={`${
                      path === "/admin-manager" &&
                      "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                    }`}
                    href={"/admin-manager"}
                  >
                    ניהול מנהלי מערכת
                  </Link>
                </li>
              </>
            )}
            {user?.roles[0].name !== "user" && (
              <li className="text-center">
                <Link
                  className={`${
                    path === "/form-reports" &&
                    "bg-[#EDF0F7] flex items-center lg:p-2 rounded-md"
                  }`}
                  href={"/form-reports"}
                >
                  דו"חות
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="lg:flex hidden">
          <Image className="h-16 w-16" alt='קב"ם' src={Mahbam}></Image>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
