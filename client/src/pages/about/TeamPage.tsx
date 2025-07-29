import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Calendar } from 'lucide-react'
import axios from 'axios'
import LoadingState from '../../components/common/LoadingState'

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${BASEURL}/team`)
        setTeamMembers(response.data)
      } catch (err) {
        console.error('Error fetching team members:', err)
        setError('Failed to load team information')
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  if (loading) {
    return <LoadingState message="Loading team information" />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Separate leadership and regular team members
  const leadership = teamMembers.filter(member => member.isLeadership)
  const founders = teamMembers.filter(member => member.isFounder)
  const regularMembers = teamMembers.filter(member => !member.isLeadership && !member.isFounder)

  // Sample team data - replace with actual data from your backend
  // const teamMembers = [
  //   {
  //     id: 1,
  //     name: "Alice Wanjiku",
  //     role: "Club President & Founder",
  //     image: "/api/placeholder/300/300",
  //     bio: "Computer Science student passionate about digital transformation. Leading initiatives to bridge the digital divide in our community.",
  //     skills: ["Leadership", "Web Development", "Digital Strategy"],
  //     email: "alice@kinapajira.com",
  //     linkedin: "https://linkedin.com/in/alicewanjiku",
  //     github: "https://github.com/alicewanjiku",
  //     joinedDate: "2023-01-15"
  //   },
  //   // Add more team members...
  // ]

  const TeamMemberCard = ({ member, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
    >
      <div className="relative">
        <img
          src={member.image || '/images/default-avatar.png'}
          alt={member.name}
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-sm opacity-90">{member.role}</p>
          {member.title && (
            <p className="text-xs opacity-75">{member.title}</p>
          )}
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
          {member.bio}
        </p>
        
        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-ajira-primary/10 text-ajira-primary text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact links */}
        <div className="flex items-center space-x-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-gray-400 hover:text-ajira-primary transition-colors"
            >
              <Mail size={18} />
            </a>
          )}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-ajira-primary transition-colors"
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-ajira-primary transition-colors"
            >
              <Github size={18} />
            </a>
          )}
        </div>
        
        {/* Join date */}
        {member.joinedDate && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="container-custom px-2 sm:px-4 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">Our Team</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the passionate individuals who lead and contribute to the Ajira Digital KiNaP Club community.
          </p>
        </div>

        {/* Founders Section */}
        {founders.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Founders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
              {founders.map((member, index) => (
                <TeamMemberCard 
                  key={member._id} 
                  member={member} 
                  delay={index * 0.1} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Leadership Section */}
        {leadership.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Leadership Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
              {leadership.map((member, index) => (
                <TeamMemberCard 
                  key={member._id} 
                  member={member} 
                  delay={index * 0.1} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Team Members */}
        {regularMembers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Team Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
              {regularMembers.map((member, index) => (
                <TeamMemberCard 
                  key={member._id} 
                  member={member} 
                  delay={index * 0.1} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No team members yet</h3>
            <p className="text-gray-600 max-w-md mx-auto text-base sm:text-lg">
              We're building an amazing team! Check back soon to meet our talented members.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamPage 