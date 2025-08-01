// Simple test script for WhatsApp
const { sendVerificationMessage, generateVerificationCode, client, isWhatsAppReady } = require('./whatsapp-server');

async function testWhatsApp() {
    console.log('📱 Testing WhatsApp message...');
    
    try {
        // Wait for WhatsApp to be ready
        let attempts = 0;
        let ready = false;
        
        while (attempts < 30 && !ready) {
            try {
                // Check if client exists and has a page
                if (client && client.pupPage) {
                    const state = await client.getState();
                    console.log(`📊 WhatsApp state: ${state}`);
                    
                    if (state === 'CONNECTED' || state === 'AUTHENTICATED') {
                        ready = true;
                        console.log('✅ WhatsApp is ready!');
                        break;
                    }
                }
                
                console.log(`⏳ Waiting for WhatsApp to be ready... (${attempts + 1}/30)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } catch (error) {
                console.log(`⏳ Waiting... (${attempts + 1}/30): ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            }
        }
        
        if (!ready) {
            throw new Error('WhatsApp is not ready after 60 seconds');
        }
        
        // Send test message
        const phoneNumber = '0792343958';
        const testCode = generateVerificationCode();
        
        console.log(`📱 Sending to: ${phoneNumber}`);
        console.log(`🔢 Verification code: ${testCode}`);
        
        const result = await sendVerificationMessage(phoneNumber, testCode, 'Test User');
        
        console.log('🎉 Message sent successfully!');
        console.log('📱 Check your WhatsApp for the verification code');
        console.log(`🔢 The code is: ${testCode}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('🔧 Make sure WhatsApp server is running: node whatsapp-server.js');
    }
}

// Wait a bit before testing
setTimeout(testWhatsApp, 3000); 