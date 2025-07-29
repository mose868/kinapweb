const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Test data for seller application
const testApplicationData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+254700000000',
    dateOfBirth: '1990-01-01',
    nationality: 'Kenyan',
    idNumber: '12345678',
    address: {
      street: '123 Main Street',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya'
    }
  },
  professionalInfo: {
    skills: ['Web Development', 'React', 'Node.js', 'MongoDB'],
    experience: '5 years of full-stack development experience',
    education: 'Bachelor of Computer Science',
    certifications: ['AWS Certified Developer', 'MongoDB Certified Developer'],
    portfolio: 'https://johndoe.dev',
    linkedinProfile: 'https://linkedin.com/in/johndoe',
    githubProfile: 'https://github.com/johndoe',
    website: 'https://johndoe.dev'
  },
  businessInfo: {
    businessName: 'John Doe Development Services',
    businessType: 'Sole Proprietorship',
    services: ['Web Development', 'Mobile App Development', 'API Development'],
    targetMarket: 'Small to medium businesses',
    pricingStrategy: 'Project-based pricing with hourly rates for maintenance',
    expectedEarnings: 50000
  },
  applicationContent: {
    motivation: 'I am passionate about creating high-quality web applications and helping businesses achieve their digital goals. I believe in delivering value through clean, maintainable code and excellent user experiences.',
    experienceDescription: 'I have worked on various projects including e-commerce platforms, CRM systems, and mobile applications. My expertise includes React, Node.js, MongoDB, and cloud deployment on AWS.',
    serviceDescription: 'I offer comprehensive web development services including frontend and backend development, database design, API development, and deployment. I focus on creating scalable, secure, and user-friendly applications.',
    valueProposition: 'I provide high-quality, custom web solutions with fast delivery times, ongoing support, and competitive pricing. My code is clean, well-documented, and follows best practices.',
    sampleWork: 'I have successfully delivered projects for clients including an e-commerce platform that increased sales by 40%, a CRM system that improved customer management efficiency by 60%, and a mobile app with 10,000+ downloads.'
  },
  documents: {
    idDocument: 'https://example.com/id-document.pdf',
    portfolioSamples: [
      'https://example.com/portfolio1.jpg',
      'https://example.com/portfolio2.jpg'
    ],
    certificates: [
      'https://example.com/cert1.pdf',
      'https://example.com/cert2.pdf'
    ],
    references: [
      'https://example.com/reference1.pdf'
    ]
  }
};

async function testSellerApplications() {
  console.log('🧪 Testing Seller Applications API...\n');
  
  let authToken = '';
  let applicationId = '';

  try {
    // 1. Test user registration (if needed)
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testseller',
        email: 'testseller@example.com',
        password: 'password123',
        displayName: 'Test Seller',
        phoneNumber: '+254700000000',
        course: 'Computer Science',
        year: '4th Year',
        experienceLevel: 'Intermediate',
        skills: ['Web Development', 'React'],
        bio: 'Test seller for application testing'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      authToken = registerData.token;
      console.log('✅ User registered successfully');
    } else {
      // Try to login if user already exists
      console.log('User already exists, trying to login...');
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testseller@example.com',
          password: 'password123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        console.log('✅ User logged in successfully');
      } else {
        throw new Error('Failed to authenticate user');
      }
    }

    // 2. Test submitting seller application
    console.log('\n2. Testing seller application submission...');
    const applicationResponse = await fetch(`${API_BASE_URL}/api/seller-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(testApplicationData)
    });

    if (applicationResponse.ok) {
      const applicationData = await applicationResponse.json();
      applicationId = applicationData.application._id;
      console.log('✅ Seller application submitted successfully');
      console.log(`   Application ID: ${applicationId}`);
      console.log(`   Status: ${applicationData.application.status}`);
    } else {
      const errorData = await applicationResponse.json();
      console.log('⚠️ Application submission response:', errorData);
    }

    // 3. Test fetching user's own application
    console.log('\n3. Testing fetch user application...');
    const myApplicationResponse = await fetch(`${API_BASE_URL}/api/seller-applications/my-application`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (myApplicationResponse.ok) {
      const myApplicationData = await myApplicationResponse.json();
      console.log('✅ User application fetched successfully');
      console.log(`   Status: ${myApplicationData.application.status}`);
      if (myApplicationData.application.aiVetting) {
        console.log(`   AI Processed: ${myApplicationData.application.aiVetting.isProcessed}`);
        if (myApplicationData.application.aiVetting.isProcessed) {
          console.log(`   Confidence: ${myApplicationData.application.aiVetting.confidence}`);
          console.log(`   Quality Score: ${myApplicationData.application.aiVetting.qualityScore}`);
          console.log(`   Risk Score: ${myApplicationData.application.aiVetting.riskScore}`);
        }
      }
    } else {
      const errorData = await myApplicationData.json();
      console.log('⚠️ Fetch application response:', errorData);
    }

    // 4. Wait a bit for AI processing
    console.log('\n4. Waiting for AI processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 5. Check application status again
    console.log('\n5. Checking application status after AI processing...');
    const statusResponse = await fetch(`${API_BASE_URL}/api/seller-applications/my-application`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Application status updated');
      console.log(`   New Status: ${statusData.application.status}`);
      if (statusData.application.aiVetting && statusData.application.aiVetting.isProcessed) {
        console.log(`   AI Confidence: ${statusData.application.aiVetting.confidence}`);
        console.log(`   AI Quality Score: ${statusData.application.aiVetting.qualityScore}`);
        console.log(`   AI Risk Score: ${statusData.application.aiVetting.riskScore}`);
        console.log(`   AI Recommendations: ${statusData.application.aiVetting.recommendations.length} items`);
        console.log(`   Flagged Issues: ${statusData.application.aiVetting.flaggedIssues.length} items`);
      }
    }

    console.log('\n🎉 Seller Applications API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testSellerApplications(); 