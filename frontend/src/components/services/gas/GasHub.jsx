import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useLanguage } from "../../../context/LanguageContext";
import { useNotification } from "../../../context/NotificationContext";
import { usePublicData } from "../../../hooks/usePublicData";
import { publicAPI } from "../../services/api";
import { Plus, RefreshCw, CreditCard, Flame, Network } from "lucide-react";

const GasHub = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { success, error } = useNotification();
  const { schemes, advisories, loading } = usePublicData("GAS");
  const topSchemes = useMemo(() => schemes.slice(0, 3), [schemes]);
  const latestAdvisories = useMemo(() => advisories.slice(0, 3), [advisories]);

  const handleApplyScheme = async (schemeId) => {
    try {
      const result = await publicAPI.getSchemeById(schemeId);
      success(`Scheme application initiated for: ${result.title}`);
      navigate("/my-applications");
    } catch (err) {
      error(err.message || "Failed to apply for scheme");
    }
  };

  const services = [
    {
      title: "New LPG Connection",
      description: "Apply for new LPG gas connection",
      icon: Plus,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/gas/new-lpg",
    },
    {
      title: "PNG Connection",
      description: "Apply for piped natural gas connection",
      icon: Network,
      color: "bg-green-100",
      iconColor: "text-green-600",
      path: "/gas/new-png",
    },
    {
      title: "LPG Refill",
      description: "Book LPG cylinder refill",
      icon: RefreshCw,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/gas/refill",
    },
    {
      title: t("billPayment"),
      description: "View and pay gas bills",
      icon: CreditCard,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/gas/billing",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t("gas")}</h1>
              <p className="text-white/90 text-lg">LPG & PNG Services</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(service.path)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center mb-4`}
              >
                <service.icon className={`w-7 h-7 ${service.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-orange-900 mb-2">
            Gas Department Advisories
          </h3>
          {loading ? (
            <p className="text-orange-800">Loading advisories...</p>
          ) : latestAdvisories.length ? (
            <ul className="space-y-2">
              {latestAdvisories.map((adv) => (
                <li key={adv.id} className="text-orange-800">
                  {adv.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-orange-800">No advisories right now.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white border rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Government Schemes
          </h3>
          {loading ? (
            <p className="text-gray-700">Loading schemes...</p>
          ) : topSchemes.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800">{scheme.title}</p>
                  <p className="text-sm text-gray-600">{scheme.description}</p>
                  <button
                    onClick={() => handleApplyScheme(scheme.id)}
                    className="mt-2 text-sm text-orange-600 hover:underline"
                  >
                    Apply Now →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">
              No schemes available for Gas currently.
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default GasHub;
