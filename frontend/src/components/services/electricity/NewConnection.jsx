import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../../common/ProgressBar";
import DocumentUpload from "../../common/DocumentUpload";
import { generateApplicationNumber } from "../../../utils/generateApplicationNumber";
import { useNotification } from "../../../hooks/useNotification";
import statesData from "../../../data/states-and-districts.json";

const steps = [
  "Applicant Details",
  "Address & Property",
  "Connection Details",
  "Document Upload",
  "Review & Submit",
];

const initialForm = {
  name: "",
  phone: "9876543210", // Pre-filled mock
  aadhaar: "",
  state: "",
  district: "",
  address: "",
  propertyType: "",
  load: "",
  phase: "",
  purpose: "",
  documents: {},
};

const NewConnection = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationNo, setApplicationNo] = useState(null);

  const notify = useNotification();

  /* ------------------ LOAD DRAFT ------------------ */
  useEffect(() => {
    const draft = localStorage.getItem("electricity_new_connection_draft");
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setFormData(parsedDraft);
      // Pre-populate districts if state exists in draft
      if (parsedDraft.state) {
        const found = statesData.states.find((s) => s.state === parsedDraft.state);
        if (found) setDistricts(found.districts);
      }
    }
  }, []);

  /* ------------------ SAVE DRAFT ------------------ */
  const saveDraft = () => {
    localStorage.setItem("electricity_new_connection_draft", JSON.stringify(formData));
    notify.success("Draft saved successfully");
  };

  /* ------------------ STATE/DISTRICT LOGIC ------------------ */
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const foundState = statesData.states.find((s) => s.state === selectedState);
    setFormData({ ...formData, state: selectedState, district: "" });
    setDistricts(foundState ? foundState.districts : []);
  };

  /* ------------------ VALIDATION ------------------ */
  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.name) newErrors.name = "Full name is required";
      if (!formData.aadhaar || formData.aadhaar.length !== 12)
        newErrors.aadhaar = "Valid 12-digit Aadhaar required";
    }
    if (step === 1) {
      if (!formData.state) newErrors.state = "Please select a state";
      if (!formData.district) newErrors.district = "Please select a district";
      if (!formData.address) newErrors.address = "Address is required";
    }
    if (step === 2) {
      if (!formData.load) newErrors.load = "Load (kW) is required";
      if (!formData.phase) newErrors.phase = "Select phase type";
      if (!formData.purpose) newErrors.purpose = "Purpose is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------ NAVIGATION ------------------ */
  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = () => {
    const appNo = generateApplicationNumber("ELEC");
    setApplicationNo(appNo);
    localStorage.removeItem("electricity_new_connection_draft");
    notify.success("Application submitted successfully");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] py-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-extrabold text-[#0A3D62] font-poppins tracking-tight">
            New Electricity Connection
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Requisition portal for Residential & Commercial Meters
          </p>
        </div>

        {/* PROGRESS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <ProgressBar steps={steps} currentStep={step} />
        </div>

        {/* FORM CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[400px]"
          >
            {/* STEP 1: APPLICANT DETAILS */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0A3D62] border-b pb-4">Applicant Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name (As per Aadhaar)</label>
                    <input name="name" className="gov-input" onChange={handleChange} value={formData.name} placeholder="e.g. Rajesh Kumar" />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <input disabled className="gov-input bg-gray-50 text-gray-500" value={formData.phone} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number</label>
                    <input name="aadhaar" className="gov-input" onChange={handleChange} value={formData.aadhaar} placeholder="12 Digit UID" />
                    {errors.aadhaar && <p className="text-red-500 text-xs mt-1 font-medium">{errors.aadhaar}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS & PROPERTY */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0A3D62] border-b pb-4">Address & Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <select className="gov-input" value={formData.state} onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {statesData.states.map((s) => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                    <select 
                      className="gov-input" 
                      value={formData.district} 
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      disabled={!formData.state}
                    >
                      <option value="">{formData.state ? "Select District" : "Choose State First"}</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                    <textarea name="address" rows="3" className="gov-input" onChange={handleChange} value={formData.address} placeholder="House/Flat No, Landmark, Street..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                    <select name="propertyType" className="gov-input" onChange={handleChange} value={formData.propertyType}>
                      <option value="">Select Type</option>
                      <option>Independent House</option>
                      <option>Apartment/Flat</option>
                      <option>Commercial Shop</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TECHNICAL */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0A3D62] border-b pb-4">Connection Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Load (kW)</label>
                    <input name="load" type="number" className="gov-input" onChange={handleChange} value={formData.load} />
                    {errors.load && <p className="text-red-500 text-xs mt-1">{errors.load}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phase</label>
                    <select name="phase" className="gov-input" onChange={handleChange} value={formData.phase}>
                      <option value="">Select</option>
                      <option>Single Phase</option>
                      <option>Three Phase</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
                    <select name="purpose" className="gov-input" onChange={handleChange} value={formData.purpose}>
                      <option value="">Select</option>
                      <option>Domestic</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DOCUMENT UPLOAD */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0A3D62] border-b pb-4">Upload Documents</h2>
                <p className="text-gray-500 text-sm">Upload Proof of Identity and Proof of Ownership (Max 5MB)</p>
                <DocumentUpload onChange={(docs) => setFormData({ ...formData, documents: docs })} />
              </div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 4 && !applicationNo && (
              <div className="space-y-6 text-left">
                <h2 className="text-2xl font-bold text-[#0A3D62] border-b pb-4">Final Review</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div><span className="text-gray-500 block text-xs uppercase">Full Name</span><p className="font-semibold">{formData.name}</p></div>
                  <div><span className="text-gray-500 block text-xs uppercase">Aadhaar</span><p className="font-semibold">{formData.aadhaar}</p></div>
                  <div><span className="text-gray-500 block text-xs uppercase">State/District</span><p className="font-semibold">{formData.state}, {formData.district}</p></div>
                  <div><span className="text-gray-500 block text-xs uppercase">Connection</span><p className="font-semibold">{formData.load} kW / {formData.phase}</p></div>
                  <div className="md:col-span-2"><span className="text-gray-500 block text-xs uppercase">Address</span><p className="font-semibold">{formData.address}</p></div>
                </div>
                <label className="flex items-start gap-3 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4" />
                  <span className="text-sm text-gray-700">I solemnly declare that the information provided is accurate. Any discrepancy may lead to immediate rejection of the connection.</span>
                </label>
              </div>
            )}

            {/* SUBMISSION SUCCESS */}
            {applicationNo && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Application Submitted</h2>
                <p className="text-gray-500 mt-2">Download your receipt or track status using the number below.</p>
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 inline-block">
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Application Number</p>
                  <p className="font-mono text-3xl font-bold text-[#0A3D62] mt-1">{applicationNo}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* FOOTER BUTTONS */}
        {!applicationNo && (
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStep} 
              disabled={step === 0}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${step === 0 ? 'invisible' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
            >
              Back
            </button>
            <div className="flex gap-4">
              <button onClick={saveDraft} className="text-gray-500 font-semibold px-4 hover:text-[#0A3D62] transition-colors">
                Save Draft
              </button>
              {step < 4 ? (
                <button onClick={nextStep} className="gov-button-primary">
                  Next Step
                </button>
              ) : (
                <button onClick={handleSubmit} className="gov-button-secondary">
                  Submit Application
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewConnection;