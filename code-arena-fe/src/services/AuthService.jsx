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
   * 📧 Request Signup OTP
   * @param {string} email - User's email address
   * @returns {Promise<Object>} response.data
   */
  requestSignupOtp: async (email) => {
    try {
      const response = await apiInterceptor.post("/auth/signup/request-otp", null, {
        params: { email }
      });
      console.info("✅ Signup OTP requested successfully:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "request signup OTP");
    }
  },

  /**
   * ✅ Verify Signup OTP and Create Account
   * @param {Object} signupVerifyRequest - { email, otp, signupRequest: { email, password, name, role } }
   * @returns {Promise<Object>} response.data
   */
  verifySignupOtp: async (signupVerifyRequest) => {
    try {
      console.info("📤 Verifying signup OTP:", signupVerifyRequest);
      const response = await apiInterceptor.post("/auth/signup/verify", signupVerifyRequest);
      console.info("✅ Signup verification successful:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "verify signup OTP");
    }
  },

  /**
   * 🔑 Request Forgot Password OTP
   * @param {string} email - User's email address
   * @returns {Promise<Object>} response.data
   */
  requestForgotPasswordOtp: async (email) => {
    try {
      const response = await apiInterceptor.post("/auth/forgot-password/request-otp", null, {
        params: { email }
      });
      console.info("✅ Forgot password OTP requested successfully:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "request forgot password OTP");
    }
  },

  /**
   * 🔄 Reset Password with OTP
   * @param {Object} resetPasswordDTO - { email, otp, newPassword }
   * @returns {Promise<Object>} response.data
   */
  resetPassword: async (resetPasswordDTO) => {
    try {
      console.info("📤 Resetting password:", { email: resetPasswordDTO.email });
      const response = await apiInterceptor.post("/auth/forgot-password/verify", resetPasswordDTO);
      console.info("✅ Password reset successful:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "reset password");
    }
  },

  /**
   * 🔐 Change Password (for logged-in users)
   * @param {Object} changePasswordDTO - { oldPassword, newPassword }
   * @returns {Promise<Object>} response.data
   */
  changePassword: async (changePasswordDTO) => {
    try {
      const response = await apiInterceptor.post("/auth/change-password", changePasswordDTO);
      console.info("✅ Password changed successfully:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "change password");
    }
  },

  /**
   * 🚪 Logout
   * @returns {Promise<Object>} response.data
   */
  logout: async () => {
    try {
      const response = await apiInterceptor.post("/auth/logout");
      console.info("✅ Logout successful:", response.data);

      // Clear JWT token from cookies
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear any localStorage data
      localStorage.clear();

      return response.data;
    } catch (error) {
      // Even if API call fails, clear local data
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      handleApiError(error, "logout");
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
