import React from "react";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="p-5 z-10 w-full  items-center justify-between font-mono text-sm lg:flex">
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
        </a>
      </div>
      <a
        href={`http://localhost:3000/oauth/authorize?client_id=${process.env.FIDOAUTH_ID}`}
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
      </a>
    </nav>
  );
};

export default Nav;
