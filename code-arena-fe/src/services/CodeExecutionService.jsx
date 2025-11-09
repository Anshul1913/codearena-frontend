import apiInterceptor from "../config/ApiInterceptor";

const CodeExecutionApi = {
  executeCode: async (codeExecutionDTO) => {
    try {
        const response = await apiInterceptor.post("/execute", codeExecutionDTO);
        console.info("✅ Code executed:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error executing code:", error);
        throw error;
    }
  },
};

export default CodeExecutionApi;