// Sample events data for testing the events management system

const sampleEvents = [
  {
    title: "React Native Workshop: Build Your First Mobile App",
    description: "Learn to build cross-platform mobile applications using React Native. This hands-on workshop will take you from setup to deployment, covering navigation, state management, API integration, and publishing to app stores. Perfect for web developers looking to transition to mobile development.",
    shortDescription: "Hands-on React Native workshop for building cross-platform mobile apps",
    category: "Workshop",
    eventType: "Hybrid",
    format: "Paid",
    schedule: {
      startDate: new Date('2024-02-15T09:00:00Z'),
      endDate: new Date('2024-02-15T17:00:00Z'),
      startTime: "09:00",
      endTime: "17:00",
      timezone: "Africa/Nairobi",
      duration: 480,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "iHub Nairobi",
      address: "Senteu Plaza, Galana Road, Kilimani",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2884, longitude: 36.7870 },
      virtualPlatform: "Zoom",
      meetingLink: "https://zoom.us/j/react-native-workshop",
      directions: "Take Matatu to Kilimani, alight at Galana Road"
    },
    organizer: {
      name: "Tech Community Kenya",
      email: "events@techcommunityke.org",
      phone: "+254 712 345 678",
      organization: "Tech Community Kenya",
      bio: "Leading technology community in Kenya fostering innovation and skill development",
      website: "https://techcommunityke.org"
    },
    speakers: [
      {
        name: "Sarah Wanjiku",
        title: "Senior Mobile Developer",
        company: "Safaricom PLC",
        bio: "Mobile development expert with 6+ years experience in React Native and Flutter",
        profileImage: "",
        expertise: ["React Native", "Mobile Development", "UI/UX"],
        socialLinks: {
          linkedin: "https://linkedin.com/in/sarah-wanjiku",
          twitter: "https://twitter.com/sarah_mobile_dev"
        },
        sessionTitle: "React Native Fundamentals",
        sessionDescription: "Introduction to React Native components and navigation",
        sessionTime: "09:00 - 12:00"
      },
      {
        name: "David Kiprotich",
        title: "Full-Stack Developer",
        company: "Flutterwave",
        bio: "Expert in mobile app deployment and performance optimization",
        profileImage: "",
        expertise: ["React Native", "DevOps", "App Store Deployment"],
        socialLinks: {
          linkedin: "https://linkedin.com/in/david-kiprotich"
        },
        sessionTitle: "App Deployment & Performance",
        sessionDescription: "Publishing to app stores and optimizing performance",
        sessionTime: "14:00 - 17:00"
      }
    ],
    registration: {
      isRequired: true,
      capacity: 40,
      registered: 35,
      waitlistEnabled: true,
      waitlistCount: 5,
      registrationDeadline: new Date('2024-02-14T23:59:59Z'),
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: false,
      regularPrice: 5000,
      earlyBirdPrice: 4000,
      studentPrice: 3000,
      currency: "KES",
      earlyBirdDeadline: new Date('2024-02-10T23:59:59Z'),
      refundPolicy: "Full refund available 7 days before event",
      paymentMethods: ["M-Pesa", "Bank Transfer", "Card"]
    },
    agenda: [
      { time: "09:00", activity: "Registration & Welcome Coffee", speaker: "", duration: 30 },
      { time: "09:30", activity: "React Native Fundamentals", speaker: "Sarah Wanjiku", duration: 150 },
      { time: "12:00", activity: "Lunch Break", speaker: "", duration: 60 },
      { time: "13:00", activity: "Building Your First App", speaker: "Sarah Wanjiku", duration: 60 },
      { time: "14:00", activity: "App Deployment & Performance", speaker: "David Kiprotich", duration: 180 },
      { time: "17:00", activity: "Q&A and Networking", speaker: "Both Speakers", duration: 30 }
    ],
    prerequisites: ["Basic JavaScript knowledge", "React.js fundamentals", "Laptop with Node.js installed"],
    requirements: ["Laptop", "Android/iOS device for testing", "Stable internet connection"],
    whatToExpected: ["Build a complete mobile app", "Learn React Native best practices", "Understand app deployment process", "Networking with mobile developers"],
    targetAudience: ["Web Developers", "React Developers", "Mobile Development Beginners"],
    learningOutcomes: ["Create React Native apps", "Navigate between screens", "Integrate APIs", "Deploy to app stores"],
    materials: ["Workshop slides", "Code samples", "Deployment checklist", "Resource links"],
    socialFeatures: {
      allowNetworking: true,
      chatEnabled: true,
      qnaEnabled: true,
      pollsEnabled: true,
      certificateProvided: true
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: true,
    tags: ["react-native", "mobile-development", "javascript", "workshop", "hands-on"],
    analytics: {
      views: 850,
      registrations: 35,
      attendees: 0,
      socialShares: 42
    },
    ratings: {
      overall: 4.8,
      content: 4.9,
      speakers: 4.7,
      organization: 4.8,
      value: 4.6,
      totalRatings: 23,
      breakdown: { five: 18, four: 4, three: 1, two: 0, one: 0 }
    }
  },

  {
    title: "AI & Machine Learning Career Fair 2024",
    description: "Connect with leading tech companies hiring AI/ML professionals in Kenya. This career fair features 30+ companies, technical interviews, portfolio reviews, and career guidance sessions. Whether you're a student, recent graduate, or experienced professional, discover opportunities in the rapidly growing AI sector.",
    shortDescription: "Career fair connecting AI/ML professionals with top tech companies",
    category: "Career Fair",
    eventType: "In-Person",
    format: "Free",
    schedule: {
      startDate: new Date('2024-02-22T08:00:00Z'),
      endDate: new Date('2024-02-22T18:00:00Z'),
      startTime: "08:00",
      endTime: "18:00",
      timezone: "Africa/Nairobi",
      duration: 600,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "Kenyatta International Convention Centre (KICC)",
      address: "Harambee Avenue, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2885, longitude: 36.8215 },
      directions: "CBD, walking distance from Kencom stage",
      parkingInfo: "Paid parking available at KICC grounds"
    },
    organizer: {
      name: "AI Kenya",
      email: "careers@aikenya.org",
      phone: "+254 722 456 789",
      organization: "AI Kenya",
      bio: "Premier AI and Machine Learning community in Kenya",
      website: "https://aikenya.org"
    },
    speakers: [
      {
        name: "Dr. Mercy Nyawira",
        title: "AI Research Scientist",
        company: "Google AI",
        bio: "Leading AI research scientist focused on NLP and computer vision applications",
        expertise: ["Machine Learning", "AI Research", "Data Science"],
        sessionTitle: "Career Paths in AI",
        sessionTime: "10:00 - 11:00"
      }
    ],
    registration: {
      isRequired: true,
      capacity: 500,
      registered: 387,
      waitlistEnabled: true,
      waitlistCount: 12,
      registrationDeadline: new Date('2024-02-21T23:59:59Z'),
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: "KES"
    },
    agenda: [
      { time: "08:00", activity: "Registration & Welcome", duration: 60 },
      { time: "09:00", activity: "Opening Keynote", speaker: "Dr. Mercy Nyawira", duration: 60 },
      { time: "10:00", activity: "Company Exhibitions Open", duration: 480 },
      { time: "12:00", activity: "Networking Lunch", duration: 60 },
      { time: "14:00", activity: "Technical Interview Sessions", duration: 240 },
      { time: "17:00", activity: "Closing & Prize Draws", duration: 60 }
    ],
    targetAudience: ["AI/ML Students", "Data Scientists", "Software Engineers", "Recent Graduates"],
    whatToExpected: ["Meet 30+ hiring companies", "On-spot interviews", "Portfolio reviews", "Career guidance", "Networking opportunities"],
    requirements: ["CV/Resume", "Portfolio (optional)", "Professional attire"],
    status: "Registration Open",
    isPublished: true,
    isFeatured: true,
    tags: ["career-fair", "ai", "machine-learning", "jobs", "networking"],
    analytics: {
      views: 1250,
      registrations: 387,
      attendees: 0,
      socialShares: 89
    }
  },

  {
    title: "Python for Data Science Bootcamp",
    description: "Intensive 3-day bootcamp covering Python programming for data science. Learn pandas, numpy, matplotlib, scikit-learn, and build real-world projects. Includes hands-on exercises with real datasets and capstone project. Perfect for beginners looking to start a career in data science.",
    shortDescription: "3-day intensive Python bootcamp for aspiring data scientists",
    category: "Training",
    eventType: "Hybrid",
    format: "Paid",
    schedule: {
      startDate: new Date('2024-03-01T09:00:00Z'),
      endDate: new Date('2024-03-03T17:00:00Z'),
      startTime: "09:00",
      endTime: "17:00",
      timezone: "Africa/Nairobi",
      duration: 1440,
      isAllDay: false,
      isMultiDay: true
    },
    location: {
      venue: "University of Nairobi Science Campus",
      address: "Chiromo Road, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2687, longitude: 36.8089 },
      virtualPlatform: "Zoom + Google Colab",
      meetingLink: "https://zoom.us/j/python-bootcamp"
    },
    organizer: {
      name: "DataCamp Kenya",
      email: "bootcamp@datacampke.org",
      phone: "+254 733 567 890",
      organization: "DataCamp Kenya",
      bio: "Data science education and training organization"
    },
    speakers: [
      {
        name: "Dr. James Ochieng",
        title: "Senior Data Scientist",
        company: "Safaricom",
        bio: "PhD in Statistics, 8+ years in data science and machine learning",
        expertise: ["Python", "Machine Learning", "Statistics", "Big Data"],
        sessionTitle: "Python Fundamentals for Data Science",
        sessionTime: "Day 1: 09:00 - 17:00"
      },
      {
        name: "Grace Achieng",
        title: "ML Engineer",
        company: "Twiga Foods",
        bio: "Machine learning engineer specializing in predictive analytics",
        expertise: ["Scikit-learn", "TensorFlow", "Data Visualization"],
        sessionTitle: "Machine Learning with Python",
        sessionTime: "Day 3: 09:00 - 17:00"
      }
    ],
    registration: {
      isRequired: true,
      capacity: 30,
      registered: 28,
      waitlistEnabled: true,
      waitlistCount: 8,
      registrationDeadline: new Date('2024-02-28T23:59:59Z'),
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: false,
      regularPrice: 15000,
      earlyBirdPrice: 12000,
      studentPrice: 8000,
      currency: "KES",
      earlyBirdDeadline: new Date('2024-02-25T23:59:59Z')
    },
    prerequisites: ["Basic programming knowledge", "High school mathematics", "Laptop with Python installed"],
    learningOutcomes: ["Python programming proficiency", "Data manipulation with pandas", "Data visualization", "Basic machine learning", "Portfolio project"],
    socialFeatures: {
      allowNetworking: true,
      chatEnabled: true,
      qnaEnabled: true,
      certificateProvided: true
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: false,
    tags: ["python", "data-science", "bootcamp", "machine-learning", "training"],
    analytics: {
      views: 650,
      registrations: 28,
      attendees: 0
    }
  },

  {
    title: "Startup Pitch Competition 2024",
    description: "Annual startup pitch competition where entrepreneurs present their innovative solutions to a panel of investors and industry experts. Winners receive funding, mentorship, and incubation opportunities. Open to all sectors with special focus on fintech, agritech, and healthtech solutions.",
    shortDescription: "Pitch your startup idea to investors and win funding opportunities",
    category: "Startup Pitch",
    eventType: "In-Person",
    format: "Free",
    schedule: {
      startDate: new Date('2024-03-08T10:00:00Z'),
      endDate: new Date('2024-03-08T19:00:00Z'),
      startTime: "10:00",
      endTime: "19:00",
      timezone: "Africa/Nairobi",
      duration: 540,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "Strathmore University Business School",
      address: "Ole Sangale Road, Madaraka",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.3106, longitude: 36.8062 }
    },
    organizer: {
      name: "Kenya Startup Ecosystem",
      email: "pitch@kenyanstartups.co.ke",
      phone: "+254 744 678 901",
      organization: "Kenya Startup Ecosystem"
    },
    speakers: [
      {
        name: "Michael Kimani",
        title: "Managing Partner",
        company: "Savannah Fund",
        bio: "Venture capital investor with 15+ years experience",
        expertise: ["Venture Capital", "Startup Strategy", "Business Development"],
        sessionTitle: "What Investors Look For",
        sessionTime: "11:00 - 12:00"
      }
    ],
    registration: {
      isRequired: true,
      capacity: 200,
      registered: 156,
      waitlistEnabled: false,
      isRegistrationOpen: true,
      requiresApproval: true
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: "KES"
    },
    targetAudience: ["Entrepreneurs", "Startup Founders", "Investors", "Business Students"],
    whatToExpected: ["Pitch presentations", "Investor feedback", "Networking", "Prize awards", "Funding opportunities"],
    status: "Registration Open",
    isPublished: true,
    isFeatured: true,
    tags: ["startup", "pitch", "competition", "funding", "entrepreneurship"],
    analytics: {
      views: 920,
      registrations: 156,
      attendees: 0,
      socialShares: 67
    }
  },

  {
    title: "Cybersecurity Awareness Webinar",
    description: "Learn essential cybersecurity practices to protect yourself and your organization from cyber threats. This webinar covers password security, phishing awareness, secure browsing, and incident response. Includes live Q&A with cybersecurity experts and downloadable security checklists.",
    shortDescription: "Essential cybersecurity practices for individuals and organizations",
    category: "Webinar",
    eventType: "Virtual",
    format: "Free",
    schedule: {
      startDate: new Date('2024-02-20T14:00:00Z'),
      endDate: new Date('2024-02-20T16:00:00Z'),
      startTime: "14:00",
      endTime: "16:00",
      timezone: "Africa/Nairobi",
      duration: 120,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "Virtual Event",
      virtualPlatform: "Zoom Webinar",
      meetingLink: "https://zoom.us/webinar/cybersecurity-awareness",
      meetingId: "123 456 7890",
      accessCode: "CYBER2024"
    },
    organizer: {
      name: "CyberSafe Kenya",
      email: "webinar@cybersafeke.org",
      phone: "+254 755 789 012",
      organization: "CyberSafe Kenya"
    },
    speakers: [
      {
        name: "Alex Mwangi",
        title: "Cybersecurity Consultant",
        company: "SecureNet Kenya",
        bio: "CISSP certified cybersecurity expert with 10+ years experience",
        expertise: ["Cybersecurity", "Penetration Testing", "Security Awareness"],
        sessionTitle: "Cybersecurity Best Practices",
        sessionTime: "14:00 - 15:30"
      }
    ],
    registration: {
      isRequired: true,
      capacity: 1000,
      registered: 543,
      waitlistEnabled: false,
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: "KES"
    },
    socialFeatures: {
      allowNetworking: false,
      chatEnabled: true,
      qnaEnabled: true,
      pollsEnabled: true,
      certificateProvided: true
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: false,
    tags: ["cybersecurity", "webinar", "security-awareness", "online", "free"],
    analytics: {
      views: 1100,
      registrations: 543,
      attendees: 0
    }
  },

  {
    title: "Tech Women Leadership Summit",
    description: "Empowering women in technology through leadership development, networking, and mentorship. Join successful women leaders in tech for panel discussions, workshops, and networking sessions. Topics include career advancement, work-life balance, and building inclusive teams.",
    shortDescription: "Empowering women in tech through leadership and networking",
    category: "Conference",
    eventType: "Hybrid",
    format: "Paid",
    schedule: {
      startDate: new Date('2024-03-15T08:30:00Z'),
      endDate: new Date('2024-03-15T17:30:00Z'),
      startTime: "08:30",
      endTime: "17:30",
      timezone: "Africa/Nairobi",
      duration: 540,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "Villa Rosa Kempinski",
      address: "Chiromo Road, Westlands",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2635, longitude: 36.8108 },
      virtualPlatform: "Hopin",
      meetingLink: "https://hopin.com/tech-women-summit"
    },
    organizer: {
      name: "Women in Tech Kenya",
      email: "summit@womenintech.ke",
      phone: "+254 766 890 123",
      organization: "Women in Tech Kenya"
    },
    speakers: [
      {
        name: "Catherine Muraga",
        title: "CEO",
        company: "IntelliSOFT Consulting",
        bio: "Tech entrepreneur and CEO with 15+ years in health tech",
        expertise: ["Leadership", "Health Tech", "Entrepreneurship"]
      },
      {
        name: "Diana Wanjala",
        title: "Engineering Manager",
        company: "Andela",
        bio: "Engineering leader passionate about diversity and inclusion",
        expertise: ["Engineering Management", "Team Building", "Diversity & Inclusion"]
      }
    ],
    registration: {
      isRequired: true,
      capacity: 150,
      registered: 98,
      waitlistEnabled: true,
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: false,
      regularPrice: 8000,
      earlyBirdPrice: 6000,
      studentPrice: 3000,
      currency: "KES",
      earlyBirdDeadline: new Date('2024-03-10T23:59:59Z')
    },
    targetAudience: ["Women in Tech", "Tech Leaders", "Aspiring Leaders", "Students"],
    socialFeatures: {
      allowNetworking: true,
      chatEnabled: true,
      qnaEnabled: true,
      certificateProvided: true
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: true,
    tags: ["women-in-tech", "leadership", "conference", "networking", "empowerment"],
    analytics: {
      views: 780,
      registrations: 98,
      attendees: 0
    }
  },

  {
    title: "Blockchain & Cryptocurrency Meetup",
    description: "Monthly meetup for blockchain enthusiasts, developers, and crypto investors. This session focuses on DeFi trends, smart contract development, and cryptocurrency regulation in Kenya. Features lightning talks, networking, and project showcases from local blockchain startups.",
    shortDescription: "Monthly blockchain and crypto community meetup",
    category: "Community Meetup",
    eventType: "In-Person",
    format: "Free",
    schedule: {
      startDate: new Date('2024-02-28T18:00:00Z'),
      endDate: new Date('2024-02-28T21:00:00Z'),
      startTime: "18:00",
      endTime: "21:00",
      timezone: "Africa/Nairobi",
      duration: 180,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "NEST Collective",
      address: "Riara Road, Kileleshwa",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2891, longitude: 36.7902 }
    },
    organizer: {
      name: "Blockchain Kenya",
      email: "meetup@blockchainkenya.org",
      phone: "+254 777 901 234",
      organization: "Blockchain Kenya"
    },
    registration: {
      isRequired: true,
      capacity: 80,
      registered: 67,
      waitlistEnabled: true,
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: "KES"
    },
    recurring: {
      isRecurring: true,
      frequency: "Monthly",
      recurringDays: ["Thursday"],
      seriesId: "blockchain-meetup-2024",
      seriesNumber: 2,
      seriesTotal: 12,
      nextEventDate: new Date('2024-03-28T18:00:00Z')
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: false,
    tags: ["blockchain", "cryptocurrency", "meetup", "defi", "web3"],
    analytics: {
      views: 420,
      registrations: 67,
      attendees: 0
    }
  },

  {
    title: "Digital Marketing Masterclass",
    description: "Comprehensive one-day masterclass covering modern digital marketing strategies. Learn SEO, social media marketing, content marketing, email campaigns, and analytics. Includes hands-on exercises with real campaigns and tools. Suitable for business owners, marketers, and freelancers.",
    shortDescription: "One-day digital marketing masterclass with hands-on exercises",
    category: "Workshop",
    eventType: "In-Person",
    format: "Paid",
    schedule: {
      startDate: new Date('2024-03-12T09:00:00Z'),
      endDate: new Date('2024-03-12T17:00:00Z'),
      startTime: "09:00",
      endTime: "17:00",
      timezone: "Africa/Nairobi",
      duration: 480,
      isAllDay: false,
      isMultiDay: false
    },
    location: {
      venue: "Chandaria Business School",
      address: "United States International University Africa",
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2197, longitude: 36.8919 }
    },
    organizer: {
      name: "Digital Marketing Institute Kenya",
      email: "masterclass@dmike.org",
      phone: "+254 788 012 345",
      organization: "Digital Marketing Institute Kenya"
    },
    speakers: [
      {
        name: "Grace Muthoni",
        title: "Digital Marketing Manager",
        company: "Jumia Kenya",
        bio: "Digital marketing expert with 8+ years experience in e-commerce",
        expertise: ["SEO", "Social Media Marketing", "E-commerce Marketing"]
      }
    ],
    registration: {
      isRequired: true,
      capacity: 25,
      registered: 22,
      waitlistEnabled: true,
      isRegistrationOpen: true,
      requiresApproval: false
    },
    pricing: {
      isFree: false,
      regularPrice: 12000,
      earlyBirdPrice: 10000,
      currency: "KES",
      earlyBirdDeadline: new Date('2024-03-08T23:59:59Z')
    },
    socialFeatures: {
      allowNetworking: true,
      chatEnabled: false,
      qnaEnabled: true,
      certificateProvided: true
    },
    status: "Registration Open",
    isPublished: true,
    isFeatured: false,
    tags: ["digital-marketing", "seo", "social-media", "workshop", "marketing"],
    analytics: {
      views: 340,
      registrations: 22,
      attendees: 0
    }
  }
];

module.exports = sampleEvents; 