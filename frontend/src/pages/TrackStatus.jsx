import { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { publicAPI } from "../components/services/api";
import { Search, FileText, MessageSquare } from "lucide-react";

const TrackStatus = () => {
  const [type, setType] = useState("application");
  const [id, setId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const data =
        type === "application"
          ? await publicAPI.getApplicationStatus(id)
          : await publicAPI.getGrievanceStatus(id);
      setStatus(data.status);
    } catch (err) {
      setError(err.message || "Not found");
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
            <h1 className="text-3xl font-bold text-gray-800">Track Status</h1>
            <p className="text-gray-600">
              Check the status of your applications or grievances
            </p>
          </div>

          <form
            onSubmit={handleTrack}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setType("application");
                  setStatus(null);
                  setError(null);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  type === "application"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                Application
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("grievance");
                  setStatus(null);
                  setError(null);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  type === "grievance"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Grievance
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {type === "application" ? "Application ID" : "Grievance ID"}
              </label>
              <input
                type="text"
                className="gov-input w-full"
                placeholder={`Enter ${type} ID`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="gov-button-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Search className="w-5 h-5" />
              {loading ? "Checking..." : "Track Status"}
            </button>

            {status && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Status:</p>
                <p className="text-2xl font-bold text-blue-900">{status}</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackStatus;
