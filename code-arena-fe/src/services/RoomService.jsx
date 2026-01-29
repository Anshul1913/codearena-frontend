import apiInterceptor from "../config/ApiInterceptor";

const RoomApi = {
  createRoom: async (roomData) => {
    // Implementation for creating a room
    console.log("Room created with data:", roomData);
    try {
      const response = await apiInterceptor.post("/rooms/create", roomData);
      console.info("✅ Room created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating room:", error);
      throw error;
    }
  },
  joinRoom: async (roomId) => {
    console.log("Joining room with ID:", roomId);
    try {
      const response = await apiInterceptor.post(`/rooms/join`, {},
        { params: { roomCode: roomId } });
      console.info("✅ Joined room successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error joining room:", error);
      throw error;
    }
  },
  getChatsFromRoom: async (roomId) => {
    try {

      const response = await apiInterceptor.get(`/chat/history/${roomId}`);
      console.log(response);

      console.info("✅ Fetched chats successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching chats:", error);
      throw error;
    }
  },
  getRoomDetails: async (roomCode) => {
    try {
      const response = await apiInterceptor.get(`/rooms/${roomCode}`);
      console.info("✅ Fetched room details successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching room details:", error);
      throw error;
    }
  },
  startRoom: async (roomCode) => {
    try {
      const response = await apiInterceptor.post(`/rooms/start?roomCode=${roomCode}`);
      console.info("✅ Fetched Questions details successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching room details:", error);
      throw error;
    }
  },
  roomQuestions: async (roomId) => {
    try {
      const response = await apiInterceptor.get(`/rooms/${roomId}/questions`);
      console.info("✅ Fetched Questions details successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching room details:", error);
      throw error;
    }
  },
  setRoomQuestions: async (roomId) => {
    try {
      const response = await apiInterceptor.post(`/rooms/${roomId}/assign-questions`);
      console.info("✅ Set Questions successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error setting room questions:", error);
      throw error;
    }
  },
  fetchRoomQuestionWithTestCases: async (roomCode) => {
    try {
      const response = await apiInterceptor.get(`/rooms/${roomCode}/coding-questions`);
      console.info("✅ Fetched room question with test cases successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching room question with test cases:", error);
      throw error;
    }
  },
  fetchRoomQuestionStatus: async (roomCode) => {
    try {
      const response = await apiInterceptor.get(`/rooms/${roomCode}/question-status`);
      console.info("✅ Fetched room question status successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching room question status:", error);
      throw error;
    }
  },
  endTestSession: async (roomCode) => {
    try {
      const response = await apiInterceptor.post(`/rooms/end-test/${roomCode}`);
      console.info("✅ Ended test session successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error ending test session:", error);
      throw error;
    }
  },
};
export default RoomApi;