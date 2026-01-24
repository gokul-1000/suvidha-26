import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNotification } from "../context/NotificationContext";
import { adminAPI } from "../components/services/api";
import { DollarSign, Plus, Edit2, Trash2, Filter } from "lucide-react";

const AdminTariffs = () => {
  const { success, error } = useNotification();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "ELECTRICITY",
    category: "",
    rate: "",
    unit: "",
    effectiveFrom: "",
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
    fetchTariffs();
  }, [selectedDepartment]);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getTariffs();
      const filtered =
        selectedDepartment === "ALL"
          ? data
          : data.filter((t) => t.department === selectedDepartment);
      setTariffs(Array.isArray(filtered) ? filtered : []);
    } catch (err) {
      error(err.message || "Failed to fetch tariffs");
      setTariffs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tariff = null) => {
    if (tariff) {
      setEditingTariff(tariff);
      setFormData({
        name: tariff.name || "",
        description: tariff.description || "",
        department: tariff.department || "ELECTRICITY",
        category: tariff.category || "",
        rate: tariff.rate || "",
        unit: tariff.unit || "",
        effectiveFrom: tariff.effectiveFrom
          ? new Date(tariff.effectiveFrom).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingTariff(null);
      setFormData({
        name: "",
        description: "",
        department: "ELECTRICITY",
        category: "",
        rate: "",
        unit: "",
        effectiveFrom: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTariff(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        rate: parseFloat(formData.rate),
      };

      if (editingTariff) {
        await adminAPI.updateTariff(editingTariff.id, payload);
        success("Tariff updated successfully");
      } else {
        await adminAPI.createTariff(payload);
        success("Tariff created successfully");
      }
      handleCloseModal();
      fetchTariffs();
    } catch (err) {
      error(err.message || "Failed to save tariff");
    }
  };

  const handleDelete = async (tariffId) => {
    if (!confirm("Are you sure you want to delete this tariff?")) return;

    try {
      await adminAPI.deleteTariff(tariffId);
      success("Tariff deleted successfully");
      fetchTariffs();
    } catch (err) {
      error(err.message || "Failed to delete tariff");
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
                Manage Tariffs
              </h1>
              <p className="text-gray-600">Create and manage service tariffs</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Tariff
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

        {/* Tariffs List */}
        {loading ? (
          <LoadingSpinner />
        ) : tariffs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No tariffs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tariffs.map((tariff, index) => (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {tariff.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(tariff.department)}`}
                    >
                      {tariff.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(tariff)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tariff.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ₹{tariff.rate}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {tariff.unit || "unit"}
                  </div>
                </div>

                {tariff.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {tariff.description}
                  </p>
                )}

                <div className="space-y-1 text-xs text-gray-500">
                  {tariff.category && <div>Category: {tariff.category}</div>}
                  {tariff.effectiveFrom && (
                    <div>
                      Effective:{" "}
                      {new Date(tariff.effectiveFrom).toLocaleDateString()}
                    </div>
                  )}
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
                {editingTariff ? "Edit Tariff" : "Add New Tariff"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
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
                      placeholder="e.g., Domestic, Commercial"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rate (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) =>
                        setFormData({ ...formData, rate: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="kWh, liter, etc."
                      required
                    />
                  </div>

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
                    {editingTariff ? "Update" : "Create"}
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

export default AdminTariffs;
