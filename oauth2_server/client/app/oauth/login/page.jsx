"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendRequest } from "@utils/sendRequest";

const emptyUser = {
  personal_id: "",
};

const page = () => {
  const [newUser, setNewUser] = useState(emptyUser);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await sendRequest("/api/auth/login", "POST", newUser);
    setSubmitting(false);

    if (response?.ok) {
      const { access_token } = await response.json();
      localStorage.setItem("token", access_token);
      router.push(
        `/oauth/authorize?client_id=${searchParams.get("client_id")}`
      );
      return;
    }

    if (response?.status === 404) {
      alert("The personal not exist!");
    } else {
      alert("Service not available");
    }
    setNewUser(emptyUser);
  };
  return (
    <section className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <h1 className="orange_gradient text-4xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="">
        <div className="my-5">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Your Personal ID</span> <span>*</span>
            </p>

            <input
              value={newUser.personal_id}
              onChange={(e) =>
                setNewUser({ ...newUser, personal_id: e.target.value })
              }
              placeholder="Enter your personal ID..."
              required
              className="form_input"
            ></input>
          </label>
        </div>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-400"
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
};

export default page;
