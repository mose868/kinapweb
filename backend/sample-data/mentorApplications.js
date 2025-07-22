const sampleMentorApplications = [
  {
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Wanjiku',
      email: 'sarah.wanjiku@techcompany.com',
      phone: '+254712345678',
      dateOfBirth: '1992-05-15',
      nationality: 'Kenyan',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahwanjiku',
        github: 'https://github.com/sarahw',
        website: 'https://sarahwanjiku.dev'
      }
    },
    
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationFlexible: true,
      preferredRadius: 50,
      canTravelForMentoring: true
    },
    
    availability: {
      isAvailableNow: true,
      weeklyHoursCommitment: 8,
      maxMentees: 5,
      responseTimeCommitment: 'Within 1 hour',
      instantMentoring: {
        enabled: true,
        maxInstantSessions: 3,
        instantSessionDuration: 30
      }
    },
    
    professional: {
      currentRole: 'Senior Software Engineer',
      currentCompany: 'Safaricom PLC',
      industry: 'Technology',
      experienceLevel: 'Senior (6-10 years)',
      yearsOfExperience: 8,
      previousRoles: [
        {
          title: 'Software Engineer',
          company: 'iHub Nairobi',
          duration: '3 years',
          description: 'Led frontend development for multiple fintech projects'
        }
      ],
      achievements: [
        'Led a team of 6 developers in building Safaricom\'s customer portal',
        'Increased application performance by 40% through optimization',
        'Mentored 12 junior developers during career'
      ],
      certifications: [
        {
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          dateObtained: new Date('2023-03-15'),
          certificateUrl: 'https://aws.amazon.com/certification'
        }
      ]
    },
    
    education: {
      highestDegree: 'Master\'s',
      fieldOfStudy: 'Computer Science',
      institution: 'University of Nairobi',
      graduationYear: 2016,
      additionalEducation: [
        {
          degree: 'Bachelor\'s',
          field: 'Information Technology',
          institution: 'Strathmore University',
          year: 2014
        }
      ],
      onlineCoursesCompleted: [
        {
          courseName: 'Advanced React Development',
          platform: 'Udemy',
          completionDate: new Date('2023-01-20'),
          certificateUrl: 'https://udemy.com/certificate'
        }
      ]
    },
    
    mentoringExperience: {
      hasMentoredBefore: true,
      previousMentoringExperience: 'Mentored junior developers at Safaricom and volunteers through local tech meetups. Helped 12 individuals transition into tech careers.',
      numberOfMentees: 12,
      mentoringDuration: '4 years',
      mentoringStyle: 'Collaborative',
      preferredMentoringFormat: ['One-on-One', 'Virtual Sessions', 'Project-Based']
    },
    
    expertise: {
      primarySkills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'JavaScript', 'TypeScript'],
      secondarySkills: ['Docker', 'Kubernetes', 'PostgreSQL'],
      technicalSkills: ['System Design', 'API Development', 'Cloud Architecture'],
      softSkills: ['Leadership', 'Communication', 'Project Management'],
      specializations: ['Web Development', 'Cloud Computing', 'Entrepreneurship'],
      industries: ['Technology', 'Finance'],
      careerStages: ['Students', 'Recent Graduates', 'Career Changers']
    },
    
    motivation: {
      whyMentor: 'I believe in giving back to the tech community that helped shape my career. Having been mentored myself during my early years, I understand the transformative power of guidance and want to help others navigate their tech journey more effectively.',
      mentoringGoals: [
        'Help mentees develop technical skills',
        'Guide career transitions into tech',
        'Build confidence in underrepresented groups'
      ],
      successDefinition: 'Success is when my mentees achieve their career goals, whether that\'s landing their first tech job, getting promoted, or successfully launching their startup.',
      challengesToAddress: ['Lack of tech opportunities for youth', 'Gender gap in technology'],
      idealMenteeProfile: 'Motivated individuals who are passionate about technology and committed to learning. I work best with people who are proactive and open to feedback.',
      valuesToShare: ['Continuous learning', 'Collaboration', 'Innovation', 'Integrity'],
      personalGrowthGoals: 'Improve my mentoring skills and learn from diverse perspectives of my mentees'
    },
    
    documents: {
      resume: 'https://example.com/resume/sarah-wanjiku.pdf',
      coverLetter: 'I am excited to join the Ajira Digital mentor network because...',
      portfolio: 'https://sarahwanjiku.dev/portfolio'
    },
    
    applicationStatus: {
      status: 'Submitted',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    
    analytics: {
      sourceChannel: 'website',
      deviceUsed: 'Desktop',
      sessionCount: 3,
      totalTimeSpent: 45
    }
  },

  {
    personalInfo: {
      firstName: 'James',
      lastName: 'Mwangi',
      email: 'james.mwangi@kcb.co.ke',
      phone: '+254787654321',
      dateOfBirth: '1988-11-22',
      nationality: 'Kenyan',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/jamesmwangi',
        twitter: 'https://twitter.com/jamesmwangi'
      }
    },
    
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationFlexible: false,
      preferredRadius: 25,
      canTravelForMentoring: false
    },
    
    availability: {
      isAvailableNow: false,
      weeklyHoursCommitment: 6,
      maxMentees: 4,
      responseTimeCommitment: 'Within 24 hours',
      instantMentoring: {
        enabled: false,
        maxInstantSessions: 0,
        instantSessionDuration: 0
      }
    },
    
    professional: {
      currentRole: 'Lead Data Scientist',
      currentCompany: 'KCB Bank',
      industry: 'Finance',
      experienceLevel: 'Senior (6-10 years)',
      yearsOfExperience: 7,
      previousRoles: [
        {
          title: 'Data Analyst',
          company: 'Equity Bank',
          duration: '2 years',
          description: 'Built predictive models for credit risk assessment'
        }
      ],
      achievements: [
        'Developed ML models that reduced loan defaults by 25%',
        'Led data science team of 8 professionals',
        'Published 3 papers on financial ML applications'
      ],
      certifications: [
        {
          name: 'Certified Data Scientist',
          issuer: 'Microsoft',
          dateObtained: new Date('2022-08-10'),
          certificateUrl: 'https://microsoft.com/learn'
        }
      ]
    },
    
    education: {
      highestDegree: 'Master\'s',
      fieldOfStudy: 'Statistics',
      institution: 'University of Nairobi',
      graduationYear: 2013,
      additionalEducation: [
        {
          degree: 'Bachelor\'s',
          field: 'Mathematics',
          institution: 'Kenyatta University',
          year: 2011
        }
      ]
    },
    
    mentoringExperience: {
      hasMentoredBefore: true,
      previousMentoringExperience: 'Informal mentoring of colleagues and university students interested in data science career paths.',
      numberOfMentees: 6,
      mentoringDuration: '2 years',
      mentoringStyle: 'Coaching',
      preferredMentoringFormat: ['One-on-One', 'Virtual Sessions']
    },
    
    expertise: {
      primarySkills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas'],
      secondarySkills: ['Tableau', 'Power BI', 'Apache Spark'],
      technicalSkills: ['Statistical Analysis', 'Predictive Modeling', 'Data Visualization'],
      softSkills: ['Analytical Thinking', 'Problem Solving', 'Presentation'],
      specializations: ['Data Science', 'Analytics', 'Career Development'],
      industries: ['Finance', 'Banking'],
      careerStages: ['Students', 'Recent Graduates', 'Mid-Career Professionals']
    },
    
    motivation: {
      whyMentor: 'Data science changed my career trajectory completely. I want to help others discover the power of data and guide them through the complexities of transitioning into this field.',
      mentoringGoals: [
        'Demystify data science for beginners',
        'Help with practical project guidance',
        'Share industry insights and trends'
      ],
      successDefinition: 'When mentees can independently tackle data science problems and feel confident in their abilities.',
      idealMenteeProfile: 'Individuals with strong analytical mindset who are curious about data and willing to put in the effort to learn statistical concepts.',
      valuesToShare: ['Data-driven decision making', 'Continuous learning', 'Ethical AI practices']
    },
    
    documents: {
      coverLetter: 'As a data science professional with extensive experience in the financial sector...'
    },
    
    applicationStatus: {
      status: 'Under Review',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  },

  {
    personalInfo: {
      firstName: 'Grace',
      lastName: 'Achieng',
      email: 'grace.achieng@ihub.co.ke',
      phone: '+254798765432',
      dateOfBirth: '1995-07-08',
      nationality: 'Kenyan',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/graceachieng',
        behance: 'https://behance.net/graceachieng'
      }
    },
    
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationFlexible: true,
      preferredRadius: 30,
      canTravelForMentoring: true
    },
    
    availability: {
      isAvailableNow: true,
      weeklyHoursCommitment: 5,
      maxMentees: 3,
      responseTimeCommitment: 'Within 4 hours',
      instantMentoring: {
        enabled: true,
        maxInstantSessions: 2,
        instantSessionDuration: 45
      }
    },
    
    professional: {
      currentRole: 'Senior UX Designer',
      currentCompany: 'iHub',
      industry: 'Technology',
      experienceLevel: 'Mid-Level (3-6 years)',
      yearsOfExperience: 5,
      previousRoles: [
        {
          title: 'UI/UX Designer',
          company: 'Ushahidi',
          duration: '2 years',
          description: 'Designed user interfaces for crisis mapping applications'
        }
      ],
      achievements: [
        'Redesigned iHub website resulting in 60% increase in user engagement',
        'Led design thinking workshops for 50+ startups',
        'Won Best UX Design Award at Nairobi Design Week 2023'
      ]
    },
    
    education: {
      highestDegree: 'Bachelor\'s',
      fieldOfStudy: 'Graphic Design',
      institution: 'USIU-Africa',
      graduationYear: 2018,
      onlineCoursesCompleted: [
        {
          courseName: 'UX Design Specialization',
          platform: 'Coursera',
          completionDate: new Date('2020-06-15')
        }
      ]
    },
    
    mentoringExperience: {
      hasMentoredBefore: false,
      previousMentoringExperience: '',
      numberOfMentees: 0,
      mentoringDuration: '',
      mentoringStyle: 'Collaborative',
      preferredMentoringFormat: ['One-on-One', 'Group Mentoring', 'Virtual Sessions']
    },
    
    expertise: {
      primarySkills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      secondarySkills: ['HTML', 'CSS', 'JavaScript'],
      technicalSkills: ['Design Systems', 'Wireframing', 'Usability Testing'],
      softSkills: ['Creativity', 'Empathy', 'Communication', 'Collaboration'],
      specializations: ['UI/UX Design', 'Product Design', 'Design Thinking'],
      industries: ['Technology', 'Startups'],
      careerStages: ['Students', 'Recent Graduates', 'Career Changers']
    },
    
    motivation: {
      whyMentor: 'Design has the power to solve real-world problems and create meaningful experiences. I want to share this passion and help others develop design thinking skills that can make a positive impact.',
      mentoringGoals: [
        'Teach user-centered design principles',
        'Help build strong design portfolios',
        'Guide career transitions into UX/UI'
      ],
      successDefinition: 'When mentees can think like designers, empathize with users, and create solutions that truly address user needs.',
      idealMenteeProfile: 'Creative individuals who are curious about human behavior and passionate about solving problems through design.',
      valuesToShare: ['User empathy', 'Iterative design', 'Inclusive design practices']
    },
    
    documents: {
      portfolio: 'https://graceachieng.design',
      coverLetter: 'Design is not just about making things look beautiful, it\'s about making them work beautifully...'
    },
    
    applicationStatus: {
      status: 'Interview Scheduled',
      submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
    }
  },

  {
    personalInfo: {
      firstName: 'David',
      lastName: 'Kiprop',
      email: 'david.kiprop@startup.com',
      phone: '+254756789012',
      dateOfBirth: '1990-03-12',
      nationality: 'Kenyan',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/davidkiprop',
        twitter: 'https://twitter.com/davidkiprop'
      }
    },
    
    location: {
      city: 'Eldoret',
      county: 'Uasin Gishu',
      country: 'Kenya',
      isLocationFlexible: true,
      preferredRadius: 100,
      canTravelForMentoring: false
    },
    
    availability: {
      isAvailableNow: false,
      weeklyHoursCommitment: 4,
      maxMentees: 2,
      responseTimeCommitment: 'Within 48 hours',
      instantMentoring: {
        enabled: false,
        maxInstantSessions: 0
      }
    },
    
    professional: {
      currentRole: 'Co-Founder & CTO',
      currentCompany: 'AgroTech Solutions',
      industry: 'Technology',
      experienceLevel: 'Senior (6-10 years)',
      yearsOfExperience: 9,
      achievements: [
        'Built AgroTech platform serving 10,000+ farmers',
        'Raised $500K in seed funding',
        'Featured in Forbes 30 Under 30 Africa'
      ]
    },
    
    education: {
      highestDegree: 'Bachelor\'s',
      fieldOfStudy: 'Computer Engineering',
      institution: 'Moi University',
      graduationYear: 2014
    },
    
    mentoringExperience: {
      hasMentoredBefore: true,
      previousMentoringExperience: 'Mentored startup founders through various accelerator programs and incubators.',
      numberOfMentees: 8,
      mentoringDuration: '3 years',
      mentoringStyle: 'Coaching',
      preferredMentoringFormat: ['One-on-One', 'Virtual Sessions']
    },
    
    expertise: {
      primarySkills: ['Product Management', 'Startup Strategy', 'Team Building', 'Fundraising'],
      technicalSkills: ['Full-Stack Development', 'System Architecture'],
      specializations: ['Entrepreneurship', 'Product Management', 'Leadership'],
      careerStages: ['Entrepreneurs', 'Mid-Career Professionals']
    },
    
    motivation: {
      whyMentor: 'Entrepreneurship is challenging but rewarding. I want to help other entrepreneurs avoid common pitfalls and accelerate their journey to building successful ventures.',
      successDefinition: 'When mentees launch viable products, build strong teams, and create sustainable businesses that solve real problems.',
      idealMenteeProfile: 'Ambitious entrepreneurs who are committed to building something meaningful and are willing to put in the hard work required.'
    },
    
    applicationStatus: {
      status: 'Approved',
      submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  },

  {
    personalInfo: {
      firstName: 'Mary',
      lastName: 'Wambui',
      email: 'mary.wambui@marketingagency.com',
      phone: '+254723456789',
      dateOfBirth: '1987-09-25',
      nationality: 'Kenyan'
    },
    
    location: {
      city: 'Mombasa',
      county: 'Mombasa',
      country: 'Kenya',
      isLocationFlexible: false,
      preferredRadius: 20,
      canTravelForMentoring: true
    },
    
    availability: {
      isAvailableNow: true,
      weeklyHoursCommitment: 6,
      maxMentees: 4,
      responseTimeCommitment: 'Within 24 hours',
      instantMentoring: {
        enabled: false
      }
    },
    
    professional: {
      currentRole: 'Digital Marketing Manager',
      currentCompany: 'Coastal Marketing Agency',
      industry: 'Marketing',
      experienceLevel: 'Senior (6-10 years)',
      yearsOfExperience: 10,
      achievements: [
        'Increased client ROI by average of 200% through targeted campaigns',
        'Managed marketing budgets exceeding $2M annually',
        'Trained over 50 marketing professionals'
      ]
    },
    
    education: {
      highestDegree: 'Master\'s',
      fieldOfStudy: 'Marketing',
      institution: 'Strathmore Business School',
      graduationYear: 2012
    },
    
    mentoringExperience: {
      hasMentoredBefore: true,
      previousMentoringExperience: 'Mentored marketing professionals and small business owners on digital marketing strategies.',
      numberOfMentees: 15,
      mentoringDuration: '5 years',
      mentoringStyle: 'Directive'
    },
    
    expertise: {
      primarySkills: ['Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Strategy', 'PPC'],
      specializations: ['Digital Marketing', 'Business Strategy', 'Entrepreneurship'],
      careerStages: ['Students', 'Recent Graduates', 'Entrepreneurs']
    },
    
    motivation: {
      whyMentor: 'Digital marketing can transform businesses, especially small ones. I want to democratize access to marketing knowledge and help entrepreneurs grow their ventures.',
      successDefinition: 'When mentees can independently create and execute effective marketing strategies that drive real business results.'
    },
    
    applicationStatus: {
      status: 'Rejected',
      submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      rejectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    }
  }
];

module.exports = sampleMentorApplications; 