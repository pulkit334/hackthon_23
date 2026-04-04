import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
// Note: Update this path to wherever your actual auth slice is located
import { logout } from "../../redux/userSlice";
import image from "../../assets/logo.jpg";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch(); // Initialize dispatch

	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
			isActive
				? "text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] bg-indigo-600/90 border border-indigo-500/30 font-semibold"
				: "text-gray-600 hover:bg-white/40 hover:text-indigo-600 border border-transparent hover:border-gray-200/50 hover:shadow-sm"
		}`;

	const closeSidebar = () => setIsOpen(false);

	// Custom handler for logging out
	const handleLogout = () => {
		dispatch(logout()); // 1. Dispatch the logout action
		closeSidebar(); // 2. Close the mobile sidebar
	};

	return (
		<>
			{/* Mobile Hamburger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="md:hidden fixed top-4 left-4 z-50 p-2.5 glass-card rounded-xl text-gray-700 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95"
			>
				<i
					className={`ri-${isOpen ? "close-line" : "menu-line"} text-2xl drop-shadow-md`}
				></i>
			</button>

			{/* Mobile Overlay Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-gray-900/40 z-40 md:hidden backdrop-blur-md transition-all duration-300"
					onClick={closeSidebar}
				></div>
			)}

			{/* Sidebar Container */}
			<div
				className={`fixed top-0 left-0 h-screen w-72 glass-card border-r border-white/40 p-6 flex flex-col justify-between z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0 ${
					isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
				}`}
			>
				{/* Top-level background glow effect */}
				<div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none rounded-t-3xl"></div>

				<div className="relative z-10 w-full">
					{/* Logo Section */}
					<div className="mb-10 px-2 flex justify-center items-center mt-8 md:mt-0">
						<NavLink to={"/"} onClick={closeSidebar} className="relative group perspective-1000">
							<div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
							<div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm relative">
							    <img
								    src={image}
								    alt="Logo"
								    className="h-10 md:h-12 object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
							    />
							</div>
						</NavLink>
					</div>

					{/* Navigation Links */}
					<nav>
						<ul className="flex flex-col gap-3">
							<li>
								<NavLink
									to="/"
									className={navLinkClass}
									onClick={closeSidebar}
								>
									<i className="ri-home-smile-2-line text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"></i>
									<span className="tracking-wide">Home</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/analytics"
									className={navLinkClass}
									onClick={closeSidebar}
								>
									<i className="ri-bar-chart-box-line text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"></i>
									<span className="tracking-wide">Analytics</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/settings"
									className={navLinkClass}
									onClick={closeSidebar}
								>
									<i className="ri-settings-4-line text-xl transition-transform duration-300 group-hover:rotate-90"></i>
									<span className="tracking-wide">
										Settings
									</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/help"
									className={navLinkClass}
									onClick={closeSidebar}
								>
									<i className="ri-customer-service-2-line text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"></i>
									<span className="tracking-wide">
										Help & Support
									</span>
								</NavLink>
							</li>
						</ul>
					</nav>
				</div>

				{/* Bottom Section (User/Logout) */}
				<div className="relative z-10 border-t border-gray-200/50 pt-6 mt-6">
					<Link
						to={"/login"}
						onClick={handleLogout}
						className="group flex items-center justify-between px-5 py-3.5 w-full rounded-xl bg-white/40 border border-white/50 text-gray-600 hover:bg-red-50/80 hover:text-red-600 hover:border-red-100 transition-all duration-300 shadow-sm hover:shadow-md"
					>
						<div className="flex items-center gap-3">
						   <i className="ri-logout-circle-r-line text-xl transition-transform duration-300 group-hover:translate-x-1"></i>
						   <span className="font-semibold tracking-wide">Logout</span>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
