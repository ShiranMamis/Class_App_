/* eslint-disable react/no-unescaped-entities */
import React from "react";

function Footer({ phone = "03-7373515", unit = 'חט"ל' }) {
  return (
    <div className="flex flex-col text-dark_text text-center">
      <p className="font-normal">טלפון לבירורים {phone}</p>
      <p>משרד קב"ם {unit}</p>
      <p className="text-footer_blue">פותח על ידי מסגרת אמ”ת ©</p>
    </div>
  );
}

export default Footer;
