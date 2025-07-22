// Sample mentorship data for testing the Uber-like mentor matching system

const sampleMentorships = [
  {
    title: "Senior React Developer Mentorship",
    description: "Get personalized guidance from a senior React developer with 8+ years of experience. I specialize in modern React patterns, state management, performance optimization, and building scalable applications. Perfect for developers looking to advance their React skills or transition to senior roles.",
    shortDescription: "Expert React mentorship for developers looking to advance their skills",
    category: "Web Development",
    expertiseLevel: "Senior",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Sarah Wanjiku",
      email: "sarah.wanjiku@ajirakinap.com",
      phone: "+254 712 345 678",
      bio: "Senior Frontend Developer at Safaricom with 8+ years of experience building large-scale React applications. Previously worked at Andela and iHub. Passionate about mentoring the next generation of African developers.",
      title: "Senior Frontend Developer",
      company: "Safaricom PLC",
      experience: "8+ years",
      linkedinProfile: "https://linkedin.com/in/sarah-wanjiku",
      githubProfile: "https://github.com/sarah-wanjiku",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 1 hour",
      weeklyHours: 10,
      maxMentees: 8,
      currentMentees: 5
    },
    pricing: {
      isFree: false,
      sessionRate: 3500,
      hourlyRate: 4000,
      currency: "KES"
    },
    skills: ["React", "JavaScript", "TypeScript", "Redux", "Next.js", "Node.js", "GraphQL", "Testing"],
    specializations: ["React Performance", "State Management", "Frontend Architecture", "Code Review"],
    mentorshipFocus: ["Career Growth", "Technical Skills", "Code Quality", "Interview Preparation"],
    targetAudience: ["Mid-level Developers", "React Beginners", "Career Changers"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 2,
      currentInstantSessions: 0
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: true
    },
    verification: {
      isVerified: true,
      badgeLevel: "Gold"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: true,
    statistics: {
      totalSessions: 145,
      totalMentees: 32,
      averageSessionRating: 4.8,
      responseRate: 95,
      completionRate: 88,
      profileViews: 1250
    },
    ratings: {
      overall: 4.8,
      communication: 4.9,
      expertise: 4.8,
      helpfulness: 4.7,
      totalRatings: 28,
      breakdown: { five: 22, four: 5, three: 1, two: 0, one: 0 }
    },
    reviews: [
      {
        menteeName: "John Mwangi",
        rating: { overall: 5, communication: 5, expertise: 5, helpfulness: 5 },
        comment: "Sarah helped me land my first React job! Her guidance on modern patterns and interview prep was invaluable.",
        sessionType: "Career Guidance",
        isVerified: true
      },
      {
        menteeName: "Grace Achieng",
        rating: { overall: 5, communication: 5, expertise: 4, helpfulness: 5 },
        comment: "Excellent React mentor. Explained complex concepts clearly and provided great code review feedback.",
        sessionType: "Code Review",
        isVerified: true
      }
    ]
  },

  {
    title: "Full-Stack JavaScript Mentorship",
    description: "Comprehensive mentorship covering both frontend and backend JavaScript development. I help developers master the complete JavaScript ecosystem including React, Node.js, databases, and deployment. Perfect for building end-to-end applications.",
    shortDescription: "Complete JavaScript stack mentorship from frontend to backend",
    category: "Web Development",
    expertiseLevel: "Expert",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "David Kiprotich",
      email: "david.kiprotich@ajirakinap.com",
      phone: "+254 722 123 456",
      bio: "Full-stack engineer with 10+ years experience. Built and scaled multiple startups from MVP to IPO. Expert in JavaScript, React, Node.js, and cloud architecture. Currently CTO at a fintech startup.",
      title: "CTO & Full-Stack Engineer",
      company: "KenyaTech Fintech",
      experience: "10+ years",
      linkedinProfile: "https://linkedin.com/in/david-kiprotich",
      githubProfile: "https://github.com/david-kiprotich",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 4 hours",
      weeklyHours: 8,
      maxMentees: 6,
      currentMentees: 4
    },
    pricing: {
      isFree: false,
      sessionRate: 5000,
      hourlyRate: 6000,
      currency: "KES"
    },
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "PostgreSQL", "AWS", "Docker", "Microservices"],
    specializations: ["System Architecture", "Database Design", "API Development", "Cloud Deployment"],
    mentorshipFocus: ["Technical Leadership", "System Design", "Startup Development", "Team Building"],
    targetAudience: ["Senior Developers", "Team Leads", "Startup Founders"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 1,
      currentInstantSessions: 0
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: true
    },
    verification: {
      isVerified: true,
      badgeLevel: "Platinum"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: true,
    statistics: {
      totalSessions: 89,
      totalMentees: 24,
      averageSessionRating: 4.9,
      responseRate: 92,
      completionRate: 95,
      profileViews: 890
    },
    ratings: {
      overall: 4.9,
      communication: 4.8,
      expertise: 5.0,
      helpfulness: 4.9,
      totalRatings: 18,
      breakdown: { five: 16, four: 2, three: 0, two: 0, one: 0 }
    }
  },

  {
    title: "UI/UX Design Mentorship for Beginners",
    description: "Learn the fundamentals of UI/UX design from a practicing designer with experience at top tech companies. I'll guide you through design thinking, user research, prototyping, and building a strong portfolio. Perfect for career changers and beginners.",
    shortDescription: "Beginner-friendly UI/UX design mentorship with portfolio building",
    category: "UI/UX Design",
    expertiseLevel: "Mid-Level",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Alice Mutindi",
      email: "alice.mutindi@ajirakinap.com",
      phone: "+254 733 987 654",
      bio: "UX Designer with 5 years of experience at international design agencies. Specialized in user research, interaction design, and design systems. Passionate about inclusive design and mentoring new designers.",
      title: "Senior UX Designer",
      company: "Design Studio Kenya",
      experience: "5+ years",
      linkedinProfile: "https://linkedin.com/in/alice-mutindi",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 24 hours",
      weeklyHours: 6,
      maxMentees: 10,
      currentMentees: 7
    },
    pricing: {
      isFree: false,
      sessionRate: 2500,
      hourlyRate: 3000,
      currency: "KES"
    },
    skills: ["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    specializations: ["User Research", "Prototyping", "Design Systems", "Mobile Design"],
    mentorshipFocus: ["Portfolio Building", "Design Process", "Career Transition", "Skill Development"],
    targetAudience: ["Design Beginners", "Career Changers", "Students"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 3,
      currentInstantSessions: 1
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: true,
      badgeLevel: "Silver"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 67,
      totalMentees: 19,
      averageSessionRating: 4.6,
      responseRate: 88,
      completionRate: 82,
      profileViews: 445
    },
    ratings: {
      overall: 4.6,
      communication: 4.7,
      expertise: 4.5,
      helpfulness: 4.8,
      totalRatings: 15,
      breakdown: { five: 9, four: 5, three: 1, two: 0, one: 0 }
    }
  },

  {
    title: "Digital Marketing Strategy Mentorship",
    description: "Learn effective digital marketing strategies from a marketing professional with experience growing multiple businesses. Covering SEO, social media, content marketing, paid advertising, and analytics. Perfect for entrepreneurs and marketing professionals.",
    shortDescription: "Master digital marketing strategies and grow your online presence",
    category: "Digital Marketing",
    expertiseLevel: "Senior",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Grace Muthoni",
      email: "grace.muthoni@ajirakinap.com",
      phone: "+254 744 567 890",
      bio: "Digital Marketing Manager with 7+ years experience. Helped 50+ businesses increase their online revenue by 300% on average. Expert in data-driven marketing strategies and conversion optimization.",
      title: "Digital Marketing Manager",
      company: "Marketing Solutions Kenya",
      experience: "7+ years",
      linkedinProfile: "https://linkedin.com/in/grace-muthoni",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Busy",
      responseTime: "Within 4 hours",
      weeklyHours: 5,
      maxMentees: 5,
      currentMentees: 4
    },
    pricing: {
      isFree: false,
      sessionRate: 3000,
      hourlyRate: 3500,
      currency: "KES"
    },
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Email Marketing", "Analytics", "Social Media"],
    specializations: ["Paid Advertising", "Conversion Optimization", "Marketing Analytics", "Content Strategy"],
    mentorshipFocus: ["Business Growth", "Marketing Strategy", "ROI Optimization", "Brand Building"],
    targetAudience: ["Entrepreneurs", "Small Business Owners", "Marketing Professionals"],
    instantAvailability: {
      enabled: false,
      maxInstantRequests: 0,
      currentInstantSessions: 0
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: true,
      badgeLevel: "Gold"
    },
    settings: {
      instantNotifications: false,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 98,
      totalMentees: 26,
      averageSessionRating: 4.7,
      responseRate: 90,
      completionRate: 85,
      profileViews: 678
    },
    ratings: {
      overall: 4.7,
      communication: 4.8,
      expertise: 4.6,
      helpfulness: 4.7,
      totalRatings: 22,
      breakdown: { five: 15, four: 6, three: 1, two: 0, one: 0 }
    }
  },

  {
    title: "Python & Data Science Mentorship",
    description: "Comprehensive mentorship in Python programming and data science. From basics to advanced machine learning, I'll help you build practical skills for data analysis, visualization, and building ML models. Perfect for beginners and career switchers.",
    shortDescription: "Learn Python and data science from basics to machine learning",
    category: "Data Science",
    expertiseLevel: "Expert",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Dr. James Ochieng",
      email: "james.ochieng@ajirakinap.com",
      phone: "+254 755 432 109",
      bio: "Data Scientist with PhD in Computer Science and 6+ years in industry. Previously at Google and Microsoft. Expert in machine learning, deep learning, and big data analytics. Published researcher with 20+ papers.",
      title: "Senior Data Scientist",
      company: "KenData Analytics",
      experience: "6+ years",
      linkedinProfile: "https://linkedin.com/in/james-ochieng",
      githubProfile: "https://github.com/james-ochieng",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 1 hour",
      weeklyHours: 12,
      maxMentees: 8,
      currentMentees: 3
    },
    pricing: {
      isFree: false,
      sessionRate: 4500,
      hourlyRate: 5500,
      currency: "KES"
    },
    skills: ["Python", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "SQL"],
    specializations: ["Machine Learning", "Data Visualization", "Statistical Analysis", "Big Data"],
    mentorshipFocus: ["Technical Skills", "Research Methods", "Career Transition", "Project Development"],
    targetAudience: ["Data Science Beginners", "Python Learners", "Graduate Students"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 2,
      currentInstantSessions: 0
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: true
    },
    verification: {
      isVerified: true,
      badgeLevel: "Platinum"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: true,
    statistics: {
      totalSessions: 76,
      totalMentees: 18,
      averageSessionRating: 4.9,
      responseRate: 98,
      completionRate: 92,
      profileViews: 567
    },
    ratings: {
      overall: 4.9,
      communication: 4.8,
      expertise: 5.0,
      helpfulness: 4.9,
      totalRatings: 14,
      breakdown: { five: 13, four: 1, three: 0, two: 0, one: 0 }
    }
  },

  {
    title: "Career Development & Interview Coaching",
    description: "Professional career coaching and interview preparation for tech roles. I'll help you build a strong resume, practice technical interviews, negotiate offers, and plan your career growth. Perfect for job seekers and career changers.",
    shortDescription: "Professional career coaching and technical interview preparation",
    category: "Career Development",
    expertiseLevel: "Senior",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Michael Otieno",
      email: "michael.otieno@ajirakinap.com",
      phone: "+254 766 123 789",
      bio: "Senior Engineering Manager with 12+ years in tech. Hired 100+ engineers at companies like Jumia and Flutterwave. Expert in career development, interview coaching, and technical leadership.",
      title: "Senior Engineering Manager",
      company: "Flutterwave",
      experience: "12+ years",
      linkedinProfile: "https://linkedin.com/in/michael-otieno",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 24 hours",
      weeklyHours: 4,
      maxMentees: 6,
      currentMentees: 5
    },
    pricing: {
      isFree: false,
      sessionRate: 4000,
      hourlyRate: 4500,
      currency: "KES"
    },
    skills: ["Interview Coaching", "Resume Review", "Career Planning", "Leadership", "Technical Interviews", "Salary Negotiation"],
    specializations: ["Technical Interviews", "Career Strategy", "Leadership Development", "Offer Negotiation"],
    mentorshipFocus: ["Job Search", "Career Growth", "Interview Skills", "Professional Development"],
    targetAudience: ["Job Seekers", "Mid-level Engineers", "Career Changers"],
    instantAvailability: {
      enabled: false,
      maxInstantRequests: 0,
      currentInstantSessions: 0
    },
    location: {
      city: "Lagos",
      country: "Nigeria",
      coordinates: { latitude: 6.5244, longitude: 3.3792 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: true,
      badgeLevel: "Gold"
    },
    settings: {
      instantNotifications: false,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 156,
      totalMentees: 42,
      averageSessionRating: 4.8,
      responseRate: 85,
      completionRate: 89,
      profileViews: 892
    },
    ratings: {
      overall: 4.8,
      communication: 4.9,
      expertise: 4.7,
      helpfulness: 4.8,
      totalRatings: 35,
      breakdown: { five: 28, four: 6, three: 1, two: 0, one: 0 }
    }
  },

  {
    title: "Mobile App Development with Flutter",
    description: "Learn cross-platform mobile development with Flutter and Dart. From building your first app to publishing on app stores, I'll guide you through the complete mobile development journey. Perfect for web developers transitioning to mobile.",
    shortDescription: "Master Flutter for cross-platform mobile app development",
    category: "Mobile Development",
    expertiseLevel: "Mid-Level",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Catherine Njeri",
      email: "catherine.njeri@ajirakinap.com",
      phone: "+254 777 654 321",
      bio: "Mobile Developer with 4+ years experience building Flutter apps for startups and enterprises. Published 8 apps on Google Play and App Store with 500K+ downloads combined.",
      title: "Senior Mobile Developer",
      company: "MobiTech Solutions",
      experience: "4+ years",
      linkedinProfile: "https://linkedin.com/in/catherine-njeri",
      githubProfile: "https://github.com/catherine-njeri",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 4 hours",
      weeklyHours: 8,
      maxMentees: 6,
      currentMentees: 2
    },
    pricing: {
      isFree: false,
      sessionRate: 3000,
      hourlyRate: 3500,
      currency: "KES"
    },
    skills: ["Flutter", "Dart", "Firebase", "REST APIs", "State Management", "App Store Publishing", "UI/UX"],
    specializations: ["Flutter Development", "State Management", "App Publishing", "Performance Optimization"],
    mentorshipFocus: ["Technical Skills", "Project Development", "App Store Success", "Best Practices"],
    targetAudience: ["Flutter Beginners", "Web Developers", "Mobile Enthusiasts"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 2,
      currentInstantSessions: 0
    },
    location: {
      city: "Mombasa",
      country: "Kenya",
      coordinates: { latitude: -4.0435, longitude: 39.6682 },
      isLocationEnabled: true
    },
    verification: {
      isVerified: false,
      badgeLevel: "Bronze"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 34,
      totalMentees: 12,
      averageSessionRating: 4.5,
      responseRate: 92,
      completionRate: 78,
      profileViews: 234
    },
    ratings: {
      overall: 4.5,
      communication: 4.6,
      expertise: 4.4,
      helpfulness: 4.5,
      totalRatings: 8,
      breakdown: { five: 4, four: 3, three: 1, two: 0, one: 0 }
    }
  },

  {
    title: "Freelancing & Business Development",
    description: "Learn how to build a successful freelancing career or consultancy business. From finding clients to pricing services and scaling your business, I'll share strategies that helped me build a 6-figure freelancing business.",
    shortDescription: "Build a successful freelancing career and grow your business",
    category: "Entrepreneurship",
    expertiseLevel: "Senior",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Peter Kamau",
      email: "peter.kamau@ajirakinap.com",
      phone: "+254 788 901 234",
      bio: "Successful freelancer and business consultant with 9+ years experience. Built a 6-figure freelancing business and now helps others achieve financial freedom through freelancing and consulting.",
      title: "Freelance Consultant & Mentor",
      company: "PK Business Solutions",
      experience: "9+ years",
      linkedinProfile: "https://linkedin.com/in/peter-kamau",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 24 hours",
      weeklyHours: 6,
      maxMentees: 8,
      currentMentees: 6
    },
    pricing: {
      isFree: true,
      sessionRate: 0,
      hourlyRate: 0,
      currency: "KES"
    },
    skills: ["Business Development", "Client Acquisition", "Pricing Strategy", "Project Management", "Marketing", "Negotiation"],
    specializations: ["Freelancing Strategy", "Client Relations", "Business Scaling", "Revenue Optimization"],
    mentorshipFocus: ["Business Skills", "Financial Freedom", "Client Success", "Scaling Strategies"],
    targetAudience: ["Aspiring Freelancers", "Small Business Owners", "Consultants"],
    instantAvailability: {
      enabled: false,
      maxInstantRequests: 0,
      currentInstantSessions: 0
    },
    location: {
      city: "Kisumu",
      country: "Kenya",
      coordinates: { latitude: -0.0917, longitude: 34.7680 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: true,
      badgeLevel: "Silver"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 112,
      totalMentees: 38,
      averageSessionRating: 4.6,
      responseRate: 80,
      completionRate: 84,
      profileViews: 445
    },
    ratings: {
      overall: 4.6,
      communication: 4.7,
      expertise: 4.5,
      helpfulness: 4.8,
      totalRatings: 25,
      breakdown: { five: 16, four: 7, three: 2, two: 0, one: 0 }
    }
  },

  {
    title: "Cybersecurity Fundamentals & Ethical Hacking",
    description: "Learn cybersecurity basics and ethical hacking techniques from a certified security professional. Covering network security, penetration testing, security frameworks, and career paths in cybersecurity.",
    shortDescription: "Master cybersecurity fundamentals and ethical hacking techniques",
    category: "Cybersecurity",
    expertiseLevel: "Expert",
    mentorshipType: "One-on-One",
    sessionFormat: "Video Call",
    mentor: {
      name: "Alex Mwangi",
      email: "alex.mwangi@ajirakinap.com",
      phone: "+254 799 876 543",
      bio: "Cybersecurity Analyst with CISSP and CEH certifications. 7+ years protecting organizations from cyber threats. Expert in penetration testing, incident response, and security architecture.",
      title: "Senior Cybersecurity Analyst",
      company: "SecureNet Kenya",
      experience: "7+ years",
      linkedinProfile: "https://linkedin.com/in/alex-mwangi",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: false,
      status: "Away",
      responseTime: "Within 48 hours",
      weeklyHours: 3,
      maxMentees: 4,
      currentMentees: 4
    },
    pricing: {
      isFree: false,
      sessionRate: 5500,
      hourlyRate: 6500,
      currency: "KES"
    },
    skills: ["Penetration Testing", "Network Security", "Incident Response", "Security Frameworks", "Ethical Hacking", "SIEM"],
    specializations: ["Penetration Testing", "Security Architecture", "Threat Analysis", "Compliance"],
    mentorshipFocus: ["Technical Skills", "Certification Prep", "Career Development", "Security Best Practices"],
    targetAudience: ["Security Beginners", "IT Professionals", "Career Changers"],
    instantAvailability: {
      enabled: false,
      maxInstantRequests: 0,
      currentInstantSessions: 0
    },
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: true,
      badgeLevel: "Platinum"
    },
    settings: {
      instantNotifications: false,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 45,
      totalMentees: 15,
      averageSessionRating: 4.8,
      responseRate: 75,
      completionRate: 90,
      profileViews: 289
    },
    ratings: {
      overall: 4.8,
      communication: 4.6,
      expertise: 5.0,
      helpfulness: 4.7,
      totalRatings: 12,
      breakdown: { five: 9, four: 3, three: 0, two: 0, one: 0 }
    }
  },

  {
    title: "Content Creation & Social Media Strategy",
    description: "Learn to create engaging content and build a strong social media presence. From content planning to audience growth and monetization strategies. Perfect for creators, marketers, and business owners.",
    shortDescription: "Master content creation and social media marketing strategies",
    category: "Content Creation",
    expertiseLevel: "Mid-Level",
    mentorshipType: "Group",
    sessionFormat: "Video Call",
    mentor: {
      name: "Diana Wanjala",
      email: "diana.wanjala@ajirakinap.com",
      phone: "+254 711 456 789",
      bio: "Content Creator and Social Media Strategist with 5+ years experience. Grew my personal brand to 100K+ followers and helped 30+ businesses increase their social media engagement by 400%.",
      title: "Content Creator & Social Media Manager",
      company: "CreativeHub Kenya",
      experience: "5+ years",
      linkedinProfile: "https://linkedin.com/in/diana-wanjala",
      timezone: "Africa/Nairobi"
    },
    availability: {
      isAvailable: true,
      status: "Available",
      responseTime: "Within 4 hours",
      weeklyHours: 10,
      maxMentees: 15,
      currentMentees: 8
    },
    pricing: {
      isFree: false,
      sessionRate: 2000,
      hourlyRate: 2500,
      currency: "KES"
    },
    skills: ["Content Creation", "Social Media Marketing", "Photography", "Video Editing", "Brand Building", "Analytics"],
    specializations: ["Content Strategy", "Audience Growth", "Brand Development", "Influencer Marketing"],
    mentorshipFocus: ["Creative Skills", "Business Growth", "Personal Branding", "Monetization"],
    targetAudience: ["Content Creators", "Small Business Owners", "Marketing Professionals"],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 3,
      currentInstantSessions: 1
    },
    location: {
      city: "Eldoret",
      country: "Kenya",
      coordinates: { latitude: 0.5143, longitude: 35.2698 },
      isLocationEnabled: false
    },
    verification: {
      isVerified: false,
      badgeLevel: "Bronze"
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      publicProfile: true,
      searchable: true
    },
    status: "Active",
    isFeatured: false,
    statistics: {
      totalSessions: 78,
      totalMentees: 28,
      averageSessionRating: 4.4,
      responseRate: 88,
      completionRate: 76,
      profileViews: 356
    },
    ratings: {
      overall: 4.4,
      communication: 4.5,
      expertise: 4.3,
      helpfulness: 4.5,
      totalRatings: 18,
      breakdown: { five: 8, four: 8, three: 2, two: 0, one: 0 }
    }
  }
];

module.exports = sampleMentorships; 