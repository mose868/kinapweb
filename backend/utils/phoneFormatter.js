/**
 * Phone number formatter for WhatsApp
 * Converts various phone number formats to the working WhatsApp format
 */

// Format phone number for WhatsApp (254xxxxxxxxx format)
const formatPhoneForWhatsApp = (phoneNumber) => {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Handle different input formats
  if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
    // Kenyan local format: 07xxxxxxxx -> 254xxxxxxxxx
    return `254${cleanNumber.substring(1)}`;
  } else if (cleanNumber.startsWith('254') && cleanNumber.length === 12) {
    // Already in correct format: 254xxxxxxxxx
    return cleanNumber;
  } else if (cleanNumber.startsWith('+254') && cleanNumber.length === 13) {
    // International format with +: +254xxxxxxxxx -> 254xxxxxxxxx
    return cleanNumber.substring(1);
  } else if (cleanNumber.length === 9) {
    // Kenyan number without country code: xxxxxxxxx -> 254xxxxxxxxx
    return `254${cleanNumber}`;
  }
  
  // Return as is if no pattern matches
  return cleanNumber;
};

// Validate phone number format
const isValidPhoneNumber = (phoneNumber) => {
  const formatted = formatPhoneForWhatsApp(phoneNumber);
  // Check if it's a valid Kenyan number (254 + 9 digits)
  return /^254\d{9}$/.test(formatted);
};

// Get WhatsApp chat ID format
const getWhatsAppChatId = (phoneNumber) => {
  const formatted = formatPhoneForWhatsApp(phoneNumber);
  return `${formatted}@c.us`;
};

module.exports = {
  formatPhoneForWhatsApp,
  isValidPhoneNumber,
  getWhatsAppChatId
}; 