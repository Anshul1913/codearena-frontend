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
    // Implementation for joining a room
    console.log("Joined room with ID:", roomId);
  },
};
export default RoomApi;