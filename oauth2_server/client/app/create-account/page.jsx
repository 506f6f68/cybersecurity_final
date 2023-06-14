"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendRequest } from "@utils/sendRequest";
import { Registration } from "@utils/webAuthn";

const emptyUser = {
  personal_id: "",
  first_name: "",
  last_name: "",
};

const page = () => {
  const [newUser, setNewUser] = useState(emptyUser);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { credId, publicKey } = await Registration(newUser.personal_id);

    setSubmitting(true);
    const response = await sendRequest("/api/auth/register", "POST", {
      ...newUser,
      cred_id: credId,
      public_key: publicKey,
    });
    setSubmitting(false);

    if (response?.ok) {
      const { access_token } = await response.json();
      localStorage.setItem("token", access_token);
      router.push("/profile");
      return;
    }

    if (response?.status === 400) {
      alert("The personal ID has been used!");
    } else {
      alert("Service not available");
    }
    setNewUser(emptyUser);
  };
  return (
    <section className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <h1 className="orange_gradient text-4xl font-bold">
        Create Your Account
      </h1>

      <form onSubmit={handleSubmit} className="">
        <div className="my-5">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Your Personal ID</span> <span>*</span>
            </p>
            <p className="p-1 text-sm text-gray-600">
              Your personal ID does not have to contain any personal
              information. Its only purpose is to provide an unique identifier
              to other apps.
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

        <div className="my-5">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Your Name</span>
            </p>
            <div className="flex gap-3">
              <input
                value={newUser.first_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, first_name: e.target.value })
                }
                placeholder="First Name"
                className="form_input"
              ></input>
              <input
                value={newUser.last_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="form_input"
              ></input>
            </div>
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
            Create Account
          </button>
        </div>
      </form>
    </section>
  );
};

export default page;
