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
      connectTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 10000,
    },
    retry: {
      max: 5,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /ETIMEDOUT/,
        /ECONNRESET/,
        /EPIPE/
      ],
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
      const alterSchema = process.env.SEQUELIZE_ALTER === 'true';
      if (alterSchema || process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ alter: alterSchema });
        console.log(`✅ Database synchronized${alterSchema ? ' with ALTER' : ''}`);
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

// Keep the pool warm to avoid idle disconnects (does not block event loop)
const KEEP_ALIVE_MS = 45000;
setInterval(async () => {
  try {
    await sequelize.query('SELECT 1');
  } catch (e) {
    console.warn('MySQL keep-alive ping failed:', e.message);
  }
}, KEEP_ALIVE_MS).unref();

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};
