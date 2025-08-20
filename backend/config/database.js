const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create Sequelize instance with MySQL connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'ajira_digital_kinap',
  process.env.MYSQL_USERNAME || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false,
      paranoid: false,
    },
  }
);

// Test the database connection
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting MySQL connection (attempt ${i + 1}/${retries})...`);
      
      // Check if required environment variables are set
      if (!process.env.MYSQL_HOST && !process.env.MYSQL_DATABASE) {
        console.warn('⚠️ MySQL environment variables not set, using defaults');
        console.log('   Expected: MYSQL_HOST, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD');
      }

      await sequelize.authenticate();
      console.log('✅ MySQL connected successfully');
      
      // Sync database (create tables if they don't exist)
      if (process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ alter: false }); // Set to true for development if you want auto-migration
        console.log('✅ Database synchronized');
      }
      
      return true;
    } catch (error) {
      console.warn(`⚠️ MySQL connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('❌ Failed to connect to MySQL after all attempts');
        console.log('🔧 MySQL troubleshooting:');
        console.log('   1. Verify MySQL server is running');
        console.log('   2. Check MySQL credentials');
        console.log('   3. Verify database exists');
        console.log('   4. Check firewall/network settings');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};

// Handle MySQL connection events
sequelize.addHook('afterConnect', () => {
  console.log('✅ MySQL connection established');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('⚠️ MySQL disconnecting...');
});

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};
