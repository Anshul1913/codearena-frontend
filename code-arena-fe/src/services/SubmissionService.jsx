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
  }

};
export default SubmissionApi;
