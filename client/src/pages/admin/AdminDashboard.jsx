import React from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, BarChart2, Settings } from 'lucide-react'
import AdminLayout from './AdminLayout'

const AdminDashboard = () => {
  // Sample data - in real app, this would come from API
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-ajira-blue" />,
      label: 'Total Users',
      value: '1,234'
    },
    {
      icon: <FileText className="w-8 h-8 text-ajira-orange" />,
      label: 'Stories Published',
      value: '156'
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-ajira-gold" />,
      label: 'Monthly Views',
      value: '45.2K'
    }
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-ajira-lightGray py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8 flex items-center space-x-4">
            <img src="/logo.jpeg" alt="Club Logo" className="h-12 w-auto rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold text-ajira-blue mb-2">
                Admin Dashboard
              </h1>
              <p className="text-ajira-gray">
                Manage your platform's content and users
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-ajira p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-ajira-lightGray rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-ajira-gray font-medium">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold text-ajira-blue">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-ajira p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-ajira-blue">
                    Recent Users
                  </h2>
                  <button className="text-ajira-blue hover:text-ajira-lightBlue font-medium text-sm">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Sample user rows - would be mapped from actual data */}
                  <div className="flex items-center justify-between py-3 border-b border-ajira-lightGray">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-ajira-blue/10 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-ajira-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-ajira-blue">John Doe</p>
                        <p className="text-sm text-ajira-gray">john@example.com</p>
                      </div>
                    </div>
                    <span className="text-sm text-ajira-gray">2 hours ago</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-ajira-lightGray">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-ajira-blue/10 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-ajira-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-ajira-blue">Jane Smith</p>
                        <p className="text-sm text-ajira-gray">jane@example.com</p>
                      </div>
                    </div>
                    <span className="text-sm text-ajira-gray">5 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-white rounded-xl shadow-ajira p-6">
                <h2 className="text-xl font-bold text-ajira-blue mb-6">
                  Quick Actions
                </h2>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors">
                    <FileText size={20} className="text-ajira-blue" />
                    <span className="font-medium text-ajira-blue">Add New Story</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors">
                    <Users size={20} className="text-ajira-blue" />
                    <span className="font-medium text-ajira-blue">Manage Users</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors">
                    <Settings size={20} className="text-ajira-blue" />
                    <span className="font-medium text-ajira-blue">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard 