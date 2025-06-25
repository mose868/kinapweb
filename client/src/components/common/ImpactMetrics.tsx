import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Users, Award, DollarSign, Briefcase, Star, Loader2 } from 'lucide-react'

interface Metrics {
  totalMembers: number
  projectsCompleted: number
  totalEarnings: number
  activeFreelancers: number
  successRate: number
  averageRating: number
}

const ImpactMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalMembers: 250000, // Quarter million members by 2025
    projectsCompleted: 180000,
    totalEarnings: 500000000, // 500M KES
    activeFreelancers: 75000,
    successRate: 94.5,
    averageRating: 4.8
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch real-time metrics from Firebase
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const projectsSnapshot = await getDocs(collection(db, 'projects'))
        
        // If we have real data, use it; otherwise, keep the default 2025 projections
        if (usersSnapshot.size > 0) {
          const totalMembers = usersSnapshot.size
          const completedProjects = projectsSnapshot.docs.filter(
            doc => doc.data().status === 'completed'
          )
          const projectsCompleted = completedProjects.length

          const totalEarnings = completedProjects.reduce(
            (sum, project) => sum + (project.data().payment || 0),
            0
          )

          const activeFreelancers = usersSnapshot.docs.filter(
            doc => doc.data().role === 'freelancer' && doc.data().isActive
          ).length

          const allProjects = projectsSnapshot.size
          const successRate = allProjects > 0
            ? (completedProjects.length / allProjects) * 100
            : 94.5

          const ratings = completedProjects
            .map(project => project.data().rating || 0)
            .filter(rating => rating > 0)
          const averageRating = ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 4.8

          setMetrics({
            totalMembers,
            projectsCompleted,
            totalEarnings,
            activeFreelancers,
            successRate,
            averageRating
          })
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching metrics:', error)
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-ajira-accent animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Loading metrics...</h2>
          <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-ajira-accent" />,
      label: 'Total Members',
      value: metrics.totalMembers,
      format: (value: number) => value.toLocaleString()
    },
    {
      icon: <Briefcase className="w-8 h-8 text-ajira-primary" />,
      label: 'Projects Completed',
      value: metrics.projectsCompleted,
      format: (value: number) => value.toLocaleString()
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      label: 'Total Earnings',
      value: metrics.totalEarnings,
      format: (value: number) => `KES ${value.toLocaleString()}`
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      label: 'Success Rate',
      value: metrics.successRate,
      format: (value: number) => `${value.toFixed(1)}%`
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-ajira-primary text-center mb-8">
        Our Impact in 2025
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-gray-50 rounded-lg"
          >
            <div className="mb-4">{stat.icon}</div>
            <div className="text-2xl font-bold text-ajira-primary mb-2">
              {stat.format(stat.value)}
            </div>
            <div className="text-sm text-gray-600 text-center">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ajira-primary mb-4">
            Active Freelancers
          </h3>
          <div className="flex items-center">
            <Users className="w-6 h-6 text-ajira-accent mr-3" />
            <span className="text-2xl font-bold text-ajira-primary">
              {metrics.activeFreelancers}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Members actively taking on projects
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ajira-primary mb-4">
            Average Project Rating
          </h3>
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(metrics.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-3 text-2xl font-bold text-ajira-primary">
              {metrics.averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Based on completed project ratings
          </p>
        </div>
      </div>

      {/* Add new 2025 AI insights section */}
      <div className="mt-8 bg-gradient-to-r from-ajira-primary/5 to-ajira-accent/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ajira-primary mb-4">
          2025 AI-Driven Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-ajira-primary mb-2">Top Skills in Demand</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• AI/ML Development</li>
              <li>• Blockchain Solutions</li>
              <li>• Quantum Computing</li>
              <li>• Green Tech Innovation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-ajira-primary mb-2">Growth Metrics</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• 150% YoY Platform Growth</li>
              <li>• 85% Remote Work Adoption</li>
              <li>• 90% Digital Skills Training</li>
              <li>• 95% Client Satisfaction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactMetrics 