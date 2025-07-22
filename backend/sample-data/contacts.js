// Sample contact messages data for testing
// This can be used to populate the database with initial data

const sampleContacts = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+254 712 345 678",
    subject: "Inquiry about Web Development Training",
    message: "Hello, I'm interested in joining your web development training program. Could you please provide more information about the course duration, curriculum, and requirements? I have basic knowledge of HTML and CSS but would like to learn more advanced topics like JavaScript and React.",
    category: "Training",
    priority: "High",
    status: "New",
    source: "Website",
    emailSent: true,
    isRead: false,
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.100",
      referrer: "https://google.com"
    }
  },

  {
    name: "Michael Ochieng",
    email: "m.ochieng@university.ac.ke",
    phone: "+254 723 456 789",
    subject: "Partnership Proposal - University Collaboration",
    message: "Dear Ajira Digital Team,\n\nI am writing to explore potential partnership opportunities between our university and your organization. We are interested in collaborating on digital skills training programs for our students and would like to discuss how we can work together to provide valuable opportunities for youth development.",
    category: "Partnership",
    priority: "High",
    status: "In Progress",
    source: "Website",
    emailSent: true,
    isRead: true,
    assignedTo: "admin@ajirakinap.com",
    responseNotes: "Scheduled meeting for next week to discuss partnership details.",
    metadata: {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ipAddress: "192.168.1.101"
    }
  },

  {
    name: "Grace Wanjiku",
    email: "grace.wanjiku@gmail.com",
    phone: "+254 734 567 890",
    subject: "Technical Issue with Login",
    message: "Hi, I'm having trouble logging into my account. Every time I try to log in, I get an error message saying 'Invalid credentials' even though I'm sure my password is correct. I've tried resetting my password twice but the issue persists. Can you please help me resolve this?",
    category: "Technical Support",
    priority: "Medium",
    status: "Responded",
    source: "Website",
    emailSent: true,
    isRead: true,
    assignedTo: "support@ajirakinap.com",
    responseNotes: "Password reset link sent. User confirmed issue resolved.",
    metadata: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
      ipAddress: "192.168.1.102"
    }
  },

  {
    name: "David Kimani",
    email: "david.kimani@techstartup.co.ke",
    phone: "+254 745 678 901",
    subject: "Hiring Opportunity - Junior Developers",
    message: "Hello Ajira Digital,\n\nOur tech startup is looking to hire 3 junior developers who have completed your training programs. We're particularly interested in candidates with React and Node.js skills. Could you connect us with some of your recent graduates? We offer competitive salaries and great learning opportunities.",
    category: "Partnership",
    priority: "Medium",
    status: "New",
    source: "Website",
    emailSent: true,
    isRead: false,
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.103"
    }
  },

  {
    name: "Lucy Muthoni",
    email: "lucy.muthoni@student.ac.ke",
    phone: "+254 756 789 012",
    subject: "Course Completion Certificate Issue",
    message: "Dear Support Team,\n\nI completed the Digital Marketing course last month but I haven't received my certificate yet. I have checked my email multiple times including the spam folder. My student ID is DM2024001. Could you please help me get my certificate? I need it for a job application deadline this Friday.",
    category: "General Inquiry",
    priority: "High",
    status: "Resolved",
    source: "Website",
    emailSent: true,
    isRead: true,
    assignedTo: "certificates@ajirakinap.com",
    responseNotes: "Certificate was re-sent via email. Student confirmed receipt.",
    metadata: {
      userAgent: "Mozilla/5.0 (Android 11; Mobile; rv:92.0) Gecko/92.0 Firefox/92.0",
      ipAddress: "192.168.1.104"
    }
  },

  {
    name: "Peter Njoroge",
    email: "peter.njoroge@email.com",
    subject: "Suggestion for New Course - Data Science",
    message: "Hi there,\n\nI've been following your training programs and think they're excellent. I wanted to suggest adding a Data Science course to your curriculum. There's growing demand for data scientists in Kenya and I believe your platform would be perfect for delivering this type of training. Would love to discuss this further.",
    category: "Suggestion",
    priority: "Low",
    status: "New",
    source: "Website",
    emailSent: true,
    isRead: false,
    metadata: {
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      ipAddress: "192.168.1.105"
    }
  },

  {
    name: "Anne Wairimu",
    email: "anne.wairimu@gmail.com",
    phone: "+254 767 890 123",
    subject: "Complaint About Training Quality",
    message: "I recently attended the Graphic Design workshop and was disappointed with the quality of training. The instructor seemed unprepared and the materials were outdated. For the amount I paid, I expected much better. I would like to request a refund or be offered a slot in a better-quality session.",
    category: "Complaint",
    priority: "High",
    status: "In Progress",
    source: "Website",
    emailSent: true,
    isRead: true,
    assignedTo: "quality@ajirakinap.com",
    responseNotes: "Escalated to training manager. Refund process initiated.",
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.106"
    }
  },

  {
    name: "James Mutua",
    email: "james.mutua@freelancer.com",
    phone: "+254 778 901 234",
    subject: "General Information Request",
    message: "Good day,\n\nI'm a freelance web designer and I've heard great things about your organization. Could you please send me general information about your programs, membership benefits, and how I can get involved? I'm particularly interested in networking opportunities and advanced skill development.",
    category: "General Inquiry",
    priority: "Low",
    status: "New",
    source: "Website",
    emailSent: true,
    isRead: false,
    metadata: {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ipAddress: "192.168.1.107"
    }
  },

  {
    name: "Catherine Akinyi",
    email: "catherine.akinyi@email.com",
    phone: "+254 789 012 345",
    subject: "Payment Issues - Course Registration",
    message: "Hello, I'm trying to register for the upcoming JavaScript course but I'm having issues with the payment system. The page keeps timing out when I try to pay via M-Pesa. I've tried multiple times with different amounts but the same issue occurs. Can someone assist me with this?",
    category: "Technical Support",
    priority: "Medium",
    status: "Responded",
    source: "Website",
    emailSent: true,
    isRead: true,
    assignedTo: "payments@ajirakinap.com",
    responseNotes: "Technical team investigated M-Pesa integration. Issue resolved.",
    metadata: {
      userAgent: "Mozilla/5.0 (Android 12; Mobile; rv:93.0) Gecko/93.0 Firefox/93.0",
      ipAddress: "192.168.1.108"
    }
  },

  {
    name: "Robert Kiprotich",
    email: "robert.kiprotich@ngo.org",
    phone: "+254 790 123 456",
    subject: "NGO Partnership for Rural Training",
    message: "Dear Ajira Digital Team,\n\nOur NGO works with rural communities in Rift Valley and we're interested in partnering with you to bring digital skills training to underserved areas. We have funding available and established community networks. Would you be interested in discussing a partnership to deliver training programs in rural locations?",
    category: "Partnership",
    priority: "Medium",
    status: "New",
    source: "Website",
    emailSent: true,
    isRead: false,
    metadata: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.109"
    }
  }
];

module.exports = sampleContacts; 