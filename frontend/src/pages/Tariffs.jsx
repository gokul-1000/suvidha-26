import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNotification } from "../context/NotificationContext";
import { publicAPI } from "../components/services/api";
import { FileText, Filter } from "lucide-react";

const Tariffs = () => {
  const { error } = useNotification();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");

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
      const data = await publicAPI.getTariffs(
        selectedDepartment === "ALL" ? null : selectedDepartment,
      );
      setTariffs(Array.isArray(data) ? data : []);
    } catch (err) {
      error(err.message || "Failed to fetch tariffs");
      setTariffs([]);
    } finally {
      setLoading(false);
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

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Service Tariffs
              </h1>
              <p className="text-gray-600">
                View current tariff rates for all departments
              </p>
            </div>
            <FileText className="w-12 h-12 text-blue-600" />
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
            <span className="font-semibold text-gray-700">
              Filter by Department:
            </span>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No tariffs found for the selected department.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {tariffs.map((tariff, index) => (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {tariff.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDepartmentColor(tariff.department)}`}
                      >
                        {tariff.department}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{tariff.rate}
                      </div>
                      <div className="text-sm text-gray-500">
                        per {tariff.unit || "unit"}
                      </div>
                    </div>
                  </div>

                  {tariff.description && (
                    <p className="text-gray-600 mb-4">{tariff.description}</p>
                  )}

                  {tariff.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-semibold">Category:</span>
                      <span>{tariff.category}</span>
                    </div>
                  )}

                  {tariff.effectiveFrom && (
                    <div className="mt-2 text-sm text-gray-500">
                      Effective from:{" "}
                      {new Date(tariff.effectiveFrom).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tariffs;
