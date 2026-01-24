import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNotification } from "../context/NotificationContext";
import { publicAPI } from "../components/services/api";
import { Shield, Filter, ExternalLink } from "lucide-react";

const Policies = () => {
  const { error } = useNotification();
  const [policies, setPolicies] = useState([]);
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
    fetchPolicies();
  }, [selectedDepartment]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await publicAPI.getPolicies(
        selectedDepartment === "ALL" ? null : selectedDepartment,
      );
      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      error(err.message || "Failed to fetch policies");
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      ELECTRICITY: "bg-yellow-100 text-yellow-800 border-yellow-300",
      WATER: "bg-blue-100 text-blue-800 border-blue-300",
      GAS: "bg-orange-100 text-orange-800 border-orange-300",
      SANITATION: "bg-green-100 text-green-800 border-green-300",
      MUNICIPAL: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[dept] || "bg-gray-100 text-gray-800 border-gray-300";
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
                Department Policies
              </h1>
              <p className="text-gray-600">
                View official policies and guidelines for all services
              </p>
            </div>
            <Shield className="w-12 h-12 text-blue-600" />
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

        {/* Policies List */}
        {loading ? (
          <LoadingSpinner />
        ) : policies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No policies found for the selected department.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all ${getDepartmentColor(policy.department)}`}
              >
                <div className="p-6 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {policy.title}
                    </h3>
                    <Shield
                      className={`w-6 h-6 flex-shrink-0 ml-2 ${policy.department === "ELECTRICITY" ? "text-yellow-600" : policy.department === "WATER" ? "text-blue-600" : policy.department === "GAS" ? "text-orange-600" : policy.department === "SANITATION" ? "text-green-600" : "text-purple-600"}`}
                    />
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getDepartmentColor(policy.department)}`}
                  >
                    {policy.department}
                  </span>

                  {policy.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {policy.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600">
                    {policy.effectiveFrom && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Effective from:</span>
                        <span>
                          {new Date(policy.effectiveFrom).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {policy.category && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Category:</span>
                        <span className="capitalize">{policy.category}</span>
                      </div>
                    )}
                  </div>

                  {policy.documentUrl && (
                    <a
                      href={policy.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Full Document
                    </a>
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

export default Policies;
