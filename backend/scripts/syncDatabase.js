const { sequelize } = require('../config/database');
require('../models'); // Import all models to register them

async function syncDatabase() {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: true, force: false });
    console.log('✅ Database synchronized successfully');
    
    // List all tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📋 Available tables:');
    results.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log(`   - ${tableName}`);
    });
    
    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
