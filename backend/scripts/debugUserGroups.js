const { sequelize } = require('../config/database');
const User = require('../models/User');
const Group = require('../models/Group');

async function debugUserGroups(email) {
  try {
    console.log('🔍 Debugging user groups for:', email);
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('❌ User not found:', email);
      return;
    }
    
    console.log('👤 User found:', {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      interests: user.interests
    });
    
    // Check current groups
    const currentGroups = await Group.getUserGroups(user.id);
    console.log('\n📋 Current groups:', currentGroups.length);
    currentGroups.forEach(group => {
      console.log(`  - ${group.name} (ID: ${group.id}) - Members: ${group.members?.length || 0}`);
    });
    
    // Check user interests
    const interests = user.interests || [];
    console.log('\n🎯 User interests:', interests);
    
    if (interests.length === 0) {
      console.log('❌ No interests found for user');
      return;
    }
    
    // Try to add user to groups based on interests
    console.log('\n🔄 Processing interests...');
    for (const interest of interests) {
      console.log(`\n🎯 Processing: ${interest}`);
      
      // Find group for this interest
      let group = await Group.findOne({ where: { name: interest } });
      
      if (!group) {
        console.log(`📝 Creating new group: ${interest}`);
        group = await Group.create({
          name: interest,
          members: [user.id],
          admins: [user.id],
          description: `${interest} community group`,
          createdById: user.id,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(interest)}&background=1B4F72&color=FFFFFF&bold=true&size=150`,
          category: 'User Interest',
          isPrivate: false
        });
        console.log(`✅ Created group: ${interest} (ID: ${group.id})`);
      } else {
        console.log(`📋 Found existing group: ${interest} (ID: ${group.id})`);
        console.log(`   Current members: ${JSON.stringify(group.members)}`);
        
        let updated = false;
        const members = group.members || [];
        const admins = group.admins || [];
        
        // Check if user is already a member
        if (!members.includes(user.id)) {
          members.push(user.id);
          group.members = members;
          updated = true;
          console.log(`👤 Added user to group: ${interest}`);
        } else {
          console.log(`ℹ️ User already in group: ${interest}`);
        }
        
        // Only make admin if they created the group
        if (group.createdById === user.id && !admins.includes(user.id)) {
          admins.push(user.id);
          group.admins = admins;
          updated = true;
          console.log(`👑 Made user admin of group: ${interest}`);
        }
        
        if (updated) {
          await group.save();
          console.log(`💾 Saved group updates for: ${interest}`);
          console.log(`   New members: ${JSON.stringify(group.members)}`);
        }
      }
    }
    
    // Check groups again after processing
    const updatedGroups = await Group.getUserGroups(user.id);
    console.log('\n📋 Groups after processing:', updatedGroups.length);
    updatedGroups.forEach(group => {
      console.log(`  - ${group.name} (ID: ${group.id}) - Members: ${group.members?.length || 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('❌ Please provide an email: node scripts/debugUserGroups.js your@email.com');
  process.exit(1);
}

debugUserGroups(email);
