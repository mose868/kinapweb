// Fiverr-like marketplace with 1000+ gigs - Exact Fiverr functionality
const sampleGigs = [];

// Working image URLs from Unsplash and Pexels
const imageCategories = {
  "Graphics & Design": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", // logo design
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop", // branding
    "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop", // design tools
    "https://images.unsplash.com/photo-1609921211353-29d0d9d63dab?w=400&h=300&fit=crop", // graphic design
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", // creative design
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", // business cards
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop", // presentations
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", // illustrations
  ],
  "Digital Marketing": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", // marketing strategy
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop", // social media
    "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=300&fit=crop", // analytics
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop", // social marketing
    "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop", // content marketing
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop", // advertising
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop", // email marketing
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", // seo
  ],
  "Writing & Translation": [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop", // writing
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop", // blogging
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop", // copywriting
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop", // articles
    "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=300&fit=crop", // content writing
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop", // books
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=300&fit=crop", // translation
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop", // proofreading
  ],
  "Video & Animation": [
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop", // video editing
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop", // animation
    "https://images.unsplash.com/photo-1492619392364-216b43e5c43c?w=400&h=300&fit=crop", // video production
    "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop", // cinematography
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=300&fit=crop", // video content
    "https://images.unsplash.com/photo-1478720568477-b946794d2947?w=400&h=300&fit=crop", // filmmaking
    "https://images.unsplash.com/photo-1551792107-7d0b4ec43508?w=400&h=300&fit=crop", // motion graphics
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", // explainer videos
  ],
  "Music & Audio": [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", // music production
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop", // voiceover
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop", // audio editing
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", // sound design
    "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=300&fit=crop", // podcasting
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", // mixing
    "https://images.unsplash.com/photo-1520637836862-4d197d17c52a?w=400&h=300&fit=crop", // recording
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // audio production
  ],
  "Programming & Tech": [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop", // web development
    "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=400&h=300&fit=crop", // programming
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", // coding
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop", // software dev
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop", // mobile apps
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop", // databases
    "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=300&fit=crop", // tech support
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop", // cybersecurity
  ],
  "Business": [
    "https://images.unsplash.com/photo-1554774853-719586f82d77?w=400&h=300&fit=crop", // business consulting
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", // business plan
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", // consulting
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop", // market research
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop", // presentations
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop", // strategy
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop", // finance
    "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=400&h=300&fit=crop", // virtual assistant
  ],
  "Lifestyle": [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // fitness
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop", // nutrition
    "https://images.unsplash.com/photo-1506629905607-5b9138b8e2de?w=400&h=300&fit=crop", // lifestyle coaching
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop", // wellness
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop", // travel planning
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", // fashion
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop", // home organization
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // personal coaching
  ]
};

