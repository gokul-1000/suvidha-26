import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { publicAPI, adminAPI } from "../components/services/api";

const DEPARTMENTS = ["ELECTRICITY", "WATER", "GAS", "SANITATION", "MUNICIPAL"];

const AdminSchemes = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error } = useNotification();

  const [department, setDepartment] = useState("WATER");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editScheme, setEditScheme] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    eligibility: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
  }, [isAdmin, navigate]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await publicAPI.getSchemes(department);
      setSchemes(Array.isArray(data) ? data : data?.schemes || []);
    } catch (err) {
      error(err.message || "Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const openEdit = (scheme) => {
    setEditScheme(scheme);
    setEditForm({
      title: scheme.title || "",
      description: scheme.description || "",
      eligibility: scheme.eligibility || "",
    });
  };

  const saveEdit = async () => {
    if (!editScheme) return;
    try {
      const updated = await adminAPI.updateScheme(editScheme.id, editForm);
      success(`Scheme updated: ${updated.title}`);
      setEditScheme(null);
      await loadSchemes();
    } catch (err) {
      error(err.message || "Failed to update scheme");
    }
  };

  const deleteScheme = async (scheme) => {
    if (!window.confirm(`Delete scheme: ${scheme.title}?`)) return;
    try {
      await adminAPI.deleteScheme(scheme.id);
      success("Scheme deleted");
      await loadSchemes();
    } catch (err) {
      error(err.message || "Failed to delete scheme");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Schemes</h1>
            <p className="text-gray-600">View and update public schemes</p>
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
            <p>Loading schemes...</p>
          ) : schemes.length ? (
            <div className="space-y-3">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {scheme.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {scheme.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Eligibility: {scheme.eligibility}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="gov-button-secondary"
                      onClick={() => openEdit(scheme)}
                    >
                      Edit
                    </button>
                    <button
                      className="gov-button-danger"
                      onClick={() => deleteScheme(scheme)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No schemes found for {department}.</p>
          )}
        </div>

        {editScheme && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Scheme</h2>
                <button
                  onClick={() => setEditScheme(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-3">
                <input
                  className="gov-input w-full"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <textarea
                  className="gov-input w-full"
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
                <textarea
                  className="gov-input w-full"
                  placeholder="Eligibility"
                  value={editForm.eligibility}
                  onChange={(e) =>
                    setEditForm({ ...editForm, eligibility: e.target.value })
                  }
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="gov-button-secondary"
                    onClick={() => setEditScheme(null)}
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

export default AdminSchemes;
