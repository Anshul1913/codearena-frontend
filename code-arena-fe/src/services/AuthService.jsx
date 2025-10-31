import apiInterceptor from "../config/ApiInterceptor";

const AuthApi = {
  /**
   * 🔐 Login API
   * @param {Object} loginDTO - { username: string, password: string }
   * @returns {Promise<Object>} response.data
   */
  login: async (loginDTO) => {
    try {
      const response = await apiInterceptor.post("/auth/login", loginDTO);
      console.info("✅ Login successful:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "login");
    }
  },

  /**
   * 🧑‍💻 Signup API
   * @param {Object} signupDTO - { name, email, password, phone }
   * @returns {Promise<Object>} response.data
   */
  signupPlayer: async (signupData) => {
    try {
        const signupDTO = {
            role: "PLAYER",
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
            phone: signupData.phone,
        };
      console.info("📤 Sending signup data:", signupDTO);
      const response = await apiInterceptor.post("/auth/signup", signupDTO);
      console.info("✅ Signup successful:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "signup");
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

export default AuthApi;
