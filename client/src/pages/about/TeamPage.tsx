import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import LoadingState from '../../components/common/LoadingState';
import JoinTeamForm from '../../components/team/JoinTeamForm';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${BASEURL}/team`);
        setTeamMembers(response.data);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team information');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <LoadingState message='Loading team information' />;
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  // Separate leadership and regular team members
  const leadership = teamMembers.filter((member) => member.isLeadership);
  const founders = teamMembers.filter((member) => member.isFounder);
  const regularMembers = teamMembers.filter(
    (member) => !member.isLeadership && !member.isFounder
  );

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
      className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full'
    >
      <div className='relative'>
        <img
          src={member.image || '/images/default-avatar.png'}
          alt={member.name}
          className='w-full h-48 sm:h-64 object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
        <div className='absolute bottom-4 left-4 text-white'>
          <h3 className='text-xl font-bold'>{member.name}</h3>
          <p className='text-sm opacity-90'>{member.role}</p>
          {member.title && <p className='text-xs opacity-75'>{member.title}</p>}
        </div>
      </div>

      <div className='p-4 sm:p-6'>
        <p className='text-gray-600 mb-4 leading-relaxed text-sm sm:text-base'>
          {member.bio}
        </p>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-xs sm:text-sm font-medium text-gray-900 mb-2'>
              Skills
            </h4>
            <div className='flex flex-wrap gap-2'>
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className='px-2 py-1 bg-ajira-primary/10 text-ajira-primary text-xs rounded-full'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact links */}
        <div className='flex items-center space-x-3'>
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className='text-gray-400 hover:text-ajira-primary transition-colors'
            >
              <Mail size={18} />
            </a>
          )}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-ajira-primary transition-colors'
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-ajira-primary transition-colors'
            >
              <Github size={18} />
            </a>
          )}
        </div>

        {/* Join date */}
        {member.joinedDate && (
          <div className='mt-4 pt-4 border-t border-gray-100'>
            <div className='flex items-center text-xs sm:text-sm text-gray-500'>
              <Calendar size={14} className='mr-1' />
              Joined{' '}
              {new Date(member.joinedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden'>
      <div className='container-custom px-2 sm:px-4 w-full'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl sm:text-4xl font-bold text-ajira-primary mb-4'>
            Our Team
          </h1>
          <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
            Meet the passionate individuals who lead and contribute to the Ajira
            Digital KiNaP Club community.
          </p>
        </div>

        {/* Founders Section */}
        {founders.length > 0 && (
          <div className='mb-16'>
            <h2 className='text-2xl font-bold text-center text-gray-900 mb-8'>
              Founders
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full'>
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
          <div className='mb-16'>
            <h2 className='text-2xl font-bold text-center text-gray-900 mb-8'>
              Leadership Team
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full'>
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
            <h2 className='text-2xl font-bold text-center text-gray-900 mb-8'>
              Team Members
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full'>
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

        {/* Under Development State */}
        {teamMembers.length === 0 && (
          <div className='text-center py-16'>
            {/* Welcome Message */}
            <div className='max-w-4xl mx-auto'>
              <div className='mb-12'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-full mb-6 shadow-lg'
                >
                  <Users className='w-10 h-10 text-white' />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className='text-3xl sm:text-4xl font-bold text-ajira-primary mb-4'
                >
                  Welcome to Our Team Page! 👋
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed'
                >
                  We're excited to introduce you to the amazing people behind the Ajira Digital KiNaP Club!
                </motion.p>
              </div>

              {/* Development Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='bg-gradient-to-r from-ajira-primary/10 to-ajira-secondary/10 rounded-2xl p-8 mb-8 border border-ajira-primary/20'
              >
                <div className='flex items-center justify-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-full flex items-center justify-center mr-4'>
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  </div>
                  <h3 className='text-2xl font-bold text-ajira-primary'>
                    Under Development
                  </h3>
                </div>
                
                <p className='text-gray-700 text-lg mb-6 max-w-3xl mx-auto leading-relaxed'>
                  Our team page is currently being crafted with care. We're gathering photos, bios, and stories from our incredible team members to give you the best experience possible.
                </p>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto'>
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-primary/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Users className='w-6 h-6 text-ajira-primary' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Team Profiles</h4>
                    <p className='text-sm text-gray-600'>Professional photos and detailed bios</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Github className='w-6 h-6 text-ajira-secondary' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Social Links</h4>
                    <p className='text-sm text-gray-600'>Connect with team members</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-accent/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Calendar className='w-6 h-6 text-ajira-accent' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Timeline</h4>
                    <p className='text-sm text-gray-600'>Join dates and milestones</p>
                  </div>
                </div>
              </motion.div>

              {/* What to Expect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200'
              >
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  What You'll Find Here
                </h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-left'>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-primary font-bold text-sm'>1</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Leadership Team</h4>
                        <p className='text-gray-600 text-sm'>Meet our club presidents, coordinators, and key decision makers</p>
                      </div>
                    </div>
                    
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-secondary font-bold text-sm'>2</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Technical Mentors</h4>
                        <p className='text-gray-600 text-sm'>Expert developers, designers, and digital professionals</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-accent font-bold text-sm'>3</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Student Leaders</h4>
                        <p className='text-gray-600 text-sm'>Passionate students driving innovation and community growth</p>
                      </div>
                    </div>
                    
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-gray-600 font-bold text-sm'>4</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Support Team</h4>
                        <p className='text-gray-600 text-sm'>Administrative and operational support members</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='mt-12'
              >
                <p className='text-gray-600 mb-6 text-lg'>
                  Want to join our amazing team? We're always looking for passionate individuals!
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button 
                    onClick={() => setShowJoinForm(true)}
                    className='px-8 py-3 bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105'
                  >
                    Join Our Team
                  </button>
                  <button className='px-8 py-3 border-2 border-ajira-primary text-ajira-primary font-semibold rounded-lg hover:bg-ajira-primary hover:text-white transition-all duration-200'>
                    Contact Us
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Join Team Form Modal */}
      <JoinTeamForm 
        isOpen={showJoinForm} 
        onClose={() => setShowJoinForm(false)} 
      />
    </div>
  );
};

export default TeamPage;
