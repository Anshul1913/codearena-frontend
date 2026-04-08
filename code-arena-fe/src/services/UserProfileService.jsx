import apiInterceptor from "../config/ApiInterceptor";

const UserProfileApi = {
  getUserProfile: async () => {
    try {
      const response = await apiInterceptor.get("/users/profile");
      console.info("✅ User profile fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      throw error;
    }
  },

  // ✅ New method for Leaderboard
  getLeaderboard: async () => {
    try {
      const response = await apiInterceptor.get("/users/leaderboard");
      console.info("✅ Leaderboard fetched:", response.data);
      return response.data; // This will return the StandardResponse containing the top 10 players
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
      throw error;
    }
  }
};

export default UserProfileApi;