"use client";
import { sendRequest } from "@utils/sendRequest";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ClientAppCard from "@components/ClientAppCard";

const emptyUser = {
  personal_id: "",
  first_name: "",
  last_name: "",
};
const Profile = () => {
  const [user, setUser] = useState(emptyUser);
  const [clients, setClients] = useState([]);
  const router = useRouter();
  const fetchUserData = async () => {
    // Get user profile
    const res = await sendRequest("/api/auth/profile", "GET");
    if (res?.ok) {
      const userData = await res.json();
      setUser(userData);
      return;
    }
    localStorage.removeItem("token");
    alert("Invalid token");
    router.push("/");
  };
  const fetchClientsData = async () => {
    // Get clients profile
    const res = await sendRequest("/api/clients", "GET");
    if (res?.ok) {
      const clients = await res.json();
      setClients(clients);
      return;
    }
    alert("Invalid token");
    router.push("/");
  };
  useEffect(() => {
    fetchUserData();
    fetchClientsData();
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await sendRequest("/api/auth/logout", "POST");
    localStorage.removeItem("token");

    alert("Successfully logged out!");
    router.push("/");
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await sendRequest("/api/auth/profile", "POST", user);
    if (res?.ok) {
      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      alert("Your info is successfully updated!");
      await fetchUserData();
      return;
    }
    if (res?.status === 400) {
      alert("New personal ID is not valid");
      await fetchUserData();
      return;
    }
  };

  return (
    <>
      <section className="mt-10 w-full max-w-2xl flex flex-col gap-3 glassmorphism">
        <h1 className="orange_gradient text-4xl font-bold">Profile</h1>
        <p className=" text-sm text-gray-600">
          You can update your personal info by clicking the "update" button!
        </p>
        <form onSubmit={handleSubmit} className="">
          <div className="">
            <label>
              <p className="font-satoshi text-xl font-bold  text-gray-800">
                <span>Personal ID</span> <span>*</span>
              </p>
              <input
                value={user.personal_id}
                onChange={(e) =>
                  setUser({ ...user, personal_id: e.target.value })
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
                <span>Name</span>
              </p>
              <div className="flex gap-3">
                <input
                  value={user.first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                  placeholder="First Name"
                  className="form_input"
                ></input>
                <input
                  value={user.last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                  placeholder="Last Name"
                  className="form_input"
                ></input>
              </div>
            </label>
          </div>
          <div className="flex-end mx-3  gap-4">
            <button
              onClick={handleSignOut}
              className=" py-1.5 text-sm  hover:text-gray-600"
            >
              Sign Out
            </button>
            <button
              type="submit"
              // disabled={submitting}
              className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-400"
            >
              Update
            </button>
          </div>
        </form>
      </section>
      <section className="mt-10 w-full max-w-2xl flex flex-col gap-3 glassmorphism mb-20">
        <div className="flex-between  gap-5">
          <h1 className=" orange_gradient text-4xl font-bold bg-red-100">
            Client Apps
          </h1>
          <Link
            href="/create-client"
            className="bg-black text-white rounded-full p-2 px-3 text-sm "
          >
            Add New App
          </Link>
        </div>
        {clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-4">
            {clients.map((client) => (
              <ClientAppCard client={client} key={client.client_id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 font-light">
            You haven't created any client apps yet. Click{" "}
            <Link
              className="text-orange-600 hover:underline"
              href="/create-client"
            >
              here
            </Link>{" "}
            to create one.
          </p>
        )}
      </section>
    </>
  );
};

export default Profile;
