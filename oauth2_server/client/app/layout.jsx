import "@styles/globals.css";

import Nav from "@components/Nav";
import Head from "next/head";

export const metadata = {
  title: "Fidoauth",
  description: "An Oauth 2.0 provider integrated with fido authentication flow",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {/* <Provider> */}
        <div className="main">
          <div className="gradient"></div>
        </div>
        <main className=" app ">
          <Nav />
          {children}
        </main>
        {/* </Provider> */}
      </body>
    </html>
  );
};

export default RootLayout;
