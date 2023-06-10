import "@styles/globals.css";

// import Nav from "@components/Nav";
// import Provider from "@components/Provider";

export const metadata = {
  title: "fidoauth",
  description: "An Oauth 2.0 provider integrated with fido authentication flow",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {/* <Provider> */}
          <div className="main">
            <div className="gradient"></div>
          </div>
          <main className="app">
            {/* <Nav /> */}
            {children}
          </main>
        {/* </Provider> */}
      </body>
    </html>
  );
};

export default RootLayout;