// Comprehensive Fiverr-like categories and subcategories
const fiverCategories = {
  "Graphics & Design": {
    subcategories: ["Logo Design", "Brand Style Guides", "Business Cards", "Flyer Design", "Poster Design", "Brochure Design", "Social Media Design", "Web & Mobile Design", "Package & Label Design", "Illustration", "Pattern Design", "Presentations", "Infographic Design", "Vector Tracing", "Resume Design"],
    basePrices: [500, 8000],
    deliveryRange: [1, 7]
  },
  "Digital Marketing": {
    subcategories: ["Social Media Marketing", "SEO", "Content Marketing", "Video Marketing", "Email Marketing", "Search Engine Marketing", "Marketing Strategy", "Web Analytics", "Influencer Marketing", "Public Relations", "Local SEO", "E-Commerce Marketing", "Mobile App Marketing", "Music Promotion", "Podcast Marketing"],
    basePrices: [1000, 25000],
    deliveryRange: [1, 30]
  },
  "Writing & Translation": {
    subcategories: ["Content Writing", "Copywriting", "Technical Writing", "Creative Writing", "Translation", "Proofreading & Editing", "Resume Writing", "Cover Letters", "LinkedIn Profiles", "Product Descriptions", "Press Releases", "Speechwriting", "Grant Writing", "Book Writing", "Script Writing"],
    basePrices: [300, 15000],
    deliveryRange: [1, 21]
  },
  "Video & Animation": {
    subcategories: ["Video Editing", "Visual Effects", "Intro & Outro Videos", "Video Ads", "Lyric & Music Videos", "Slideshow Videos", "Live Action Explainer", "Animation", "Character Animation", "Logo Animation", "Lottie & Web Animation", "NFT Animation", "Article to Video", "App & Website Previews", "Crowdfunding Videos"],
    basePrices: [2000, 50000],
    deliveryRange: [3, 30]
  },
  "Music & Audio": {
    subcategories: ["Voice Over", "Music Production", "Audio Editing", "Sound Design", "Mixing & Mastering", "Jingles & Intros", "Audiobook Production", "Podcast Production", "Audio Ads", "Custom Songs", "Online Music Lessons", "Audio Logo & Sonic Branding", "DJ Drops & Tags", "Singer-Songwriter", "Session Musicians"],
    basePrices: [800, 20000],
    deliveryRange: [1, 14]
  },
  "Programming & Tech": {
    subcategories: ["Website Development", "Website Platforms", "Website Maintenance", "Mobile Apps", "Desktop Applications", "Chatbot Development", "Game Development", "Web Programming", "E-Commerce Development", "Database", "User Testing", "QA & Review", "DevOps & Cloud", "Cybersecurity", "Data Processing"],
    basePrices: [2000, 100000],
    deliveryRange: [1, 60]
  },
  "Business": {
    subcategories: ["Virtual Assistant", "Data Entry", "Market Research", "Business Plans", "Legal Consulting", "Financial Consulting", "HR Consulting", "Customer Care", "Project Management", "CRM Management", "ERP Management", "Supply Chain Management", "Event Management", "Sales", "Lead Generation"],
    basePrices: [500, 30000],
    deliveryRange: [1, 30]
  },
  "Lifestyle": {
    subcategories: ["Gaming", "Fitness", "Nutrition", "Cooking Lessons", "Arts & Crafts", "Relationship Advice", "Travel Itineraries", "Astrology", "Spiritual & Healing", "Family & Genealogy", "Career Counseling", "Life Coaching", "Fashion Advice", "Beauty", "Wellness"],
    basePrices: [800, 15000],
    deliveryRange: [1, 21]
  }
};

// Realistic Kenyan seller names and profiles
const kenyanSellers = [
  { name: "Grace Wanjiku", location: "Nairobi", expertise: "Graphics & Design", joinYear: 2019, level: "Top Rated Plus" },
  { name: "John Kamau", location: "Mombasa", expertise: "Writing & Translation", joinYear: 2020, level: "Level 2" },
  { name: "Peter Mwangi", location: "Kisumu", expertise: "Programming & Tech", joinYear: 2018, level: "Top Rated Plus" },
  { name: "Sarah Njeri", location: "Nakuru", expertise: "Digital Marketing", joinYear: 2021, level: "Level 2" },
  { name: "David Kiprotich", location: "Eldoret", expertise: "Video & Animation", joinYear: 2020, level: "Level 1" },
  { name: "Mary Wanjiru", location: "Thika", expertise: "Business", joinYear: 2019, level: "Level 1" },
  { name: "Michael Ochieng", location: "Kakamega", expertise: "Music & Audio", joinYear: 2018, level: "Top Rated" },
  { name: "Catherine Nyong", location: "Meru", expertise: "Lifestyle", joinYear: 2021, level: "New Seller" },
  // ... adding more sellers
  "Dennis Kimani", "Joyce Akinyi", "Alex Ruto", "Lillian Njoroge", "George Wafula", "Beatrice Muthoni",
  "Paul Kiplagat", "Hannah Wairimu", "Martin Omondi", "Stella Gathoni", "Philip Kibet", "Lydia Macharia",
  "Tony Maina", "Eunice Wanjala", "Moses Karanja", "Violet Cheptoo", "Edwin Mogaka", "Gladys Kerubo",
  "Collins Wafula", "Irene Wanjiru", "Kevin Mbugua", "Mary Atieno", "Robert Kiprop", "Susan Nyambura",
  "Lucy Chepkoech", "Daniel Kiprotich", "Grace Wambui", "James Mutua", "Winnie Achieng", "Peter Kimani",
  "Nancy Wanjiru", "Andrew Ruto", "Faith Njoroge", "John Otieno", "Elizabeth Chebet", "David Kamau",
  "Jane Wanjiku", "Patrick Mwangi", "Faith Auma", "Joseph Kamau", "Mercy Wanjiku", "Brian Otieno",
  "Rose Chebet", "Victor Mutua", "Esther Wambui", "Francis Ochieng"
].map((seller, index) => {
  if (typeof seller === 'string') {
    const categories = Object.keys(fiverCategories);
    return {
      name: seller,
      location: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kakamega", "Meru", "Nyeri", "Machakos"][index % 10],
      expertise: categories[index % categories.length],
      joinYear: 2017 + (index % 7),
      level: ["New Seller", "Level 1", "Level 2", "Top Rated", "Top Rated Plus"][Math.floor(index / 10) % 5]
    };
  }
  return seller;
});

