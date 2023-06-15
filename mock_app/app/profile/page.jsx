"use client";
import { getProfile } from "@/utils/getProfile";
import { useEffect, useState } from "react";
import Link from "next/link";

const page = () => {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    getProfile(setProfile);
  }, []);
  return (
    <section className="w-2/3 rounded-xl  bg-white/5 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-5 flex flex-col gap-3">
      <h1 className="text-3xl font-bold">{profile?.personal_id}</h1>
      <p className="text-lg font-light">First Name: {profile?.first_name}</p>
      <p className="text-lg font-light">Last Name: {profile?.last_name}</p>
      <div className=" flex flex-row-reverse ">
        <Link
          className="hover:bg-white/25 transition-all duration-200 border px-2 py-1 rounded-xl "
          href="/"
        >
          Back
        </Link>
      </div>
    </section>
  );
};

export default page;
