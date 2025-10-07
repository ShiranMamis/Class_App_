import React from "react";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
const Layout = ({ children }) => {
  return (
    <>
      <ToastContainer
        rtl
        pauseOnHover={false}
        autoClose={5000}
        position="top-right"
        style={{ marginTop: "65px" }}
      />
      <div className="h-screen flex flex-col">
        <header className="flex flex-col">
          <Navbar />
        </header>
        <main className="bg-white rounded-md mx-2 flex flex-1 my-2">
          {children}
        </main>
      </div>
    </>
  );
};
export default Layout;
