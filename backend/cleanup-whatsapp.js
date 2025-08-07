const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up WhatsApp Web.js session files...');

const sessionPaths = [
    './.wwebjs_auth',
    './whatsapp-session',
    './.wwebjs_cache'
];

sessionPaths.forEach(sessionPath => {
    if (fs.existsSync(sessionPath)) {
        try {
            // Remove the directory and all its contents
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log(`✅ Removed: ${sessionPath}`);
        } catch (error) {
            console.log(`⚠️ Could not remove ${sessionPath}:`, error.message);
        }
    } else {
        console.log(`ℹ️ Directory not found: ${sessionPath}`);
    }
});

console.log('\n🎉 Cleanup completed!');
console.log('📱 You can now restart the WhatsApp service.');
console.log('🔧 Run: npm run test-whatsapp'); 