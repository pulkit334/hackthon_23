import Document from "../modal/document.js";

export const getGlobalAnalytics = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId || req.user?.user_id || req.user?.user;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please log in.",
            });
        }

        const [success, pending, processing, failed] = await Promise.all([
            // ─── Successfully processed — all final done states ───
            Document.countDocuments({
                uploadedBy: userId,
                status: { $in: ['done', 'processed'] }
            }),
            // ─── Waiting in queue ─────────────────────────────────
            Document.countDocuments({
                uploadedBy: userId,
                status: { $in: ['queued'] }
            }),
            // ─── Currently being worked on ────────────────────────
            Document.countDocuments({
                uploadedBy: userId,
         status: { $in: ['scanning', 'extracting', 'analysing', 'processed'] }

            }),
            // ─── Failed or blocked ────────────────────────────────
            Document.countDocuments({
                uploadedBy: userId,
                status: { $in: ['failed', 'blocked'] }
            })
        ]);

        return res.status(200).json({
            success: true,
            stats: { success, pending, processing, failed }
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};