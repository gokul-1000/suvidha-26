import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { publicAPI, adminAPI } from "../components/services/api";

const DEPARTMENTS = ["ELECTRICITY", "WATER", "GAS", "SANITATION", "MUNICIPAL"];

const AdminAdvisories = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error } = useNotification();

  const [department, setDepartment] = useState("WATER");
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editAdvisory, setEditAdvisory] = useState(null);
  const [editForm, setEditForm] = useState({ message: "", validTill: "" });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
  }, [isAdmin, navigate]);

  const loadAdvisories = async () => {
    setLoading(true);
    try {
      const data = await publicAPI.getAdvisories(department);
      setAdvisories(Array.isArray(data) ? data : data?.advisories || []);
    } catch (err) {
      error(err.message || "Failed to load advisories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const openEdit = (advisory) => {
    setEditAdvisory(advisory);
    setEditForm({
      message: advisory.message || "",
      validTill: advisory.validTill
        ? new Date(advisory.validTill).toISOString().split("T")[0]
        : "",
    });
  };

  const saveEdit = async () => {
    if (!editAdvisory) return;
    try {
      await adminAPI.updateAdvisory(editAdvisory.id, editForm);
      success("Advisory updated");
      setEditAdvisory(null);
      await loadAdvisories();
    } catch (err) {
      error(err.message || "Failed to update advisory");
    }
  };

  const deleteAdvisory = async (advisory) => {
    if (
      !window.confirm(
        `Delete advisory: ${advisory.message.substring(0, 50)}...?`,
      )
    )
      return;
    try {
      await adminAPI.deleteAdvisory(advisory.id);
      success("Advisory deleted");
      await loadAdvisories();
    } catch (err) {
      error(err.message || "Failed to delete advisory");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Advisories
            </h1>
            <p className="text-gray-600">View and update public advisories</p>
          </div>
          <button
            className="gov-button-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <select
            className="gov-input w-full max-w-sm"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          {loading ? (
            <p>Loading advisories...</p>
          ) : advisories.length ? (
            <div className="space-y-3">
              {advisories.map((advisory) => (
                <div
                  key={advisory.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div>
                    <p className="text-gray-800">{advisory.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Valid till:{" "}
                      {new Date(advisory.validTill).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="gov-button-secondary"
                      onClick={() => openEdit(advisory)}
                    >
                      Edit
                    </button>
                    <button
                      className="gov-button-danger"
                      onClick={() => deleteAdvisory(advisory)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No advisories found for {department}.
            </p>
          )}
        </div>

        {editAdvisory && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Advisory</h2>
                <button
                  onClick={() => setEditAdvisory(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-3">
                <textarea
                  className="gov-input w-full"
                  placeholder="Message"
                  rows={4}
                  value={editForm.message}
                  onChange={(e) =>
                    setEditForm({ ...editForm, message: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="gov-input w-full"
                  value={editForm.validTill}
                  onChange={(e) =>
                    setEditForm({ ...editForm, validTill: e.target.value })
                  }
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="gov-button-secondary"
                    onClick={() => setEditAdvisory(null)}
                  >
                    Cancel
                  </button>
                  <button className="gov-button-primary" onClick={saveEdit}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminAdvisories;
