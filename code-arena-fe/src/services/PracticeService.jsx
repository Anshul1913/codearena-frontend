import apiInterceptor from "../config/ApiInterceptor";

const PracticeApi = {
    /**
     * 🎯 Start Practice Session
     * @param {Object} matchRequest - { questionType, maxQuestions, timeLimitMinutes, topic?, difficultyPreference? }
     * @returns {Promise<Object>} StandardResponsePracticeSessionDTO
     */
    startPracticeSession: async (matchRequest) => {
        try {
            console.info("📤 Starting practice session:", matchRequest);
            const response = await apiInterceptor.post("/practice/start", matchRequest);
            console.info("✅ Practice session started:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "start practice session");
        }
    },

    /**
     * ➡️ Get Next Question in Session
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponsePracticeQuestionResponseDTO
     */
    getNextQuestion: async (sessionId) => {
        try {
            console.info("📤 Fetching next question for session:", sessionId);
            const response = await apiInterceptor.get(`/practice/session/${sessionId}/next`);
            console.info("✅ Next question fetched:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "get next question");
        }
    },

    /**
     * ✅ Submit Current Question Answer
     * @param {Object} submissionDTO - { sessionId, questionId, questionType, language?, sourceCode?, selectedOptionId?, timeTakenSeconds, ... }
     * @returns {Promise<Object>} StandardResponseSubmissionResultDTO
     */
    submitCurrentQuestion: async (submissionDTO) => {
        try {
            console.info("📤 Submitting answer:", submissionDTO);
            const response = await apiInterceptor.post("/practice/submit-current", submissionDTO);
            console.info("✅ Answer submitted:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "submit answer");
        }
    },

    /**
     * ⏭️ Skip Current Question
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponsePracticeQuestionResponseDTO
     */
    skipQuestion: async (sessionId) => {
        try {
            console.info("📤 Skipping question for session:", sessionId);
            const response = await apiInterceptor.post(`/practice/session/${sessionId}/skip`);
            console.info("✅ Question skipped:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "skip question");
        }
    },

    /**
     * 🏁 End Practice Session
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponsePracticeResultDTO
     */
    endPracticeSession: async (sessionId) => {
        try {
            console.info("📤 Ending practice session:", sessionId);
            const response = await apiInterceptor.post(`/practice/session/${sessionId}/end`);
            console.info("✅ Practice session ended:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "end practice session");
        }
    },

    /**
     * 🔄 Resume Practice Session
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponsePracticeSessionDTO
     */
    resumePracticeSession: async (sessionId) => {
        try {
            console.info("📤 Resuming practice session:", sessionId);
            const response = await apiInterceptor.get(`/practice/session/${sessionId}/resume`);
            console.info("✅ Practice session resumed:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "resume practice session");
        }
    },

    /**
     * 📋 Get Active Practice Sessions
     * @returns {Promise<Object>} StandardResponseListPracticeSessionDTO
     */
    getActiveSessions: async () => {
        try {
            console.info("📤 Fetching active practice sessions");
            const response = await apiInterceptor.get("/practice/sessions/active");
            console.info("✅ Active sessions fetched:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "get active sessions");
        }
    },

    /**
     * 📊 Get Practice History
     * @param {string} startDate - Optional start date (ISO format)
     * @param {string} endDate - Optional end date (ISO format)
     * @returns {Promise<Object>} StandardResponseListPracticeHistoryDTO
     */
    getPracticeHistory: async (startDate = null, endDate = null) => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            console.info("📤 Fetching practice history:", params);
            const response = await apiInterceptor.get("/practice/history", { params });
            console.info("✅ Practice history fetched:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "get practice history");
        }
    },

    /**
     * 📖 Get Session Details
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponsePracticeSessionDTO
     */
    getSessionDetails: async (sessionId) => {
        try {
            console.info("📤 Fetching session details:", sessionId);
            const response = await apiInterceptor.get(`/practice/session/${sessionId}`);
            console.info("✅ Session details fetched:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "get session details");
        }
    },

    /**
     * ⏱️ Extend Session Time
     * @param {string} sessionId - Practice session ID
     * @param {number} additionalMinutes - Additional minutes to add
     * @returns {Promise<Object>} StandardResponseVoid
     */
    extendSessionTime: async (sessionId, additionalMinutes) => {
        try {
            console.info("📤 Extending session time:", { sessionId, additionalMinutes });
            const response = await apiInterceptor.post(`/practice/session/${sessionId}/extend`, null, {
                params: { additionalMinutes }
            });
            console.info("✅ Session time extended:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "extend session time");
        }
    },

    /**
     * 🚫 Abandon Session
     * @param {string} sessionId - Practice session ID
     * @returns {Promise<Object>} StandardResponseVoid
     */
    abandonSession: async (sessionId) => {
        try {
            console.info("📤 Abandoning session:", sessionId);
            const response = await apiInterceptor.post(`/practice/session/${sessionId}/abandon`);
            console.info("✅ Session abandoned:", response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, "abandon session");
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

export default PracticeApi;
