import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useNotification } from "../context/NotificationContext";
import { grievancesAPI } from "../components/services/api";
import { MessageSquare } from "lucide-react";

const DEPARTMENTS = ["ELECTRICITY", "WATER", "GAS", "SANITATION", "MUNICIPAL"];

const Grievances = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    department: "ELECTRICITY",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) {
      error("Please provide a description");
      return;
    }

    setLoading(true);
    try {
      const result = await grievancesAPI.create(form);
      success(`Grievance submitted: ${result.id}`);
      setForm({ department: "ELECTRICITY", description: "" });
      setTimeout(() => navigate("/my-applications"), 1500);
    } catch (err) {
      error(err.message || "Failed to submit grievance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-800">
                Submit Grievance
              </h1>
            </div>
            <p className="text-gray-600">
              Report issues or complaints related to civic services
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <select
                className="gov-input w-full"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="gov-input w-full"
                rows={6}
                placeholder="Describe your grievance in detail..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="gov-button-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gov-button-primary flex-1"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Grievance"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Grievances;
