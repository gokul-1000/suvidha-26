import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNotification } from "../context/NotificationContext";
import { adminAPI } from "../components/services/api";
import { Shield, Plus, Edit2, Trash2, Filter } from "lucide-react";

const AdminPolicies = () => {
  const { success, error } = useNotification();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "ELECTRICITY",
    category: "",
    effectiveFrom: "",
    documentUrl: "",
  });

  const departments = [
    "ALL",
    "ELECTRICITY",
    "WATER",
    "GAS",
    "SANITATION",
    "MUNICIPAL",
  ];

  useEffect(() => {
    fetchPolicies();
  }, [selectedDepartment]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPolicies();
      const filtered =
        selectedDepartment === "ALL"
          ? data
          : data.filter((p) => p.department === selectedDepartment);
      setPolicies(Array.isArray(filtered) ? filtered : []);
    } catch (err) {
      error(err.message || "Failed to fetch policies");
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData({
        title: policy.title || "",
        description: policy.description || "",
        department: policy.department || "ELECTRICITY",
        category: policy.category || "",
        effectiveFrom: policy.effectiveFrom
          ? new Date(policy.effectiveFrom).toISOString().split("T")[0]
          : "",
        documentUrl: policy.documentUrl || "",
      });
    } else {
      setEditingPolicy(null);
      setFormData({
        title: "",
        description: "",
        department: "ELECTRICITY",
        category: "",
        effectiveFrom: "",
        documentUrl: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPolicy(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPolicy) {
        await adminAPI.updatePolicy(editingPolicy.id, formData);
        success("Policy updated successfully");
      } else {
        await adminAPI.createPolicy(formData);
        success("Policy created successfully");
      }
      handleCloseModal();
      fetchPolicies();
    } catch (err) {
      error(err.message || "Failed to save policy");
    }
  };

  const handleDelete = async (policyId) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    try {
      await adminAPI.deletePolicy(policyId);
      success("Policy deleted successfully");
      fetchPolicies();
    } catch (err) {
      error(err.message || "Failed to delete policy");
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      ELECTRICITY: "bg-yellow-100 text-yellow-800",
      WATER: "bg-blue-100 text-blue-800",
      GAS: "bg-orange-100 text-orange-800",
      SANITATION: "bg-green-100 text-green-800",
      MUNICIPAL: "bg-purple-100 text-purple-800",
    };
    return colors[dept] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Manage Policies
              </h1>
              <p className="text-gray-600">
                Create and manage department policies
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Policy
            </button>
          </div>
        </motion.div>

        {/* Department Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedDepartment === dept
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Policies List */}
        {loading ? (
          <LoadingSpinner />
        ) : policies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No policies found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {policy.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(policy.department)}`}
                      >
                        {policy.department}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{policy.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {policy.category && (
                        <span>Category: {policy.category}</span>
                      )}
                      {policy.effectiveFrom && (
                        <span>
                          Effective:{" "}
                          {new Date(policy.effectiveFrom).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(policy)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingPolicy ? "Edit Policy" : "Add New Policy"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="ELECTRICITY">ELECTRICITY</option>
                      <option value="WATER">WATER</option>
                      <option value="GAS">GAS</option>
                      <option value="SANITATION">SANITATION</option>
                      <option value="MUNICIPAL">MUNICIPAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Effective From
                    </label>
                    <input
                      type="date"
                      value={formData.effectiveFrom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          effectiveFrom: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Document URL
                    </label>
                    <input
                      type="url"
                      value={formData.documentUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documentUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPolicy ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPolicies;
