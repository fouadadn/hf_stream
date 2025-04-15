"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Login = () => {

  const [height, setHeight] = useState(0)


  useEffect(() => {
    setHeight(window.innerHeight)
  }, [])
  return (
    <div className="flex justify-center font-sans items-center duration-300" style={{ height: height }}>
      <form style={{backgroundColor: "#44403b30" , border: "0.2px solid #ffffff35"}} className="border-[0.5px] border-white/20 p-10 rounded-4xl bg-stone-700/30 w-96 md:w-[500px] ">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={"/"}
              className="text-nowrap text-3xl font-bold font-serif flex items-center">
              <span className="text-[#5c00cc] font-sans text-5xl">HF</span>
              <span>Stream</span>{" "}
            </Link>

            <span className="text-xs text-stone-500 relative bottom-3">Login to your account</span>
          </div>
          <Link href={'/'}>
            <button style={{ border: "0.2px solid #ffffff35"}} className="border-white/30 border rounded-lg px-4 py-2 cursor-pointer">Close</button>
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="outline-0 border border-white/30 rounded-lg px-5 py-3 mt-1 bg-black"
              style={{ border: "1px solid #ffffff55" }} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <input
              style={{ border: "1px solid #ffffff55" }}
              type="password"
              placeholder="password"
              className="outline-0 border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black"
            />
          </div>
        </div>
        <div className="flex justify-center my-5">
          <a href="" className="font-bold">
            Forget Password
          </a>
        </div>

        <div className="mt-2">
          <button className="hover:bg-stone-700/50 hover:text-white w-full bg-white text-black rounded-xl py-2 font-bold duration-200 cursor-pointer">
            Login
          </button>
        </div>

        <div className="text-sm flex justify-center mt-4">
          <span className="text-[#797979] ">Don't have an accout?</span><Link href={"/auth/sign-up"} className="font-bold">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