// Fiverr-like gig titles templates (1000+ combinations)
const gigTitleTemplates = {
  "Graphics & Design": [
    "I will design a professional minimalist logo for your brand",
    "I will create stunning social media graphics for your business",
    "I will design eye-catching flyers and posters",
    "I will create a complete brand identity package",
    "I will design business cards and stationery",
    "I will create custom illustrations and vector art",
    "I will design professional presentation templates",
    "I will create infographics and data visualizations",
    "I will design packaging and label designs",
    "I will create web and mobile app UI designs",
    "I will design brochures and marketing materials",
    "I will create custom icons and graphics",
    "I will design book covers and ebook layouts",
    "I will create banner ads and web graphics",
    "I will design t-shirts and merchandise",
    // ... more variations
  ],
  "Digital Marketing": [
    "I will run effective Facebook and Instagram ad campaigns",
    "I will optimize your website for search engines",
    "I will create comprehensive digital marketing strategies",
    "I will manage your social media accounts professionally",
    "I will write compelling sales copy and landing pages",
    "I will conduct thorough market research and analysis",
    "I will create email marketing campaigns that convert",
    "I will optimize your Google Ads for better ROI",
    "I will provide SEO audit and optimization services",
    "I will create content marketing strategies",
    "I will manage your LinkedIn marketing campaigns",
    "I will provide influencer marketing services",
    "I will create YouTube channel optimization",
    "I will develop brand positioning strategies",
    "I will provide conversion rate optimization",
    // ... more variations
  ]
  // ... continuing for all categories
};

