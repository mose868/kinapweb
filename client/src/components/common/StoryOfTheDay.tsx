import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { ArrowRight, Star } from 'lucide-react'

interface Story {
  id: string
  title: string
  content: string
  author: string
  authorRole: string
  rating: number
  image: string
  createdAt: any
  impact: {
    earnings: number
    jobsCreated: number
    skillsGained: string[]
  }
  aiInsights: {
    marketPotential: string
    growthOpportunities: string[]
    skillRecommendations: string[]
  }
}

const StoryOfTheDay = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [currentStory, setCurrentStory] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(
          collection(db, 'stories'),
          where('featured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
          // Add sample 2025 stories if none exist
          const sampleStories = [
            {
              title: "From Local Developer to Global AI Innovator",
              content: "Through Ajira's AI Development Program, I transformed from a traditional web developer into a Quantum AI specialist. Now I lead a team developing neural interfaces for the African market.",
              author: "Sarah Mwangi",
              authorRole: "Senior Quantum AI Architect",
              rating: 5,
              image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
              impact: {
                earnings: 5000000,
                jobsCreated: 15,
                skillsGained: ["Quantum Computing", "Neural Networks", "AI Ethics"]
              },
              aiInsights: {
                marketPotential: "High growth in African AI market expected (300% by 2026)",
                growthOpportunities: [
                  "Neural Interface Development",
                  "Quantum AI Solutions",
                  "Green Tech Integration"
                ],
                skillRecommendations: [
                  "Advanced Quantum Programming",
                  "Neural Architecture Design",
                  "Sustainable AI Practices"
                ]
              }
            },
            {
              title: "Freelancer to Digital Agency Owner",
              content: "Ajira's mentorship helped me scale from a solo freelancer to running a digital agency with 20+ employees, serving clients worldwide.",
              author: "James Kamau",
              authorRole: "Founder, Kamau Digital Solutions",
              rating: 5,
              image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              impact: {
                earnings: 3000000,
                jobsCreated: 22,
                skillsGained: ["Project Management", "Client Acquisition", "Team Leadership"]
              },
              aiInsights: {
                marketPotential: "Digital services demand is booming in Africa and globally.",
                growthOpportunities: [
                  "Remote Team Building",
                  "Cross-border E-commerce",
                  "Brand Strategy"
                ],
                skillRecommendations: [
                  "Digital Marketing",
                  "Business Automation",
                  "Cross-cultural Communication"
                ]
              }
            },
            {
              title: "Student to Award-Winning Content Creator",
              content: "With Ajira's training, I turned my passion for storytelling into a career. My YouTube channel now has 100k+ subscribers and I mentor other students.",
              author: "Grace Wanjiru",
              authorRole: "Content Creator & Mentor",
              rating: 5,
              image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
              impact: {
                earnings: 1200000,
                jobsCreated: 5,
                skillsGained: ["Video Production", "Public Speaking", "Mentorship"]
              },
              aiInsights: {
                marketPotential: "Content creation is a top growth sector for youth in Africa.",
                growthOpportunities: [
                  "Edutainment",
                  "Online Courses",
                  "Brand Partnerships"
                ],
                skillRecommendations: [
                  "SEO for Video",
                  "Personal Branding",
                  "Community Building"
                ]
              }
            }
          ]

          for (const story of sampleStories) {
            await addDoc(collection(db, 'stories'), {
              ...story,
              featured: true,
              createdAt: serverTimestamp()
            })
          }
          
          // Fetch again after adding samples
          const newSnapshot = await getDocs(q)
          const data = newSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Story[]
          setStories(data)
        } else {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Story[]
          setStories(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stories:', error)
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  // Auto-rotate stories every 10 seconds
  useEffect(() => {
    if (stories.length === 0) return

    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [stories])

  if (loading) {
    return (
      <div className="text-center py-12">
        Loading featured stories...
      </div>
    )
  }

  if (stories.length === 0) {
    return null
  }

  const story = stories[currentStory]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-ajira-primary mb-2">
          2025 Success Story of the Day
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
          <p className="text-gray-600 line-clamp-3">{story.content}</p>
        </div>

        {/* Impact Metrics */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-ajira-primary mb-3">Impact Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-lg font-bold text-ajira-accent">
                {story.impact.earnings.toLocaleString()} KES
              </div>
              <div className="text-sm text-gray-600">Annual Earnings</div>
            </div>
            <div>
              <div className="text-lg font-bold text-ajira-accent">
                {story.impact.jobsCreated}
              </div>
              <div className="text-sm text-gray-600">Jobs Created</div>
            </div>
            <div>
              <div className="text-lg font-bold text-ajira-accent">
                {story.impact.skillsGained.length}
              </div>
              <div className="text-sm text-gray-600">New Skills</div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-ajira-primary/5 to-ajira-accent/5 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-ajira-primary mb-3">AI Market Insights</h4>
          <p className="text-sm text-gray-600 mb-3">{story.aiInsights.marketPotential}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-ajira-primary mb-2">Growth Areas</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {story.aiInsights.growthOpportunities.map((opportunity, index) => (
                  <li key={index}>• {opportunity}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-ajira-primary mb-2">Recommended Skills</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {story.aiInsights.skillRecommendations.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-ajira-primary">
              {story.author}
            </div>
            <div className="text-sm text-gray-500">{story.authorRole}</div>
          </div>

          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < story.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Story Navigation */}
        <div className="flex justify-center space-x-2 mt-6">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStory(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStory
                  ? 'bg-ajira-accent'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <Link
            to="/media-upload"
            className="inline-flex items-center text-ajira-accent hover:text-ajira-accent/80"
          >
            Share Your 2025 Success Story
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StoryOfTheDay 