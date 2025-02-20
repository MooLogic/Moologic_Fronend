import React from 'react';

const SignUpForm: React.FC = () => {
  return (
    <form>
      <div className="self-start mt-8 text-base">
        <label htmlFor="fullName" className="sr-only">Full Name</label>
        Full Name
      </div>
      <input
        id="fullName"
        type="text"
        className="flex flex-col justify-center items-start px-4 py-4 mt-2.5 text-sm whitespace-nowrap rounded-xl bg-neutral-100 max-md:pr-5 w-full"
        placeholder="Jiangyu"
        aria-label="Full Name"
      />
      <div className="self-start mt-5 text-base">
        <label htmlFor="email" className="sr-only">Email Address</label>
        Email Address
      </div>
      <input
        id="email"
        type="email"
        className="flex flex-col justify-center items-start px-4 py-4 mt-2 text-sm whitespace-nowrap rounded-xl bg-neutral-100 max-md:pr-5 w-full"
        placeholder="example@gmail.com"
        aria-label="Email Address"
      />
      <div className="self-start mt-5 text-base">
        <label htmlFor="username" className="sr-only">Username</label>
        Username
      </div>
      <input
        id="username"
        type="text"
        className="flex flex-col justify-center items-start px-4 py-4 mt-5 text-sm whitespace-nowrap rounded-xl bg-neutral-100 max-md:pr-5 w-full"
        placeholder="johnkevine4362"
        aria-label="Username"
      />
      <div className="self-start mt-5 text-base">
        <label htmlFor="password" className="sr-only">Password</label>
        Password
      </div>
      <input
        id="password"
        type="password"
        className="flex shrink-0 mt-2 px-5 rounded-xl bg-neutral-100 h-[50px] w-full"
        aria-label="Password"
      />
      <div className="self-center mt-6 text-base">
        By creating an account you agree to the{" "}
        <a href="#" className="text-indigo-500 underline">terms of use</a>
        {" "}and our{" "}
        <a href="#" className="text-indigo-500 underline">privacy policy</a>.
      </div>
      <button type="submit" className="px-16 py-3.5 mt-8 text-base font-semibold text-black bg-indigo-500 rounded-xl max-md:px-5 w-full">
        Create account
      </button>
      <div className="self-center mt-8 text-base">
        Already have an account?{" "}
        <a href="#" className="text-indigo-500">Log in</a>
      </div>
    </form>
  );
};

export default SignUpForm;