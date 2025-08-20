const { sequelize } = require('../config/database');
const User = require('../models/User');
const Group = require('../models/Group');

async function addUserToInterestGroups(email) {
  try {
    console.log('🔄 Adding user to interest-based groups...');
    console.log('📧 Email:', email);
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('❌ User not found with email:', email);
      return;
    }
    
    console.log('👤 Found user:', user.displayName || user.email);
    console.log('🎯 User interests:', user.interests);
    console.log('🛠️ User skills:', user.skills);
    
    // Process interests
    if (user.interests && Array.isArray(user.interests) && user.interests.length > 0) {
      console.log('✅ Processing interests...');
      
      for (const interest of user.interests) {
        console.log(`🎯 Processing interest: ${interest}`);
        let group = await Group.findOne({ where: { name: interest } });
        
        if (!group) {
          console.log(`📝 Creating new group for interest: ${interest}`);
          group = await Group.create({ 
            name: interest, 
            members: [user.id], 
            admins: [user.id], 
            description: `${interest} community group`, 
            createdById: user.id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(interest)}&background=1B4F72&color=FFFFFF&bold=true&size=150`
          });
          console.log(`✅ Created group: ${interest}`);
        } else {
          console.log(`📋 Found existing group: ${interest}`);
          let updated = false;
          const members = group.members || [];
          const admins = group.admins || [];
          
          if (!members.includes(user.id)) {
            members.push(user.id);
            group.members = members;
            updated = true;
            console.log(`👤 Added user to group: ${interest}`);
          }
          if (!admins.includes(user.id)) {
            admins.push(user.id);
            group.admins = admins;
            updated = true;
            console.log(`👑 Made user admin of group: ${interest}`);
          }
          if (updated) {
            await group.save();
            console.log(`💾 Saved group updates for: ${interest}`);
          } else {
            console.log(`ℹ️ User already in group: ${interest}`);
          }
        }
      }
    } else {
      console.log('❌ No interests found for user');
    }
    
    // Process skills
    if (user.skills && Array.isArray(user.skills) && user.skills.length > 0) {
      console.log('✅ Processing skills...');
      
      for (const skill of user.skills) {
        console.log(`🛠️ Processing skill: ${skill}`);
        let group = await Group.findOne({ where: { name: skill } });
        
        if (!group) {
          console.log(`📝 Creating new group for skill: ${skill}`);
          group = await Group.create({ 
            name: skill, 
            members: [user.id], 
            admins: [user.id], 
            description: `Community group for ${skill} enthusiasts`, 
            createdById: user.id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(skill)}&background=2E8B57&color=FFFFFF&bold=true&size=150`
          });
          console.log(`✅ Created skill group: ${skill}`);
        } else {
          console.log(`📋 Found existing skill group: ${skill}`);
          let updated = false;
          const members = group.members || [];
          const admins = group.admins || [];
          
          if (!members.includes(user.id)) {
            members.push(user.id);
            group.members = members;
            updated = true;
            console.log(`👤 Added user to skill group: ${skill}`);
          }
          if (!admins.includes(user.id)) {
            admins.push(user.id);
            group.admins = admins;
            updated = true;
            console.log(`👑 Made user admin of skill group: ${skill}`);
          }
          if (updated) {
            await group.save();
            console.log(`💾 Saved skill group updates for: ${skill}`);
          } else {
            console.log(`ℹ️ User already in skill group: ${skill}`);
          }
        }
      }
    } else {
      console.log('❌ No skills found for user');
    }
    
    // Show final group membership
    const userGroups = await Group.findAll({
      where: {
        members: {
          [require('sequelize').Op.contains]: [user.id]
        }
      }
    });
    
    console.log('🎉 User is now member of these groups:');
    userGroups.forEach(group => {
      console.log(`  - ${group.name} (${group.description})`);
    });
    
    await sequelize.close();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

// Usage: node scripts/addUserToInterestGroups.js user@example.com
const email = process.argv[2];
if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/addUserToInterestGroups.js user@example.com');
  process.exit(1);
}

addUserToInterestGroups(email);
