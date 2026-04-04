import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { DocumentUpload } from "../../Api's/api's_Config/api.document.config";

const FileUpload = () => {
    const mainFileInputRef = useRef(null);
    const supportFileInputRef = useRef(null);

    const [documentGroups, setDocumentGroups] = useState([]);
    const [activeDocId, setActiveDocId] = useState(null);
    const [sector, setSector] = useState("legal");
    
    const [isUploading, setIsUploading] = useState(false);
    // ─── NEW: State for tracking upload percentage ───
    const [uploadProgress, setUploadProgress] = useState(0);

    const MAX_TOTAL_SIZE = 15 * 1024 * 1024;

    const calculateTotalSize = () => {
        return documentGroups.reduce((total, group) => {
            const mainSize = group.mainFile.size;
            const supportSize = group.supportFiles.reduce((sum, f) => sum + f.size, 0);
            return total + mainSize + supportSize;
        }, 0);
    };

    const getValidFiles = (files, currentTotal) => {
        const allowedExtensions = [".pdf", ".docx", ".txt"];
        let runningTotal = currentTotal;

        return Array.from(files).filter((file) => {
            const isImage = file.type.startsWith("image/");
            const hasValidExtension = allowedExtensions.some((ext) =>
                file.name.toLowerCase().endsWith(ext),
            );

            if (!isImage && !hasValidExtension) {
                toast.warning(`Skipped: "${file.name}". Only .pdf, .docx, .txt, and images allowed.`);
                return false;
            }

            if (runningTotal + file.size > MAX_TOTAL_SIZE) {
                toast.error(`Skipped: "${file.name}". Combined total cannot exceed 15MB.`);
                return false;
            }

            runningTotal += file.size;
            return true;
        });
    };

    const handleMainFileSelect = (files) => {
        if (!files) return;
        const currentTotal = calculateTotalSize();
        const validFiles = getValidFiles(files, currentTotal);
        const newGroups = validFiles.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            mainFile: file,
            supportFiles: [],
        }));
        setDocumentGroups((prev) => [...prev, ...newGroups]);
    };

    const removeMainDocument = (id) => {
        setDocumentGroups((prev) => prev.filter((doc) => doc.id !== id));
    };

    const triggerSupportUpload = (id) => {
        setActiveDocId(id);
        supportFileInputRef.current.click();
    };

    const handleSupportFileSelect = (files) => {
        if (!files || !activeDocId) return;
        const targetGroup = documentGroups.find((doc) => doc.id === activeDocId);
        if (!targetGroup) return;

        const currentCount = targetGroup.supportFiles.length;
        const remainingSlots = 5 - currentCount;

        if (remainingSlots <= 0) {
            toast.error("You can only attach a maximum of 5 support files.");
            setActiveDocId(null);
            return;
        }

        const currentTotal = calculateTotalSize();
        const validFiles = getValidFiles(files, currentTotal);
        let filesToAdd = validFiles;

        if (validFiles.length > remainingSlots) {
            toast.warning(`Limit reached. Only ${remainingSlots} more file(s) were added.`);
            filesToAdd = validFiles.slice(0, remainingSlots);
        }

        setDocumentGroups((prev) =>
            prev.map((doc) => {
                if (doc.id === activeDocId) {
                    return { ...doc, supportFiles: [...doc.supportFiles, ...filesToAdd] };
                }
                return doc;
            }),
        );
        setActiveDocId(null);
    };

    const removeSupportFile = (docId, supportFileIndex) => {
        setDocumentGroups((prev) =>
            prev.map((doc) => {
                if (doc.id === docId) {
                    const updatedSupport = doc.supportFiles.filter((_, i) => i !== supportFileIndex);
                    return { ...doc, supportFiles: updatedSupport };
                }
                return doc;
            }),
        );
    };

    // ─── SUBMISSION ──────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (documentGroups.length === 0) {
            toast.error("Please select at least one primary document.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0); // Reset progress on new upload
        const uploadToastId = toast.loading("Preparing upload...");

        const formData = new FormData();
        
        formData.append("sector", sector);

        documentGroups.forEach((group) => {
            formData.append("files", group.mainFile);
            
            group.supportFiles.forEach((supportFile) => {
                formData.append("files", supportFile);
            });
        });

        // ─── NEW: Axios Progress Configuration ───
        const config = {
            onUploadProgress: (progressEvent) => {
                // Calculate percentage
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
                
                // Update toast message dynamically
                toast.update(uploadToastId, {
                    render: `Uploading... ${percentCompleted}%`,
                });
            }
        };

        try {
            // Pass the config alongside your formData!
            const response = await DocumentUpload(formData, config);

            console.log("Upload successful:", response);
            setDocumentGroups([]);

            toast.update(uploadToastId, {
                render: "Documents uploaded successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

        } catch (error) {
            console.error("Upload failed:", error);
            const errorMsg = error.response?.data?.message || "Failed to upload documents.";
            
            toast.update(uploadToastId, {
                render: errorMsg,
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setIsUploading(false);
            // Optionally, you can keep the progress bar at 100% for a moment, 
            // but setting it back to 0 cleans up the UI.
            setTimeout(() => setUploadProgress(0), 1000); 
        }
    };
    // ─────────────────────────────────────────────────────────────

    const currentTotalSizeMB = (calculateTotalSize() / (1024 * 1024)).toFixed(1);
    const sizePercentage = Math.min((calculateTotalSize() / MAX_TOTAL_SIZE) * 100, 100);

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
            <input
                type="file"
                multiple
                ref={supportFileInputRef}
                onChange={(e) => {
                    handleSupportFileSelect(e.target.files);
                    e.target.value = null;
                }}
                className="hidden"
                accept=".pdf, .docx, .txt, image/*"
            />

            <div className="lg:col-span-7 xl:col-span-8 space-y-6 animate-fade-in">
                <div className="space-y-4">
                    <div className="flex justify-between items-end pb-2 border-b border-gray-200/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">1</span>
                            Select Primary Documents
                        </h2>
                        <div className="text-right">
                            <p className="text-[10px] font-black tracking-widest text-gray-400 mb-0.5">TOTAL SIZE</p>
                            <p className={`text-base font-extrabold ${sizePercentage > 90 ? "text-red-500" : "text-indigo-600"}`}>
                                {currentTotalSizeMB} <span className="text-gray-400 font-medium text-sm">/ 15 MB</span>
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => mainFileInputRef.current.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleMainFileSelect(e.dataTransfer.files); }}
                        className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer px-4 text-center overflow-hidden ${isUploading || sizePercentage >= 100 ? "opacity-50 pointer-events-none" : "border-indigo-300 bg-indigo-50/30 hover:bg-white hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]"}`}
                    >
                        {/* Glowing effect inside dropzone */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <input
                            type="file"
                            multiple
                            ref={mainFileInputRef}
                            onChange={(e) => handleMainFileSelect(e.target.files)}
                            className="hidden"
                            accept=".pdf, .docx, .txt, image/*"
                        />
                        <div className="flex flex-col items-center gap-3 pointer-events-none relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                            <div className="w-14 h-14 bg-white shadow-sm border border-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                                <i className="ri-folder-upload-fill text-indigo-500 text-3xl"></i>
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium text-lg">
                                    <span className="text-indigo-600 font-bold group-hover:underline decoration-2 underline-offset-4">Click to browse</span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-gray-400 text-sm mt-1">.pdf, .docx, .txt, images (Max 15MB total)</p>
                            </div>
                        </div>
                    </div>

                    {documentGroups.length > 0 && (
                        <div className="space-y-4 pt-4">
                            {documentGroups.map((group) => (
                                <div key={group.id} className="p-5 bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-sm hover:shadow-md transition-shadow group/item">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center border border-indigo-100/50 shadow-sm shrink-0">
                                                <i className="ri-file-text-fill text-2xl text-indigo-500"></i>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-base font-bold text-gray-800 truncate">{group.mainFile.name}</p>
                                                <p className="text-xs font-semibold text-gray-400">{(group.mainFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => triggerSupportUpload(group.id)}
                                                disabled={isUploading || group.supportFiles.length >= 5 || sizePercentage >= 100}
                                                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${group.supportFiles.length >= 5 || sizePercentage >= 100 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"}`}
                                            >
                                                <i className="ri-attachment-2"></i>{" "}
                                                {group.supportFiles.length >= 5 ? "Limit Reached" : "Attach"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeMainDocument(group.id)}
                                                disabled={isUploading}
                                                className="text-gray-400 hover:text-red-500 w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm"
                                            >
                                                <i className="ri-delete-bin-5-fill text-lg"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {group.supportFiles.length > 0 && (
                                        <div className="mt-4 ml-6 pl-5 border-l-2 border-indigo-100/50 space-y-2 relative">
                                            <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full border-2 border-white bg-indigo-200"></div>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md inline-block">Supporting Elements</p>
                                                <p className="text-[10px] font-bold text-gray-400">{group.supportFiles.length} / 5</p>
                                            </div>
                                            {group.supportFiles.map((supportFile, sIndex) => (
                                                <div key={sIndex} className="flex items-center justify-between p-3 bg-white/50 border border-gray-100 rounded-2xl group/sub">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <i className="ri-file-shield-2-fill text-emerald-500 text-xl shrink-0 drop-shadow-sm"></i>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-gray-700 truncate">{supportFile.name}</p>
                                                            <p className="text-[10.5px] font-medium text-gray-400">{(supportFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSupportFile(group.id, sIndex)}
                                                        disabled={isUploading}
                                                        className="text-gray-300 hover:text-red-500 p-1.5 shrink-0 transition-colors opacity-0 group-hover/sub:opacity-100 focus:opacity-100"
                                                    >
                                                        <i className="ri-close-circle-fill text-xl"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/50 sticky top-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">2</span>
                        Document Category
                    </h2>
                    <div className="flex flex-col gap-4">
                        <label className={`relative flex gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${sector === "legal" ? "border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]" : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50/50"} ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {sector === "legal" && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/20 to-transparent blur-xl"></div>}
                            <div className="flex items-center pt-0.5">
                                <input type="radio" name="sector" value="legal" checked={sector === "legal"} onChange={(e) => setSector(e.target.value)} disabled={isUploading} className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <span className="block text-base font-bold text-gray-900 mb-0.5">Legal Documents</span>
                                <span className="block text-sm font-medium text-gray-500 leading-snug">Processing contracts, NDAs, and strict compliance forms.</span>
                            </div>
                        </label>
                        <label className={`relative flex gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${sector === "financial" ? "border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]" : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50/50"} ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {sector === "financial" && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/20 to-transparent blur-xl"></div>}
                            <div className="flex items-center pt-0.5">
                                <input type="radio" name="sector" value="financial" checked={sector === "financial"} onChange={(e) => setSector(e.target.value)} disabled={isUploading} className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <span className="block text-base font-bold text-gray-900 mb-0.5">Financial Documents</span>
                                <span className="block text-sm font-medium text-gray-500 leading-snug">Handling invoices, tax returns, and balance sheets securely.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200/60">
                    <button
                        type="submit"
                        disabled={documentGroups.length === 0 || isUploading}
                        className="w-full glass-button text-white py-4 px-4 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-3 group relative overflow-hidden"
                    >
                        {isUploading ? (
                            <><i className="ri-loader-4-line animate-spin text-2xl"></i> Synchronizing...</>
                        ) : (
                            <>
                                <span>Upload to Secure Server</span>
                                <i className="ri-cloud-upload-fill text-xl transition-transform group-hover:-translate-y-1"></i>
                            </>
                        )}
                    </button>

                    {/* Highly polished Visual Progress Bar */}
                    {isUploading && (
                        <div className="w-full mt-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm animate-fade-in">
                            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2 px-1">
                                <span className="flex items-center gap-1.5"><i className="ri-lock-fill text-indigo-500"></i> Encrypting & Transferring</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all ease-out duration-300 shadow-[0_0_10px_rgba(99,102,241,0.8)] relative" 
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    {/* Shimmer effect inside progress bar */}
                                    <div className="absolute inset-0 w-full h-full bg-white/20" style={{ transform: "skewX(-20deg)", animation: "shimmer 2s infinite" }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default FileUpload;