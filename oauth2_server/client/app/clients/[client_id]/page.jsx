"use client";
import { sendRequest } from "@utils/sendRequest";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const EditClient = () => {
  const router = useRouter();
  const params = useParams();

  const [newClient, setNewClient] = useState({
    client_name: "",
    client_uri: "",
    grant_type: "authorization_code",
    redirect_uri: "",
    response_type: "code",
    scope: "profile",
    token_endpoint_auth_method: "client_secret_basic",
  });

  useEffect(() => {
    const fetchClientData = async () => {
      const res = await sendRequest(`/api/clients/${params.client_id}`, "GET");
      if (res?.ok) {
        const { client_metadata } = await res.json();
        setNewClient({
          ...newClient,
          client_name: client_metadata.client_name,
          client_uri: client_metadata.client_uri,
          redirect_uri: client_metadata.redirect_uris[0],
          token_endpoint_auth_method:
            client_metadata.token_endpoint_auth_method,
        });
        return;
      }
      alert("Invalid client id");
      router.push("/profile");
    };
    fetchClientData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await sendRequest(
      `/api/clients/${params.client_id}`,
      "PATCH",
      newClient
    );
    if (res?.ok) {
      alert("Client updated successfully!");
    } else {
      alert("Service not available");
    }
    router.push("/profile");
    return;
  };
  return (
    <section className="mt-10 w-full max-w-2xl flex flex-col gap-3 glassmorphism">
      <h1 className="orange_gradient text-4xl font-bold">Edit Client</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
        <div className="">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Client Name</span> <span>*</span>
            </p>
            <p className=" text-sm text-gray-600">
              Name of your app or project.
            </p>
            <input
              value={newClient.client_name}
              onChange={(e) =>
                setNewClient({ ...newClient, client_name: e.target.value })
              }
              placeholder="e.g. app1"
              required
              className="form_input"
            ></input>
          </label>
        </div>

        <div className="">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Client URI</span> <span>*</span>
            </p>
            <p className=" text-sm text-gray-600">
              The URI of your client app.
            </p>
            <input
              value={newClient.client_uri}
              onChange={(e) =>
                setNewClient({ ...newClient, client_uri: e.target.value })
              }
              placeholder="e.g. https://app1.com"
              required
              className="form_input"
            ></input>
          </label>
        </div>

        <div className="">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Redirect URI</span> <span>*</span>
            </p>
            <p className=" text-sm text-gray-600">
              The URI you want to go back to after authentication.
            </p>
            <input
              value={newClient.redirect_uri}
              onChange={(e) =>
                setNewClient({ ...newClient, redirect_uri: e.target.value })
              }
              placeholder="e.g. https://app1.com"
              required
              className="form_input"
            ></input>
          </label>
        </div>

        <div className="">
          <label>
            <p className="font-satoshi text-xl font-bold  text-gray-800">
              <span>Token Endpoint Auth Method</span> <span>*</span>
            </p>
            <select
              value={newClient.token_endpoint_auth_method}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  token_endpoint_auth_method: e.target.value,
                })
              }
              placeholder="e.g. https://app1.com"
              required
              className="form_input"
            >
              <option value={"client_secret_basic"}>Client Secret Basic</option>
              <option value={"client_secret_post"}>Client Secret Post</option>
              <option value={"none"}>None</option>
            </select>
          </label>
        </div>

        <div className="flex-end mx-3  gap-4">
          <Link
            href={"/profile"}
            className=" py-1.5 text-sm  hover:text-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            // disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-400"
          >
            Update Client
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditClient;
