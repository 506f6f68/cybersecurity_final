import Link from "next/link";

const page = () => {
  return (
    <section className="w-full mt-40 flex-center flex-col">
      <h1 className="head_text text-center">
        Oauth 2.0
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> with FIDO 2.0 </span>
      </h1>
      <p className="desc text-center">
        {" "}
        Create your account and login with Fidoauth without passwords!
      </p>
      {/* <button className="mt-6 p-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"> */}
      <div className="flex flex-row gap-3">
        <Link
          href="/create-account"
          className="mt-6 p-4 black_btn text-xl font-bold font-montserrat"
        >
          Create Account
        </Link>
        <Link
          href="/login"
          className="mt-6 p-4 outline_btn text-xl font-bold font-montserrat"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default page;
