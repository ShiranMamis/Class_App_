import React from "react";
import { XCircleIcon } from "lucide-react";
function page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-400 text-lg">
      <XCircleIcon className="w-12 h-12" />
      <p>אין לך הרשאה למערכת זו</p>
    </div>
  );
}

export default page;
