import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./context/UserContext";
import { getCSRFTokenFromCookie } from "./getcsrf";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { setIsAuthenticated } = useUser();

  const loginForm = useForm();
  const signupForm = useForm();

  const handleLoginSubmit = async (data) => {
    console.log("Login Data: ", data);
    try {
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Login successful");
        setIsAuthenticated(true);
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  const handleSignupSubmit = async (data) => {
    console.log("Signup Data: ", data);
    try {
      const response = await fetch("http://localhost:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Signup successful");
        setIsAuthenticated(true);
      } else {
        console.log("Signup failed");
      }
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="relative w-full max-w-md h-[500px] overflow-hidden border-4 bg-gray-950 border-gray-700 rounded-lg">
        <div
          className={`absolute w-full h-full transition-transform  duration-500 ease-in-out ${
            isSignUp ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          
          <form
            onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
            className="w-full h-full flex flex-col pt-8 px-6"
          >
            <div className="text-center">
              <p className="text-4xl md:text-5xl text-white font-bold pt-5 pb-1">Login</p>
            </div>

            <label className="block text-lg md:text-xl pt-5 font-medium text-white mb-1">Email</label>
            <input
              {...loginForm.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full text-white border border-gray-500 focus:ring-2 px-4 py-2 rounded-lg transition-all bg-transparent"
              placeholder="your@mail.com"
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-4 font-medium text-white mb-1">Password</label>
            <input
              type="password"
              {...loginForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 text-gray-400 transition-all bg-transparent"
              placeholder="••••••••"
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
            )}

            <button
              type="submit"
              className="mt-6 cursor-pointer bg-violet-500 hover:bg-violet-400 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-[0_4px_0_0_rgba(109,40,217,1)] hover:shadow-[0_2px_0_0_rgba(109,40,217,1)] active:translate-y-1 active:shadow-none"
            >
              Sign In
            </button>
            <p
              className="text-white pt-4 font-semibold cursor-pointer text-center hover:text-violet-400 transition-all"
              onClick={() => setIsSignUp(true)}
            >
              Create an account
            </p>
          </form>

          
          <form
            onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
            className="w-full h-full flex flex-col pt-8 px-6"
          >
            <div className="text-center">
              <p className="text-4xl md:text-5xl text-white font-bold pt-5 pb-1">Sign Up</p>
            </div>

            <label className="block text-lg md:text-xl pt-3 font-medium text-white mb-1">Username</label>
            <input
              {...signupForm.register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border border-gray-500 text-white rounded-lg focus:ring-2 transition-all bg-transparent"
              placeholder="Enter your username"
            />
            {signupForm.formState.errors.username && (
              <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.username.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-2 font-medium text-white mb-1">Email</label>
            <input
              {...signupForm.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full text-white border border-gray-500 focus:ring-2 px-4 py-2 rounded-lg transition-all bg-transparent"
              placeholder="your@mail.com"
            />
            {signupForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.email.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-4 font-medium text-white mb-1">Password</label>
            <input
              type="password"
              {...signupForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 text-gray-400 transition-all bg-transparent"
              placeholder="••••••••"
            />
            {signupForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.password.message}</p>
            )}

            <button
              type="submit"
              className="mt-6 cursor-pointer bg-violet-500 hover:bg-violet-400 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-[0_4px_0_0_rgba(109,40,217,1)] hover:shadow-[0_2px_0_0_rgba(109,40,217,1)] active:translate-y-1 active:shadow-none"
            >
              Sign up
            </button>
            <p
              className="text-white pt-3 font-semibold cursor-pointer text-center hover:text-violet-400 transition-all"
              onClick={() => setIsSignUp(false)}
            >
              Already have an account?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
