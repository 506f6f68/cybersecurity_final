"use client";

import { sendRequest } from "@utils/sendRequest";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Authorize = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientName, setClientName] = useState("");

  const fetchClientData = async () => {
    const res = await sendRequest(
      `/api/clients/${searchParams.get("client_id")}/name`,
      "GET"
    );
    if (res?.ok) {
      const clientData = await res.json();
      setClientName(clientData.client_name);
      return;
    }
    if (res?.status === 404) {
      alert("Invalid client ID");
    } else {
      alert("Service not available");
    }
    router.push("/");
    return;
  };
  useEffect(() => {
    fetchClientData();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/oauth/login?client_id=${searchParams.get("client_id")}`);
      return;
    }
  }, []);

  const handleSubmit = async () => {
    const res = await sendRequest(
      `/api/oauth/authorize?response_type=code&client_id=${searchParams.get(
        "client_id"
      )}&scope=profile`,
      "POST",
      {
        confirm: true,
      }
    );
    if (res?.ok) {
      const { redirect_url } = await res.json();
      window.location.href = redirect_url;
    }
    console.log(res);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur mt-20 w-2/3 sm:w-1/2 md:w-1/3 flex flex-col">
      <div className="rounded-t-xl w-full h-20 bg-white flex-center">
        <h1 className="text-2xl font-bold">{clientName}</h1>
      </div>
      <p className="font-light text-sm m-5">
        This application is requesting your profile.
      </p>
      <div className="flex-center m-5 mt-0">
        <button
          className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-400"
          onClick={handleSubmit}
        >
          Consent
        </button>
      </div>
    </section>
  );
};

export default Authorize;
