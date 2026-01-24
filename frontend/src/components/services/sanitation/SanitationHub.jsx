import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useLanguage } from "../../../context/LanguageContext";
import { Home, Trash2, CreditCard, Calendar, Recycle } from "lucide-react";

const SanitationHub = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    {
      title: "Toilet Construction",
      description: "Apply for household toilet construction under SBM",
      icon: Home,
      color: "bg-green-100",
      iconColor: "text-green-600",
      path: "/sanitation/new-connection",
    },
    {
      title: "Waste Collection",
      description: "Door-to-door waste collection tracking",
      icon: Trash2,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/sanitation/waste-collection",
    },
    {
      title: "Collection Schedule",
      description: "View scheduled waste collection dates",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/sanitation/schedule",
    },
    {
      title: t("billPayment"),
      description: "View and pay sanitation charges",
      icon: CreditCard,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/sanitation/billing",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Recycle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t("sanitation")}</h1>
              <p className="text-white/90 text-lg">
                Sanitation & Waste Management
              </p>
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
          className="mt-8 bg-green-50 border-l-4 border-green-500 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-green-900 mb-2">
            Swachh Bharat Mission
          </h3>
          <p className="text-green-800">
            Get financial assistance for household toilet construction under
            Swachh Bharat Mission. Subsidy up to ₹12,000 available for eligible
            households.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SanitationHub;
