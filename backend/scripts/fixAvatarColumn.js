const { sequelize } = require('../config/database');

async function fixAvatarColumn() {
  try {
    console.log('🔄 Fixing avatar column size to handle large Base64 images...');
    
    // Check current column definition
    console.log('📋 Checking current avatar column definition...');
    const [currentDef] = await sequelize.query(`
      SHOW COLUMNS FROM users WHERE Field = 'avatar'
    `);
    
    if (currentDef.length > 0) {
      console.log('Current avatar column type:', currentDef[0].Type);
    }
    
    // Modify the avatar column to LONGTEXT to handle large Base64 images
    console.log('🔧 Modifying avatar column to LONGTEXT...');
    await sequelize.query(`
      ALTER TABLE users MODIFY COLUMN avatar LONGTEXT NULL
    `);
    
    console.log('✅ Avatar column updated to LONGTEXT successfully!');
    
    // Verify the change
    console.log('🔍 Verifying the column change...');
    const [newDef] = await sequelize.query(`
      SHOW COLUMNS FROM users WHERE Field = 'avatar'
    `);
    
    if (newDef.length > 0) {
      console.log('Updated avatar column type:', newDef[0].Type);
    }
    
    console.log('🎉 Avatar column can now handle large Base64 images!');
    console.log('📏 LONGTEXT can store up to 4GB of data');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing avatar column:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

fixAvatarColumn();
