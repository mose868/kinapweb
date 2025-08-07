const express = require('express');
const Contact = require('../models/Contact');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Submit contact form (public)
router.post('/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      category,
      priority
    } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }

    // Get metadata from request
    const metadata = {
      userAgent: req.get('User-Agent') || '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      referrer: req.get('Referrer') || ''
    };

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
      source: 'Website',
      metadata
    });

    // Send email notification to admin
    try {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B4F72; border-bottom: 2px solid #1B4F72; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4F72; margin-top: 0;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Category:</td>
                <td style="padding: 8px 0;">${category || 'General Inquiry'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
                <td style="padding: 8px 0;">${priority || 'Medium'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #1B4F72; margin-top: 0;">Subject</h3>
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">${subject}</p>
            
            <h3 style="color: #1B4F72;">Message</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1B4F72; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
            <h4 style="color: #1B4F72; margin-top: 0;">Quick Actions</h4>
            <p style="margin: 10px 0;">
              <strong>Reply via Email:</strong> 
              <a href="mailto:${email}?subject=Re: ${subject}" style="color: #1B4F72; text-decoration: none;">
                Click to reply to ${email}
              </a>
            </p>
            ${phone ? `
            <p style="margin: 10px 0;">
              <strong>WhatsApp:</strong> 
              <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Hi ${name}, thank you for contacting Ajira Digital KiNaP Club regarding: ${subject}" 
                 style="color: #25D366; text-decoration: none;">
                Send WhatsApp message
              </a>
            </p>
            ` : ''}
            <p style="margin: 10px 0;">
              <strong>Contact ID:</strong> ${contact._id}
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center; color: #6c757d; font-size: 12px;">
            <p>This message was sent from the Ajira Digital KiNaP Club website contact form.</p>
            <p>Admin Panel: <a href="http://localhost:5173/admin/contact" style="color: #1B4F72;">Manage Contact Messages</a></p>
          </div>
        </div>
      `;

      await sendEmail(
        'moseskimani414@gmail.com',
        `New Contact: ${subject} - ${category}`,
        emailContent
      );

      // Mark email as sent
      contact.emailSent = true;
      await contact.save();

      console.log(`📧 Contact form email sent to moseskimani414@gmail.com for: ${name} (${email})`);
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ 
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contactId: contact._id,
      whatsappLink: `https://wa.me/254792343958?text=Hi, I just sent a contact form on your website regarding: ${encodeURIComponent(subject)}`
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// Get all contact messages (admin)
router.get('/admin', async (req, res) => {
  try {
    const { 
      status, 
      category, 
      priority,
      isRead,
      limit = 50, 
      skip = 0 
    } = req.query;

    let query = { isArchived: false };

    // Add filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contact message (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Mark as read when viewed by admin
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseNotes, assignedTo } = req.body;

    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    if (status) contact.status = status;
    if (responseNotes) contact.responseNotes = responseNotes;
    if (assignedTo) contact.assignedTo = assignedTo;

    await contact.save();

    res.json({ 
      message: 'Contact status updated successfully', 
      contact 
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive contact message (admin)
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ 
      message: 'Contact message archived successfully', 
      contact 
    });
  } catch (error) {
    console.error('Archive contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact message (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact statistics (admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments({ isArchived: false });
    const unreadMessages = await Contact.countDocuments({ isRead: false, isArchived: false });
    const newMessages = await Contact.countDocuments({ status: 'New', isArchived: false });
    const resolvedMessages = await Contact.countDocuments({ status: 'Resolved', isArchived: false });

    const categoriesStats = await Contact.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Contact.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusStats = await Contact.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMessages = await Contact.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isArchived: false
    });

    res.json({
      totalMessages,
      unreadMessages,
      newMessages,
      resolvedMessages,
      recentMessages,
      categoriesStats,
      priorityStats,
      statusStats
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send WhatsApp message (generates link)
router.post('/whatsapp', async (req, res) => {
  try {
    const { contactId, customMessage } = req.body;

    let message = 'Hi, I would like to get in touch with Ajira Digital KiNaP Club.';
    
    if (contactId) {
      const contact = await Contact.findById(contactId);
      if (contact) {
        message = `Hi, I just sent a contact form regarding: ${contact.subject}. Contact ID: ${contactId}`;
      }
    }

    if (customMessage) {
      message = customMessage;
    }

    const whatsappUrl = `https://wa.me/254792343958?text=${encodeURIComponent(message)}`;

    res.json({
      message: 'WhatsApp link generated successfully',
      whatsappUrl,
      phoneNumber: '+254792343958'
    });
  } catch (error) {
    console.error('WhatsApp link generation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations (admin)
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Action and IDs are required' });
    }

    let updateOperation = {};

    switch (action) {
      case 'mark-read':
        updateOperation = { isRead: true };
        break;
      case 'mark-unread':
        updateOperation = { isRead: false };
        break;
      case 'archive':
        updateOperation = { isArchived: true };
        break;
      case 'unarchive':
        updateOperation = { isArchived: false };
        break;
      case 'mark-resolved':
        updateOperation = { status: 'Resolved' };
        break;
      case 'delete':
        await Contact.deleteMany({ _id: { $in: ids } });
        return res.json({ message: `${ids.length} messages deleted successfully` });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      updateOperation
    );

    res.json({ 
      message: `${result.modifiedCount} messages updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 