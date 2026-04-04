import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Generate 25 dummy failed files for demonstration
const MOCK_FAILED_FILES = Array.from({ length: 25 }, (_, i) => ({
    id: `ERR-${1000 + i}`,
    fileName: `document_batch_${i + 1}.pdf`,
    reason: i % 3 === 0 ? "Corrupted file structure" : i % 2 === 0 ? "Unsupported format" : "Network timeout during upload",
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
    size: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`
}));

const ITEMS_PER_PAGE = 10;

const FailureList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate pagination values
    const totalPages = Math.ceil(MOCK_FAILED_FILES.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFiles = MOCK_FAILED_FILES.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="w-full relative z-0 min-h-screen">
            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-300/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-4 pt-20 md:p-8 max-w-5xl mx-auto flex flex-col relative z-10 w-full animate-fade-in">
                {/* Back button and Header */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/analytics')}
                        className="text-gray-500 hover:text-indigo-600 transition-colors font-semibold flex items-center gap-1 mb-4 text-sm"
                    >
                        <i className="ri-arrow-left-line"></i> Back to Analytics
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-2 tracking-tight flex items-center gap-3">
                        <i className="ri-error-warning-fill"></i> Failure Logs
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Detailed breakdown of files that encountered errors during processing.
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] p-6 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-end pb-4 border-b border-gray-100 flex-wrap gap-4">
                        <p className="text-sm font-bold text-gray-700">
                            Showing {paginatedFiles.length} of {MOCK_FAILED_FILES.length} problematic files
                        </p>
                    </div>

                    {/* List */}
                    <div className="space-y-3 mt-4 mb-6">
                        {paginatedFiles.map((file) => (
                            <div key={file.id} className="bg-white/60 border border-red-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm hover:bg-white transition-all">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0 border border-red-100 mt-1 sm:mt-0">
                                        <i className="ri-file-damage-fill text-lg"></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-gray-900">{file.fileName}</h4>
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{file.id}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-red-500 mb-1"><i className="ri-alert-line mr-1"></i> {file.reason}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{file.timestamp} • {file.size}</p>
                                    </div>
                                </div>
                                <div className="sm:self-center shrink-0">
                                    <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                        <i className="ri-refresh-line"></i> Retry
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <p className="text-sm font-bold text-gray-500">
                                Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95 transition-all"
                                >
                                    <i className="ri-arrow-left-s-line text-xl"></i>
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95 transition-all"
                                >
                                    <i className="ri-arrow-right-s-line text-xl"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FailureList;
