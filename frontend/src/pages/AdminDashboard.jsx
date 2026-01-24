import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { adminAPI } from "../components/services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error } = useNotification();

  const [summary, setSummary] = useState(null);
  const [kioskUsage, setKioskUsage] = useState(null);
  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  // Dropdown options
  const departments = [
    "ELECTRICITY",
    "WATER",
    "GAS",
    "SANITATION",
    "MUNICIPAL",
  ];
  const serviceTypes = [
    "NEW_CONNECTION",
    "LOAD_CHANGE",
    "NAME_CHANGE",
    "CONNECTION_REMOVAL",
    "REFILL",
    "GRIEVANCE",
    "SCHEME_APPLICATION",
    "WATER_QUALITY_TEST",
    "BILL_PAYMENT",
  ];

  const [customDepartment, setCustomDepartment] = useState(false);
  const [customServiceType, setCustomServiceType] = useState(false);

  const [schemeForm, setSchemeForm] = useState({
    department: "ELECTRICITY",
    title: "",
    description: "",
    eligibility: "",
  });
  const [advisoryForm, setAdvisoryForm] = useState({
    department: "ELECTRICITY",
    message: "",
    validTill: "",
  });
  const [billForm, setBillForm] = useState({
    mobileNumber: "",
    department: "ELECTRICITY",
    consumerId: "",
    address: "",
    amount: "",
    dueDate: "",
  });
  const [serviceAccountForm, setServiceAccountForm] = useState({
    mobileNumber: "",
    department: "ELECTRICITY",
    consumerId: "",
    address: "",
  });
  const [testDataForm, setTestDataForm] = useState({
    mobileNumber: "",
    department: "ELECTRICITY",
    serviceType: "NEW_CONNECTION",
  });
  const [caseForm, setCaseForm] = useState({
    mobileNumber: "",
    department: "ELECTRICITY",
    serviceType: "NEW_CONNECTION",
    description: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [summaryData, kioskData, apps, griev] = await Promise.all([
          adminAPI.getSummary(),
          adminAPI.getKioskUsage(),
          adminAPI.listApplications(),
          adminAPI.listGrievances(),
        ]);
        setSummary(summaryData);
        setKioskUsage(kioskData);
        setApplications(apps.slice(0, 6));
        setGrievances(griev.slice(0, 6));
      } catch (err) {
        error(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, navigate, error]);

  const handleCreateScheme = async () => {
    try {
      const result = await adminAPI.createScheme(schemeForm);
      success(`Scheme created: ${result.title}`);
      setSchemeForm({
        department: schemeForm.department,
        title: "",
        description: "",
        eligibility: "",
      });
    } catch (err) {
      error(err.message || "Failed to create scheme");
    }
  };

  const handleCreateAdvisory = async () => {
    try {
      const result = await adminAPI.createAdvisory(advisoryForm);
      success(`Advisory created for ${result.department}`);
      setAdvisoryForm({
        department: advisoryForm.department,
        message: "",
        validTill: "",
      });
    } catch (err) {
      error(err.message || "Failed to create advisory");
    }
  };

  const handleCreateBill = async () => {
    try {
      const result = await adminAPI.createBill({
        ...billForm,
        amount: Number(billForm.amount),
      });
      success(`Bill created: ${result.id}`);
      setBillForm({
        mobileNumber: billForm.mobileNumber,
        department: billForm.department,
        consumerId: "",
        address: "",
        amount: "",
        dueDate: "",
      });
    } catch (err) {
      error(err.message || "Failed to create bill");
    }
  };

  const handleCreateTestBill = async () => {
    try {
      const result = await adminAPI.createTestBill({
        mobileNumber: billForm.mobileNumber,
        department: billForm.department,
        consumerId: billForm.consumerId,
        address: billForm.address,
        amount: billForm.amount ? Number(billForm.amount) : undefined,
        dueDate: billForm.dueDate || undefined,
      });
      success(`Test bill created: ${result.id}`);
    } catch (err) {
      error(err.message || "Failed to create test bill");
    }
  };

  const handleCreateServiceAccount = async () => {
    try {
      const result = await adminAPI.createServiceAccount(serviceAccountForm);
      success(`Service account created: ${result.id}`);
      setServiceAccountForm({
        mobileNumber: serviceAccountForm.mobileNumber,
        department: serviceAccountForm.department,
        consumerId: "",
        address: "",
      });
    } catch (err) {
      error(err.message || "Failed to create service account");
    }
  };

  const handleCreateTestData = async () => {
    try {
      const result = await adminAPI.createTestData(testDataForm);
      success(`Test data created for ${result.citizenId}`);
    } catch (err) {
      error(err.message || "Failed to create test data");
    }
  };

  const handleCreateApplication = async () => {
    try {
      const result = await adminAPI.createApplication({
        mobileNumber: caseForm.mobileNumber,
        department: caseForm.department,
        serviceType: caseForm.serviceType,
      });
      success(`Application created: ${result.id}`);
    } catch (err) {
      error(err.message || "Failed to create application");
    }
  };

  const handleCreateGrievance = async () => {
    try {
      const result = await adminAPI.createGrievance({
        mobileNumber: caseForm.mobileNumber,
        department: caseForm.department,
        description: caseForm.description,
      });
      success(`Grievance created: ${result.id}`);
    } catch (err) {
      error(err.message || "Failed to create grievance");
    }
  };

  const handleViewApplication = async (app) => {
    setSelectedApplication(app);
    setShowApplicationModal(true);
  };

  const handleViewGrievance = async (griev) => {
    setSelectedGrievance(griev);
    setShowGrievanceModal(true);
  };

  const handleUpdateApplicationStatus = async (status) => {
    if (!selectedApplication) return;
    try {
      await adminAPI.updateApplicationStatus(selectedApplication.id, status);
      success(`Application status updated to ${status}`);
      setShowApplicationModal(false);
      setSelectedApplication(null);
      // Reload applications
      const apps = await adminAPI.listApplications();
      setApplications(apps.slice(0, 6));
    } catch (err) {
      error(err.message || "Failed to update application status");
    }
  };

  const handleUpdateGrievanceStatus = async (status) => {
    if (!selectedGrievance) return;
    try {
      await adminAPI.updateGrievanceStatus(selectedGrievance.id, status);
      success(`Grievance status updated to ${status}`);
      setShowGrievanceModal(false);
      setSelectedGrievance(null);
      // Reload grievances
      const griev = await adminAPI.listGrievances();
      setGrievances(griev.slice(0, 6));
    } catch (err) {
      error(err.message || "Failed to update grievance status");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Signed in as {user?.fullName || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="gov-button-secondary"
              onClick={() => navigate("/admin/schemes")}
            >
              Manage Schemes
            </button>
            <button
              className="gov-button-secondary"
              onClick={() => navigate("/admin/advisories")}
            >
              Manage Advisories
            </button>
            <button
              className="gov-button-secondary"
              onClick={() => navigate("/admin/policies")}
            >
              Manage Policies
            </button>
            <button
              className="gov-button-secondary"
              onClick={() => navigate("/admin/tariffs")}
            >
              Manage Tariffs
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow">
            Loading dashboard...
          </div>
        ) : (
          <div className="space-y-10">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Today Summary</h2>
                <div className="space-y-2 text-gray-700">
                  <p>New citizens: {summary?.citizens ?? 0}</p>
                  <p>Payments: {summary?.payments ?? 0}</p>
                  <p>Applications: {summary?.applications ?? 0}</p>
                  <p>Grievances: {summary?.grievances ?? 0}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Kiosk Usage</h2>
                <p className="text-gray-700">
                  Active sessions today: {kioskUsage?.sessions ?? 0}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Applications
                </h2>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewApplication(app)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {app.department} • {app.serviceType}
                          </p>
                          <p className="text-sm text-gray-600">
                            Citizen: {app.citizen?.fullName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Mobile: {app.citizen?.mobileNumber || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            app.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : app.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : app.status === "UNDER_PROCESS"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!applications.length && (
                    <p className="text-gray-500">No applications yet.</p>
                  )}
                </div>
                {applications.length > 0 && (
                  <button
                    className="mt-4 text-primary hover:underline text-sm"
                    onClick={() => navigate("/admin/applications")}
                  >
                    View all applications →
                  </button>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Grievances
                </h2>
                <div className="space-y-3">
                  {grievances.map((grievance) => (
                    <div
                      key={grievance.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewGrievance(grievance)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {grievance.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            Citizen: {grievance.citizen?.fullName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {grievance.description || "No description"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            grievance.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : grievance.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : grievance.status === "UNDER_PROCESS"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {grievance.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!grievances.length && (
                    <p className="text-gray-500">No grievances yet.</p>
                  )}
                </div>
                {grievances.length > 0 && (
                  <button
                    className="mt-4 text-primary hover:underline text-sm"
                    onClick={() => navigate("/admin/grievances")}
                  >
                    View all grievances →
                  </button>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">Create Scheme</h2>
                <input
                  className="gov-input"
                  placeholder="Title"
                  value={schemeForm.title}
                  onChange={(e) =>
                    setSchemeForm({ ...schemeForm, title: e.target.value })
                  }
                />
                <div>
                  <select
                    className="gov-input"
                    value={schemeForm.department}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setCustomDepartment(true);
                        setSchemeForm({ ...schemeForm, department: "" });
                      } else {
                        setCustomDepartment(false);
                        setSchemeForm({
                          ...schemeForm,
                          department: e.target.value,
                        });
                      }
                    }}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom (Enter Manually)</option>
                  </select>
                  {customDepartment && (
                    <input
                      className="gov-input mt-2"
                      placeholder="Enter custom department"
                      value={schemeForm.department}
                      onChange={(e) =>
                        setSchemeForm({
                          ...schemeForm,
                          department: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
                <textarea
                  className="gov-input"
                  placeholder="Description"
                  value={schemeForm.description}
                  onChange={(e) =>
                    setSchemeForm({
                      ...schemeForm,
                      description: e.target.value,
                    })
                  }
                />
                <textarea
                  className="gov-input"
                  placeholder="Eligibility"
                  value={schemeForm.eligibility}
                  onChange={(e) =>
                    setSchemeForm({
                      ...schemeForm,
                      eligibility: e.target.value,
                    })
                  }
                />
                <button
                  className="gov-button-primary w-full"
                  onClick={handleCreateScheme}
                >
                  Create Scheme
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">Create Advisory</h2>
                <select
                  className="gov-input"
                  value={advisoryForm.department}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      department: e.target.value,
                    })
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <textarea
                  className="gov-input"
                  placeholder="Message"
                  value={advisoryForm.message}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      message: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="gov-input"
                  value={advisoryForm.validTill}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      validTill: e.target.value,
                    })
                  }
                />
                <button
                  className="gov-button-primary w-full"
                  onClick={handleCreateAdvisory}
                >
                  Create Advisory
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">
                  Create Bill for Citizen
                </h2>
                <input
                  className="gov-input"
                  placeholder="Mobile Number"
                  value={billForm.mobileNumber}
                  onChange={(e) =>
                    setBillForm({ ...billForm, mobileNumber: e.target.value })
                  }
                />
                <select
                  className="gov-input"
                  value={billForm.department}
                  onChange={(e) =>
                    setBillForm({ ...billForm, department: e.target.value })
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <input
                  className="gov-input"
                  placeholder="Consumer ID"
                  value={billForm.consumerId}
                  onChange={(e) =>
                    setBillForm({ ...billForm, consumerId: e.target.value })
                  }
                />
                <input
                  className="gov-input"
                  placeholder="Address"
                  value={billForm.address}
                  onChange={(e) =>
                    setBillForm({ ...billForm, address: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="gov-input"
                  placeholder="Amount"
                  value={billForm.amount}
                  onChange={(e) =>
                    setBillForm({ ...billForm, amount: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="gov-input"
                  value={billForm.dueDate}
                  onChange={(e) =>
                    setBillForm({ ...billForm, dueDate: e.target.value })
                  }
                />
                <button
                  className="gov-button-primary w-full"
                  onClick={handleCreateBill}
                >
                  Create Bill
                </button>
                <button
                  className="gov-button-secondary w-full"
                  onClick={handleCreateTestBill}
                >
                  Create Test Bill
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">Add Service Account</h2>
                <input
                  className="gov-input"
                  placeholder="Mobile Number"
                  value={serviceAccountForm.mobileNumber}
                  onChange={(e) =>
                    setServiceAccountForm({
                      ...serviceAccountForm,
                      mobileNumber: e.target.value,
                    })
                  }
                />
                <select
                  className="gov-input"
                  value={serviceAccountForm.department}
                  onChange={(e) =>
                    setServiceAccountForm({
                      ...serviceAccountForm,
                      department: e.target.value,
                    })
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <input
                  className="gov-input"
                  placeholder="Consumer ID"
                  value={serviceAccountForm.consumerId}
                  onChange={(e) =>
                    setServiceAccountForm({
                      ...serviceAccountForm,
                      consumerId: e.target.value,
                    })
                  }
                />
                <input
                  className="gov-input"
                  placeholder="Address"
                  value={serviceAccountForm.address}
                  onChange={(e) =>
                    setServiceAccountForm({
                      ...serviceAccountForm,
                      address: e.target.value,
                    })
                  }
                />
                <button
                  className="gov-button-primary w-full"
                  onClick={handleCreateServiceAccount}
                >
                  Create Service Account
                </button>
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-xl font-semibold">Create Test Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="gov-input"
                  placeholder="Mobile Number"
                  value={testDataForm.mobileNumber}
                  onChange={(e) =>
                    setTestDataForm({
                      ...testDataForm,
                      mobileNumber: e.target.value,
                    })
                  }
                />
                <select
                  className="gov-input"
                  value={testDataForm.department}
                  onChange={(e) =>
                    setTestDataForm({
                      ...testDataForm,
                      department: e.target.value,
                    })
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <select
                  className="gov-input"
                  value={testDataForm.serviceType}
                  onChange={(e) =>
                    setTestDataForm({
                      ...testDataForm,
                      serviceType: e.target.value,
                    })
                  }
                >
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="gov-button-primary"
                onClick={handleCreateTestData}
              >
                Generate Test Application & Grievance
              </button>
            </section>

            <section className="bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-xl font-semibold">
                Create Service Request / Complaint
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="gov-input"
                  placeholder="Mobile Number"
                  value={caseForm.mobileNumber}
                  onChange={(e) =>
                    setCaseForm({ ...caseForm, mobileNumber: e.target.value })
                  }
                />
                <div>
                  <select
                    className="gov-input"
                    value={caseForm.department}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setCustomServiceType(false); // Reset service type custom
                        setCaseForm({
                          ...caseForm,
                          department: "",
                          serviceType: "",
                        });
                      } else {
                        setCaseForm({
                          ...caseForm,
                          department: e.target.value,
                        });
                      }
                    }}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom (Enter Manually)</option>
                  </select>
                  {caseForm.department === "" && (
                    <input
                      className="gov-input mt-2"
                      placeholder="Enter custom department"
                      value={caseForm.department}
                      onChange={(e) =>
                        setCaseForm({ ...caseForm, department: e.target.value })
                      }
                    />
                  )}
                </div>
                <div>
                  <select
                    className="gov-input"
                    value={customServiceType ? "CUSTOM" : caseForm.serviceType}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setCustomServiceType(true);
                        setCaseForm({ ...caseForm, serviceType: "" });
                      } else {
                        setCustomServiceType(false);
                        setCaseForm({
                          ...caseForm,
                          serviceType: e.target.value,
                        });
                      }
                    }}
                  >
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom (Enter Manually)</option>
                  </select>
                  {customServiceType && (
                    <input
                      className="gov-input mt-2"
                      placeholder="Enter custom service type"
                      value={caseForm.serviceType}
                      onChange={(e) =>
                        setCaseForm({
                          ...caseForm,
                          serviceType: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
                <input
                  className="gov-input"
                  placeholder="Grievance Description"
                  value={caseForm.description}
                  onChange={(e) =>
                    setCaseForm({ ...caseForm, description: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  className="gov-button-primary"
                  onClick={handleCreateApplication}
                >
                  Create Application
                </button>
                <button
                  className="gov-button-secondary"
                  onClick={handleCreateGrievance}
                >
                  Create Grievance
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Application Modal */}
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-semibold">{selectedApplication.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">
                      {selectedApplication.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">
                      {selectedApplication.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-semibold">
                      {selectedApplication.serviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Citizen Name</p>
                    <p className="font-semibold">
                      {selectedApplication.citizen?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile Number</p>
                    <p className="font-semibold">
                      {selectedApplication.citizen?.mobileNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">
                      {selectedApplication.citizen?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted At</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedApplication.submittedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedApplication.documents &&
                  selectedApplication.documents.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Documents</p>
                      <ul className="space-y-1">
                        {selectedApplication.documents.map((doc) => (
                          <li key={doc.id}>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Document {doc.id.slice(0, 8)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">Update Status</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        handleUpdateApplicationStatus("UNDER_PROCESS")
                      }
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      Under Process
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateApplicationStatus("DEMAND_NOTE_ISSUED")
                      }
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                    >
                      Demand Note
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus("APPROVED")}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus("REJECTED")}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus("DELIVERED")}
                      className="px-3 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 text-sm"
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grievance Modal */}
        {showGrievanceModal && selectedGrievance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold">Grievance Details</h2>
                <button
                  onClick={() => setShowGrievanceModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Grievance ID</p>
                    <p className="font-semibold">{selectedGrievance.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{selectedGrievance.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">
                      {selectedGrievance.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Citizen Name</p>
                    <p className="font-semibold">
                      {selectedGrievance.citizen?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile Number</p>
                    <p className="font-semibold">
                      {selectedGrievance.citizen?.mobileNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedGrievance.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded">
                    {selectedGrievance.description || "No description provided"}
                  </p>
                </div>

                {selectedGrievance.documents &&
                  selectedGrievance.documents.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Documents</p>
                      <ul className="space-y-1">
                        {selectedGrievance.documents.map((doc) => (
                          <li key={doc.id}>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Document {doc.id.slice(0, 8)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">Update Status</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        handleUpdateGrievanceStatus("UNDER_PROCESS")
                      }
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      Under Process
                    </button>
                    <button
                      onClick={() => handleUpdateGrievanceStatus("APPROVED")}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateGrievanceStatus("REJECTED")}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateGrievanceStatus("DELIVERED")}
                      className="px-3 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 text-sm"
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateGrievanceStatus("COMPLETED")}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      Completed
                    </button>
                  </div>
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

export default AdminDashboard;
