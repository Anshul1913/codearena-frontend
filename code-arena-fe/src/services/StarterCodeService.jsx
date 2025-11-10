import apiInterceptor from "../config/ApiInterceptor";

const StarterCodeApi = {
  getStarterCode: async (questionId) => {
    try {
        const response = await apiInterceptor.get(`/starter-code/question/${questionId}`);        
        console.info("✅ Fetched starter code:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching starter code:", error);
        throw error;
    }
}
};

export default StarterCodeApi;