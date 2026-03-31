import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const SignUp = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-3 font-sans">
			{/* Main Card */}
			<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 pt-2 border border-gray-100 ">
				{/* Header */}
				<div className="text-center mb-8">
					<img className="h-18 mx-auto" src={logo} alt="" />
					<p className="text-gray-400 mt-2">
						Join us to start your journey
					</p>
				</div>

				<form className="flex flex-col gap-4">
					{/* Username Input Group */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="username"
							className="text-sm font-semibold text-gray-700 ml-1"
						>
							Username
						</label>
						<div className="relative">
							<i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
							<input
								type="text"
								id="username"
								placeholder="johndoe123"
								aria-autocomplete="off"
								className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
							/>
						</div>
					</div>

					{/* Email Input Group */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="email"
							className="text-sm font-semibold text-gray-700 ml-1"
						>
							Email Address
						</label>
						<div className="relative">
							<i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
							<input
								type="email"
								id="email"
								placeholder="name@company.com"
								className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
							/>
						</div>
					</div>

					{/* Password Input Group */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="pass"
							className="text-sm font-semibold text-gray-700 ml-1"
						>
							Password
						</label>
						<div className="relative">
							<i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
							<input
								type="password"
								id="pass"
								placeholder="••••••••"
								className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
							/>
						</div>
					</div>

					{/* Retype Password Input Group */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="repass"
							className="text-sm font-semibold text-gray-700 ml-1"
						>
							Confirm Password
						</label>
						<div className="relative">
							<i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
							<input
								type="password"
								id="repass"
								placeholder="••••••••"
								className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="button"
						className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
					>
						Create Account
					</button>

					{/* Footer Text */}
					<p className="text-center text-sm text-gray-500 mt-2">
						Already a member?
						<Link
							to={"/login"}
							type="button"
							className="text-indigo-600 font-bold hover:underline underline-offset-4"
						>
							Log In
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
