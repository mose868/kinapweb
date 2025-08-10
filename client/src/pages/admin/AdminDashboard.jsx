import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Info,
  Shield,
  HelpCircle,
  Mail,
  BookOpen,
  UserCheck,
  Calendar,
  Brain,
} from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  // Sample data - in real app, this would come from API
  const stats = [
    {
      icon: <Users className='w-8 h-8 text-ajira-blue' />,
      label: 'Total Users',
      value: '1,234',
    },
    {
      icon: <FileText className='w-8 h-8 text-ajira-orange' />,
      label: 'Stories Published',
      value: '156',
    },
    {
      icon: <BarChart3 className='w-8 h-8 text-ajira-gold' />,
      label: 'Monthly Views',
      value: '45.2K',
    },
  ];

  return (
    <AdminLayout>
      <div className='min-h-screen bg-ajira-lightGray py-8 sm:py-12 w-full overflow-x-hidden'>
        <div className='container-custom px-2 sm:px-4 w-full'>
          {/* Header */}
          <div className='mb-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full'>
            <img
              src='/logo.jpeg'
              alt='Club Logo'
              className='h-10 sm:h-12 w-auto rounded-lg'
            />
            <div className='text-center sm:text-left w-full'>
              <h1 className='text-2xl sm:text-3xl font-bold text-ajira-blue mb-2'>
                Admin Dashboard
              </h1>
              <p className='text-ajira-gray text-sm sm:text-base'>
                Manage your platform's content and users
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 w-full'>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white rounded-xl shadow-ajira p-4 sm:p-6 w-full'
              >
                <div className='flex items-center space-x-4'>
                  <div className='p-3 bg-ajira-lightGray rounded-lg'>
                    {stat.icon}
                  </div>
                  <div>
                    <p className='text-ajira-gray font-medium text-sm sm:text-base'>
                      {stat.label}
                    </p>
                    <h3 className='text-lg sm:text-2xl font-bold text-ajira-blue'>
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 w-full'>
            {/* Recent Users */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-xl shadow-ajira p-4 sm:p-6 w-full'>
                <div className='flex flex-col sm:flex-row items-center justify-between mb-6 gap-2 w-full'>
                  <h2 className='text-lg sm:text-xl font-bold text-ajira-blue'>
                    Recent Users
                  </h2>
                  <button className='text-ajira-blue hover:text-ajira-lightBlue font-medium text-xs sm:text-sm'>
                    View All
                  </button>
                </div>

                <div className='space-y-4'>
                  {/* Sample user rows - would be mapped from actual data */}
                  <div className='flex flex-col sm:flex-row items-center justify-between py-3 border-b border-ajira-lightGray gap-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-ajira-blue/10 rounded-full flex items-center justify-center'>
                        <Users size={20} className='text-ajira-blue' />
                      </div>
                      <div>
                        <p className='font-medium text-ajira-blue text-sm sm:text-base'>
                          John Doe
                        </p>
                        <p className='text-xs sm:text-sm text-ajira-gray'>
                          john@example.com
                        </p>
                      </div>
                    </div>
                    <span className='text-xs sm:text-sm text-ajira-gray'>
                      2 hours ago
                    </span>
                  </div>

                  <div className='flex flex-col sm:flex-row items-center justify-between py-3 border-b border-ajira-lightGray gap-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-ajira-blue/10 rounded-full flex items-center justify-center'>
                        <Users size={20} className='text-ajira-blue' />
                      </div>
                      <div>
                        <p className='font-medium text-ajira-blue text-sm sm:text-base'>
                          Jane Smith
                        </p>
                        <p className='text-xs sm:text-sm text-ajira-gray'>
                          jane@example.com
                        </p>
                      </div>
                    </div>
                    <span className='text-xs sm:text-sm text-ajira-gray'>
                      5 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className='bg-white rounded-xl shadow-ajira p-4 sm:p-6 w-full'>
                <h2 className='text-lg sm:text-xl font-bold text-ajira-blue mb-6'>
                  Quick Actions
                </h2>

                <div className='space-y-4'>
                  <button className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'>
                    <FileText size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Add New Story
                    </span>
                  </button>

                  <Link
                    to='/admin/about-us'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <Info size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Manage About Us
                    </span>
                  </Link>

                  <Link
                    to='/admin/team'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <Users size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Manage Team
                    </span>
                  </Link>

                  <Link
                    to='/admin/updates'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <FileText size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Club Updates
                    </span>
                  </Link>

                  <Link
                    to='/admin/faq'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <HelpCircle size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      FAQ Management
                    </span>
                  </Link>

                  <Link
                    to='/admin/contact'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <Mail size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Contact Messages
                    </span>
                  </Link>

                  <Link
                    to='/admin/training'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <BookOpen size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Training Programs
                    </span>
                  </Link>

                  <Link
                    to='/admin/mentorship'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <UserCheck size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Mentorship Programs
                    </span>
                  </Link>

                  <Link
                    to='/admin/mentor-applications'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <Brain size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      AI Mentor Recruiting
                    </span>
                  </Link>

                  <Link
                    to='/admin/events'
                    className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'
                  >
                    <Calendar size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Events Management
                    </span>
                  </Link>

                  <button className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'>
                    <Users size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Manage Users
                    </span>
                  </button>

                  <button className='w-full flex items-center space-x-3 p-3 bg-ajira-lightGray rounded-lg hover:bg-ajira-blue/10 transition-colors text-sm sm:text-base'>
                    <Settings size={20} className='text-ajira-blue' />
                    <span className='font-medium text-ajira-blue'>
                      Settings
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
