const { sequelize } = require('../config/database');
const Group = require('../models/Group');

const DEFAULT_GROUPS = [
  // Tech/Programming Groups
  { name: 'Web Development', category: 'Technology', description: 'Full-stack web development discussions and resources' },
  { name: 'Mobile Development', category: 'Technology', description: 'iOS, Android, and cross-platform mobile development' },
  { name: 'Data Science', category: 'Technology', description: 'Machine learning, AI, and data analysis community' },
  { name: 'UI/UX Design', category: 'Design', description: 'User interface and user experience design' },
  { name: 'Digital Marketing', category: 'Marketing', description: 'SEO, social media, and digital marketing strategies' },
  { name: 'Content Creation', category: 'Creative', description: 'Video, writing, and creative content development' },
  { name: 'Cybersecurity', category: 'Technology', description: 'Information security and cybersecurity discussions' },
  { name: 'Cloud Computing', category: 'Technology', description: 'AWS, Azure, GCP, and cloud infrastructure' },
  { name: 'DevOps', category: 'Technology', description: 'CI/CD, deployment, and infrastructure automation' },
  { name: 'Blockchain', category: 'Technology', description: 'Cryptocurrency, DeFi, and blockchain development' },
  
  // Academic Groups
  { name: 'Computer Science', category: 'Academic', description: 'Computer science students and discussions' },
  { name: 'Business Administration', category: 'Academic', description: 'Business studies and entrepreneurship' },
  { name: 'Information Technology', category: 'Academic', description: 'IT systems and network administration' },
  { name: 'Project Management', category: 'Business', description: 'Agile, Scrum, and project management methodologies' },
  { name: 'Graphic Design', category: 'Design', description: 'Visual design, branding, and creative graphics' },
  
  // Career/Professional Groups
  { name: 'Career Development', category: 'Professional', description: 'Job search, interviews, and career growth' },
  { name: 'Freelancing', category: 'Professional', description: 'Freelance work, client management, and business tips' },
  { name: 'Remote Work', category: 'Professional', description: 'Remote work strategies and opportunities' },
  { name: 'Networking', category: 'Professional', description: 'Professional networking and industry connections' },
  { name: 'Entrepreneurship', category: 'Business', description: 'Startup ideas, business development, and innovation' },
  
  // Learning Groups
  { name: 'Online Learning', category: 'Education', description: 'Online courses, MOOCs, and self-directed learning' },
  { name: 'Certification Prep', category: 'Education', description: 'IT certifications, professional exams, and test prep' },
  { name: 'Research', category: 'Academic', description: 'Academic research, papers, and scholarly discussions' },
  { name: 'Study Groups', category: 'Academic', description: 'Collaborative studying and academic support' },
  
  // Community Groups
  { name: 'Student Support', category: 'Community', description: 'Academic and personal support for students' },
  { name: 'Mentorship', category: 'Community', description: 'Mentor-mentee connections and guidance' },
  { name: 'Events & Meetups', category: 'Community', description: 'Local and virtual events and meetups' },
  { name: 'General Discussion', category: 'Community', description: 'Open discussions and general chat' }
];

async function createDefaultGroups(skipConnectionManagement = false) {
  try {
    console.log('🚀 Starting default groups creation...');
    
    // Connect to database only if not already connected
    if (!skipConnectionManagement) {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
    }
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const groupData of DEFAULT_GROUPS) {
      try {
        // Check if group already exists
        const existingGroup = await Group.findOne({ 
          where: { name: groupData.name } 
        });
        
        if (existingGroup) {
          console.log(`⚪ Group already exists: ${groupData.name}`);
          existingCount++;
        } else {
          // Create new group
          const group = await Group.create({
            name: groupData.name,
            category: groupData.category,
            description: groupData.description,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(groupData.name)}&background=1B4F72&color=FFFFFF&bold=true&size=150`,
            members: [],
            admins: [],
            isPrivate: false,
            createdById: null // System-created groups
          });
          
          console.log(`✅ Created group: ${groupData.name} (ID: ${group.id})`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing group ${groupData.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${createdCount} groups`);
    console.log(`   Existing: ${existingCount} groups`);
    console.log(`   Total: ${createdCount + existingCount} groups`);
    console.log(`🎉 Default groups creation completed!`);
    
  } catch (error) {
    console.error('❌ Error creating default groups:', error);
  } finally {
    // Close database connection only if we opened it
    if (!skipConnectionManagement) {
      await sequelize.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script if called directly
if (require.main === module) {
  createDefaultGroups();
}

module.exports = { createDefaultGroups, DEFAULT_GROUPS };
