import apiInterceptor from "../config/ApiInterceptor";

const RoomInvitationApi = {
    /**
     * 📧 Send Single Room Invitation
     * @param {Object} invitationDTO - { recipientEmail, roomCode, customMessage?, inviterName? }
     * @returns {Promise<Object>} response.data
     */
    sendSingleInvitation: async (invitationDTO) => {
        try {
            console.info("📤 Sending room invitation:", invitationDTO);
            const response = await apiInterceptor.post("/room-invitations/send", invitationDTO);
            console.info("✅ Room invitation sent successfully:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "send room invitation");
        }
    },

    /**
     * 📧 Send Bulk Room Invitations
     * @param {number} roomCode - Room code
     * @param {string} emails - Comma-separated email addresses
     * @param {string} inviterName - Name of the person inviting (optional)
     * @returns {Promise<Object>} response.data
     */
    sendBulkInvitations: async (roomCode, emails, inviterName = null) => {
        try {
            const params = { roomCode, emails };
            if (inviterName) params.inviterName = inviterName;

            console.info("📤 Sending bulk invitations:", params);
            const response = await apiInterceptor.post("/room-invitations/send-bulk", null, { params });
            console.info("✅ Bulk invitations sent successfully:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "send bulk invitations");
        }
    },

    /**
     * 👥 Send Invitation to All Friends
     * @param {number} roomCode - Room code
     * @returns {Promise<Object>} response.data
     */
    sendInvitationToFriends: async (roomCode) => {
        try {
            console.info("📤 Sending invitations to friends for room:", roomCode);
            const response = await apiInterceptor.post(`/room-invitations/send-to-friends/${roomCode}`);
            console.info("✅ Invitations sent to friends successfully:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "send invitations to friends");
        }
    },
};

/**
 * ⚙️ Centralized API error handler
 */
function handleApiError(error, apiName) {
    if (error.response) {
        console.error(`❌ ${apiName.toUpperCase()} API Error:`, error.response.data);
        throw error.response.data;
    } else if (error.request) {
        console.error(`⚠️ ${apiName.toUpperCase()} API Request not sent:`, error.request);
        throw new Error("Server not responding. Please try again later.");
    } else {
        console.error(`🚨 ${apiName.toUpperCase()} API Unexpected error:`, error.message);
        throw new Error("Unexpected error occurred. Please try again.");
    }
}

export default RoomInvitationApi;
