import { useState } from 'react'
import { Mail, Globe, Linkedin, Twitter } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  position: string
  image: string
  bio: string
  contact: {
    email?: string
    website?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
}

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<'leaders' | 'members'>('leaders')

  const leaders: TeamMember[] = [
    {
      name: "John Doe",
      role: "leader",
      position: "Club President",
      image: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
      bio: "Final year student in Computer Science with a passion for digital innovation and community building.",
      contact: {
        email: "john.doe@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe"
      }
    },
    {
      name: "Jane Smith",
      role: "leader",
      position: "Vice President",
      image: "https://ui-avatars.com/api/?name=Jane+Smith&background=BC0D8A&color=fff",
      bio: "Digital marketing specialist and advocate for youth empowerment in technology.",
      contact: {
        email: "jane.smith@kinap.ac.ke",
        website: "https://janesmith.com",
        linkedin: "https://linkedin.com/in/janesmith"
      }
    },
    {
      name: "David Kamau",
      role: "leader",
      position: "Technical Lead",
      image: "https://ui-avatars.com/api/?name=David+Kamau&background=8ABC0D&color=fff",
      bio: "Full-stack developer with experience in building community platforms and mentoring students.",
      contact: {
        email: "david.kamau@kinap.ac.ke",
        github: "https://github.com/davidkamau"
      }
    }
  ]

  const members: TeamMember[] = [
    {
      name: "Alice Wanjiku",
      role: "member",
      position: "Web Development Lead",
      image: "https://ui-avatars.com/api/?name=Alice+Wanjiku&background=0DABC8&color=fff",
      bio: "Passionate about creating beautiful and functional web experiences.",
      contact: {
        email: "alice.wanjiku@kinap.ac.ke"
      }
    },
    {
      name: "Bob Maina",
      role: "member",
      position: "Content Creation Lead",
      image: "https://ui-avatars.com/api/?name=Bob+Maina&background=C80DAB&color=fff",
      bio: "Creative writer and digital content specialist.",
      contact: {
        email: "bob.maina@kinap.ac.ke"
      }
    }
    // Add more members as needed
  ]

  const renderSocialLinks = (contact: TeamMember['contact']) => (
    <div className="flex space-x-3">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-ajira-primary">
          <Mail size={18} />
        </a>
      )}
      {contact.website && (
        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Globe size={18} />
        </a>
      )}
      {contact.linkedin && (
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Linkedin size={18} />
        </a>
      )}
      {contact.twitter && (
        <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Twitter size={18} />
        </a>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the passionate individuals who lead and contribute to the Ajira Digital KiNaP Club community.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('leaders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'leaders'
                  ? 'bg-ajira-primary text-white'
                  : 'text-gray-500 hover:text-ajira-primary'
              }`}
            >
              Club Leaders
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'members'
                  ? 'bg-ajira-primary text-white'
                  : 'text-gray-500 hover:text-ajira-primary'
              }`}
            >
              Active Members
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'leaders' ? leaders : members).map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-ajira-primary font-medium">{member.position}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{member.bio}</p>
              {renderSocialLinks(member.contact)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamPage 