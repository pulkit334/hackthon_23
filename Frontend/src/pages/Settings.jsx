import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
	return (
		<div className="w-full relative z-0 min-h-screen">
			{/* Decorative background gradients */}
			<div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"></div>
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>

			<div className="p-4 pt-24 md:p-10 max-w-5xl mx-auto flex flex-col relative z-10">
				{/* Header */}
				<div className="mb-10 text-center md:text-left">
					<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
						Platform Settings
					</h1>
					<p className="text-gray-500 text-sm sm:text-base font-medium max-w-2xl">
						Manage your account preferences, configure security options, and customize your experience.
					</p>
				</div>

				{/* Settings Sections Container */}
				<div className="space-y-10 animate-fade-in-up">
					{/* 1. Security Section */}
					<section className="glass-card p-6 sm:p-8 rounded-[2rem]">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
								<i className="ri-shield-keyhole-fill text-xl"></i>
							</div>
							<h2 className="text-lg font-extrabold text-gray-900 tracking-wide">
								Security & Authentication
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Change Password Link */}
							<Link
								to="/change-password"
								className="group relative overflow-hidden bg-white/60 border border-gray-200/50 p-5 rounded-2xl hover:bg-white transition-all shadow-sm hover:shadow-md hover:border-indigo-200 flex flex-col justify-between h-40"
							>
								<div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
									<i className="ri-lock-password-line text-8xl text-indigo-600"></i>
								</div>
								<div>
									<div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
										<i className="ri-key-2-line text-2xl"></i>
									</div>
									<h3 className="text-base font-bold text-gray-900 mb-1">
										Change Password
									</h3>
									<p className="text-xs font-medium text-gray-500">
										Update your active credentials
									</p>
								</div>
								<div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:scale-110">
									<i className="ri-arrow-right-line"></i>
								</div>
							</Link>

							{/* Two-Factor Authentication (Placeholder) */}
							<div className="relative overflow-hidden bg-white/60 border border-gray-200/50 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-40 opacity-70">
								<div>
									<div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 border border-green-100">
										<i className="ri-smartphone-line text-2xl"></i>
									</div>
									<h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
										Two-Factor Auth <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Coming Soon</span>
									</h3>
									<p className="text-xs font-medium text-gray-500">
										SMS or Authenticator App
									</p>
								</div>
								<div className="absolute bottom-5 right-5 w-11 h-6 bg-gray-200 rounded-full cursor-not-allowed">
									<div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
								</div>
							</div>
						</div>
					</section>

					{/* 2. Profile & Account Section (Dummy) */}
					<section className="glass-card p-6 sm:p-8 rounded-[2rem]">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
								<i className="ri-user-settings-fill text-xl"></i>
							</div>
							<h2 className="text-lg font-extrabold text-gray-900 tracking-wide">
								Profile Preferences
							</h2>
						</div>

						<div className="bg-white/60 border border-gray-200/50 rounded-2xl overflow-hidden divide-y divide-gray-100/50 shadow-sm">
							<div className="flex items-center justify-between p-5 hover:bg-white transition-colors cursor-pointer group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
										<i className="ri-file-user-line text-xl"></i>
									</div>
									<div>
										<h3 className="text-sm sm:text-base font-bold text-gray-900">
											Personal Information
										</h3>
										<p className="text-xs font-medium text-gray-500 mt-0.5">
											Update your display name and contact details
										</p>
									</div>
								</div>
								<div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
									<i className="ri-arrow-right-s-line text-xl"></i>
								</div>
							</div>

							<div className="flex items-center justify-between p-5 hover:bg-white transition-colors cursor-pointer group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
										<i className="ri-notification-badge-line text-xl"></i>
									</div>
									<div>
										<h3 className="text-sm sm:text-base font-bold text-gray-900">
											Notifications
										</h3>
										<p className="text-xs font-medium text-gray-500 mt-0.5">
											Manage email alerts and push notifications
										</p>
									</div>
								</div>
								<div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
									<i className="ri-arrow-right-s-line text-xl"></i>
								</div>
							</div>
						</div>
					</section>

					{/* 3. Danger Zone */}
					<section className="mt-12 bg-red-50/50 border border-red-100 p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
						<div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
							<i className="ri-alert-fill text-9xl text-red-600"></i>
						</div>
						
						<div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
							<div>
								<h3 className="text-lg font-extrabold text-red-700 flex items-center gap-2">
									<i className="ri-error-warning-fill"></i> Danger Zone
								</h3>
								<p className="text-sm font-medium text-red-500 mt-1 max-w-md">
									Permanently delete your account along with all associated data. This action cannot be undone.
								</p>
							</div>
							<Link
								to={"/delete-account"}
								className="px-6 py-3 bg-white text-red-600 text-sm font-bold border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm whitespace-nowrap active:scale-95 flex items-center gap-2 w-fit"
							>
								<i className="ri-delete-bin-line"></i> Delete Account
							</Link>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Settings;
