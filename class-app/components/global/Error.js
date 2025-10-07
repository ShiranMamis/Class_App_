import { XCircleIcon } from "lucide-react";
import React from "react";
export default function ErrorPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-400 text-lg">
      <XCircleIcon className="w-12 h-12" />
      <p>אין לך הרשאה לעמוד זה</p>
    </div>
  );
}
