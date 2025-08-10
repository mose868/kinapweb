const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');
const mongoose = require('mongoose');
const { sendEmail } = require('./config/email');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ajira_digital_kinap');
    console.log('MongoDB connected for Better Auth');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const auth = betterAuth({
  // Database configuration
  database: mongodbAdapter(mongoose.connection.db),
  
  // Base URL configuration
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  
  // Secret key for encryption
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this-in-production",
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Enable email verification
  },
  
  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  // Session configuration
  session: {
    expiresIn: 30 * 60, // 30 minutes (changed from 7 days)
  },
  
  // User configuration
  user: {
    additionalFields: {
      displayName: { type: "string", required: false },
      phoneNumber: { type: "string", required: false },
      course: { type: "string", required: false },
      year: { type: "string", required: false },
      experienceLevel: { type: "string", required: false },
      skills: { type: "array", required: false },
      bio: { type: "string", required: false },
      role: { type: "string", required: false, default: "student" },
      isVerified: { type: "boolean", required: false, default: false },
      avatar: { type: "string", required: false },
      location: {
        country: { type: "string", required: false },
        city: { type: "string", required: false },
      },
      languages: { type: "array", required: false },
      portfolio: { type: "array", required: false },
      rating: { type: "number", required: false, default: 0 },
      // Password reset fields
      resetPasswordToken: { type: "string", required: false },
      resetPasswordExpires: { type: "date", required: false },
      // Biometric fields
      biometricEnabled: { type: "boolean", required: false, default: false },
      biometricCredentials: { type: "array", required: false },
      biometricAuthHistory: { type: "array", required: false },
      // Login history
      loginHistory: { type: "array", required: false },
      // Session activity tracking
      lastActivity: { type: "date", required: false },
      sessionExpiresAt: { type: "date", required: false },
    },
  },
  
  // Email configuration
  email: {
    from: `"Ajira Digital KiNaP Club" <${process.env.GMAIL_USER}>`,
    transport: {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    },
    templates: {
      // Password reset email template
      passwordReset: {
        subject: 'Reset Your Password - Ajira Digital KiNaP Club',
        html: (data) => `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
              <p style="margin: 10px 0 0 0;">Password Reset Request</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.user.displayName || 'there'}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                You recently requested to reset your password for your Ajira Digital KiNaP Club account. 
                Click the button below to reset it.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" 
                   style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                This password reset link will expire in 1 hour.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${data.resetUrl}" style="color: #1B4F72;">${data.resetUrl}</a>
              </p>
            </div>
          </div>
        `,
        text: (data) => `
          Ajira Digital KiNaP Club - Password Reset Request
          
          Hello ${data.user.displayName || 'there'}!
          
          You recently requested to reset your password for your Ajira Digital KiNaP Club account. 
          Click the link below to reset it:
          
          ${data.resetUrl}
          
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          
          This password reset link will expire in 1 hour.
        `,
      },
      
      // Welcome email template
      welcome: {
        subject: 'Welcome to Ajira Digital KiNaP Club!',
        html: (data) => `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
              <p style="margin: 10px 0 0 0;">Welcome to Our Community!</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${data.user.displayName || 'there'}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining the Ajira Digital KiNaP Club! We're excited to have you as part of our community 
                of digital innovators and learners.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1B4F72; margin-bottom: 15px;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Complete your profile to unlock all features</li>
                  <li>Explore our marketplace for digital services</li>
                  <li>Join our community discussions</li>
                  <li>Apply for mentorship programs</li>
                  <li>Consider becoming an ambassador</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
                   style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Complete Your Profile
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you have any questions or need assistance, feel free to reach out to our support team.
              </p>
            </div>
          </div>
        `,
        text: (data) => `
          Welcome to Ajira Digital KiNaP Club!
          
          Hello ${data.user.displayName || 'there'}!
          
          Thank you for joining the Ajira Digital KiNaP Club! We're excited to have you as part of our community 
          of digital innovators and learners.
          
          What's Next?
          - Complete your profile to unlock all features
          - Explore our marketplace for digital services
          - Join our community discussions
          - Apply for mentorship programs
          - Consider becoming an ambassador
          
          Get started: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile
          
          If you have any questions or need assistance, feel free to reach out to our support team.
        `,
      },
      
      // Ambassador application notification template
      ambassadorApplication: {
        subject: 'Ambassador Application Received - Ajira Digital KiNaP Club',
        html: (data) => `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
              <p style="margin: 10px 0 0 0;">Ambassador Application Received</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Thank you for your application!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Dear ${data.application.fullName || 'Applicant'},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We have received your ambassador application for the Ajira Digital KiNaP Club. 
                Our team will review your application and get back to you within 5-7 business days.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1B4F72; margin-bottom: 15px;">Application Details</h3>
                <p style="color: #666; margin-bottom: 10px;"><strong>Course:</strong> ${data.application.course || 'Not specified'}</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Year:</strong> ${data.application.year || 'Not specified'}</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Experience Level:</strong> ${data.application.experienceLevel || 'Not specified'}</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Application ID:</strong> ${data.application._id}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                In the meantime, feel free to explore our platform and engage with the community. 
                You can track your application status by logging into your account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/ambassador" 
                   style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  View Ambassador Program
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you have any questions about your application, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        `,
        text: (data) => `
          Ambassador Application Received - Ajira Digital KiNaP Club
          
          Dear ${data.application.fullName || 'Applicant'},
          
          We have received your ambassador application for the Ajira Digital KiNaP Club. 
          Our team will review your application and get back to you within 5-7 business days.
          
          Application Details:
          - Course: ${data.application.course || 'Not specified'}
          - Year: ${data.application.year || 'Not specified'}
          - Experience Level: ${data.application.experienceLevel || 'Not specified'}
          - Application ID: ${data.application._id}
          
          In the meantime, feel free to explore our platform and engage with the community. 
          You can track your application status by logging into your account.
          
          View Ambassador Program: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/ambassador
          
          If you have any questions about your application, please don't hesitate to contact us.
        `,
      },
      
      // Ambassador application status update template
      ambassadorStatusUpdate: {
        subject: 'Ambassador Application Update - Ajira Digital KiNaP Club',
        html: (data) => `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
              <p style="margin: 10px 0 0 0;">Application Status Update</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Application Status: ${data.status}</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Dear ${data.application.fullName || 'Applicant'},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                ${data.message}
              </p>
              
              ${data.status === 'approved' ? `
                <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #155724; margin-bottom: 15px;">🎉 Congratulations!</h3>
                  <p style="color: #155724; line-height: 1.6;">
                    You have been selected as an Ajira Digital KiNaP Club Ambassador! 
                    Welcome to our elite community of student leaders.
                  </p>
                </div>
              ` : ''}
              
              ${data.status === 'rejected' ? `
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #721c24; margin-bottom: 15px;">Application Feedback</h3>
                  <p style="color: #721c24; line-height: 1.6;">
                    ${data.feedback || 'We appreciate your interest and encourage you to apply again in the future.'}
                  </p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/ambassador" 
                   style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  View Ambassador Program
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Thank you for your interest in the Ajira Digital KiNaP Club Ambassador Program.
              </p>
            </div>
          </div>
        `,
        text: (data) => `
          Ambassador Application Update - Ajira Digital KiNaP Club
          
          Dear ${data.application.fullName || 'Applicant'},
          
          Application Status: ${data.status}
          
          ${data.message}
          
          ${data.status === 'approved' ? `
          🎉 Congratulations!
          You have been selected as an Ajira Digital KiNaP Club Ambassador! 
          Welcome to our elite community of student leaders.
          ` : ''}
          
          ${data.status === 'rejected' ? `
          Application Feedback:
          ${data.feedback || 'We appreciate your interest and encourage you to apply again in the future.'}
          ` : ''}
          
          View Ambassador Program: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/ambassador
          
          Thank you for your interest in the Ajira Digital KiNaP Club Ambassador Program.
        `,
      },
    },
  },
  
  // Callbacks
  callbacks: {
    onSignIn: async (user) => {
      // Log successful sign in
      console.log(`User ${user.email} signed in successfully`);
      
      // Update login history
      const loginEntry = {
        timestamp: new Date(),
        ipAddress: 'Unknown', // You can get this from request object
        userAgent: 'Unknown', // You can get this from request object
        success: true,
        method: 'password'
      };
      
      // Add to user's login history (if not exists, create it)
      if (!user.loginHistory) {
        user.loginHistory = [];
      }
      user.loginHistory.push(loginEntry);
      
      // Keep only last 10 login entries
      if (user.loginHistory.length > 10) {
        user.loginHistory = user.loginHistory.slice(-10);
      }
      
      await user.save();
      
      return user;
    },
    
    onSignUp: async (user) => {
      // Log new user registration
      console.log(`New user ${user.email} registered successfully`);
      
      // Send welcome email
      try {
        await sendEmail(
          user.email,
          'Welcome to Ajira Digital KiNaP Club!',
          auth.email.templates.welcome.html({ user }),
          auth.email.templates.welcome.text({ user })
        );
        console.log(`Welcome email sent to ${user.email}`);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
      
      return user;
    },
    
    onPasswordReset: async (user, resetUrl) => {
      // Send password reset email
      try {
        await sendEmail(
          user.email,
          'Reset Your Password - Ajira Digital KiNaP Club',
          auth.email.templates.passwordReset.html({ user, resetUrl }),
          auth.email.templates.passwordReset.text({ user, resetUrl })
        );
        console.log(`Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error('Failed to send password reset email:', error);
      }
    },
  },
  
  // Pages configuration
  pages: {
    signIn: "/auth",
    signUp: "/auth",
    error: "/auth",
  },
});

// Export email sending functions for use in other parts of the application
const sendAmbassadorApplicationEmail = async (application) => {
  try {
    await sendEmail(
      application.email,
      'Ambassador Application Received - Ajira Digital KiNaP Club',
      auth.email.templates.ambassadorApplication.html({ application }),
      auth.email.templates.ambassadorApplication.text({ application })
    );
    console.log(`Ambassador application email sent to ${application.email}`);
  } catch (error) {
    console.error('Failed to send ambassador application email:', error);
  }
};

const sendAmbassadorStatusUpdateEmail = async (application, status, message, feedback = null) => {
  try {
    await sendEmail(
      application.email,
      'Ambassador Application Update - Ajira Digital KiNaP Club',
      auth.email.templates.ambassadorStatusUpdate.html({ application, status, message, feedback }),
      auth.email.templates.ambassadorStatusUpdate.text({ application, status, message, feedback })
    );
    console.log(`Ambassador status update email sent to ${application.email}`);
  } catch (error) {
    console.error('Failed to send ambassador status update email:', error);
  }
};

module.exports = { 
  auth, 
  sendAmbassadorApplicationEmail, 
  sendAmbassadorStatusUpdateEmail 
}; 