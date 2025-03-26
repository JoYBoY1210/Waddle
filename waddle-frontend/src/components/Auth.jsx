import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./context/UserContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { setIsAuthenticated } = useUser();
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const loginForm = useForm();
  const signupForm = useForm();

  const getCSRFToken = async () => {
    const response = await fetch("http://localhost:8000/auth/csrf/", {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  };

  const handleLoginSubmit = async (data) => {
    setLoginError("");
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError(responseData.detail || "Invalid email or password.");
      }
    } catch (error) {
      setLoginError("Something went wrong. Please try again later.");
    }
  };

  const handleSignupSubmit = async (data) => {
    setSignupError("");
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch("http://localhost:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setSignupError(
          responseData.detail ||
            responseData.email ||
            responseData.username ||
            "Signup failed. Please try again."
        );
      }
    } catch (error) {
      setSignupError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="relative w-full max-w-md h-[500px] overflow-hidden border-4 bg-gray-950 border-gray-700 rounded-lg">
        <div
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
            isSignUp ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          
          <form
            onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
            className="w-full h-full flex flex-col pt-8 px-6"
          >
            <p className="text-4xl md:text-5xl text-white font-bold pt-5 pb-1 text-center">Login</p>

            <label className="block text-lg md:text-xl pt-5 font-medium text-white mb-1">Email</label>
            <input
              {...loginForm.register("email", { required: "Email is required" })}
              className="w-full text-white border border-gray-500 px-4 py-2 rounded-lg bg-transparent"
              placeholder="your@mail.com"
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-4 font-medium text-white mb-1">Password</label>
            <input
              type="password"
              {...loginForm.register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-transparent text-gray-400"
              placeholder="••••••••"
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
            )}

            {loginError && <p className="text-sm text-red-500 mt-2">{loginError}</p>}

            <button
              type="submit"
              className="mt-6 cursor-pointer bg-violet-500 hover:bg-violet-400 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-[0_4px_0_0_rgba(109,40,217,1)] hover:shadow-[0_2px_0_0_rgba(109,40,217,1)] active:translate-y-1 active:shadow-none"
            >
              Sign In
            </button>
            <p className="text-white pt-4 font-semibold text-center cursor-pointer" onClick={() => setIsSignUp(true)}>
              Create an account
            </p>
          </form>

          
          <form
            onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
            className="w-full h-full flex flex-col pt-8 px-6"
          >
            <p className="text-4xl md:text-5xl text-white font-bold pt-5 pb-1 text-center">Sign Up</p>

            <label className="block text-lg md:text-xl pt-3 font-medium text-white mb-1">Username</label>
            <input
              {...signupForm.register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border border-gray-500 text-white rounded-lg bg-transparent"
              placeholder="Enter your username"
            />
            {signupForm.formState.errors.username && (
              <p className="text-sm text-red-600">{signupForm.formState.errors.username.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-2 font-medium text-white mb-1">Email</label>
            <input
              {...signupForm.register("email", { required: "Email is required" })}
              className="w-full text-white border border-gray-500 px-4 py-2 rounded-lg bg-transparent"
              placeholder="your@mail.com"
            />
            {signupForm.formState.errors.email && (
              <p className="text-sm text-red-600">{signupForm.formState.errors.email.message}</p>
            )}

            <label className="block text-lg md:text-xl pt-4 font-medium text-white mb-1">Password</label>
            <input
              type="password"
              {...signupForm.register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-transparent text-gray-400"
              placeholder="••••••••"
            />
            {signupForm.formState.errors.password && (
              <p className="text-sm text-red-600">{signupForm.formState.errors.password.message}</p>
            )}

            {signupError && <p className="text-sm text-red-500 mt-2">{signupError}</p>}

            <button
              type="submit"
              className="mt-6 cursor-pointer bg-violet-500 hover:bg-violet-400 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-[0_4px_0_0_rgba(109,40,217,1)] hover:shadow-[0_2px_0_0_rgba(109,40,217,1)] active:translate-y-1 active:shadow-none"
            >
              Sign Up
            </button>
            <p className="text-white pt-3 font-semibold text-center cursor-pointer" onClick={() => setIsSignUp(false)}>
              Already have an account?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
