const sampleHomePageData = {
  heroTitle: "Empowering Kenya's Digital Generation",
  heroSubtitle: "KiNaP Ajira Digital Club – Innovation & Excellence",
  heroImage: "/logo.jpeg",
  heroVideo: "/videos/digital-transformation.mp4",
  heroBackground: "/images/hero-bg.jpg",
  
  stats: {
    studentsTrained: 1500,
    successStories: 250,
    skillsPrograms: 75,
    digitalExcellence: 95,
    activeMembers: 800,
    completedProjects: 350,
    partnerOrganizations: 30,
    averageEarnings: 75000
  },
  
  ctaButtons: [
    {
      label: "Get Started",
      url: "/auth?mode=register",
      type: "primary"
    },
    {
      label: "Official Portal",
      url: "https://ajiradigital.go.ke",
      type: "external"
    }
  ],
  
  features: [
    {
      icon: "Users",
      title: "Community Driven",
      description: "Join a thriving community of digital professionals and learners across Kenya",
      color: "from-ajira-primary to-ajira-blue-600",
      bgColor: "bg-ajira-primary/10",
      order: 1
    },
    {
      icon: "Award",
      title: "Certified Training",
      description: "Industry-recognized certifications and skill development programs",
      color: "from-ajira-secondary to-ajira-green-600",
      bgColor: "bg-ajira-secondary/10",
      order: 2
    },
    {
      icon: "TrendingUp",
      title: "Career Growth",
      description: "Track your progress and unlock new opportunities in the digital economy",
      color: "from-ajira-accent to-ajira-orange-600",
      bgColor: "bg-ajira-accent/10",
      order: 3
    },
    {
      icon: "Globe",
      title: "Global Reach",
      description: "Connect with international markets and opportunities worldwide",
      color: "from-ajira-info to-ajira-blue-500",
      bgColor: "bg-ajira-info/10",
      order: 4
    },
    {
      icon: "Shield",
      title: "Quality Assurance",
      description: "Rigorous vetting process ensures high-quality services and training",
      color: "from-ajira-warning to-ajira-yellow-600",
      bgColor: "bg-ajira-warning/10",
      order: 5
    },
    {
      icon: "Zap",
      title: "Fast Results",
      description: "Quick turnaround times and immediate access to opportunities",
      color: "from-ajira-success to-ajira-green-500",
      bgColor: "bg-ajira-success/10",
      order: 6
    }
  ],
  
  testimonials: [
    {
      name: "Sarah Mwangi",
      role: "Digital Marketing Specialist",
      company: "Tech Solutions Kenya",
      content: "KiNaP transformed my career. The community support and training programs are exceptional. I went from knowing nothing about digital marketing to running successful campaigns for major brands.",
      rating: 5,
      image: "/images/testimonials/sarah.jpg",
      featured: true,
      order: 1
    },
    {
      name: "John Kamau",
      role: "Web Developer",
      company: "Freelance",
      content: "The marketplace helped me start my freelance career. Great platform for digital professionals. I've completed over 50 projects and earned more than I ever did in my previous job.",
      rating: 5,
      image: "/images/testimonials/john.jpg",
      featured: true,
      order: 2
    },
    {
      name: "Grace Wanjiku",
      role: "UI/UX Designer",
      company: "Design Studio Nairobi",
      content: "The mentorship program connected me with industry experts who guided my career path. The skills I learned here are directly applicable to real-world projects.",
      rating: 5,
      image: "/images/testimonials/grace.jpg",
      featured: true,
      order: 3
    },
    {
      name: "David Ochieng",
      role: "Data Analyst",
      company: "Analytics Kenya",
      content: "The data science program was comprehensive and practical. I now work with major corporations analyzing their business data and providing insights.",
      rating: 5,
      image: "/images/testimonials/david.jpg",
      featured: false,
      order: 4
    },
    {
      name: "Mary Njeri",
      role: "Content Creator",
      company: "Digital Media Hub",
      content: "KiNaP's content creation program taught me everything from writing to video production. I now run my own successful digital media business.",
      rating: 5,
      image: "/images/testimonials/mary.jpg",
      featured: false,
      order: 5
    }
  ],
  
  newsItems: [
    {
      title: "New Digital Skills Program Launch",
      excerpt: "We are excited to announce the launch of our comprehensive digital skills training program covering web development, digital marketing, and data analysis.",
      content: "The new program is designed to provide practical, industry-relevant skills that directly translate to employment opportunities. Participants will receive hands-on training, mentorship, and access to our marketplace platform.",
      image: "/images/news/program-launch.jpg",
      category: "Announcements",
      author: "KiNaP Team",
      featured: true,
      tags: ["training", "skills", "launch", "programs"],
      readTime: 3,
      order: 1
    },
    {
      title: "Marketplace Success Stories: Q1 2024",
      excerpt: "Our marketplace platform has facilitated over 500 successful projects in the first quarter of 2024, generating significant income for our members.",
      content: "The marketplace continues to grow with new features including AI-powered project matching, secure payment systems, and enhanced communication tools.",
      image: "/images/news/marketplace-success.jpg",
      category: "Success Stories",
      author: "Marketplace Team",
      featured: true,
      tags: ["marketplace", "success", "income", "projects"],
      readTime: 4,
      order: 2
    },
    {
      title: "Partnership with Major Tech Companies",
      excerpt: "KiNaP has formed strategic partnerships with leading technology companies to provide internship and employment opportunities for our members.",
      content: "These partnerships will provide our members with real-world experience, mentorship from industry experts, and direct pathways to employment.",
      image: "/images/news/partnerships.jpg",
      category: "Partnerships",
      author: "Partnerships Team",
      featured: true,
      tags: ["partnerships", "employment", "internships", "tech"],
      readTime: 5,
      order: 3
    },
    {
      title: "Community Meetup: Nairobi Chapter",
      excerpt: "Join us for our monthly community meetup in Nairobi where members can network, share experiences, and learn from each other.",
      content: "The meetup will feature guest speakers, networking sessions, and workshops on various digital skills topics.",
      image: "/images/news/meetup.jpg",
      category: "Events",
      author: "Community Team",
      featured: false,
      tags: ["community", "meetup", "networking", "nairobi"],
      readTime: 2,
      order: 4
    }
  ],
  
  programs: [],
  
  partners: [
    {
      name: "Ajira Digital",
      logo: "/images/partners/ajira-digital.png",
      website: "https://ajiradigital.go.ke",
      description: "Official government digital skills program",
      category: "Government",
      featured: true,
      order: 1
    },
    {
      name: "Google Developers",
      logo: "/images/partners/google-developers.png",
      website: "https://developers.google.com",
      description: "Google's developer community and resources",
      category: "Technology",
      featured: true,
      order: 2
    },
    {
      name: "Microsoft Learn",
      logo: "/images/partners/microsoft-learn.png",
      website: "https://learn.microsoft.com",
      description: "Microsoft's learning platform and certifications",
      category: "Technology",
      featured: true,
      order: 3
    },
    {
      name: "Coursera",
      logo: "/images/partners/coursera.png",
      website: "https://coursera.org",
      description: "Online learning platform with university partnerships",
      category: "Education",
      featured: false,
      order: 4
    },
    {
      name: "Udemy",
      logo: "/images/partners/udemy.png",
      website: "https://udemy.com",
      description: "Online course marketplace with expert instructors",
      category: "Education",
      featured: false,
      order: 5
    }
  ],
  
  aboutSection: {
    title: "About KiNaP Ajira Digital Club",
    content: "We are a community-driven platform dedicated to empowering Kenyans with digital skills and opportunities. Our mission is to bridge the digital divide and create sustainable employment opportunities in the digital economy. Through mentorship and marketplace access, we help individuals transform their careers and contribute to Kenya's digital transformation.",
    image: "/images/about/team.jpg",
    showStats: true
  },
  
  servicesSection: {
    title: "Our Services",
    subtitle: "Comprehensive Digital Solutions",
    description: "From marketplace opportunities to community support, we provide everything you need for digital success. Our integrated approach ensures that community engagement translates directly to earning opportunities.",
    showCTA: true
  },
  
  communitySection: {
    title: "Join Our Community",
    subtitle: "Connect with Digital Professionals",
    description: "Be part of Kenya's fastest-growing digital community. Network with peers, share experiences, and access exclusive opportunities through our vibrant community platform.",
    memberCount: 800,
    showJoinCTA: true
  },
  
  // SEO & Meta
  metaTitle: "KiNaP Ajira Digital Club - Empowering Kenya's Digital Generation",
  metaDescription: "Join KiNaP Ajira Digital Club for marketplace opportunities and community support. Transform your career in Kenya's digital economy.",
  metaKeywords: ["digital skills", "Kenya", "Ajira Digital", "training", "marketplace", "community", "career development", "freelancing"],
  
  // Configuration
  isActive: true,
  showHero: true,
  showStats: true,
  showFeatures: true,
  showTestimonials: true,
  showNews: true,
  showPrograms: true,
  showPartners: true
};

module.exports = sampleHomePageData; 