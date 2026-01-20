import React from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import { useLanguage } from '../../../context/LanguageContext'
import { 
  Plus, 
  Settings, 
  Trash2, 
  CreditCard, 
  Search,
  Zap 
} from 'lucide-react'

const ElectricityHub = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const services = [
    {
      title: t('newConnection'),
      description: 'Apply for new electricity connection',
      icon: Plus,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      path: '/electricity/new-connection',
    },
    {
      title: t('loadManagement'),
      description: 'Load increase/decrease or category change',
      icon: Settings,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: '/electricity/load-management',
    },
    {
      title: t('removeConnection'),
      description: 'Permanent or temporary disconnection',
      icon: Trash2,
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      path: '/electricity/remove-connection',
    },
    {
      title: t('billPayment'),
      description: 'View and pay electricity bills',
      icon: CreditCard,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      path: '/electricity/billing',
    },
    {
      title: t('trackApplication'),
      description: 'Track your application status',
      icon: Search,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      path: '/electricity/track',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('electricity')}</h1>
              <p className="text-white/90 text-lg">Electricity Services & Management</p>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
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
              <div className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center mb-4`}>
                <service.icon className={`w-7 h-7 ${service.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-blue-900 mb-2">Important Information</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• All applications are processed within 3-5 working days</li>
            <li>• Keep your consumer number handy for faster service</li>
            <li>• Documents can be uploaded via DigiLocker or mobile QR scan</li>
            <li>• Track your application status anytime with your application number</li>
          </ul>
        </motion.div>
      <Outlet />

      </main>

      <Footer />
    </div>
  )
}

export default ElectricityHub