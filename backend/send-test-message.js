const { client, sendVerificationWhatsApp, generateVerificationCode, testWhatsAppConnection } = require('./services/whatsappService');

async function sendTestMessage() {
    console.log('📱 Sending test WhatsApp message...');
    
    try {
        // Wait for client to be ready
        console.log('⏳ Waiting for WhatsApp client to be ready...');
        let attempts = 0;
        let clientReady = false;
        
        while (attempts < 10 && !clientReady) {
            try {
                const connectionTest = await testWhatsAppConnection();
                if (connectionTest.working) {
                    clientReady = true;
                    console.log('✅ WhatsApp client is ready!');
                } else {
                    console.log(`⏳ Waiting... (attempt ${attempts + 1}/10): ${connectionTest.message}`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    attempts++;
                }
            } catch (error) {
                console.log(`⏳ Waiting... (attempt ${attempts + 1}/10): ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            }
        }
        
        if (!clientReady) {
            throw new Error('WhatsApp client failed to become ready after 10 attempts');
        }
        
        const phoneNumber = '0792343958';
        const testCode = generateVerificationCode();
        
        console.log(`📱 Sending to: ${phoneNumber}`);
        console.log(`🔢 Verification code: ${testCode}`);
        
        const result = await sendVerificationWhatsApp(phoneNumber, testCode, 'Test User');
        
        console.log('✅ Message sent successfully!');
        console.log('📱 Check your WhatsApp for the verification code');
        console.log(`🔢 The code is: ${testCode}`);
        
    } catch (error) {
        console.error('❌ Failed to send message:', error.message);
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure WhatsApp is connected');
        console.log('2. Check if the phone number is correct');
        console.log('3. Ensure WhatsApp is working on your phone');
        console.log('4. Try restarting the WhatsApp service');
    }
}

sendTestMessage(); 