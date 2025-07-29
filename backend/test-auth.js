const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test registration
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
        phoneNumber: '+254700000000',
        course: 'Computer Science',
        year: '3rd Year',
        experienceLevel: 'Intermediate',
        skills: ['JavaScript', 'React', 'Node.js'],
        bio: 'A passionate developer',
        location: {
          country: 'Kenya',
          city: 'Nairobi'
        },
        languages: ['English', 'Swahili']
      }),
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful!');
      console.log('   User ID:', registerData.user._id);
      console.log('   Token:', registerData.token.substring(0, 20) + '...');
    } else {
      const error = await registerResponse.json();
      console.log('❌ Registration failed:', error.message);
    }

    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('   User:', loginData.user.displayName);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');

      // Test profile endpoint
      console.log('\n3. Testing profile endpoint...');
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile fetch successful!');
        console.log('   User:', profileData.displayName);
        console.log('   Email:', profileData.email);
        console.log('   Skills:', profileData.skills.join(', '));
      } else {
        console.log('❌ Profile fetch failed');
      }

      // Test token verification
      console.log('\n4. Testing token verification...');
      const verifyResponse = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (verifyResponse.ok) {
        console.log('✅ Token verification successful!');
      } else {
        console.log('❌ Token verification failed');
      }

    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error.message);
    }

    console.log('\n🎉 Authentication tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth(); 