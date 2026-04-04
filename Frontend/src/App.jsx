import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/general/Sidebar";

const App = () => {
	return (
		<div className="flex w-full animated-gradient-bg min-h-screen text-gray-900 selection:bg-indigo-200">
			<Sidebar />
			<main className="flex-1 h-screen overflow-y-auto relative perspective-1000">
				<Outlet />
			</main>
		</div>
	);
};

export default App;
