const { auth } = require('../auth');
const { sendEmail } = require('../config/email');

class BetterAuthEmailService {
  // Send welcome email to new users
  async sendWelcomeEmail(user) {
    try {
      await sendEmail(
        user.email,
        'Welcome to Ajira Digital KiNaP Club!',
        auth.email.templates.welcome.html({ user }),
        auth.email.templates.welcome.text({ user })
      );
      console.log(`Welcome email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetUrl) {
    try {
      await sendEmail(
        user.email,
        'Reset Your Password - Ajira Digital KiNaP Club',
        auth.email.templates.passwordReset.html({ user, resetUrl }),
        auth.email.templates.passwordReset.text({ user, resetUrl })
      );
      console.log(`Password reset email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  // Send ambassador application confirmation email
  async sendAmbassadorApplicationEmail(application) {
    try {
      await sendEmail(
        application.email,
        'Ambassador Application Received - Ajira Digital KiNaP Club',
        auth.email.templates.ambassadorApplication.html({ application }),
        auth.email.templates.ambassadorApplication.text({ application })
      );
      console.log(`Ambassador application email sent to ${application.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send ambassador application email:', error);
      return false;
    }
  }

  // Send ambassador application status update email
  async sendAmbassadorStatusUpdateEmail(application, status, message, feedback = null) {
    try {
      await sendEmail(
        application.email,
        'Ambassador Application Update - Ajira Digital KiNaP Club',
        auth.email.templates.ambassadorStatusUpdate.html({ application, status, message, feedback }),
        auth.email.templates.ambassadorStatusUpdate.text({ application, status, message, feedback })
      );
      console.log(`Ambassador status update email sent to ${application.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send ambassador status update email:', error);
      return false;
    }
  }

  // Send mentor application notification email
  async sendMentorApplicationEmail(application) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
            <p style="margin: 10px 0 0 0;">Mentor Application Received</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for your mentor application!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear ${application.fullName || 'Applicant'},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We have received your mentor application for the Ajira Digital KiNaP Club. 
              Our team will review your application and get back to you within 5-7 business days.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4F72; margin-bottom: 15px;">Application Details</h3>
              <p style="color: #666; margin-bottom: 10px;"><strong>Course:</strong> ${application.course || 'Not specified'}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Experience Level:</strong> ${application.experienceLevel || 'Not specified'}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Skills:</strong> ${application.skills?.join(', ') || 'Not specified'}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Application ID:</strong> ${application._id}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              In the meantime, feel free to explore our platform and engage with the community. 
              You can track your application status by logging into your account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/mentorship" 
                 style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        font-weight: bold;">
                View Mentorship Program
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions about your application, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      `;

      const text = `
        Mentor Application Received - Ajira Digital KiNaP Club
        
        Dear ${application.fullName || 'Applicant'},
        
        We have received your mentor application for the Ajira Digital KiNaP Club. 
        Our team will review your application and get back to you within 5-7 business days.
        
        Application Details:
        - Course: ${application.course || 'Not specified'}
        - Experience Level: ${application.experienceLevel || 'Not specified'}
        - Skills: ${application.skills?.join(', ') || 'Not specified'}
        - Application ID: ${application._id}
        
        In the meantime, feel free to explore our platform and engage with the community. 
        You can track your application status by logging into your account.
        
        View Mentorship Program: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/mentorship
        
        If you have any questions about your application, please don't hesitate to contact us.
      `;

      await sendEmail(
        application.email,
        'Mentor Application Received - Ajira Digital KiNaP Club',
        html,
        text
      );
      console.log(`Mentor application email sent to ${application.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send mentor application email:', error);
      return false;
    }
  }

  // Send contact form notification email
  async sendContactFormEmail(contactData) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
            <p style="margin: 10px 0 0 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4F72; margin-bottom: 15px;">Contact Details</h3>
              <p style="color: #666; margin-bottom: 10px;"><strong>Name:</strong> ${contactData.name}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Email:</strong> ${contactData.email}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Message:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <p style="color: #666; line-height: 1.6; margin: 0;">${contactData.message}</p>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This message was sent from the Ajira Digital KiNaP Club contact form.
            </p>
          </div>
        </div>
      `;

      const text = `
        New Contact Form Submission - Ajira Digital KiNaP Club
        
        Contact Details:
        - Name: ${contactData.name}
        - Email: ${contactData.email}
        - Subject: ${contactData.subject}
        - Message: ${contactData.message}
        
        This message was sent from the Ajira Digital KiNaP Club contact form.
      `;

      // Send to admin
      await sendEmail(
        process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
        `New Contact Form Submission: ${contactData.subject}`,
        html,
        text
      );

      // Send confirmation to user
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
            <p style="margin: 10px 0 0 0;">Message Received</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for contacting us!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear ${contactData.name},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We have received your message and will get back to you as soon as possible. 
              Our team typically responds within 24-48 hours.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4F72; margin-bottom: 15px;">Your Message</h3>
              <p style="color: #666; margin-bottom: 10px;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="color: #666; margin-bottom: 10px;"><strong>Message:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <p style="color: #666; line-height: 1.6; margin: 0;">${contactData.message}</p>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any urgent questions, please don't hesitate to reach out to us again.
            </p>
          </div>
        </div>
      `;

      const userText = `
        Thank you for contacting us! - Ajira Digital KiNaP Club
        
        Dear ${contactData.name},
        
        We have received your message and will get back to you as soon as possible. 
        Our team typically responds within 24-48 hours.
        
        Your Message:
        - Subject: ${contactData.subject}
        - Message: ${contactData.message}
        
        If you have any urgent questions, please don't hesitate to reach out to us again.
      `;

      await sendEmail(
        contactData.email,
        'Message Received - Ajira Digital KiNaP Club',
        userHtml,
        userText
      );

      console.log(`Contact form emails sent for ${contactData.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send contact form email:', error);
      return false;
    }
  }

  // Send custom email with template
  async sendCustomEmail(to, subject, templateName, data) {
    try {
      if (!auth.email.templates[templateName]) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const template = auth.email.templates[templateName];
      await sendEmail(
        to,
        subject,
        template.html(data),
        template.text(data)
      );
      console.log(`Custom email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Failed to send custom email:', error);
      return false;
    }
  }

  // Send bulk email to multiple recipients
  async sendBulkEmail(recipients, subject, templateName, data) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const success = await this.sendCustomEmail(recipient.email, subject, templateName, {
          ...data,
          user: recipient
        });
        results.push({ email: recipient.email, success });
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        results.push({ email: recipient.email, success: false, error: error.message });
      }
    }

    return results;
  }
}

module.exports = new BetterAuthEmailService();