// Generate 1000+ gigs with authentic data
function generateMassiveGigData() {
  let gigId = 1;
  
  for (const [categoryName, categoryData] of Object.entries(fiverCategories)) {
    const { subcategories, basePrices, deliveryRange } = categoryData;
    const categoryImages = imageCategories[categoryName];
    
    // Generate 125 gigs per category (8 categories × 125 = 1000 gigs)
    for (let i = 0; i < 125; i++) {
      const subcategory = subcategories[i % subcategories.length];
      const seller = kenyanSellers[Math.floor(Math.random() * kenyanSellers.length)];
      const basePrice = Math.floor(Math.random() * (basePrices[1] - basePrices[0])) + basePrices[0];
      const deliveryTime = Math.floor(Math.random() * (deliveryRange[1] - deliveryRange[0])) + deliveryRange[0];
      const rating = 3.7 + Math.random() * 1.3; // 3.7 to 5.0
      const reviewCount = Math.floor(Math.random() * 2000) + 10;
      const orderCount = Math.floor(reviewCount * (1.2 + Math.random() * 3));
      const isKinapChoice = Math.random() > 0.88; // 12% are KiNaP's Choice
      const imageUrl = categoryImages[Math.floor(Math.random() * categoryImages.length)];
      
      // Generate package prices (Fiverr-style)
      const basicPrice = basePrice;
      const standardPrice = Math.floor(basicPrice * (1.7 + Math.random() * 0.6));
      const premiumPrice = Math.floor(standardPrice * (1.5 + Math.random() * 0.8));
      
      const gig = {
        id: gigId++,
        title: generateGigTitle(categoryName, subcategory, i),
        description: generateGigDescription(categoryName, subcategory),
        image: imageUrl,
        images: [imageUrl, imageUrl, imageUrl], // Fiverr has multiple images
        category: categoryName,
        subcategory: subcategory,
        price: basicPrice,
        originalPrice: Math.floor(basicPrice * (1.3 + Math.random() * 0.7)),
        rating: Math.round(rating * 10) / 10,
        reviews: reviewCount,
        orders: orderCount,
        deliveryTime: `${deliveryTime} day${deliveryTime > 1 ? 's' : ''}`,
        seller: {
          name: seller.name,
          username: seller.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 999),
          image: `https://i.pravatar.cc/150?u=${seller.name}`,
          level: seller.level,
          country: "Kenya",
          location: seller.location,
          responseTime: `${Math.floor(Math.random() * 6) + 1} hour${Math.floor(Math.random() * 6) + 1 > 1 ? 's' : ''}`,
          lastSeen: Math.random() > 0.4 ? "Online" : `${Math.floor(Math.random() * 48)} hours ago`,
          verified: Math.random() > 0.15, // 85% verified
          sellerSince: seller.joinYear,
          totalOrders: orderCount + Math.floor(Math.random() * 500),
          totalReviews: reviewCount + Math.floor(Math.random() * 200),
          languages: ["English", Math.random() > 0.3 ? "Swahili" : null].filter(Boolean)
        },
        features: generateGigFeatures(categoryName, subcategory),
        tags: generateGigTags(categoryName, subcategory),
        isFavorite: Math.random() > 0.85,
        isKinapChoice: isKinapChoice,
        badge: generateBadge(orderCount, rating, isKinapChoice),
        packages: [
          {
            name: "basic",
            title: "Basic",
            price: basicPrice,
            deliveryTime: deliveryTime,
            revisions: Math.floor(Math.random() * 3) + 1,
            description: generatePackageDescription("basic", subcategory),
            features: generatePackageFeatures("basic", subcategory)
          },
          {
            name: "standard",
            title: "Standard",
            price: standardPrice,
            deliveryTime: deliveryTime + Math.floor(Math.random() * 3) + 1,
            revisions: Math.floor(Math.random() * 3) + 3,
            description: generatePackageDescription("standard", subcategory),
            features: generatePackageFeatures("standard", subcategory)
          },
          {
            name: "premium",
            title: "Premium",
            price: premiumPrice,
            deliveryTime: deliveryTime + Math.floor(Math.random() * 5) + 2,
            revisions: Math.floor(Math.random() * 5) + 5,
            description: generatePackageDescription("premium", subcategory),
            features: generatePackageFeatures("premium", subcategory)
          }
        ],
        stats: {
          views: Math.floor(Math.random() * 10000) + 100,
          orders: orderCount,
          rating: Math.round(rating * 10) / 10,
          reviews: reviewCount,
          completionRate: Math.floor(Math.random() * 10) + 90,
          onTimeDelivery: Math.floor(Math.random() * 15) + 85,
          responseRate: Math.floor(Math.random() * 20) + 80
        },
        recentReviews: generateRecentReviews(gigId - 1, reviewCount),
        createdAt: new Date(2024 - Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      };
      
      sampleGigs.push(gig);
    }
  }
  
  return sampleGigs;
}

// Helper functions for generating realistic content
function generateGigTitle(category, subcategory, index) {
  const titles = {
    "Graphics & Design": {
      "Logo Design": [
        "I will design a professional minimalist logo for your brand",
        "I will create a modern logo with unlimited revisions",
        "I will design a creative logo that stands out",
        "I will create a professional business logo design",
        "I will design a unique logo for your startup"
      ],
      "Social Media Design": [
        "I will create stunning social media graphics for your business",
        "I will design Instagram posts and stories",
        "I will create Facebook cover and post designs",
        "I will design LinkedIn banner and posts",
        "I will create YouTube thumbnails and channel art"
      ]
      // ... more subcategory titles
    }
    // ... other categories
  };
  
  const categoryTitles = titles[category]?.[subcategory] || [
    `I will provide professional ${subcategory.toLowerCase()} services`,
    `I will create amazing ${subcategory.toLowerCase()} for your business`,
    `I will deliver high-quality ${subcategory.toLowerCase()} work`
  ];
  
  return categoryTitles[index % categoryTitles.length];
}

function generateGigDescription(category, subcategory) {
  return `Professional ${subcategory.toLowerCase()} service with high-quality delivery and customer satisfaction guaranteed. I have extensive experience in ${category.toLowerCase()} and specialize in ${subcategory.toLowerCase()}. You'll receive premium quality work with unlimited revisions until you're 100% satisfied. Fast delivery, excellent communication, and professional service guaranteed.`;
}

