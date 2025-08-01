const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🔄 Restarting WhatsApp service...');

// Clean up any existing client
if (global.whatsappClient) {
    try {
        await global.whatsappClient.destroy();
        console.log('✅ Previous client destroyed');
    } catch (error) {
        console.log('⚠️ Could not destroy previous client:', error.message);
    }
}

// Create new client with better configuration
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ],
        timeout: 60000
    }
});

// Set up event handlers
client.on('qr', (qr) => {
    console.log('📱 WhatsApp QR Code:');
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan this QR code with your WhatsApp to connect');
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    console.log('📱 Display name set to: Kinap Ajira Club');
    
    // Set display name
    try {
        client.setDisplayName('Kinap Ajira Club');
    } catch (error) {
        console.log('⚠️ Could not set display name:', error.message);
    }
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated successfully');
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('📱 WhatsApp disconnected:', reason);
});

// Initialize client
try {
    console.log('🔗 Initializing WhatsApp client...');
    await client.initialize();
    console.log('✅ WhatsApp client initialized successfully');
    
    // Store client globally
    global.whatsappClient = client;
    
    // Test connection after 5 seconds
    setTimeout(async () => {
        try {
            const state = await client.getState();
            console.log(`📊 WhatsApp state: ${state}`);
            
            if (state === 'CONNECTED' || state === 'AUTHENTICATED') {
                console.log('🎉 WhatsApp is ready to send messages!');
                console.log('📱 You can now run: node send-test-message.js');
            } else {
                console.log('⏳ Waiting for WhatsApp to be fully connected...');
            }
        } catch (error) {
            console.log('⚠️ Could not check state:', error.message);
        }
    }, 5000);
    
} catch (error) {
    console.error('❌ Failed to initialize WhatsApp client:', error.message);
    console.log('🔧 Try running: npm run cleanup-whatsapp');
}

module.exports = { client }; 