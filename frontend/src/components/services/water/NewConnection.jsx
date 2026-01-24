import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useNotification } from "../../../context/NotificationContext";
import { applicationsAPI } from "../../services/api";
import { Droplet } from "lucide-react";

const WaterNewConnection = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceType: "NEW_CONNECTION",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await applicationsAPI.create({
        department: "WATER",
        serviceType: form.serviceType,
      });
      success(`Application submitted: ${result.id}`);
      setTimeout(() => navigate("/my-applications"), 1500);
    } catch (err) {
      error(err.message || "Failed to submit application");
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
              <Droplet className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Water Connection
              </h1>
            </div>
            <p className="text-gray-600">Apply for new water connection</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type
              </label>
              <select
                className="gov-input w-full"
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value })
                }
              >
                <option value="NEW_CONNECTION">New Connection</option>
                <option value="CONNECTION_REMOVAL">Remove Connection</option>
              </select>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After submission, you'll need to upload
                required documents (ID proof, address proof, property documents)
                from the "My Applications" page.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="gov-button-secondary"
                onClick={() => navigate("/water")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gov-button-primary flex-1"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WaterNewConnection;
