const { sequelize } = require('../config/database');

async function addMissingColumns() {
  try {
    console.log('🔄 Adding missing columns to users table...');
    
    // Check current table structure
    console.log('📋 Current table structure:');
    const [results] = await sequelize.query('DESCRIBE users');
    console.log('Current columns:', results.map(col => col.Field));
    
    // Add the missing columns one by one with proper error handling
    try {
      console.log('➕ Adding idNumber column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN idNumber VARCHAR(50) NULL');
      console.log('✅ idNumber column added');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️ idNumber column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      console.log('➕ Adding ajiraGoals column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN ajiraGoals TEXT NULL');
      console.log('✅ ajiraGoals column added');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️ ajiraGoals column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      console.log('➕ Adding interests column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN interests JSON NULL');
      console.log('✅ interests column added');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️ interests column already exists');
      } else {
        throw error;
      }
    }
    
    // Verify the columns were added
    console.log('🔍 Verifying table structure after changes:');
    const [newResults] = await sequelize.query('DESCRIBE users');
    console.log('Updated columns:', newResults.map(col => col.Field));
    
    // Check if all required columns exist
    const columnNames = newResults.map(col => col.Field);
    const requiredColumns = ['idNumber', 'ajiraGoals', 'interests'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('🎉 All required columns added successfully!');
    } else {
      console.log('⚠️ Still missing columns:', missingColumns);
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding columns:', error);
    await sequelize.close();
    process.exit(1);
  }
}

addMissingColumns();
