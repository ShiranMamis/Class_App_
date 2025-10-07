"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Login() {
  const { login, user, isLoading, error } = useAuth({ middleware: "guest" });
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      return router.push("/form-creation");
    }
    login(setErrors);
  }, [user]);
  if (isLoading) {
    return <></>;
  }

  return <></>;
}
