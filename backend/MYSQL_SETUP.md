# MySQL Setup Guide - Migration from MongoDB

This guide helps you set up MySQL for the KiNaP Ajira Club platform after migrating from MongoDB.

## ⚡ Quick Setup Checklist

- [ ] MySQL server installed and running
- [ ] Database created
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Database connection tested

## 🔧 Environment Variables

Update your `.env` file in the backend directory with these MySQL settings:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=ajira_digital_kinap
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_mysql_password_here

# Better Auth (will use the same MySQL settings)
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production

# Keep your existing email and other settings
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
# ... other existing settings
```

## 📋 MySQL Server Setup

### Option 1: Local MySQL Installation

1. **Install MySQL Server**
   ```bash
   # Windows
   Download from: https://dev.mysql.com/downloads/mysql/
   
   # macOS
   brew install mysql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   
   # CentOS/RHEL
   sudo yum install mysql-server
   ```

2. **Start MySQL Service**
   ```bash
   # Windows (as Administrator)
   net start mysql
   
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

3. **Create Database**
   ```sql
   mysql -u root -p
   CREATE DATABASE ajira_digital_kinap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'ajira_user'@'localhost' IDENTIFIED BY 'secure_password_here';
   GRANT ALL PRIVILEGES ON ajira_digital_kinap.* TO 'ajira_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Option 2: Docker MySQL

```bash
# Run MySQL in Docker
docker run --name mysql-ajira \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=ajira_digital_kinap \
  -e MYSQL_USER=ajira_user \
  -e MYSQL_PASSWORD=secure_password \
  -p 3306:3306 \
  -d mysql:8.0

# Update .env file accordingly
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=ajira_digital_kinap
MYSQL_USERNAME=ajira_user
MYSQL_PASSWORD=secure_password
```

### Option 3: Cloud MySQL (AWS RDS, Google Cloud SQL, etc.)

1. Create a MySQL instance in your cloud provider
2. Configure security groups/firewall rules
3. Get connection details from your cloud console
4. Update `.env` with cloud MySQL credentials

## 🚀 Testing the Connection

1. **Test MySQL Connection**
   ```bash
   cd backend
   node -e "
   const { testConnection } = require('./config/database');
   testConnection().then(success => {
     console.log('Connection test:', success ? 'SUCCESS' : 'FAILED');
     process.exit(success ? 0 : 1);
   });
   "
   ```

2. **Start the Server**
   ```bash
   cd backend
   npm run dev
   ```

   You should see:
   ```
   🔄 Attempting MySQL connection (attempt 1/3)...
   ✅ MySQL connected successfully
   ✅ Database synchronized
   🚀 Server running on port 5000
   ```

## 📊 Database Tables

The following tables will be automatically created:

- `users` - User accounts and profiles
- `chat_messages` - Community chat messages
- `gigs` - Marketplace service listings
- `orders` - Service orders and transactions
- `groups` - Community groups
- And other related tables...

## 🔄 Data Migration (Optional)

If you have existing MongoDB data, create a migration script:

```javascript
// backend/scripts/migrateFromMongoDB.js
const mongoose = require('mongoose');
const { sequelize, User, ChatMessage, Gig, Order, Group } = require('../models');

const migrateData = async () => {
  try {
    // Connect to both databases
    await mongoose.connect(process.env.MONGODB_URI);
    await sequelize.authenticate();
    
    console.log('Starting data migration...');
    
    // Migrate users, messages, gigs, etc.
    // Implementation depends on your specific data structure
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

migrateData();
```

## 🚨 Troubleshooting

### Connection Issues

**Error: "Access denied for user"**
```bash
# Reset MySQL password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

**Error: "Database doesn't exist"**
```bash
mysql -u root -p
CREATE DATABASE ajira_digital_kinap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Error: "Can't connect to MySQL server"**
- Verify MySQL service is running
- Check if port 3306 is open
- Verify host and port in .env file

### Performance Optimization

```sql
-- Optimize MySQL for the application
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 200;
SET GLOBAL query_cache_size = 67108864; -- 64MB
```

## 📈 Monitoring

### Check Database Status
```sql
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Threads_running';
SHOW PROCESSLIST;
```

### View Table Information
```sql
USE ajira_digital_kinap;
SHOW TABLES;
DESCRIBE users;
SELECT COUNT(*) FROM users;
```

## 🔒 Security Best Practices

1. **Use Strong Passwords**
   - At least 12 characters
   - Mix of letters, numbers, symbols

2. **Limit User Privileges**
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON ajira_digital_kinap.* TO 'ajira_user'@'localhost';
   ```

3. **Enable SSL (Production)**
   ```env
   MYSQL_SSL_CA=/path/to/ca-cert.pem
   MYSQL_SSL_CERT=/path/to/client-cert.pem
   MYSQL_SSL_KEY=/path/to/client-key.pem
   ```

4. **Regular Backups**
   ```bash
   mysqldump -u root -p ajira_digital_kinap > backup_$(date +%Y%m%d).sql
   ```

## ✅ Migration Verification

After setup, verify these work:
- [ ] User registration and login
- [ ] Community chat messages
- [ ] Marketplace gig creation
- [ ] Order placement
- [ ] File uploads
- [ ] Email notifications

## 🆘 Need Help?

1. **Check MySQL Error Logs**
   ```bash
   # Linux
   sudo tail -f /var/log/mysql/error.log
   
   # macOS (Homebrew)
   tail -f /usr/local/var/mysql/*.err
   
   # Windows
   # Check MySQL installation directory for error logs
   ```

2. **Test Individual Components**
   ```bash
   # Test database connection only
   node -e "require('./config/database').testConnection()"
   
   # Test specific model
   node -e "require('./models/User').findAll().then(console.log)"
   ```

3. **Community Support**
   - Check project issues on GitHub
   - Ask in community discussions
   - Contact development team

---

**🎉 Congratulations! Your MySQL migration is complete!**

The application now uses MySQL for all data storage instead of MongoDB, with improved performance and reliability.
