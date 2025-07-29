const Gig = require('../models/Gig');
const User = require('../models/User');

const sampleGigs = [
  {
    title: "Professional Web Development - React & Node.js",
    description: "I'll create a modern, responsive website using React for frontend and Node.js for backend. Includes database setup, API development, and deployment. Perfect for businesses looking to establish their online presence.",
    category: "web-development",
    subcategory: "full-stack",
    tags: ["react", "nodejs", "mongodb", "responsive", "modern"],
    pricing: {
      type: "fixed",
      amount: 25000,
      currency: "KES"
    },
    packages: [
      {
        name: "basic",
        title: "Basic Website",
        description: "Simple responsive website with contact form",
        price: 15000,
        deliveryTime: 7,
        revisions: 2,
        features: ["Responsive design", "Contact form", "SEO optimized", "1 month support"]
      },
      {
        name: "standard",
        title: "Standard Website",
        description: "Full-featured website with admin panel",
        price: 25000,
        deliveryTime: 14,
        revisions: 3,
        features: ["Admin panel", "Database integration", "Payment integration", "3 months support"]
      },
      {
        name: "premium",
        title: "Premium Website",
        description: "Advanced website with custom features",
        price: 45000,
        deliveryTime: 21,
        revisions: 5,
        features: ["Custom features", "Advanced animations", "Analytics integration", "6 months support"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        alt: "Web Development"
      }
    ],
    requirements: [
      {
        question: "What type of website do you need?",
        type: "text",
        required: true
      },
      {
        question: "Do you have existing branding materials?",
        type: "file",
        required: false
      },
      {
        question: "What is your target audience?",
        type: "text",
        required: true
      }
    ],
    skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "HTML/CSS"],
    languages: ["English", "Swahili"],
    location: {
      country: "Kenya",
      city: "Nairobi"
    }
  },
  {
    title: "Creative Graphic Design & Branding",
    description: "Professional graphic design services including logos, business cards, social media graphics, and complete brand identity packages. I create visually appealing designs that help businesses stand out.",
    category: "graphic-design",
    subcategory: "branding",
    tags: ["logo", "branding", "social-media", "business-cards", "creative"],
    pricing: {
      type: "fixed",
      amount: 8000,
      currency: "KES"
    },
    packages: [
      {
        name: "basic",
        title: "Logo Design",
        description: "Professional logo with 3 concepts",
        price: 5000,
        deliveryTime: 3,
        revisions: 2,
        features: ["3 logo concepts", "Vector files", "Color variations", "Basic brand guidelines"]
      },
      {
        name: "standard",
        title: "Brand Identity",
        description: "Complete brand identity package",
        price: 8000,
        deliveryTime: 7,
        revisions: 3,
        features: ["Logo design", "Business cards", "Letterhead", "Social media templates"]
      },
      {
        name: "premium",
        title: "Premium Branding",
        description: "Full brand identity with marketing materials",
        price: 15000,
        deliveryTime: 14,
        revisions: 5,
        features: ["Complete brand identity", "Marketing materials", "Website mockups", "Brand guidelines"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        alt: "Graphic Design"
      }
    ],
    requirements: [
      {
        question: "Describe your business and target audience",
        type: "text",
        required: true
      },
      {
        question: "What colors represent your brand?",
        type: "text",
        required: false
      },
      {
        question: "Do you have any design preferences?",
        type: "text",
        required: false
      }
    ],
    skills: ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Brand Strategy", "Typography"],
    languages: ["English"],
    location: {
      country: "Kenya",
      city: "Mombasa"
    }
  },
  {
    title: "Digital Marketing & Social Media Management",
    description: "Comprehensive digital marketing services including social media management, content creation, SEO optimization, and paid advertising campaigns. I help businesses grow their online presence and reach more customers.",
    category: "digital-marketing",
    subcategory: "social-media",
    tags: ["social-media", "marketing", "seo", "content", "advertising"],
    pricing: {
      type: "hourly",
      amount: 1500,
      currency: "KES"
    },
    packages: [
      {
        name: "basic",
        title: "Social Media Management",
        description: "Monthly social media management",
        price: 20000,
        deliveryTime: 30,
        revisions: 2,
        features: ["Content creation", "Daily posting", "Engagement management", "Monthly reports"]
      },
      {
        name: "standard",
        title: "Digital Marketing Package",
        description: "Complete digital marketing strategy",
        price: 35000,
        deliveryTime: 30,
        revisions: 3,
        features: ["SEO optimization", "Content marketing", "Email campaigns", "Analytics tracking"]
      },
      {
        name: "premium",
        title: "Premium Marketing",
        description: "Full-service digital marketing",
        price: 60000,
        deliveryTime: 30,
        revisions: 5,
        features: ["Paid advertising", "Influencer outreach", "Video content", "Strategy consulting"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=500",
        alt: "Digital Marketing"
      }
    ],
    requirements: [
      {
        question: "What platforms do you want to focus on?",
        type: "choice",
        required: true,
        options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"]
      },
      {
        question: "What are your marketing goals?",
        type: "text",
        required: true
      },
      {
        question: "What is your monthly budget for ads?",
        type: "text",
        required: false
      }
    ],
    skills: ["Social Media Marketing", "SEO", "Content Creation", "Google Ads", "Facebook Ads", "Analytics"],
    languages: ["English", "Swahili"],
    location: {
      country: "Kenya",
      city: "Nairobi"
    }
  },
  {
    title: "Professional Content Writing & Copywriting",
    description: "High-quality content writing services including blog posts, website content, product descriptions, and marketing copy. I create engaging, SEO-optimized content that converts readers into customers.",
    category: "content-writing",
    subcategory: "copywriting",
    tags: ["content", "copywriting", "blog", "seo", "marketing"],
    pricing: {
      type: "fixed",
      amount: 3000,
      currency: "KES"
    },
    packages: [
      {
        name: "basic",
        title: "Blog Post",
        description: "500-800 word SEO-optimized blog post",
        price: 2000,
        deliveryTime: 2,
        revisions: 1,
        features: ["SEO optimization", "Keyword research", "Basic editing", "1 revision"]
      },
      {
        name: "standard",
        title: "Content Package",
        description: "Multiple pieces of content",
        price: 3000,
        deliveryTime: 5,
        revisions: 2,
        features: ["3 blog posts", "Social media content", "Email copy", "2 revisions"]
      },
      {
        name: "premium",
        title: "Premium Content",
        description: "Comprehensive content strategy",
        price: 8000,
        deliveryTime: 10,
        revisions: 3,
        features: ["Content strategy", "Website copy", "Marketing materials", "Ongoing support"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500",
        alt: "Content Writing"
      }
    ],
    requirements: [
      {
        question: "What type of content do you need?",
        type: "choice",
        required: true,
        options: ["Blog posts", "Website content", "Product descriptions", "Marketing copy"]
      },
      {
        question: "What is your target audience?",
        type: "text",
        required: true
      },
      {
        question: "Do you have specific keywords to target?",
        type: "text",
        required: false
      }
    ],
    skills: ["Content Writing", "Copywriting", "SEO", "Blog Writing", "Marketing Copy", "Editing"],
    languages: ["English", "Swahili"],
    location: {
      country: "Kenya",
      city: "Kisumu"
    }
  },
  {
    title: "Mobile App Development - React Native",
    description: "Professional mobile app development using React Native for both iOS and Android platforms. I create high-performance, user-friendly apps with modern UI/UX design and robust backend integration.",
    category: "mobile-development",
    subcategory: "react-native",
    tags: ["react-native", "mobile", "ios", "android", "app-development"],
    pricing: {
      type: "fixed",
      amount: 80000,
      currency: "KES"
    },
    packages: [
      {
        name: "basic",
        title: "Simple App",
        description: "Basic mobile app with core features",
        price: 50000,
        deliveryTime: 21,
        revisions: 2,
        features: ["Core functionality", "Basic UI", "Testing", "App store submission"]
      },
      {
        name: "standard",
        title: "Standard App",
        description: "Feature-rich mobile app",
        price: 80000,
        deliveryTime: 35,
        revisions: 3,
        features: ["Advanced features", "Custom UI", "Backend integration", "Analytics"]
      },
      {
        name: "premium",
        title: "Premium App",
        description: "Enterprise-level mobile app",
        price: 150000,
        deliveryTime: 60,
        revisions: 5,
        features: ["Complex features", "Custom animations", "Advanced backend", "Maintenance"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
        alt: "Mobile App Development"
      }
    ],
    requirements: [
      {
        question: "What type of app do you want to build?",
        type: "text",
        required: true
      },
      {
        question: "What are the main features you need?",
        type: "text",
        required: true
      },
      {
        question: "Do you have existing designs or wireframes?",
        type: "file",
        required: false
      }
    ],
    skills: ["React Native", "JavaScript", "iOS Development", "Android Development", "Firebase", "API Integration"],
    languages: ["English"],
    location: {
      country: "Kenya",
      city: "Nairobi"
    }
  }
];

const populateMarketplace = async () => {
  try {
    // Get a sample user to assign as seller
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Clear existing gigs
    await Gig.deleteMany({});

    // Create gigs with the user as seller
    const gigsWithSeller = sampleGigs.map(gig => ({
      ...gig,
      seller: user._id,
      status: 'active',
      featured: Math.random() > 0.7, // 30% chance of being featured
      verified: Math.random() > 0.5, // 50% chance of being verified
      stats: {
        views: Math.floor(Math.random() * 1000),
        orders: Math.floor(Math.random() * 50),
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
        reviews: Math.floor(Math.random() * 20)
      }
    }));

    const createdGigs = await Gig.insertMany(gigsWithSeller);
    console.log(`✅ Created ${createdGigs.length} sample gigs`);
    
    return createdGigs;
  } catch (error) {
    console.error('Error populating marketplace:', error);
  }
};

module.exports = { populateMarketplace, sampleGigs }; 