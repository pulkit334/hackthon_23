import React, { useState } from "react";
import { Link } from "react-router-dom";

const Forget = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		// TODO: Add your API call here to send the reset link to the backend
		console.log("Reset link requested for:", email);

		// Simulate a successful API response
		setIsSubmitted(true);
	};

	return (
		<div className="flex items-center justify-center min-h-screen animated-gradient-bg px-4 relative overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

			<div className="w-full max-w-md glass-card p-10 rounded-[2.5rem] relative z-10 animate-fade-in-up">
				{/* Icon Header */}
				<div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-sm border border-white">
					<i className="ri-lock-password-fill text-3xl text-indigo-600"></i>
				</div>

				<h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
					Forgot Password?
				</h2>

				{/* Conditional Rendering: Form vs Success Message */}
				{!isSubmitted ? (
					<>
						<p className="text-gray-600 text-center font-medium mb-8">
							No worries! Enter your email address below and we'll
							send you instructions to reset your password.
						</p>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="group">
								<label
									htmlFor="email"
									className="block text-sm font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600"
								>
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<i className="ri-mail-line text-gray-400 text-lg transition-colors group-focus-within:text-indigo-600"></i>
									</div>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400"
										placeholder="Enter your registered email"
										required
									/>
								</div>
							</div>

							<button
								type="submit"
								className="w-full glass-button text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group"
							>
								<span>Send Reset Link</span>
								<i className="ri-send-plane-fill transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
							</button>
						</form>
					</>
				) : (
					<div className="py-4 animate-fade-in">
						<div className="bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-800 p-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
							<div className="bg-green-100 p-1.5 rounded-full mt-0.5">
								<i className="ri-check-line text-xl font-bold text-green-600"></i>
							</div>
							<p className="leading-relaxed font-medium text-sm">
								We have sent a password reset link to{" "}
								<span className="font-extrabold text-green-900">
									{email}
								</span>
								. Please check your inbox.
							</p>
						</div>

						<button
							onClick={() => setIsSubmitted(false)}
							className="block w-full text-center text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors bg-white/50 py-3 rounded-xl hover:bg-white/80"
						>
							Didn't receive the email? Try again.
						</button>
					</div>
				)}

				{/* Back to Login Link */}
				<div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
					<Link
						to="/login"
						className="text-sm font-bold text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors group"
					>
						<div className="bg-white/60 p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">
							<i className="ri-arrow-left-line"></i>
						</div>
						Back to log in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Forget;
