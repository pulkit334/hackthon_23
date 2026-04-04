import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../redux/userSlice";
import { AuthLogin } from "../Api's/api's_Config/api.config.js";

const SignIn = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const email = useRef(null);
    const password = useRef(null);

    const formHandler = async (e) => {
        e.preventDefault();

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.current.value)) {
            toast.error("Email is not valid!");
            return;
        }

        if (password.current.value.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const response = await AuthLogin({
                email:    email.current.value,
                Password: password.current.value,
            });

            // cookie is set by backend automatically
            // just update redux state and redirect
            dispatch(setIsAuth());
            toast.success("Logged in successfully!");
            navigator("/");

        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Try again.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex text-gray-900 bg-white">
            {/* Left side: Premium Branding/Graphic Side */}
            <div className="hidden lg:flex w-1/2 animated-gradient-bg relative flex-col items-center justify-center p-12 overflow-hidden">
                {/* Abstract floating shapes for premium feel */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl shadow-2xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl shadow-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10 glass-card p-12 rounded-[3rem] text-center max-w-lg border border-white/40 shadow-2xl">
                    <img className="h-24 mx-auto mb-8 drop-shadow-xl filter rounded-2xl bg-white p-2" src={logo} alt="Deep-X Logo" />
                    <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                        Welcome to Deep-X
                    </h1>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                        Securely manage your data and streamline your documentation workflow with our premium platform.
                    </p>
                </div>
            </div>

            {/* Right side: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
                {/* Subtle background element for mobile */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/50 lg:hidden pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                    <div className="text-left mb-10">
                        <img className="h-12 mb-6 lg:hidden filter rounded-xl bg-white p-1 shadow-sm" src={logo} alt="Deep-X Logo" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 font-medium">
                            Please enter your details to access your account.
                        </p>
                    </div>

                    <form onSubmit={formHandler} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group">
                            <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">
                                Email Address
                            </label>
                            <div className="relative">
                                <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                <input
                                    ref={email}
                                    type="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 group">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="pass" className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-indigo-600">
                                    Password
                                </label>
                                <Link
                                    to="/forget-password"
                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors bg-indigo-50 px-2 py-1 rounded-lg"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                <input
                                    ref={password}
                                    type="password"
                                    id="pass"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium tracking-wider"
                                />
                            </div>
                        </div>

                        <button className="mt-4 w-full glass-button text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] flex justify-center items-center gap-2 group">
                            <span>Sign In</span>
                            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                        </button>

                        <div className="relative mt-2 flex items-center justify-center">
                            <div className="border-t border-gray-200 w-full absolute top-1/2"></div>
                            <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider relative z-10">Or continue with</span>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-2 font-medium">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors ml-1 border-b-2 border-indigo-200 hover:border-indigo-600">
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;