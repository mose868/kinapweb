const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contact = require('../models/Contact');
const sampleContacts = require('../sample-data/contacts');

dotenv.config();

async function populateContacts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing contacts (optional - comment out if you want to keep existing data)
    // await Contact.deleteMany({});
    // console.log('Cleared existing contact messages');

    // Insert sample contacts
    const createdContacts = await Contact.insertMany(sampleContacts);
    console.log(`Successfully created ${createdContacts.length} sample contact messages`);

    // Display created contacts
    createdContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} - ${contact.subject} (${contact.category}) - ${contact.status} ${contact.emailSent ? '📧' : ''}`);
    });

    // Show statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Contact Messages Statistics by Category:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} total, ${stat.unread} unread, ${stat.urgent} high priority`);
    });

    const statusStats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📈 Contact Messages by Status:');
    statusStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} messages`);
    });

    const unreadCount = await Contact.countDocuments({ isRead: false });
    const emailsSent = await Contact.countDocuments({ emailSent: true });

    console.log('\n📝 Summary:');
    console.log(`Total Messages: ${createdContacts.length}`);
    console.log(`Unread Messages: ${unreadCount}`);
    console.log(`Emails Sent: ${emailsSent}`);
    console.log(`Email Success Rate: ${Math.round((emailsSent / createdContacts.length) * 100)}%`);

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error populating contacts:', error);
    process.exit(1);
  }
}

// Run the script
populateContacts(); 