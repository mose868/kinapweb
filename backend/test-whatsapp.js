const { initializeWhatsApp, testWhatsAppConnection, sendVerificationWhatsApp, generateVerificationCode } = require('./services/whatsappService');

async function testWhatsAppService() {
    console.log('📱 Testing Kinap Ajira Club WhatsApp Service...\n');

    console.log('📋 How WhatsApp Verification Works:');
    console.log('1. You scan a QR code with your WhatsApp');
    console.log('2. The system connects to your WhatsApp account');
    console.log('3. Verification codes are sent via WhatsApp messages');
    console.log('4. Users receive codes instantly on WhatsApp');
    console.log('5. Completely FREE - no SMS charges!');

    try {
        // Initialize WhatsApp client
        console.log('\n🔗 Initializing WhatsApp client...');
        initializeWhatsApp();

        // Wait for WhatsApp to be properly initialized and authenticated
        console.log('\n⏳ Waiting for WhatsApp to be ready...');
        setTimeout(async () => {
            try {
                // Test WhatsApp connection
                console.log('\n🔍 Testing WhatsApp connection...');
                const connectionTest = await testWhatsAppConnection();
                
                if (connectionTest.working) {
                    console.log('✅ WhatsApp connection successful');
                    console.log('📱 Connection state:', connectionTest.state);
                    
                    // Test sending a verification message
                    console.log('\n📧 Testing verification WhatsApp...');
                    
                    const readline = require('readline');
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    rl.question('Enter your phone number (e.g., 0792343958): ', async (phoneNumber) => {
                        rl.close();
                        
                        if (!phoneNumber || phoneNumber.length < 10) {
                            console.log('❌ Please enter a valid phone number (at least 10 digits)');
                            return;
                        }

                        console.log(`\n📱 Testing with phone number: ${phoneNumber}`);
                        
                        try {
                            const testCode = generateVerificationCode();
                            console.log(`🔢 Test verification code: ${testCode}`);
                            
                            await sendVerificationWhatsApp(phoneNumber, testCode, 'Test User');
                            console.log('✅ Verification WhatsApp sent successfully');
                            console.log(`📱 Check your WhatsApp: ${phoneNumber}`);
                            console.log('\n🎉 WhatsApp service is working perfectly!');
                            console.log('You can now use WhatsApp verification for registration and password reset.');
                            
                        } catch (whatsappError) {
                            console.error('❌ Failed to send WhatsApp message:', whatsappError.message);
                            console.log('\n🔧 Troubleshooting:');
                            console.log('1. Make sure you scanned the QR code with WhatsApp');
                            console.log('2. Check if the phone number is correct');
                            console.log('3. Ensure WhatsApp is connected to the internet');
                            console.log('4. Try a different phone number');
                        }
                    });
                    
                } else {
                    console.log('❌ WhatsApp connection failed:', connectionTest.message);
                    console.log('\n🔧 Solutions:');
                    console.log('1. Make sure you scanned the QR code');
                    console.log('2. Check your internet connection');
                    console.log('3. Try restarting the application');
                }
                
            } catch (error) {
                console.error('❌ WhatsApp test failed:', error.message);
            }
        }, 10000); // Wait 10 seconds for initialization and authentication

    } catch (error) {
        console.error('❌ WhatsApp service failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure you have WhatsApp installed');
        console.log('2. Check your internet connection');
        console.log('3. Try restarting the application');
    }
}

testWhatsAppService(); 