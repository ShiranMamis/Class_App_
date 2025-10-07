"use client";

import useSWR from "swr";
import axios from "../lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth({ middleware } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/users/get-auth-user", () =>
    axios.get("/users/get-auth-user").then((res) => res.data)
  );
  useEffect(() => {
    if (user || error) {
      setIsLoading(false);
    }
    if (middleware === "auth" && !user && error) {
      router.push("/");
    }
  }, [user]);

  const login = async (setErrors) => {
    setErrors({});
    axios
      .post("/login", { personal_number: "1234567" })
      .then((res) => {
        mutate();
      })
      .catch((error) => {
        if (error.response.status !== 422) {
          if (error.response.status === 400) {
            router.push("/not-allowed");
          }
          throw error;
        }
        setErrors(error?.response.data.errors);
      });
  };

  return {
    user,
    login,
    isLoading,
  };
}
