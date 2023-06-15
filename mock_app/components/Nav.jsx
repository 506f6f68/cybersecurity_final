"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProfile } from "@/utils/getProfile";

const Nav = () => {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  useEffect(() => {
    getProfile(setUser);
  }, [pathname]);
  return (
    <nav className="p-5 z-10 w-full  items-center justify-between font-mono text-sm lg:flex">
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <Link
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="/"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
        </Link>
      </div>
      {user ? (
        <div className="flex gap-4 ">
          <Link
            href="/profile"
            className="flex justify-center items-center hover:bg-gray-800 px-2 p-1 rounded-md "
          >
            <span className=""> Hello, {user.personal_id}</span>
          </Link>
          <button
            className="text-md font-semibold border border-gray-800 px-2 p-1 rounded-md text-gray-200 hover:bg-gray-600"
            onClick={() => {
              localStorage.removeItem("fidoauth_token");
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            window.location.href = `http://localhost:3000/oauth/authorize?client_id=${process.env.FIDOAUTH_ID}`;
          }}
          className="flex-center group rounded-lg border border-transparent  transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`m-1 mx-3 text-lg font-semibold`}>
            Sign In with Fidoauth
            <span className="pl-2 text-2xl inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              ➔
            </span>
          </h2>
        </button>
      )}
    </nav>
  );
};

export default Nav;
