import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send } from "lucide-react";
import { toast } from "react-toastify";
import RoomInvitationApi from "../../services/RoomInvitationService";
import JwtUtils from "../../utils/security/JwtUtils";

export default function InviteModal({ isOpen, onClose, roomCode }) {
    const [email, setEmail] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendInvitation = async (e) => {
        e.preventDefault();

        // Validate email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const invitationDTO = {
                recipientEmail: email,
                roomCode: parseInt(roomCode),
                customMessage: customMessage.trim() || undefined,
                inviterName: JwtUtils.getUsername() || undefined,
            };

            await RoomInvitationApi.sendSingleInvitation(invitationDTO);
            console.log("✅ Invitation sent successfully");
            toast.success(`📧 Invitation sent to ${email}!`);

            // Reset form and close modal
            setEmail("");
            setCustomMessage("");
            onClose();
        } catch (error) {
            console.error("❌ Failed to send invitation:", error);
            toast.error(error.message || "Failed to send invitation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-surface/95 backdrop-blur-md border border-surface/50 rounded-radius-xl p-6 w-full max-w-md shadow-shadow-strong">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-text flex items-center gap-2">
                                    <Mail className="text-primary" size={24} />
                                    Invite Friend
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-muted hover:text-text transition-colors p-1 rounded-lg hover:bg-bg/50"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSendInvitation} className="space-y-4">
                                {/* Room Code Display */}
                                <div className="bg-bg/50 rounded-radius-lg p-3 border border-surface/30">
                                    <p className="text-xs text-muted mb-1">Room Code</p>
                                    <p className="text-xl font-mono font-bold text-primary">{roomCode}</p>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm mb-1 text-muted">
                                        Friend's Email <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="friend@example.com"
                                        required
                                        className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                {/* Custom Message (Optional) */}
                                <div>
                                    <label className="block text-sm mb-1 text-muted">
                                        Custom Message (Optional)
                                    </label>
                                    <textarea
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        placeholder="Join me for a coding battle!"
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-2 px-4 rounded-radius-lg bg-bg/70 border border-surface/50 text-muted hover:text-text hover:border-surface transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !email.trim()}
                                        className={`flex-1 py-2 px-4 rounded-radius-lg font-semibold transition-all flex items-center justify-center gap-2 ${!loading && email.trim()
                                                ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02] shadow-shadow-soft"
                                                : "bg-surface text-muted cursor-not-allowed"
                                            }`}
                                    >
                                        <Send size={18} />
                                        {loading ? "Sending..." : "Send Invite"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
