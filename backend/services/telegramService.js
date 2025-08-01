const TelegramBot = require('node-telegram-bot-api');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code via Telegram
const sendVerificationTelegram = async (chatId, code, userName = null) => {
  try {
    const message = `
🔐 **Kinap Ajira Club - Verification Code**

Hello ${userName || 'there'}!

Your verification code is: **${code}**

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

If you didn't request this code, please ignore this message.

Best regards,
Kinap Ajira Club Team
    `;

    const result = await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    
    console.log('✅ Telegram message sent successfully');
    console.log('📱 Message ID:', result.message_id);
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error('❌ Telegram message failed:', error.message);
    throw error;
  }
};

// Send password reset code via Telegram
const sendPasswordResetTelegram = async (chatId, code, userName = null) => {
  try {
    const message = `
🔐 **Kinap Ajira Club - Password Reset**

Hello ${userName || 'there'}!

Your password reset code is: **${code}**

⏰ This code is valid for 15 minutes
🔒 Don't share this code with anyone

If you didn't request this code, please ignore this message.

Best regards,
Kinap Ajira Club Team
    `;

    const result = await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    
    console.log('✅ Password reset Telegram message sent');
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error('❌ Password reset Telegram failed:', error.message);
    throw error;
  }
};

// Test Telegram bot connection
const testTelegramConnection = async () => {
  try {
    const botInfo = await bot.getMe();
    console.log('✅ Telegram bot connection successful');
    console.log('🤖 Bot name:', botInfo.first_name);
    console.log('👤 Bot username:', botInfo.username);
    return { 
      working: true, 
      message: 'Telegram bot is working correctly',
      botInfo: botInfo
    };
  } catch (error) {
    return { 
      working: false, 
      message: error.message 
    };
  }
};

// Get bot info for users to start chat
const getBotInfo = async () => {
  try {
    const botInfo = await bot.getMe();
    return {
      username: botInfo.username,
      name: botInfo.first_name,
      startLink: `https://t.me/${botInfo.username}`
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendVerificationTelegram,
  sendPasswordResetTelegram,
  generateVerificationCode,
  testTelegramConnection,
  getBotInfo
}; 