// Sample FAQ data for testing
// This can be used to populate the database with initial data

const sampleFAQs = [
  {
    question: "What is Ajira Digital KiNaP Club?",
    answer: "Ajira Digital KiNaP Club is a student organization at Kiambu National Polytechnic that focuses on empowering youth through digital skills and online work opportunities. We provide training, resources, and a supportive community for students interested in digital careers, freelancing, and entrepreneurship.",
    category: "General",
    tags: ["club", "digital-skills", "introduction", "about"],
    priority: 10,
    isPublished: true,
    isPopular: true,
    seoMeta: {
      metaTitle: "What is Ajira Digital KiNaP Club?",
      metaDescription: "Learn about Ajira Digital KiNaP Club - a student organization focused on digital skills and online work opportunities.",
      keywords: ["ajira digital", "kinap club", "digital skills", "student organization"]
    }
  },

  {
    question: "How can I join the club?",
    answer: "To join the club, you need to be a current student at Kiambu National Polytechnic. You can sign up through our website by creating an account, or visit our office during club hours (Monday-Friday, 2-5 PM). Membership is completely free and open to all students interested in digital skills development.",
    category: "Membership",
    tags: ["join", "membership", "registration", "signup"],
    priority: 9,
    isPublished: true,
    isPopular: true,
    seoMeta: {
      metaTitle: "How to Join Ajira Digital KiNaP Club",
      metaDescription: "Learn how to become a member of Ajira Digital KiNaP Club. Free membership for all KiNaP students.",
      keywords: ["join club", "membership", "registration", "kinap students"]
    }
  },

  {
    question: "What training programs do you offer?",
    answer: "We offer comprehensive training programs including: Web Development (HTML, CSS, JavaScript, React), Digital Marketing (SEO, Social Media, Content Marketing), Graphic Design (Photoshop, Illustrator, Canva), Content Writing, Data Entry, Virtual Assistant skills, and Freelancing basics. All programs are designed to be practical and industry-relevant with hands-on projects.",
    category: "Training",
    tags: ["training", "web-development", "digital-marketing", "graphic-design", "freelancing"],
    priority: 8,
    isPublished: true,
    isPopular: true,
    seoMeta: {
      metaTitle: "Training Programs at Ajira Digital KiNaP Club",
      metaDescription: "Explore our comprehensive training programs in web development, digital marketing, graphic design, and freelancing.",
      keywords: ["training programs", "web development", "digital marketing", "freelancing courses"]
    }
  },

  {
    question: "Are the training sessions free?",
    answer: "Most of our basic training sessions are completely free for club members. This includes introductory courses, weekly workshops, and peer learning sessions. However, some specialized workshops, certification programs, or courses with external trainers may have a nominal fee (usually KSh 500-2000) to cover resources, certificates, and trainer costs.",
    category: "Training",
    tags: ["free", "cost", "fees", "pricing", "training-cost"],
    priority: 7,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Are Ajira Digital Training Sessions Free?",
      metaDescription: "Learn about the cost of training programs at Ajira Digital KiNaP Club. Most sessions are free for members.",
      keywords: ["free training", "course fees", "training cost", "membership benefits"]
    }
  },

  {
    question: "How does the marketplace work?",
    answer: "Our marketplace is a platform where club members can showcase their digital skills and services to potential clients. Members can create service listings (gigs), receive job opportunities, and build their portfolio through real projects. Clients can browse services, hire members, and leave reviews. We facilitate secure payments and provide dispute resolution when needed.",
    category: "Career",
    tags: ["marketplace", "gigs", "services", "freelancing", "clients"],
    priority: 6,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "How the Ajira Digital Marketplace Works",
      metaDescription: "Learn how to use the Ajira Digital marketplace to showcase skills, find clients, and earn money online.",
      keywords: ["marketplace", "freelancing platform", "gig work", "online services"]
    }
  },

  {
    question: "Can I post jobs on the marketplace?",
    answer: "Yes, verified employers and clients can post job opportunities on our marketplace. All job postings are reviewed by our team to ensure they meet our quality and safety standards. Jobs must offer fair compensation, clear deliverables, and comply with our community guidelines. There's a small posting fee of KSh 200 for job listings to maintain quality.",
    category: "Career",
    tags: ["jobs", "employers", "posting", "hiring", "clients"],
    priority: 5,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Post Jobs on Ajira Digital Marketplace",
      metaDescription: "Learn how employers can post job opportunities on the Ajira Digital marketplace to hire talented students.",
      keywords: ["post jobs", "hire students", "job opportunities", "employer"]
    }
  },

  {
    question: "What support do you provide to members?",
    answer: "We provide comprehensive support including: one-on-one mentorship with industry professionals, technical support for projects, access to premium learning resources and software, networking opportunities with alumni and partners, career guidance and interview preparation, access to computer labs and high-speed internet, and a supportive community forum for peer help.",
    category: "General",
    tags: ["support", "mentorship", "resources", "networking", "career-guidance"],
    priority: 7,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Member Support at Ajira Digital KiNaP Club",
      metaDescription: "Discover the comprehensive support services available to Ajira Digital club members.",
      keywords: ["member support", "mentorship", "career guidance", "resources"]
    }
  },

  {
    question: "How can I get help if I'm stuck on a project?",
    answer: "Multiple support channels are available: Use our 24/7 chat support for quick questions, visit our physical office during working hours, post in our community forum where peers and mentors respond, join our weekly 'Help Sessions' every Wednesday at 3 PM, or schedule a one-on-one mentorship session. We also have a WhatsApp support group for urgent technical issues.",
    category: "General",
    tags: ["help", "support", "technical-help", "mentorship", "community"],
    priority: 6,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Getting Help with Projects at Ajira Digital",
      metaDescription: "Learn about the various support channels available when you need help with your digital projects.",
      keywords: ["project help", "technical support", "mentorship", "community support"]
    }
  },

  {
    question: "Do you provide certificates for completed courses?",
    answer: "Yes, we provide digital certificates for all completed training programs. Certificates include your name, course details, completion date, and a verification QR code. Advanced courses also include skill assessments and portfolio reviews. Our certificates are recognized by many local employers and can be shared on LinkedIn and other professional platforms.",
    category: "Certification",
    tags: ["certificates", "certification", "completion", "credentials", "verification"],
    priority: 6,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Certificates for Ajira Digital Courses",
      metaDescription: "Learn about the digital certificates provided for completing Ajira Digital training programs.",
      keywords: ["course certificates", "digital certification", "skill credentials", "training completion"]
    }
  },

  {
    question: "What are the requirements to become a verified seller on the marketplace?",
    answer: "To become a verified seller, you must: Complete at least 2 training programs with us, maintain a 4.5+ rating from initial projects, submit 3 portfolio samples, pass a skill assessment test, provide valid ID and contact information, and agree to our seller terms of service. Verification typically takes 3-5 business days and gives you access to premium features and higher-paying projects.",
    category: "Career",
    tags: ["verification", "seller", "requirements", "marketplace", "premium"],
    priority: 4,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Become a Verified Seller on Ajira Digital Marketplace",
      metaDescription: "Learn the requirements and process to become a verified seller on the Ajira Digital marketplace.",
      keywords: ["verified seller", "seller requirements", "marketplace verification", "premium features"]
    }
  },

  {
    question: "Can I attend events if I'm not a member?",
    answer: "Some of our public events like career fairs, guest speaker sessions, and community outreach programs are open to all KiNaP students. However, workshops, training sessions, networking events, and members-only activities require active membership. We recommend joining the club to access our full range of events and opportunities.",
    category: "Events",
    tags: ["events", "membership", "public", "workshops", "attendance"],
    priority: 4,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Event Attendance Rules at Ajira Digital",
      metaDescription: "Learn about which events are open to all students and which require club membership.",
      keywords: ["event attendance", "public events", "member events", "club activities"]
    }
  },

  {
    question: "How do I reset my account password?",
    answer: "To reset your password: Go to the login page and click 'Forgot Password', enter your registered email address, check your email for a reset link (check spam folder too), click the link and create a new strong password, or visit our office with your student ID for manual reset. Password reset links expire after 24 hours for security.",
    category: "Technical",
    tags: ["password", "reset", "login", "account", "security"],
    priority: 3,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Reset Your Ajira Digital Account Password",
      metaDescription: "Step-by-step guide to reset your Ajira Digital club account password safely.",
      keywords: ["password reset", "account recovery", "login help", "forgot password"]
    }
  },

  {
    question: "What payment methods do you accept for premium services?",
    answer: "We accept multiple payment methods: M-Pesa (most popular), Airtel Money, Bank transfers, Cash payments at our office, and PayPal for international transactions. All payments are processed securely and you'll receive a digital receipt. We also offer payment plans for expensive courses - pay in 2-3 installments over 2 months.",
    category: "Payment",
    tags: ["payment", "mpesa", "methods", "fees", "transactions"],
    priority: 5,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Payment Methods at Ajira Digital KiNaP Club",
      metaDescription: "Learn about the various payment methods accepted for premium services and training programs.",
      keywords: ["payment methods", "mpesa", "fees", "course payment", "secure transactions"]
    }
  },

  {
    question: "How can I become a mentor or trainer?",
    answer: "To become a mentor/trainer: Have at least 2 years of industry experience, demonstrate expertise in your field, complete our mentor training program, provide references from previous work/teaching, commit to at least 4 hours per month, and pass a background check. Mentors receive recognition, networking opportunities, and a small stipend for their time.",
    category: "Training",
    tags: ["mentor", "trainer", "volunteer", "teaching", "expertise"],
    priority: 3,
    isPublished: true,
    isPopular: false,
    seoMeta: {
      metaTitle: "Become a Mentor at Ajira Digital KiNaP Club",
      metaDescription: "Learn how to become a mentor or trainer and give back to the Ajira Digital community.",
      keywords: ["become mentor", "trainer", "volunteer", "teach", "give back"]
    }
  },

  {
    question: "Do you offer job placement assistance?",
    answer: "Yes! We provide comprehensive job placement assistance including: resume/CV review and optimization, interview preparation and mock interviews, job search strategies and techniques, direct connections with hiring partners, freelance project opportunities through our marketplace, and career counseling sessions. Our placement rate is over 70% within 6 months of course completion.",
    category: "Career",
    tags: ["job-placement", "career", "employment", "assistance", "success-rate"],
    priority: 8,
    isPublished: true,
    isPopular: true,
    seoMeta: {
      metaTitle: "Job Placement Assistance at Ajira Digital",
      metaDescription: "Learn about our comprehensive job placement assistance program with 70%+ success rate.",
      keywords: ["job placement", "career assistance", "employment help", "job search"]
    }
  }
];

module.exports = sampleFAQs; 