function generateGigFeatures(category, subcategory) {
  const baseFeatures = ["Professional quality", "Fast delivery", "Unlimited revisions", "24/7 support", "Commercial license"];
  const categoryFeatures = {
    "Graphics & Design": ["High resolution files", "Vector formats", "Source files included", "Print ready"],
    "Digital Marketing": ["Analytics tracking", "Strategy included", "Performance reports", "ROI optimization"],
    "Writing & Translation": ["Plagiarism free", "SEO optimized", "Native speaker", "Research included"],
    "Video & Animation": ["HD quality", "Background music", "Color grading", "Multiple formats"],
    "Music & Audio": ["Studio quality", "Professional mixing", "Commercial rights", "Multiple takes"],
    "Programming & Tech": ["Clean code", "Documentation", "Testing included", "Support provided"],
    "Business": ["Market research", "Data analysis", "Professional reports", "Strategic insights"],
    "Lifestyle": ["Personalized approach", "Expert guidance", "Progress tracking", "Results guaranteed"]
  };
  
  return [...baseFeatures.slice(0, 3), ...(categoryFeatures[category] || []).slice(0, 2)];
}

function generateGigTags(category, subcategory) {
  const baseTags = [category.toLowerCase().replace(/\s+/g, ''), subcategory.toLowerCase().replace(/\s+/g, '')];
  const extraTags = {
    "Graphics & Design": ["design", "creative", "visual", "branding"],
    "Digital Marketing": ["marketing", "seo", "social", "advertising"],
    "Writing & Translation": ["writing", "content", "copywriting", "editing"],
    "Video & Animation": ["video", "animation", "motion", "editing"],
    "Music & Audio": ["music", "audio", "sound", "recording"],
    "Programming & Tech": ["coding", "development", "tech", "software"],
    "Business": ["business", "consulting", "strategy", "management"],
    "Lifestyle": ["lifestyle", "coaching", "personal", "wellness"]
  };
  
  return [...baseTags, ...(extraTags[category] || []).slice(0, 3)];
}

function generateBadge(orderCount, rating, isKinapChoice) {
  if (isKinapChoice) return "Choice";
  if (orderCount > 1000) return "Bestseller";
  if (orderCount > 500) return "Popular";
  if (rating > 4.8) return "Top Rated";
  if (orderCount < 50) return "New";
  return null;
}

function generatePackageDescription(packageType, subcategory) {
  const descriptions = {
    basic: `Basic ${subcategory.toLowerCase()} package with essential features`,
    standard: `Standard ${subcategory.toLowerCase()} package with enhanced features and faster delivery`,
    premium: `Premium ${subcategory.toLowerCase()} package with all features, priority support, and fastest delivery`
  };
  return descriptions[packageType];
}

function generatePackageFeatures(packageType, subcategory) {
  const features = {
    basic: ["Basic delivery", "Standard quality", "Email support", "1 revision"],
    standard: ["Fast delivery", "Premium quality", "Priority support", "3 revisions", "Source files"],
    premium: ["Express delivery", "Premium quality", "24/7 support", "Unlimited revisions", "Source files", "Commercial license", "Bonus features"]
  };
  return features[packageType];
}

function generateRecentReviews(gigId, reviewCount) {
  const reviewTexts = [
    "Outstanding work! Exactly what I needed and delivered on time. Highly recommend!",
    "Great quality work and professional communication. Will work with again!",
    "Exceeded my expectations! Fast delivery and amazing results. Thank you!",
    "Professional service, high quality work, and excellent communication throughout.",
    "Perfect! Delivered exactly as promised and even added some extra touches.",
    "Very pleased with the result. Quick turnaround and great attention to detail.",
    "Excellent work quality and very responsive. Definitely hiring again!",
    "Amazing talent! Understood my vision perfectly and brought it to life.",
    "Top-notch professional work. Highly skilled and reliable.",
    "Fantastic results! Quick delivery and exceeded all expectations."
  ];
  
  const buyerNames = ["John M.", "Sarah K.", "Mike R.", "Emma L.", "David W.", "Lisa P.", "Tom B.", "Anna S.", "Chris J.", "Maya T."];
  
  const numReviews = Math.min(3, Math.floor(reviewCount / 50) + 1);
  
  return Array.from({ length: numReviews }, (_, index) => ({
    id: gigId * 10 + index,
    rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
    comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
    buyerName: buyerNames[Math.floor(Math.random() * buyerNames.length)],
    buyerAvatar: `https://i.pravatar.cc/50?u=${buyerNames[Math.floor(Math.random() * buyerNames.length)]}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    helpful: Math.floor(Math.random() * 30) + 1,
    verified: Math.random() > 0.2
  }));
}

// Generate all 1000+ gigs
export default generateMassiveGigData(); 