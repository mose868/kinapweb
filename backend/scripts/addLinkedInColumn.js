const { sequelize } = require('../config/database');

async function addLinkedInColumn() {
  try {
    console.log('🔄 Adding linkedinProfile column to users table...');
    
    // Check current table structure
    console.log('📋 Checking current table structure...');
    const [results] = await sequelize.query('DESCRIBE users');
    const columnNames = results.map(col => col.Field);
    console.log('Current columns:', columnNames);
    
    // Add the linkedinProfile column if it doesn't exist
    if (!columnNames.includes('linkedinProfile')) {
      console.log('➕ Adding linkedinProfile column...');
      await sequelize.query('ALTER TABLE users ADD COLUMN linkedinProfile VARCHAR(255) NULL');
      console.log('✅ linkedinProfile column added');
    } else {
      console.log('ℹ️ linkedinProfile column already exists');
    }
    
    // Verify the column was added
    console.log('🔍 Verifying table structure after changes:');
    const [newResults] = await sequelize.query('DESCRIBE users');
    const newColumnNames = newResults.map(col => col.Field);
    
    if (newColumnNames.includes('linkedinProfile')) {
      console.log('🎉 linkedinProfile column is now available!');
    } else {
      console.log('⚠️ linkedinProfile column was not added successfully');
    }
    
    console.log('Updated columns:', newColumnNames);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding linkedinProfile column:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

addLinkedInColumn();
