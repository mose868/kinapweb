const venom = require('venom-bot');

console.log('🐍 Testing Venom Bot WhatsApp...');

// Create Venom client
venom
  .create({
    session: 'kinap-ajira-club',
    multidevice: true,
    headless: true,
    useChrome: false,
    debug: false,
    logQR: true,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  })
  .then((client) => {
    console.log('✅ Venom Bot client created successfully!');
    
    // Test sending message after 5 seconds
    setTimeout(async () => {
      try {
        console.log('📱 Testing message sending...');
        
        const phoneNumber = '0792343958';
        const testCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        console.log(`📱 Sending to: ${phoneNumber}`);
        console.log(`🔢 Verification code: ${testCode}`);
        
        const message = `🔐 *KINAP AJIRA CLUB - VERIFICATION CODE*

Hello there!

Your verification code is: *${testCode}*

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

📱 *This is an automated message from Kinap Ajira Club*
🚫 *Please do not reply to this message*

Best regards,
*Kinap Ajira Club Team*`;

        // Try different phone number formats
        const phoneNumbers = [
          phoneNumber,
          `+254${phoneNumber.substring(1)}`,
          `254${phoneNumber.substring(1)}`
        ];
        
        for (const number of phoneNumbers) {
          try {
            console.log(`📤 Trying to send to: ${number}`);
            const result = await client.sendText(`${number}@c.us`, message);
            
            console.log('🎉 Message sent successfully!');
            console.log('📱 Check your WhatsApp for the verification code');
            console.log(`🔢 The code is: ${testCode}`);
            console.log('📊 Result:', result);
            
            break; // Success, exit loop
            
          } catch (error) {
            console.log(`❌ Failed with ${number}:`, error.message);
            continue;
          }
        }
        
      } catch (error) {
        console.error('❌ Test failed:', error.message);
      }
    }, 5000);
    
  })
  .catch((error) => {
    console.error('❌ Failed to create Venom client:', error.message);
  }); 