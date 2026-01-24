import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useNotification } from "../../../context/NotificationContext";
import { waterQualityAPI } from "../../services/api";
import { TestTube } from "lucide-react";

const WaterQualityTest = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sampleAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sampleAddress.trim()) {
      error("Please provide sample collection address");
      return;
    }

    setLoading(true);
    try {
      const result = await waterQualityAPI.create(form.sampleAddress);
      success(
        `Water quality test requested successfully! Test ID: ${result.id}`,
      );
      setForm({ sampleAddress: "" });
      setTimeout(() => navigate("/water"), 1500);
    } catch (err) {
      error(err.message || "Failed to request test");
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
              <TestTube className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Water Quality Test
              </h1>
            </div>
            <p className="text-gray-600">
              Request water quality testing service
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sample Collection Address *
              </label>
              <textarea
                className="gov-input w-full"
                rows={4}
                placeholder="Enter complete address where water sample should be collected"
                value={form.sampleAddress}
                onChange={(e) =>
                  setForm({ ...form, sampleAddress: e.target.value })
                }
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">
                What to Expect:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sample collection within 2-3 working days</li>
                <li>• Test results available in 5-7 working days</li>
                <li>• Report downloadable from your applications</li>
                <li>• Free service for residential addresses</li>
              </ul>
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
                {loading ? "Submitting..." : "Request Test"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WaterQualityTest;
