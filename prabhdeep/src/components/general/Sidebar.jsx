import React from "react";
import { Link, NavLink } from "react-router-dom";
import image from "../../assets/logo.jpg";

const Sidebar = () => {
	// Utility to handle active vs inactive styles
	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
			isActive
				? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
				: "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
		}`;

	return (
		<div className="w-[20%] h-screen bg-white border-r border-gray-100 p-6 flex flex-col justify-between">
			<div>
				{/* Logo Section */}
				<div className="mb-5 px-2">
					<NavLink to={"/"}>
						<img src={image} alt="" className="h-20" />
					</NavLink>
				</div>

				{/* Navigation Links */}
				<nav>
					<ul className="flex flex-col gap-2">
						<li>
							<NavLink to="/" className={navLinkClass}>
								<i className="ri-home-4-line text-xl"></i>
								<span className="font-medium">Home</span>
							</NavLink>
						</li>
						<li>
							<NavLink to="/settings" className={navLinkClass}>
								<i className="ri-settings-3-line text-xl"></i>
								<span className="font-medium">Settings</span>
							</NavLink>
						</li>
						<li>
							<NavLink to="/help" className={navLinkClass}>
								<i className="ri-question-line text-xl"></i>
								<span className="font-medium">
									Help & Support
								</span>
							</NavLink>
						</li>
					</ul>
				</nav>
			</div>

			{/* Bottom Section (User/Logout) */}
			<div className="border-t border-gray-100 pt-6">
				<Link
					to={"/login"}
					className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
				>
					<i className="ri-logout-box-r-line text-xl"></i>
					<span className="font-medium">Logout</span>
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
