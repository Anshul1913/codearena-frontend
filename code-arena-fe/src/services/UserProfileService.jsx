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
  }
};
export default UserProfileApi;