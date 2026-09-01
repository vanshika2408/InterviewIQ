const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

/* =====================================================
   AUTH
===================================================== */

export const loginUser = (data) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerUser = (data) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getCurrentUser = () =>
  apiRequest("/users/me");

export const forgotPassword = (data) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resetPassword = (data) =>
  apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyEmail = (data) =>
  apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const refreshAccessToken = () =>
  apiRequest("/auth/refresh", {
    method: "POST",
  });

export const logoutUser = () =>
  apiRequest("/auth/logout", {
    method: "POST",
  });


/* =====================================================
   DASHBOARD
===================================================== */

export const getDashboard = () =>
  apiRequest("/dashboard");


/* =====================================================
   PROFILE / USER
===================================================== */

export const getProfile = () =>
  apiRequest("/users/me");

export const updateProfile = (data) =>
  apiRequest("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const changePassword = (data) =>
  apiRequest("/users/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const getUserSettings = () =>
  apiRequest("/users/settings");

export const updateUserSettings = (data) =>
  apiRequest("/users/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const sendTestEmail = () =>
  apiRequest("/users/settings/test-email", {
    method: "POST",
  });


/* =====================================================
   RESUME
===================================================== */

export const getResume = () =>
  apiRequest("/resumes");

export const uploadResume = (formData) =>
  apiRequest("/resumes", {
    method: "POST",
    body: formData,
  });

export const deleteResume = () =>
  apiRequest("/resumes", {
    method: "DELETE",
  });


/* =====================================================
   INTERVIEWS
===================================================== */

export const getInterviews = () =>
  apiRequest("/interviews");

export const createInterview = (data) =>
  apiRequest("/interviews", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getInterview = (id) =>
  apiRequest(`/interviews/${id}`);

export const startInterview = (id) =>
  apiRequest(`/interviews/${id}/start`, {
    method: "POST",
  });

export const submitAnswer = (id, data) =>
  apiRequest(`/interviews/${id}/answer`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const completeInterview = (id) =>
  apiRequest(`/interviews/${id}/complete`, {
    method: "POST",
  });

export const processVoiceAnswer = (id, formData) =>
  apiRequest(`/interviews/${id}/voice`, {
    method: "POST",
    body: formData,
  });


/* =====================================================
   FEEDBACK
===================================================== */

export const generateFeedback = (interviewId) =>
  apiRequest(`/feedback/${interviewId}`, {
    method: "POST",
  });

export const getFeedback = (interviewId) =>
  apiRequest(`/feedback/${interviewId}`);


/* =====================================================
   ANALYTICS
===================================================== */

export const getAnalytics = () =>
  apiRequest("/analytics");


/* =====================================================
   LEADERBOARD
===================================================== */

export const getLeaderboard = () =>
  apiRequest("/leaderboard");

export const getAchievements = () =>
  apiRequest("/leaderboard/achievements");

export const getDailyChallenge = () =>
  apiRequest("/leaderboard/daily");

export const completeDailyChallenge = (challengeId) =>
  apiRequest(`/leaderboard/daily/${challengeId}/complete`, {
    method: "POST",
  });


/* =====================================================
   CERTIFICATES
===================================================== */

export const getCertificates = () =>
  apiRequest("/certificates");

export const generateCertificate = (interviewId) =>
  apiRequest(`/certificates/interview/${interviewId}`, {
    method: "POST",
  });


/* =====================================================
   ADMIN
===================================================== */

export const getAdminUsers = () =>
  apiRequest("/admin/users");

export const getAdminReports = () =>
  apiRequest("/admin/reports");

export const getAdminAnalytics = () =>
  apiRequest("/admin/analytics");

export const getAdminAIUsage = () =>
  apiRequest("/admin/ai-usage");

export const getAdminPlans = () =>
  apiRequest("/admin/plans");

export const moderateUser = (userId, action) =>
  apiRequest(`/admin/users/${userId}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });


/* =====================================================
   DEFAULT
===================================================== */

export default apiRequest;