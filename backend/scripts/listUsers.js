const { sequelize } = require('../config/database');
const User = require('../models/User');

async function listUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const users = await User.findAll({
      attributes: ['id', 'email', 'displayName', 'interests'],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    console.log(`\n👥 Found ${users.length} users:\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName || 'No name'} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Interests: ${JSON.stringify(user.interests || [])}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

listUsers();
