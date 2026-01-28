import apiInterceptor from "../config/ApiInterceptor";

const CodeExecutionApi = {
  executeCode: async (codeExecutionDTO) => {
    try {
      console.log("Payload to be send ", codeExecutionDTO);

      const response = await apiInterceptor.post("/run", codeExecutionDTO);

      console.info("✅ Code executed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error executing code:", error);
      throw error;
    }
  },
  submitCode: async (codeExecutionDTO, roomCode) => {
    try {
      console.log("Payload to be send ", codeExecutionDTO);

      const response = await apiInterceptor.post(`/submit/${roomCode}`, codeExecutionDTO);

      console.info("✅ Code executed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error executing code:", error);
      throw error;
    }
  },
};

export default CodeExecutionApi;