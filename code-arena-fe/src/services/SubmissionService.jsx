import apiInterceptor from "../config/ApiInterceptor";

const SubmissionApi = {

  submitAnswers: async (answers, roomCode, questionType) => {

    let submissionRequestDTO = {
      roomCode: roomCode,
      questionType: questionType
    };

    // MCQ Mode
    if (questionType === "MCQ") {

      submissionRequestDTO.mcqAnswers = Object.entries(answers).map(
        ([questionId, optionId]) => ({
          questionId,
          selectedOptionId: optionId
        })
      );
    }
    try {
      const response = await apiInterceptor.post("/submissions/submit", submissionRequestDTO);

      console.info("✅ Answers submitted:", response.data);
      return response.data;
    } catch (error) {

      console.error("❌ Error submiting:", error.data);
      throw error;
    }
  },
  submitCodingAnswers: async (codeExecutionDTO, roomCode) => {
    try {
      console.log("Payload to be send ", codeExecutionDTO);

      const response = await apiInterceptor.post(`/submissions/submit/coding/${roomCode}/${codeExecutionDTO.codingQuestionId}`, codeExecutionDTO);

      console.info("✅ Code executed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error executing code:", error);
      throw error;
    }
  },

  submitRoomAnswers: async (submissionRequestDTO) => {
    try {
      // Unified endpoint
      const response = await apiInterceptor.post("/submissions/submit", submissionRequestDTO);
      console.info("✅ Room Answers submitted:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error submiting room answers:", error);
      throw error;
    }
  }
}
export default SubmissionApi;
