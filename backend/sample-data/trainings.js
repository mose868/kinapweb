// Sample training programs data for testing
// This can be used to populate the database with initial data

const sampleTrainings = [
  {
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    description: "Master modern web development from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB through hands-on projects. Build real-world applications and get job-ready skills in just 12 weeks.",
    shortDescription: "Full-stack web development bootcamp covering frontend and backend technologies",
    category: "Web Development",
    level: "Beginner",
    duration: {
      weeks: 12,
      hours: 4,
      totalHours: 120
    },
    schedule: {
      format: "Hybrid",
      days: ["Monday", "Wednesday", "Friday"],
      timeSlot: "6:00 PM - 8:00 PM",
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-24')
    },
    instructor: {
      name: "Moses Kimani",
      bio: "Senior Full-Stack Developer with 8+ years of experience. Former Tech Lead at major startups.",
      email: "moses@ajirakinap.com",
      experience: "8+ years",
      specialization: ["JavaScript", "React", "Node.js", "MongoDB"]
    },
    learningOutcomes: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create dynamic web applications using React",
      "Develop REST APIs with Node.js and Express",
      "Work with databases using MongoDB",
      "Deploy applications to cloud platforms",
      "Use Git for version control"
    ],
    prerequisites: [
      "Basic computer literacy",
      "Willingness to learn",
      "Access to a computer with internet"
    ],
    tools: ["VS Code", "Node.js", "Git", "MongoDB", "Postman", "Figma"],
    certification: {
      provided: true,
      title: "Certified Full-Stack Web Developer",
      validityPeriod: "Lifetime"
    },
    pricing: {
      isFree: false,
      regularPrice: 25000,
      discountPrice: 20000,
      currency: "KES"
    },
    enrollment: {
      capacity: 30,
      enrolled: 24,
      isOpen: true,
      registrationDeadline: new Date('2024-02-20')
    },
    features: [
      "Live coding sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Job placement assistance",
      "Lifetime access to materials",
      "Certificate of completion"
    ],
    tags: ["web development", "javascript", "react", "nodejs", "mongodb", "fullstack"],
    status: "Published",
    isFeatured: true,
    isActive: true,
    statistics: {
      views: 1250,
      inquiries: 45,
      completionRate: 85,
      jobPlacementRate: 78
    },
    ratings: {
      average: 4.8,
      totalRatings: 18,
      breakdown: {
        five: 15,
        four: 2,
        three: 1,
        two: 0,
        one: 0
      }
    },
    reviews: [
      {
        studentName: "Sarah Wanjiku",
        rating: 5,
        comment: "Excellent course! Moses is a great instructor and the curriculum is very practical.",
        date: new Date('2024-01-15'),
        isVerified: true
      },
      {
        studentName: "John Mwangi",
        rating: 5,
        comment: "Got a job as a junior developer within 2 months of completing the course!",
        date: new Date('2024-01-10'),
        isVerified: true
      }
    ]
  },

  {
    title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing course covering SEO, social media marketing, email marketing, content marketing, and paid advertising. Learn to create effective marketing campaigns that drive results.",
    shortDescription: "Master digital marketing strategies and tools for business growth",
    category: "Digital Marketing",
    level: "Intermediate",
    duration: {
      weeks: 8,
      hours: 3,
      totalHours: 60
    },
    schedule: {
      format: "Online",
      days: ["Tuesday", "Thursday"],
      timeSlot: "7:00 PM - 9:30 PM",
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-04-11')
    },
    instructor: {
      name: "Grace Muthoni",
      bio: "Digital Marketing Expert with 6+ years experience. Helped 100+ businesses grow online.",
      email: "grace@ajirakinap.com",
      experience: "6+ years",
      specialization: ["SEO", "Social Media Marketing", "Google Ads", "Content Marketing"]
    },
    learningOutcomes: [
      "Create effective SEO strategies",
      "Manage social media campaigns",
      "Design email marketing funnels",
      "Run profitable Google Ads campaigns",
      "Analyze marketing performance",
      "Build brand awareness online"
    ],
    prerequisites: [
      "Basic understanding of social media",
      "Access to computer and internet",
      "Business or marketing interest"
    ],
    tools: ["Google Analytics", "Google Ads", "Facebook Ads Manager", "Mailchimp", "Canva", "SEMrush"],
    certification: {
      provided: true,
      title: "Certified Digital Marketing Professional",
      validityPeriod: "2 years"
    },
    pricing: {
      isFree: false,
      regularPrice: 18000,
      discountPrice: 15000,
      currency: "KES"
    },
    enrollment: {
      capacity: 25,
      enrolled: 19,
      isOpen: true,
      registrationDeadline: new Date('2024-02-10')
    },
    features: [
      "Live workshops",
      "Real campaign case studies",
      "Marketing tools access",
      "Performance tracking",
      "Industry best practices",
      "Networking opportunities"
    ],
    tags: ["digital marketing", "seo", "social media", "google ads", "email marketing"],
    status: "Published",
    isFeatured: true,
    isActive: true,
    statistics: {
      views: 890,
      inquiries: 32,
      completionRate: 92,
      jobPlacementRate: 65
    },
    ratings: {
      average: 4.6,
      totalRatings: 12,
      breakdown: {
        five: 8,
        four: 3,
        three: 1,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design. Master design tools, create wireframes and prototypes, and understand user psychology to create beautiful and functional digital products.",
    shortDescription: "Learn UI/UX design principles and create stunning user experiences",
    category: "UI/UX Design",
    level: "Beginner",
    duration: {
      weeks: 10,
      hours: 3,
      totalHours: 75
    },
    schedule: {
      format: "In-Person",
      days: ["Saturday"],
      timeSlot: "9:00 AM - 1:00 PM",
      startDate: new Date('2024-02-24'),
      endDate: new Date('2024-05-04')
    },
    instructor: {
      name: "David Kiprotich",
      bio: "Senior UX Designer with 5+ years at top tech companies. Passionate about user-centered design.",
      email: "david@ajirakinap.com",
      experience: "5+ years",
      specialization: ["User Research", "Prototyping", "Figma", "Design Systems"]
    },
    learningOutcomes: [
      "Understand UX design principles",
      "Create wireframes and prototypes",
      "Design beautiful user interfaces",
      "Conduct user research",
      "Use Figma professionally",
      "Build design systems"
    ],
    prerequisites: [
      "Basic computer skills",
      "Interest in design",
      "Creative mindset"
    ],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Miro", "Principle"],
    certification: {
      provided: true,
      title: "Certified UI/UX Designer",
      validityPeriod: "Lifetime"
    },
    pricing: {
      isFree: false,
      regularPrice: 22000,
      discountPrice: 18000,
      currency: "KES"
    },
    enrollment: {
      capacity: 20,
      enrolled: 15,
      isOpen: true,
      registrationDeadline: new Date('2024-02-17')
    },
    features: [
      "Hands-on design projects",
      "Industry mentor feedback",
      "Portfolio development",
      "Design critique sessions",
      "Latest design trends",
      "Job referrals"
    ],
    tags: ["ui design", "ux design", "figma", "prototyping", "user research"],
    status: "Published",
    isFeatured: false,
    isActive: true,
    statistics: {
      views: 650,
      inquiries: 28,
      completionRate: 88,
      jobPlacementRate: 70
    },
    ratings: {
      average: 4.7,
      totalRatings: 8,
      breakdown: {
        five: 6,
        four: 1,
        three: 1,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "Data Science with Python",
    description: "Dive into the world of data science using Python. Learn data analysis, visualization, machine learning, and statistical modeling. Work with real datasets and build predictive models.",
    shortDescription: "Master data science and machine learning with Python",
    category: "Data Science",
    level: "Intermediate",
    duration: {
      weeks: 14,
      hours: 4,
      totalHours: 140
    },
    schedule: {
      format: "Online",
      days: ["Monday", "Wednesday", "Friday"],
      timeSlot: "7:00 PM - 9:00 PM",
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-06-14')
    },
    instructor: {
      name: "Dr. Anne Wairimu",
      bio: "PhD in Data Science. Former ML Engineer at Google. Published researcher in AI/ML.",
      email: "anne@ajirakinap.com",
      experience: "7+ years",
      specialization: ["Machine Learning", "Python", "Statistics", "Deep Learning"]
    },
    learningOutcomes: [
      "Master Python for data science",
      "Perform statistical analysis",
      "Create data visualizations",
      "Build machine learning models",
      "Work with big data",
      "Deploy ML models"
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Mathematics/Statistics background",
      "Python basics (helpful but not required)"
    ],
    tools: ["Python", "Jupyter Notebook", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "TensorFlow"],
    certification: {
      provided: true,
      title: "Certified Data Scientist",
      validityPeriod: "3 years"
    },
    pricing: {
      isFree: false,
      regularPrice: 35000,
      discountPrice: 28000,
      currency: "KES"
    },
    enrollment: {
      capacity: 15,
      enrolled: 8,
      isOpen: true,
      registrationDeadline: new Date('2024-03-05')
    },
    features: [
      "Real-world datasets",
      "Kaggle competitions",
      "Industry case studies",
      "ML model deployment",
      "Research projects",
      "Data science mentorship"
    ],
    tags: ["data science", "python", "machine learning", "statistics", "analytics"],
    status: "Published",
    isFeatured: true,
    isActive: true,
    statistics: {
      views: 420,
      inquiries: 15,
      completionRate: 78,
      jobPlacementRate: 85
    },
    ratings: {
      average: 4.9,
      totalRatings: 5,
      breakdown: {
        five: 5,
        four: 0,
        three: 0,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase. Integrate APIs, handle navigation, and publish to app stores.",
    shortDescription: "Create mobile apps for iOS and Android using React Native",
    category: "Mobile Development",
    level: "Intermediate",
    duration: {
      weeks: 10,
      hours: 4,
      totalHours: 100
    },
    schedule: {
      format: "Hybrid",
      days: ["Tuesday", "Thursday"],
      timeSlot: "6:30 PM - 8:30 PM",
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-06')
    },
    instructor: {
      name: "Peter Njoroge",
      bio: "Mobile Development Lead with 6+ years experience. Built 20+ apps with millions of downloads.",
      email: "peter@ajirakinap.com",
      experience: "6+ years",
      specialization: ["React Native", "iOS Development", "Android Development", "Flutter"]
    },
    learningOutcomes: [
      "Build cross-platform mobile apps",
      "Implement mobile navigation",
      "Integrate REST APIs",
      "Handle device features",
      "Publish to app stores",
      "Optimize app performance"
    ],
    prerequisites: [
      "JavaScript knowledge",
      "React basics",
      "Understanding of mobile platforms"
    ],
    tools: ["React Native", "Expo", "Android Studio", "Xcode", "Firebase", "Redux"],
    certification: {
      provided: true,
      title: "Certified Mobile App Developer",
      validityPeriod: "2 years"
    },
    pricing: {
      isFree: false,
      regularPrice: 28000,
      discountPrice: 23000,
      currency: "KES"
    },
    enrollment: {
      capacity: 18,
      enrolled: 12,
      isOpen: true,
      registrationDeadline: new Date('2024-03-25')
    },
    features: [
      "Real app development",
      "App store publishing",
      "Performance optimization",
      "Cross-platform development",
      "Industry best practices",
      "Portfolio apps"
    ],
    tags: ["mobile development", "react native", "ios", "android", "cross-platform"],
    status: "Published",
    isFeatured: false,
    isActive: true,
    statistics: {
      views: 380,
      inquiries: 18,
      completionRate: 82,
      jobPlacementRate: 75
    },
    ratings: {
      average: 4.5,
      totalRatings: 6,
      breakdown: {
        five: 3,
        four: 3,
        three: 0,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "Introduction to Cybersecurity",
    description: "Learn the fundamentals of cybersecurity and ethical hacking. Understand common threats, security frameworks, and how to protect digital assets. Hands-on labs with real security tools.",
    shortDescription: "Essential cybersecurity skills for protecting digital assets",
    category: "Cybersecurity",
    level: "Beginner",
    duration: {
      weeks: 8,
      hours: 3,
      totalHours: 60
    },
    schedule: {
      format: "Online",
      days: ["Saturday", "Sunday"],
      timeSlot: "2:00 PM - 4:30 PM",
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-05-05')
    },
    instructor: {
      name: "Catherine Akinyi",
      bio: "Cybersecurity Analyst with 5+ years experience. CISSP certified security professional.",
      email: "catherine@ajirakinap.com",
      experience: "5+ years",
      specialization: ["Network Security", "Ethical Hacking", "Incident Response", "Security Auditing"]
    },
    learningOutcomes: [
      "Understand cybersecurity fundamentals",
      "Identify common security threats",
      "Implement security best practices",
      "Use security testing tools",
      "Respond to security incidents",
      "Conduct security assessments"
    ],
    prerequisites: [
      "Basic IT knowledge",
      "Understanding of networks",
      "Interest in security"
    ],
    tools: ["Kali Linux", "Wireshark", "Nmap", "Metasploit", "Burp Suite", "OWASP ZAP"],
    certification: {
      provided: true,
      title: "Certified Cybersecurity Specialist",
      validityPeriod: "2 years"
    },
    pricing: {
      isFree: false,
      regularPrice: 20000,
      discountPrice: 16000,
      currency: "KES"
    },
    enrollment: {
      capacity: 22,
      enrolled: 16,
      isOpen: true,
      registrationDeadline: new Date('2024-03-03')
    },
    features: [
      "Hands-on labs",
      "Real threat simulations",
      "Security tools training",
      "Industry case studies",
      "Ethical hacking practice",
      "Security certifications prep"
    ],
    tags: ["cybersecurity", "ethical hacking", "network security", "penetration testing"],
    status: "Published",
    isFeatured: false,
    isActive: true,
    statistics: {
      views: 520,
      inquiries: 22,
      completionRate: 90,
      jobPlacementRate: 68
    },
    ratings: {
      average: 4.4,
      totalRatings: 9,
      breakdown: {
        five: 5,
        four: 3,
        three: 1,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "Content Writing and Copywriting Mastery",
    description: "Master the art of persuasive writing for digital platforms. Learn to create compelling content for websites, blogs, social media, and marketing campaigns that converts readers into customers.",
    shortDescription: "Learn to write compelling content that converts and engages audiences",
    category: "Content Writing",
    level: "Beginner",
    duration: {
      weeks: 6,
      hours: 2,
      totalHours: 36
    },
    schedule: {
      format: "Online",
      days: ["Wednesday", "Saturday"],
      timeSlot: "5:00 PM - 7:00 PM",
      startDate: new Date('2024-02-28'),
      endDate: new Date('2024-04-10')
    },
    instructor: {
      name: "Lucy Muthoni",
      bio: "Professional copywriter and content strategist. 4+ years creating content for top brands.",
      email: "lucy@ajirakinap.com",
      experience: "4+ years",
      specialization: ["Copywriting", "Content Strategy", "SEO Writing", "Social Media Content"]
    },
    learningOutcomes: [
      "Write persuasive copy",
      "Create engaging blog content",
      "Develop content strategies",
      "Optimize content for SEO",
      "Write for different platforms",
      "Build a writing portfolio"
    ],
    prerequisites: [
      "Good command of English",
      "Basic computer skills",
      "Interest in writing"
    ],
    tools: ["Google Docs", "Grammarly", "Hemingway Editor", "Canva", "WordPress", "Buffer"],
    certification: {
      provided: true,
      title: "Certified Content Writer",
      validityPeriod: "Lifetime"
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: "KES"
    },
    enrollment: {
      capacity: 40,
      enrolled: 35,
      isOpen: true,
      registrationDeadline: new Date('2024-02-25')
    },
    features: [
      "Writing exercises",
      "Portfolio development",
      "Client acquisition tips",
      "Freelancing guidance",
      "Writing samples library",
      "Peer feedback sessions"
    ],
    tags: ["content writing", "copywriting", "seo writing", "freelancing", "blogging"],
    status: "Published",
    isFeatured: false,
    isActive: true,
    statistics: {
      views: 780,
      inquiries: 45,
      completionRate: 94,
      jobPlacementRate: 60
    },
    ratings: {
      average: 4.3,
      totalRatings: 15,
      breakdown: {
        five: 8,
        four: 5,
        three: 2,
        two: 0,
        one: 0
      }
    }
  },

  {
    title: "Project Management Fundamentals",
    description: "Learn essential project management skills and methodologies. Master Agile, Scrum, and traditional project management approaches. Prepare for PMP certification with practical experience.",
    shortDescription: "Master project management methodologies and lead successful projects",
    category: "Project Management",
    level: "All Levels",
    duration: {
      weeks: 8,
      hours: 3,
      totalHours: 60
    },
    schedule: {
      format: "Hybrid",
      days: ["Monday", "Thursday"],
      timeSlot: "6:00 PM - 8:30 PM",
      startDate: new Date('2024-04-08'),
      endDate: new Date('2024-06-03')
    },
    instructor: {
      name: "Robert Kiprotich",
      bio: "PMP certified project manager with 10+ years experience leading tech projects.",
      email: "robert@ajirakinap.com",
      experience: "10+ years",
      specialization: ["Agile", "Scrum", "Risk Management", "Team Leadership"]
    },
    learningOutcomes: [
      "Apply project management frameworks",
      "Lead cross-functional teams",
      "Manage project risks and budgets",
      "Use project management tools",
      "Implement Agile methodologies",
      "Prepare for PMP certification"
    ],
    prerequisites: [
      "Basic business understanding",
      "Leadership interest",
      "Team collaboration skills"
    ],
    tools: ["Microsoft Project", "Jira", "Trello", "Asana", "Slack", "Gantt Charts"],
    certification: {
      provided: true,
      title: "Certified Project Management Professional",
      validityPeriod: "3 years"
    },
    pricing: {
      isFree: false,
      regularPrice: 24000,
      discountPrice: 20000,
      currency: "KES"
    },
    enrollment: {
      capacity: 25,
      enrolled: 14,
      isOpen: true,
      registrationDeadline: new Date('2024-04-01')
    },
    features: [
      "Real project simulations",
      "PMP exam preparation",
      "Industry case studies",
      "Leadership training",
      "Agile certification prep",
      "Career advancement guidance"
    ],
    tags: ["project management", "agile", "scrum", "pmp", "leadership"],
    status: "Coming Soon",
    isFeatured: false,
    isActive: true,
    statistics: {
      views: 290,
      inquiries: 12,
      completionRate: 0,
      jobPlacementRate: 0
    },
    ratings: {
      average: 0,
      totalRatings: 0,
      breakdown: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0
      }
    }
  }
];

module.exports = sampleTrainings; 