import React from 'react'

const page = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
      Oauth 2.0 
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> with FIDO 2.0 </span>
      </h1>
      <p className="desc text-center">
        {" "}
        Create your account and login with Fidoauth without passwords!
      </p>
    </section>
  )
}

export default page