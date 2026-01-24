import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
const resolveAuthToken = (config) => {
  const adminToken = localStorage.getItem("adminToken");
  const citizenToken = localStorage.getItem("citizenToken");
  const url = config.url || "";

  if (url.startsWith("/admin/auth")) {
    return null;
  }

  if (url.startsWith("/admin")) {
    return adminToken;
  }

  if (url.startsWith("/auth") || url.startsWith("/public")) {
    return null;
  }

  return citizenToken;
};

api.interceptors.request.use(
  (config) => {
    const token = resolveAuthToken(config);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      localStorage.removeItem("user");
      if (url.startsWith("/admin")) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("citizenToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  requestOTP: async (mobileNumber) => {
    try {
      const response = await api.post("/auth/request-otp", { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyOTP: async (mobileNumber, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        mobileNumber,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const citizenAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/citizen/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (payload) => {
    try {
      const response = await api.put("/citizen/profile", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getServiceAccounts: async () => {
    try {
      const response = await api.get("/citizen/service-accounts");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createServiceAccount: async (payload) => {
    try {
      const response = await api.post("/citizen/service-accounts", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const publicAPI = {
  getDepartments: async () => {
    try {
      const response = await api.get("/public/departments");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getServices: async (department) => {
    try {
      const response = await api.get("/public/services", {
        params: department ? { department } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getSchemes: async (department) => {
    try {
      const response = await api.get("/public/schemes", {
        params: department ? { department } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getSchemeById: async (schemeId) => {
    try {
      const response = await api.get(`/public/schemes/${schemeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getTariffs: async (department) => {
    try {
      const response = await api.get("/public/tariffs", {
        params: department ? { department } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getPolicies: async (department) => {
    try {
      const response = await api.get("/public/policies", {
        params: department ? { department } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getAdvisories: async (department) => {
    try {
      const response = await api.get("/public/advisories", {
        params: department ? { department } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getApplicationStatus: async (applicationId) => {
    try {
      const response = await api.get(
        `/public/status/application/${applicationId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getGrievanceStatus: async (grievanceId) => {
    try {
      const response = await api.get(`/public/status/grievance/${grievanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============================================
// APPLICATIONS APIs
// ============================================

export const applicationsAPI = {
  create: async (applicationData) => {
    try {
      const response = await api.post("/applications", applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  list: async () => {
    try {
      const response = await api.get("/applications");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadDocument: async (applicationId, fileOrUrl) => {
    try {
      if (fileOrUrl instanceof FormData) {
        const response = await api.post(
          `/applications/${applicationId}/documents`,
          fileOrUrl,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data;
      }

      const response = await api.post(
        `/applications/${applicationId}/documents`,
        {
          fileUrl: fileOrUrl,
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============================================
// BILLS APIs
// ============================================

export const billsAPI = {
  list: async () => {
    try {
      const response = await api.get("/bills");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getByUser: async () => {
    try {
      const response = await api.get("/bills");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============================================
// PAYMENTS APIs
// ============================================

export const paymentsAPI = {
  initiate: async (billId, amount) => {
    try {
      const response = await api.post("/payments/initiate", {
        billId,
        amount,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  confirm: async (paymentId, status, receiptNo) => {
    try {
      const response = await api.post("/payments/confirm", {
        paymentId,
        status,
        receiptNo,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get("/payments/history");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getReceipt: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/receipt`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============================================
// GRIEVANCES APIs
// ============================================

export const grievancesAPI = {
  create: async (grievanceData) => {
    try {
      const response = await api.post("/grievances", grievanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (grievanceId) => {
    try {
      const response = await api.get(`/grievances/${grievanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  list: async () => {
    try {
      const response = await api.get("/grievances");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadDocument: async (grievanceId, fileOrUrl) => {
    try {
      if (fileOrUrl instanceof FormData) {
        const response = await api.post(
          `/grievances/${grievanceId}/documents`,
          fileOrUrl,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data;
      }

      const response = await api.post(`/grievances/${grievanceId}/documents`, {
        fileUrl: fileOrUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ============================================
// SOLAR APIs
// ============================================

export const adminAuthAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post("/admin/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  logout: async () => {
    try {
      const response = await api.post("/admin/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const adminAPI = {
  getSummary: async () => {
    try {
      const response = await api.get("/admin/dashboard/summary");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getKioskUsage: async () => {
    try {
      const response = await api.get("/admin/dashboard/kiosk-usage");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  listApplications: async () => {
    try {
      const response = await api.get("/admin/applications");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getApplication: async (id) => {
    try {
      const response = await api.get(`/admin/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateApplicationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/applications/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  listGrievances: async () => {
    try {
      const response = await api.get("/admin/grievances");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateGrievanceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/grievances/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  listPayments: async () => {
    try {
      const response = await api.get("/admin/payments");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getPayment: async (id) => {
    try {
      const response = await api.get(`/admin/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createScheme: async (payload) => {
    try {
      const response = await api.post("/admin/schemes", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateScheme: async (id, payload) => {
    try {
      const response = await api.patch(`/admin/schemes/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  deleteScheme: async (id) => {
    try {
      const response = await api.delete(`/admin/schemes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createAdvisory: async (payload) => {
    try {
      const response = await api.post("/admin/advisories", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateAdvisory: async (id, payload) => {
    try {
      const response = await api.patch(`/admin/advisories/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  deleteAdvisory: async (id) => {
    try {
      const response = await api.delete(`/admin/advisories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Policies
  getPolicies: async () => {
    try {
      const response = await api.get("/admin/policies");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createPolicy: async (payload) => {
    try {
      const response = await api.post("/admin/policies", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updatePolicy: async (id, payload) => {
    try {
      const response = await api.patch(`/admin/policies/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  deletePolicy: async (id) => {
    try {
      const response = await api.delete(`/admin/policies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Tariffs
  getTariffs: async () => {
    try {
      const response = await api.get("/admin/tariffs");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createTariff: async (payload) => {
    try {
      const response = await api.post("/admin/tariffs", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateTariff: async (id, payload) => {
    try {
      const response = await api.patch(`/admin/tariffs/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  deleteTariff: async (id) => {
    try {
      const response = await api.delete(`/admin/tariffs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  listCitizens: async () => {
    try {
      const response = await api.get("/admin/citizens");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getCitizen: async (id) => {
    try {
      const response = await api.get(`/admin/citizens/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  listSessions: async () => {
    try {
      const response = await api.get("/admin/sessions/active");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  auditLogs: async () => {
    try {
      const response = await api.get("/admin/audit-logs");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  errorReports: async () => {
    try {
      const response = await api.get("/admin/error-reports");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createServiceAccount: async (payload) => {
    try {
      const response = await api.post("/admin/service-accounts", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createBill: async (payload) => {
    try {
      const response = await api.post("/admin/bills", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createTestBill: async (payload) => {
    try {
      const response = await api.post("/admin/bills/test", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createApplication: async (payload) => {
    try {
      const response = await api.post("/admin/applications", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createGrievance: async (payload) => {
    try {
      const response = await api.post("/admin/grievances", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createTestData: async (payload) => {
    try {
      const response = await api.post("/admin/test-data", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Water Quality Tests API (Special Routes)
export const waterQualityAPI = {
  create: async (sampleAddress) => {
    try {
      const response = await api.post("/special/water-quality-tests", {
        sampleAddress,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getTest: async (testId) => {
    try {
      const response = await api.get(`/special/water-quality-tests/${testId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getReport: async (testId) => {
    try {
      const response = await api.get(
        `/special/water-quality-tests/${testId}/report`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api;
