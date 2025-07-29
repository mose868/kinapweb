import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Users, 
  Target, 
  Trophy, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  Gift,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AmbassadorPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const ambassadorBenefits = [
    {
      icon: <Award className="w-8 h-8 text-ajira-accent" />,
      title: "Exclusive Recognition",
      description: "Get official ambassador status and recognition within the Ajira Digital community."
    },
    {
      icon: <Gift className="w-8 h-8 text-ajira-accent" />,
      title: "Rewards & Incentives",
      description: "Earn points, certificates, and exclusive merchandise for your contributions."
    },
    {
      icon: <Users className="w-8 h-8 text-ajira-accent" />,
      title: "Leadership Opportunities",
      description: "Lead workshops, mentor new members, and represent the club at events."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-ajira-accent" />,
      title: "Skill Development",
      description: "Access advanced training programs and professional development resources."
    }
  ]

  const leaderboard = [
    {
      rank: 1,
      name: "Sarah Mwangi",
      points: 2850,
      achievements: ["Top Mentor", "Event Leader", "Content Creator"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      rank: 2,
      name: "James Kamau",
      points: 2640,
      achievements: ["Workshop Leader", "Community Builder"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      rank: 3,
      name: "Grace Wanjiru",
      points: 2420,
      achievements: ["Social Media Champion", "Recruiter"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const tasks = [
    {
      id: 1,
      title: "Organize Study Group Session",
      description: "Lead a study group for new members on digital marketing basics",
      points: 150,
      deadline: "2025-01-15",
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "Create Social Media Content",
      description: "Design and post 3 engaging posts about Ajira Digital opportunities",
      points: 100,
      deadline: "2025-01-10",
      difficulty: "Easy"
    },
    {
      id: 3,
      title: "Mentor New Members",
      description: "Guide 5 new members through their first week in the program",
      points: 200,
      deadline: "2025-01-20",
      difficulty: "Hard"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ajira-primary via-ajira-primary-dark to-ajira-accent py-12 sm:py-20 w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 p-4 rounded-full">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ambassador Program 2025
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our elite community of student leaders and help shape the future of digital skills at Kiambu National Polytechnic.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-ajira-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto">
                  Apply Now
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ajira-primary transition-colors w-full sm:w-auto">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 w-full">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'tasks', label: 'Tasks' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-ajira-accent text-ajira-accent'
                    : 'border-transparent text-gray-500 hover:text-ajira-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container-custom px-2 sm:px-4 w-full">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-ajira-primary mb-4">
                  What is the Ambassador Program?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our Ambassador Program recognizes and empowers outstanding students who demonstrate leadership, 
                  commitment, and passion for digital skills development.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Responsive grid: 1 col on mobile, 2 on md+ */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <Target className="w-12 h-12 text-ajira-accent mb-4" />
                  <h3 className="text-xl font-bold text-ajira-primary mb-3">Our Mission</h3>
                  <p className="text-gray-600">
                    To create a network of student leaders who inspire, mentor, and guide their peers 
                    towards success in the digital economy.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <Users className="w-12 h-12 text-ajira-accent mb-4" />
                  <h3 className="text-xl font-bold text-ajira-primary mb-3">Community Impact</h3>
                  <p className="text-gray-600">
                    Ambassadors have helped over 500+ students discover digital opportunities and 
                    develop essential skills for the modern workforce.
                  </p>
                </div>
              </div>

              <div className="bg-ajira-primary rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h3>
                <p className="text-white/90 mb-6">
                  Join our ambassador program and become a catalyst for change in your community.
                </p>
                <button className="bg-ajira-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-ajira-accent/90 transition-colors">
                  Start Your Application
                </button>
              </div>
            </motion.div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-ajira-primary mb-4">
                  Ambassador Benefits
                </h2>
                <p className="text-lg text-gray-600">
                  Exclusive perks and opportunities for our dedicated ambassadors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Responsive grid: 1 col on mobile, 2 on md+ */}
                {ambassadorBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-ajira-primary/10 p-3 rounded-lg">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-ajira-primary mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-ajira-primary mb-4">
                  Top Ambassadors 2025
                </h2>
                <p className="text-lg text-gray-600">
                  Celebrating our most active and impactful ambassadors
                </p>
              </div>

              <div className="space-y-4">
                {leaderboard.map((ambassador, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-6"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        ambassador.rank === 1 ? 'bg-yellow-500' :
                        ambassador.rank === 2 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                        {ambassador.rank}
                      </div>
                    </div>
                    <img
                      src={ambassador.avatar}
                      alt={ambassador.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-ajira-primary">
                        {ambassador.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {ambassador.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="bg-ajira-accent/10 text-ajira-accent px-2 py-1 rounded-full text-sm"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ajira-accent">
                        {ambassador.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-ajira-primary mb-4">
                  Available Tasks
                </h2>
                <p className="text-lg text-gray-600">
                  Complete tasks to earn points and make an impact in your community
                </p>
              </div>

              <div className="space-y-6">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-ajira-primary mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {task.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{task.points} points</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {task.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary-dark transition-colors">
                        Accept Task
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AmbassadorPage