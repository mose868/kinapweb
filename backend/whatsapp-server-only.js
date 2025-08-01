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
    
    // Test sending a message after 10 seconds (give more time for page to load)
    setTimeout(async () => {
        try {
            console.log('\n📱 Testing message sending...');
            
            // Wait for page to be fully loaded
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if client is ready
            const state = await client.getState();
            console.log(`📊 WhatsApp state: ${state}`);
            
            if (state !== 'CONNECTED' && state !== 'AUTHENTICATED') {
                throw new Error(`WhatsApp is not ready. Current state: ${state}`);
            }
            
            const phoneNumber = '0792343958';
            const testCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Format phone number
            let formattedNumber = phoneNumber;
            if (phoneNumber.startsWith('0')) {
                formattedNumber = '+254' + phoneNumber.substring(1);
            }
            
            console.log(`📱 Sending to: ${formattedNumber}`);
            console.log(`🔢 Verification code: ${testCode}`);
            
            const message = `🔐 *KINAP AJIRA CLUB - VERIFICATION CODE*

Hello there!

Your verification code is: *${testCode}*

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

📱 *This is an automated message from Kinap Ajira Club*
🚫 *Please do not reply to this message*

If you didn't request this code, please ignore this message.

Best regards,
*Kinap Ajira Club Team*
---
*This is a verification service. Replies are not monitored.*`;

            console.log('📤 Attempting to send message...');
            
            // Try to get the chat first
            const chat = await client.getChatById(`${formattedNumber}@c.us`);
            console.log('✅ Chat found, sending message...');
            
            const result = await chat.sendMessage(message);
            
            console.log('🎉 Message sent successfully!');
            console.log('📱 Check your WhatsApp for the verification code');
            console.log(`🔢 The code is: ${testCode}`);
            
        } catch (error) {
            console.error('❌ Failed to send test message:', error.message);
            console.log('🔧 Error details:', error);
            
            // Try to get more error information
            try {
                const state = await client.getState();
                console.log(`📊 Current WhatsApp state: ${state}`);
            } catch (stateError) {
                console.log('📊 Could not get WhatsApp state:', stateError.message);
            }
        }
    }, 10000);
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

// Start the server
initializeWhatsApp().then(() => {
    console.log('🎉 WhatsApp Server is running!');
    console.log('📱 Waiting for authentication...');
}).catch((error) => {
    console.error('❌ Failed to start WhatsApp Server:', error.message);
}); 