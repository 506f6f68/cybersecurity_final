"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Auth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");

  const getToken = async () => {
    let formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("scope", "profile");
    formData.append("code", searchParams.get("code"));

    let config = {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization:
          "Basic " +
          btoa(process.env.FIDOAUTH_ID + ":" + process.env.FIDOAUTH_SECRET),
      },
      body: formData,
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/oauth/token", config);
      if (response?.ok) {
        const { access_token } = await response.json();
        setAccessToken(access_token);
        localStorage.setItem("fidoauth_token", access_token);
        setTimeout(() => {
          router.push("/");
          return;
        }, 2000);
      }
    } catch (error) {
      alert("Code invalid, please sign in again.");
      router.push("/");
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default Auth;
