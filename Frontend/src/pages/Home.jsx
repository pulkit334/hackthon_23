import React from "react";
import FileUpload from "../components/general/FileUpload";

const Home = () => {
	return (
		<div className="flex-1 w-full relative z-0">
			<div className="p-4 pt-20 md:p-8 md:pt-8 max-w-[90rem] mx-auto flex flex-col h-full min-h-[calc(100vh-2rem)]">
				<div className="mb-6 flex flex-col items-start gap-1">
					<h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">Upload Center</h1>
					<p className="text-gray-600 font-medium text-sm">Securely upload and process your primary documents and supporting files.</p>
				</div>
				<div className="flex-1 glass-card rounded-[2.5rem] p-4 sm:p-6 md:p-10 flex flex-col relative overflow-hidden group/container">
					{/* Decorative background glow for the card */}
					<div className="absolute top-[-50%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 group-hover/container:bg-indigo-400/20"></div>
					<div className="relative z-10 w-full flex-1">
					    <FileUpload />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
