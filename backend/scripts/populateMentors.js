const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kinapweb';

const sampleMentors = [
  {
    title: 'Senior React Developer Mentorship',
    slug: 'senior-react-developer',
    mentor: {
      name: 'Sarah Wanjiku',
      bio: 'Senior Frontend Developer at Safaricom with 8+ years experience in React, TypeScript, and modern web technologies. Passionate about mentoring junior developers and sharing industry best practices.',
      profilePhoto: null
    },
    category: 'Web Development',
    expertiseLevel: 'Senior',
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 1 hour'
    },
    instantAvailability: {
      enabled: true,
      responseTime: 'Within 30 minutes'
    },
    pricing: {
      isFree: false,
      sessionRate: 5000,
      currency: 'KES',
      regularPrice: 6000,
      discountPrice: 5000
    },
    location: {
      city: 'Nairobi',
      country: 'Kenya'
    },
    ratings: {
      overall: 4.9,
      totalRatings: 15,
      average: 4.9
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    isFeatured: true,
    sessionTypes: ['Code Review', 'Technical Help', 'Career Advice', 'Project Guidance'],
    skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Redux', 'GraphQL'],
    experience: {
      years: 8,
      description: 'Extensive experience in building scalable web applications and mentoring junior developers.'
    },
    education: {
      degree: 'BSc Computer Science',
      institution: 'University of Nairobi',
      year: 2015
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-wanjiku',
      github: 'https://github.com/sarah-wanjiku',
      portfolio: 'https://sarah-wanjiku.dev'
    },
    stats: {
      sessionsCompleted: 45,
      totalHours: 120,
      satisfactionRate: 98,
      responseRate: 95
    }
  },
  {
    title: 'Data Science & Machine Learning Expert',
    slug: 'data-science-ml-expert',
    mentor: {
      name: 'Dr. Anne Wairimu',
      bio: 'Data Scientist with PhD in Machine Learning from MIT. Currently leading AI initiatives at a major tech company. Expert in Python, TensorFlow, and building production ML systems.',
      profilePhoto: null
    },
    category: 'Data Science',
    expertiseLevel: 'Expert',
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 2 hours'
    },
    instantAvailability: {
      enabled: false,
      responseTime: 'Within 4 hours'
    },
    pricing: {
      isFree: false,
      sessionRate: 8000,
      currency: 'KES',
      regularPrice: 10000,
      discountPrice: 8000
    },
    location: {
      city: 'Nairobi',
      country: 'Kenya'
    },
    ratings: {
      overall: 4.8,
      totalRatings: 23,
      average: 4.8
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    isFeatured: true,
    sessionTypes: ['Technical Help', 'Career Advice', 'Project Guidance', 'Interview Prep'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP'],
    experience: {
      years: 10,
      description: 'PhD in Machine Learning with extensive research and industry experience in AI/ML.'
    },
    education: {
      degree: 'PhD Machine Learning',
      institution: 'MIT',
      year: 2018
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/anne-wairimu',
      github: 'https://github.com/anne-wairimu'
    },
    stats: {
      sessionsCompleted: 67,
      totalHours: 180,
      satisfactionRate: 96,
      responseRate: 92
    }
  },
  {
    title: 'Digital Marketing & Growth Strategy',
    slug: 'digital-marketing-growth',
    mentor: {
      name: 'Grace Muthoni',
      bio: 'Digital Marketing Director with 6+ years experience in growth marketing, SEO, and social media strategy. Helped scale multiple startups from 0 to millions in revenue.',
      profilePhoto: null
    },
    category: 'Digital Marketing',
    expertiseLevel: 'Senior',
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 3 hours'
    },
    instantAvailability: {
      enabled: true,
      responseTime: 'Within 1 hour'
    },
    pricing: {
      isFree: false,
      sessionRate: 4000,
      currency: 'KES',
      regularPrice: 5000,
      discountPrice: 4000
    },
    location: {
      city: 'Mombasa',
      country: 'Kenya'
    },
    ratings: {
      overall: 4.7,
      totalRatings: 18,
      average: 4.7
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    isFeatured: false,
    sessionTypes: ['Career Advice', 'Project Guidance', 'General Mentorship'],
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Growth Hacking', 'Google Ads', 'Analytics'],
    experience: {
      years: 6,
      description: 'Proven track record in digital marketing and growth strategy for various industries.'
    },
    education: {
      degree: 'MBA Marketing',
      institution: 'Strathmore University',
      year: 2019
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/grace-muthoni',
      portfolio: 'https://grace-muthoni.com'
    },
    stats: {
      sessionsCompleted: 34,
      totalHours: 85,
      satisfactionRate: 94,
      responseRate: 88
    }
  },
  {
    title: 'UI/UX Design & Product Strategy',
    slug: 'ui-ux-design-product',
    mentor: {
      name: 'Moses Kimani',
      bio: 'Senior Product Designer with expertise in user experience design, product strategy, and design systems. Worked with major tech companies and startups.',
      profilePhoto: null
    },
    category: 'UI/UX Design',
    expertiseLevel: 'Senior',
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 2 hours'
    },
    instantAvailability: {
      enabled: false,
      responseTime: 'Within 4 hours'
    },
    pricing: {
      isFree: false,
      sessionRate: 6000,
      currency: 'KES',
      regularPrice: 7500,
      discountPrice: 6000
    },
    location: {
      city: 'Nairobi',
      country: 'Kenya'
    },
    ratings: {
      overall: 4.9,
      totalRatings: 12,
      average: 4.9
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    isFeatured: true,
    sessionTypes: ['Project Guidance', 'Technical Help', 'Career Advice'],
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
    experience: {
      years: 7,
      description: 'Extensive experience in product design and user experience across various platforms.'
    },
    education: {
      degree: 'BSc Design',
      institution: 'Kenyatta University',
      year: 2016
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/moses-kimani',
      portfolio: 'https://moses-kimani.design'
    },
    stats: {
      sessionsCompleted: 28,
      totalHours: 70,
      satisfactionRate: 97,
      responseRate: 90
    }
  },
  {
    title: 'Mobile App Development (iOS/Android)',
    slug: 'mobile-app-development',
    mentor: {
      name: 'David Ochieng',
      bio: 'Mobile App Developer specializing in React Native, Flutter, and native iOS/Android development. Built apps with millions of downloads.',
      profilePhoto: null
    },
    category: 'Mobile Development',
    expertiseLevel: 'Senior',
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 1 hour'
    },
    instantAvailability: {
      enabled: true,
      responseTime: 'Within 30 minutes'
    },
    pricing: {
      isFree: false,
      sessionRate: 5500,
      currency: 'KES',
      regularPrice: 7000,
      discountPrice: 5500
    },
    location: {
      city: 'Kisumu',
      country: 'Kenya'
    },
    ratings: {
      overall: 4.6,
      totalRatings: 20,
      average: 4.6
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    isFeatured: false,
    sessionTypes: ['Code Review', 'Technical Help', 'Project Guidance'],
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'],
    experience: {
      years: 5,
      description: 'Specialized in cross-platform mobile development with focus on performance and user experience.'
    },
    education: {
      degree: 'BSc Software Engineering',
      institution: 'Jomo Kenyatta University',
      year: 2018
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/david-ochieng',
      github: 'https://github.com/david-ochieng'
    },
    stats: {
      sessionsCompleted: 41,
      totalHours: 110,
      satisfactionRate: 93,
      responseRate: 89
    }
  }
];

async function populateMentors() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing mentors
    console.log('🧹 Clearing existing mentors...');
    await Mentor.deleteMany({});
    console.log('✅ Cleared existing mentors');

    // Create test users if they don't exist
    console.log('👥 Creating test users for mentors...');
    const testUsers = [];
    
    for (let i = 0; i < sampleMentors.length; i++) {
      const mentor = sampleMentors[i];
      const username = `mentor${i + 1}`;
      const email = `mentor${i + 1}@ajira.com`;
      
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          username,
          email,
          displayName: mentor.mentor.name,
          password: 'password123',
          role: 'student',
          isVerified: true
        });
        await user.save();
        console.log(`✅ Created test user: ${username}`);
      }
      testUsers.push(user);
    }

    // Create mentors with user IDs
    console.log('🤝 Creating mentor profiles...');
    const createdMentors = [];
    
    for (let i = 0; i < sampleMentors.length; i++) {
      const mentorData = {
        ...sampleMentors[i],
        userId: testUsers[i]._id
      };
      
      const mentor = new Mentor(mentorData);
      await mentor.save();
      createdMentors.push(mentor);
      console.log(`✅ Created mentor: ${mentor.mentor.name}`);
    }

    console.log('\n📊 Mentor Database Summary:');
    console.log(`   - Total mentors created: ${createdMentors.length}`);
    console.log(`   - Featured mentors: ${createdMentors.filter(m => m.isFeatured).length}`);
    console.log(`   - Categories: ${[...new Set(createdMentors.map(m => m.category))].join(', ')}`);
    console.log(`   - Cities: ${[...new Set(createdMentors.map(m => m.location.city))].join(', ')}`);

    console.log('\n🎯 Mentor Details:');
    createdMentors.forEach((mentor, index) => {
      console.log(`   ${index + 1}. ${mentor.mentor.name} - ${mentor.category} (${mentor.expertiseLevel})`);
      console.log(`      Rating: ${mentor.ratings.overall}/5 (${mentor.ratings.totalRatings} reviews)`);
      console.log(`      Price: ${mentor.pricing.currency} ${mentor.pricing.sessionRate}/session`);
      console.log(`      Location: ${mentor.location.city}`);
      console.log(`      Featured: ${mentor.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('🎉 Mentor population completed successfully!');
    console.log('\n🔗 Next Steps:');
    console.log('   - Test mentor listing: http://localhost:5173/mentorship');
    console.log('   - Test mentor details: http://localhost:5173/mentorship/[slug]');
    console.log('   - Admin dashboard: http://localhost:5173/admin/mentors');

  } catch (error) {
    console.error('❌ Error populating mentors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the population script
populateMentors(); 