const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('📱 Direct WhatsApp Test...');

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
            '--disable-gpu'
        ]
    }
});

// Set up event handlers
client.on('qr', (qr) => {
    console.log('📱 WhatsApp QR Code:');
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan this QR code with your WhatsApp to connect');
});

client.on('ready', async () => {
    console.log('✅ WhatsApp client is ready!');
    
    try {
        // Wait a bit for everything to settle
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('📱 Testing message sending...');
        
        // Try different phone number formats
        const phoneNumbers = [
            '0792343958',
            '+254792343958',
            '254792343958'
        ];
        
        const testCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔢 Test verification code: ${testCode}`);
        
        for (const phoneNumber of phoneNumbers) {
            try {
                console.log(`\n📱 Trying phone number: ${phoneNumber}`);
                
                // Format the number properly
                let formattedNumber = phoneNumber;
                if (phoneNumber.startsWith('0')) {
                    formattedNumber = '+254' + phoneNumber.substring(1);
                } else if (!phoneNumber.startsWith('+')) {
                    formattedNumber = '+' + phoneNumber;
                }
                
                console.log(`📱 Formatted number: ${formattedNumber}`);
                
                const message = `🔐 *KINAP AJIRA CLUB - VERIFICATION CODE*

Hello there!

Your verification code is: *${testCode}*

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

📱 *This is an automated message from Kinap Ajira Club*
🚫 *Please do not reply to this message*

Best regards,
*Kinap Ajira Club Team*`;

                console.log('📤 Sending message...');
                const result = await client.sendMessage(`${formattedNumber}@c.us`, message);
                
                console.log('🎉 Message sent successfully!');
                console.log('📱 Check your WhatsApp for the verification code');
                console.log(`🔢 The code is: ${testCode}`);
                
                // Success! Exit the loop
                break;
                
            } catch (error) {
                console.log(`❌ Failed with ${phoneNumber}:`, error.message);
                continue;
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated successfully');
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp authentication failed:', msg);
});

// Initialize client
client.initialize().then(() => {
    console.log('🎉 WhatsApp client initialized');
}).catch((error) => {
    console.error('❌ Failed to initialize:', error.message);
}); 