import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { toast } from "react-toastify";
import { Otp_Verification } from "../Api's/api's_Config/api.config.js";

const SignUp = () => {                                    // ← removed async
    const navigator = useNavigate();
    const username = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const rePass = useRef(null);

    const formHandler = async (e) => {                    // ← made async
        e.preventDefault();

        if (
            !username.current.value.trim() ||
            !email.current.value.trim() ||
            !password.current.value.trim() ||
            !rePass.current.value.trim()
        ) {
            toast.error("All Fields are Required!");
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.current.value)) {
            toast.error("Email is not valid!");
            return;
        }

        if (password.current.value.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (password.current.value !== rePass.current.value) {
            toast.error("Passwords do not match.");
            return;
        }

        // ─── Send OTP then navigate ───────────────────────────
        try {
            await Otp_Verification({ email: email.current.value.trim() });

            toast.success("OTP sent to your email!");

            navigator("/otp", {
                state: {
                    firstName:     username.current.value.trim(),
                    lastName:      "",
                    email:         email.current.value.trim(),
                    password:      password.current.value,
                    contactNumber: "",
                    accountType:   "user",
                }
            });

        } catch (error) {
            const message = error.response?.data?.message || "Failed to send OTP.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-3 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-300 p-8 pt-2 border border-gray-100">
                <div className="text-center mb-8">
                    <img className="h-18 mx-auto" src={logo} alt="" />
                    <p className="text-gray-400 mt-2">Join us to start your journey</p>
                </div>

                <form onSubmit={formHandler} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="username" className="text-sm font-semibold text-gray-700 ml-1">
                            Username
                        </label>
                        <div className="relative">
                            <i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                            <input
                                ref={username}
                                type="text"
                                id="username"
                                placeholder="johndoe123"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                            <input
                                ref={email}
                                type="email"
                                id="email"
                                placeholder="name@company.com"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="pass" className="text-sm font-semibold text-gray-700 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                            <input
                                ref={password}
                                type="password"
                                id="pass"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="repass" className="text-sm font-semibold text-gray-700 ml-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                            <input
                                ref={rePass}
                                type="password"
                                id="repass"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-2">
                        Already a member?{" "}
                        <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;