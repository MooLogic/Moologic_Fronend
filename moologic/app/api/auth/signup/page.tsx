import React from 'react';
import SignUpForm from './signUpForm';
// import RoleComponent from './role';
const SignUpPage: React.FC = () => {
  return (
    <div className="h-screen overflow-auto pr-20 bg-neutral-50 max-md:pr-5">
      <div className="flex gap-5 h-full max-md:flex-col">
        <div className="flex flex-col w-[39%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-12 py-20 mx-auto w-full text-black bg-white max-md:px-5 max-md:mt-10 max-md:max-w-full h-full overflow-auto">
            <div className="flex self-center ml-4 max-w-full w-[241px]">
              <div className="flex flex-col">
                <div className="flex flex-col items-start pl-9 text-2xl font-semibold max-md:pl-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/d6be0eb8f62148a585903dcdda486b49/fb8f14559e28642e205a70a69cc5a4e6e5324ee19eb375c9a1609d7c9bdd1336?apiKey=d6be0eb8f62148a585903dcdda486b49&"
                    alt="Company logo"
                    className="object-contain aspect-[1.17] w-[129px]"
                  />
                  <div className="mt-11 ml-3.5 max-md:mt-10 max-md:ml-2.5">
                    Sign Up
                  </div>
                </div>
              </div>
            </div>
            <SignUpForm />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[61%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/d6be0eb8f62148a585903dcdda486b49/9a1afa6a8ed5f5d60f96a9b3b7ccd7b7b1db262421d2e361a042dc7e46ce59b9?apiKey=d6be0eb8f62148a585903dcdda486b49&"
            alt="Decorative image"
            className="object-contain self-stretch my-auto w-full aspect-[1.63] max-md:mt-10 max-md:max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
