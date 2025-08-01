const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting WhatsApp Server...');

// Create WhatsApp client
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

// Global variable to track if client is ready
global.whatsappReady = false;

// Function to check if WhatsApp is ready
const isWhatsAppReady = () => {
    return global.whatsappReady && client && client.pupPage;
};

// Set up event handlers
client.on('qr', (qr) => {
    console.log('📱 WhatsApp QR Code:');
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan this QR code with your WhatsApp to connect');
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    console.log('📱 Display name set to: Kinap Ajira Club');
    global.whatsappReady = true;
    
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
    global.whatsappReady = false;
});

client.on('disconnected', (reason) => {
    console.log('📱 WhatsApp disconnected:', reason);
    global.whatsappReady = false;
});

// Function to send verification message
const sendVerificationMessage = async (phoneNumber, code, userName = null) => {
    if (!global.whatsappReady) {
        throw new Error('WhatsApp client is not ready');
    }

    try {
        // Format phone number
        let formattedNumber = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            formattedNumber = '+254' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('+')) {
            formattedNumber = '+' + phoneNumber;
        }

        console.log(`📱 Sending message to: ${formattedNumber}`);

        const message = `🔐 *KINAP AJIRA CLUB - VERIFICATION CODE*

Hello ${userName || 'there'}!

Your verification code is: *${code}*

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

📱 *This is an automated message from Kinap Ajira Club*
🚫 *Please do not reply to this message*

If you didn't request this code, please ignore this message.

Best regards,
*Kinap Ajira Club Team*
---
*This is a verification service. Replies are not monitored.*`;

        const result = await client.sendMessage(`${formattedNumber}@c.us`, message);
        
        console.log('✅ Message sent successfully!');
        return { success: true, messageId: result.id._serialized };
        
    } catch (error) {
        console.error('❌ Failed to send message:', error.message);
        throw error;
    }
};

// Function to generate verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Initialize client
const initializeWhatsApp = async () => {
    try {
        console.log('🔗 Initializing WhatsApp client...');
        await client.initialize();
        console.log('✅ WhatsApp client initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize WhatsApp client:', error.message);
        throw error;
    }
};

// Export functions
module.exports = {
    client,
    sendVerificationMessage,
    generateVerificationCode,
    initializeWhatsApp,
    isWhatsAppReady
};

// Start the server
initializeWhatsApp().then(() => {
    console.log('🎉 WhatsApp Server is running!');
    console.log('📱 You can now send messages using the client');
}).catch((error) => {
    console.error('❌ Failed to start WhatsApp Server:', error.message);
}); 