import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { toast } from "react-toastify";
import { Otp_Verification } from "../Api's/api's_Config/api.config";
// import { AuthSingup } from "../Api's/api's_Config/api.config.js" // Keep this imported if you need it later

const SignUp = () => {
    // 🚨 Changed to 'navigate' (React Router best practice)
    const navigate = useNavigate(); 
    
    const firstName = useRef(null);
    const lastName = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const rePass = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showRePass, setShowRePass] = useState(false);

    const formHandler = async (e) => {
        e.preventDefault();

        const firstNameValue = firstName.current.value.trim();
        const lastNameValue = lastName.current.value.trim();
        const emailValue = email.current.value.trim();
        const passwordValue = password.current.value;
        const rePassValue = rePass.current.value;

        if (!firstNameValue || !emailValue || !passwordValue || !rePassValue) {
            toast.error("First Name, Email, and Passwords are Required!");
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
            toast.error("Email is not valid!");
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(passwordValue)) {
            toast.error("Password must be at least 8 characters and include a number, uppercase, lowercase, and special character.");
            return;
        }

        if (passwordValue !== rePassValue) {
            toast.error("Passwords do not match");
            return;
        }

        // ─── THE FIXED BLOCK ─────────────────────────────────────
        try {
            // Optional: If you have an API to trigger the email OTP, call it here.
            await Otp_Verification({ email: emailValue });

            toast.success("OTP sent! Please verify your email.");
            
            // Navigate ONCE, securely passing the state
            navigate("/otp", {
                state: {
                    firstName: firstNameValue,
                    lastName: lastNameValue, 
                    email: emailValue,
                    password: passwordValue 
                }
            });
            
        } catch (error) {
            console.error("Error transitioning to OTP: ", error);
            toast.error("Something went wrong. Please try again.");
        }
        // ─────────────────────────────────────────────────────────
    };
    
    return (
        <div className="min-h-screen flex text-gray-900 bg-white">
            {/* Left side: Premium Branding/Graphic Side */}
            <div className="hidden lg:flex w-1/2 dark-animated-gradient-bg relative flex-col items-center justify-center p-12 overflow-hidden">
                {/* Abstract floating shapes for premium feel */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl shadow-2xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl shadow-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10 glass-card p-12 rounded-[3rem] text-center max-w-lg shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/20 bg-white/10">
                    <img className="h-24 mx-auto mb-8 drop-shadow-xl filter rounded-2xl bg-white p-2" src={logo} alt="Deep-X Logo" />
                    <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-md">
                        Join Deep-X Today
                    </h1>
                    <p className="text-lg text-gray-200 font-medium leading-relaxed">
                        Start your journey towards a more organized and secure workflow. Everything you need, elegantly designed.
                    </p>
                </div>
            </div>

            {/* Right side: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative overflow-y-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/50 lg:hidden pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10 animate-fade-in-up py-8">
                    <div className="text-left mb-8">
                        <img className="h-12 mb-6 lg:hidden filter rounded-xl bg-white p-1 shadow-sm" src={logo} alt="Deep-X Logo" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 font-medium">
                            Join us to start your journey. Please fill out your details.
                        </p>
                    </div>

                    <form onSubmit={formHandler} className="flex flex-col gap-5">
                        
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 w-1/2 group">
                                <label htmlFor="firstName" className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">
                                    First Name
                                </label>
                                <div className="relative">
                                    <i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                    <input
                                        ref={firstName}
                                        type="text"
                                        id="firstName"
                                        placeholder="John"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 w-1/2 group">
                                <label htmlFor="lastName" className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                    <input
                                        ref={lastName}
                                        type="text"
                                        id="lastName"
                                        placeholder="Doe"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 group">
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
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 group">
                            <label htmlFor="pass" className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">
                                Password
                            </label>
                            <div className="relative">
                                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                <input
                                    ref={password}
                                    type={showPassword ? "text" : "password"} 
                                    id="pass"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors bg-white/50 p-1 rounded-md backdrop-blur-sm"
                                >
                                    <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line text-lg"}></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 group">
                            <label htmlFor="repass" className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600 pointer-events-none"></i>
                                <input
                                    ref={rePass}
                                    type={showRePass ? "text" : "password"} 
                                    id="repass"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 font-medium tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRePass(!showRePass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors bg-white/50 p-1 rounded-md backdrop-blur-sm"
                                >
                                    <i className={showRePass ? "ri-eye-off-line" : "ri-eye-line text-lg"}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full glass-button text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] flex justify-center items-center gap-2 group"
                        >
                            <span>Create Account</span>
                            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                        </button>

                        <div className="relative mt-2 flex items-center justify-center">
                            <div className="border-t border-gray-200 w-full absolute top-1/2"></div>
                            <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider relative z-10">Almost there</span>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-2 font-medium">
                            Already a member?{" "}
                            <Link
                                to={"/login"}
                                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors ml-1 border-b-2 border-indigo-200 hover:border-indigo-600"
                            >
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;