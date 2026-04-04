import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { DocumentAnalysis } from "../Api's/api's_Config/api.document.anayltics";

const Analytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    success: 0,
    pending: 0,
    processing: 0,
    failed: 0,
  });

  // OPTIMIZATION 1: Track the interval ID to easily clear it without causing re-renders
  const intervalRef = useRef(null);
  
  // OPTIMIZATION 2: Track if the component is mounted to prevent state updates on unmounted components
  const isMounted = useRef(true);

  useEffect(() => {
    // Reset to true in case of React 18 Strict Mode double-invocations
    isMounted.current = true;

    const fetchStats = async () => {
      try {
        const res = await DocumentAnalysis();

        // Only update state if the component is STILL on the screen
        if (isMounted.current && res?.data?.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching live stats:", error);
      }
    };

    // Fetch immediately when the page loads
    fetchStats();

    // Store the interval ID in the ref
    intervalRef.current = setInterval(fetchStats, 5000);

    // Cleanup function when component unmounts
    return () => {
      isMounted.current = false; // Flag that component is unmounting
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear the interval
      }
    };
  }, []);

  return (
    <div className="w-full relative z-0 min-h-screen">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="p-4 pt-24 md:p-10 max-w-6xl mx-auto flex flex-col relative z-10 w-full animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-medium max-w-2xl">
            Monitor your document processing pipelines and system logs in
            real-time.
          </p>
        </div>

        {/* Indicators Grid (Smaller Boxes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* Success Indicator */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl border-2 border-transparent hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200/50 shadow-sm">
                <i className="ri-checkbox-circle-fill text-xl"></i>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Processed
              </span>
            </div>
            {/* 🟢 LIVE DATA */}
            <h3 className="text-2xl font-black text-gray-900 mb-0.5">
              {stats.success}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              Successfully Processed
            </p>
          </div>

          {/* Pending Indicator */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl border-2 border-transparent hover:border-amber-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200/50 shadow-sm">
                <i className="ri-time-fill text-xl"></i>
              </div>
              <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Queued
              </span>
            </div>
            {/* 🟡 LIVE DATA */}
            <h3 className="text-2xl font-black text-gray-900 mb-0.5">
              {stats.pending}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              Pending Execution
            </p>
          </div>

          {/* Processing Indicator */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl border-2 border-transparent hover:border-blue-200 hover:shadow-md transition-all relative">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200/50 shadow-sm">
                <i
                  className={`ri-loader-4-line text-xl ${stats.processing > 0 ? "animate-spin" : ""}`}
                ></i>
              </div>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Active
              </span>
            </div>
            {/* 🔵 LIVE DATA */}
            <h3 className="text-2xl font-black text-gray-900 mb-0.5">
              {stats.processing}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              Currently Processing
            </p>

            {/* Extra: Tiny pulsing blue dot when worker is active */}
            {stats.processing > 0 && (
              <div className="absolute top-5 right-5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
            )}
          </div>

          {/* Failure Indicator (Clickable to redirect) */}
          <div
            onClick={() => navigate("/analytics/failures")}
            className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 border border-red-200/50 shadow-sm relative group-hover:scale-105 transition-transform">
                <i className="ri-error-warning-fill text-xl"></i>
                {/* Only show the red ping if there are actually failed files */}
                {stats.failed > 0 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 group-hover:bg-red-100 transition-colors">
                Attention <i className="ri-arrow-right-line"></i>
              </span>
            </div>
            {/* 🔴 LIVE DATA */}
            <h3 className="text-2xl font-black text-red-600 mb-0.5">
              {stats.failed}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              Failed Operations (View Details)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;