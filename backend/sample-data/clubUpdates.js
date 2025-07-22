// Sample club updates data for testing
// This can be used to populate the database with initial data

const sampleUpdates = [
  {
    title: 'KiNaP Ajira Club AI & Machine Learning Bootcamp 2025',
    excerpt: 'Join our intensive 6-week AI and Machine Learning bootcamp starting February 2025. Learn Python, TensorFlow, and real-world AI applications.',
    content: `Join our intensive 6-week AI and Machine Learning bootcamp starting February 2025. Learn Python, TensorFlow, and real-world AI applications. Industry professionals from Nairobi tech companies will mentor participants.

Key Features:
- Hands-on Python programming
- TensorFlow and Keras frameworks
- Real-world project development
- Industry mentorship
- Job placement assistance
- Certificate upon completion

Prerequisites: Basic programming knowledge (any language)
Duration: 6 weeks (3 sessions per week)
Fee: FREE for KiNaP members
Application Deadline: January 31, 2025`,
    author: 'Alice Wanjiku',
    authorEmail: 'alice@kinapajira.com',
    category: 'Training',
    tags: ['AI', 'machine-learning', 'bootcamp', 'python', 'tensorflow'],
    featured: true,
    priority: 'High',
    status: 'Published',
    publishDate: new Date('2025-01-15'),
    eventDetails: {
      eventDate: new Date('2025-02-15'),
      location: 'University of the People Campus',
      registrationLink: 'https://forms.gle/aibootcamp2025',
      capacity: 50
    },
    images: [],
    seoMeta: {
      metaTitle: 'AI & ML Bootcamp 2025 - KiNaP Ajira Club',
      metaDescription: 'Free AI and Machine Learning bootcamp for KiNaP members. Learn Python, TensorFlow and get mentored by industry professionals.',
      keywords: ['AI bootcamp', 'machine learning', 'python training', 'tech education']
    }
  },
  
  {
    title: 'Record-Breaking Year: 500+ Members Secured Digital Jobs',
    excerpt: 'Incredible achievement! Our club members have secured over 500 digital job placements in 2024, with average salary increases of 300%.',
    content: `Incredible achievement! Our club members have secured over 500 digital job placements in 2024, with average salary increases of 300%. This includes positions at top companies like Safaricom, Equity Bank, and international remote roles.

2024 Success Highlights:
- 500+ job placements secured
- Average salary increase: 300%
- Top hiring companies: Safaricom, Equity Bank, KCB, iLabAfrica
- 150+ remote international positions
- 80% placement rate within 3 months of course completion

Success Stories:
- John Mwangi: From unemployed graduate to Senior Developer at Safaricom
- Mary Njeri: Transitioned from teaching to UX Designer at international startup
- Peter Kamau: Started freelancing, now earning $2000+ monthly

Thank you to all our members, mentors, and partner companies for making this possible!`,
    author: 'Club President',
    authorEmail: 'president@kinapajira.com',
    category: 'Achievement',
    tags: ['achievement', 'employment', 'success-stories', '2024-review'],
    featured: true,
    priority: 'High',
    status: 'Published',
    publishDate: new Date('2025-01-20'),
    images: [],
    seoMeta: {
      metaTitle: '500+ Digital Jobs Secured by KiNaP Members in 2024',
      metaDescription: 'Amazing achievement: KiNaP Ajira Club members secured over 500 digital jobs in 2024 with 300% average salary increases.',
      keywords: ['job placement', 'digital jobs', 'success stories', 'career growth']
    }
  },

  {
    title: 'Partnership with Google Africa and Microsoft Kenya',
    excerpt: 'Exciting news! KiNaP Ajira Club has signed partnerships with Google Africa and Microsoft Kenya to provide free certification programs.',
    content: `Exciting news! KiNaP Ajira Club has signed partnerships with Google Africa and Microsoft Kenya to provide free certification programs, cloud credits, and exclusive internship opportunities for our members throughout 2025.

Partnership Benefits:

Google Africa Partnership:
- Free Google Career Certificates (IT Support, Data Analytics, UX Design, Project Management)
- $200 Google Cloud credits per member
- Priority access to Google Developer programs
- Exclusive workshop sessions with Google engineers
- Internship opportunities at Google Kenya office

Microsoft Kenya Partnership:
- Free Microsoft Azure certifications
- Office 365 access for all members
- Azure credits worth $150 per member
- Microsoft Learn premium access
- Direct recruitment pipeline for Microsoft roles
- Quarterly tech talks by Microsoft executives

Application Process:
1. Must be active KiNaP member (attendance >75%)
2. Complete baseline skills assessment
3. Commit to full certification program
4. Share success story upon completion

Applications open: February 1, 2025
Limited slots available - first come, first served!`,
    author: 'Partnership Team',
    authorEmail: 'partnerships@kinapajira.com',
    category: 'Partnership',
    tags: ['google', 'microsoft', 'certification', 'partnership', 'opportunities'],
    featured: true,
    priority: 'Urgent',
    status: 'Published',
    publishDate: new Date('2025-01-18'),
    images: [],
    seoMeta: {
      metaTitle: 'Google & Microsoft Partnership - Free Certifications for KiNaP Members',
      metaDescription: 'KiNaP partners with Google Africa and Microsoft Kenya to offer free certifications, cloud credits, and internships.',
      keywords: ['google partnership', 'microsoft certification', 'free training', 'tech partnership']
    }
  },

  {
    title: 'Weekly Tech Meetups Resume - Every Saturday 2PM',
    excerpt: 'Our popular weekly tech meetups are back! Join us every Saturday at 2PM for skill-sharing, networking, and collaborative projects.',
    content: `Our popular weekly tech meetups are back! Join us every Saturday at 2PM for skill-sharing, networking, and collaborative projects.

Meetup Format:
- 2:00-2:30 PM: Networking & Coffee
- 2:30-3:30 PM: Featured Presentation/Workshop
- 3:30-4:00 PM: Project Collaboration Time
- 4:00-4:30 PM: Q&A and Next Steps

Upcoming Sessions:
- Jan 25: "Building Your First React App" by Sarah Muthoni
- Feb 1: "Digital Marketing for Developers" by David Kiprotich  
- Feb 8: "Blockchain Basics & Cryptocurrency" by Grace Wanjala
- Feb 15: "UI/UX Design Thinking Workshop" by James Ochieng

What to Bring:
- Your laptop
- Current project (if any)
- Questions and enthusiasm!

Location: University of the People Computer Lab
No registration required - just show up!`,
    author: 'Events Team',
    authorEmail: 'events@kinapajira.com',
    category: 'Event',
    tags: ['meetup', 'networking', 'weekly', 'saturday', 'tech-talks'],
    featured: false,
    priority: 'Medium',
    status: 'Published',
    publishDate: new Date('2025-01-22'),
    eventDetails: {
      eventDate: new Date('2025-01-25'),
      location: 'University of the People Computer Lab',
      registrationLink: '',
      capacity: 100
    },
    images: []
  },

  {
    title: 'New Member Orientation - February 5th',
    excerpt: 'Welcome new members! Join our orientation session to learn about club activities, resources, and how to maximize your membership.',
    content: `Welcome new members! Join our orientation session to learn about club activities, resources, and how to maximize your membership.

Orientation Agenda:
- Welcome & Introductions (30 mins)
- Club History & Mission (15 mins)
- Available Programs & Resources (45 mins)
- Mentorship Program Overview (30 mins)
- Slack & Discord Community Setup (15 mins)
- Q&A Session (30 mins)
- Networking & Refreshments (45 mins)

What You'll Learn:
- How to access free courses and certifications
- Finding and connecting with mentors
- Joining project teams and hackathons
- Career services and job placement support
- Monthly challenges and competitions
- Community guidelines and expectations

What You'll Receive:
- Welcome package with club merchandise
- Access to exclusive member resources
- LinkedIn profile optimization guide
- Course recommendation based on your goals
- Mentor assignment (if requested)

Date: February 5th, 2025
Time: 6:00 PM - 8:30 PM
Location: Main Auditorium, University of the People
Refreshments will be provided!`,
    author: 'Membership Team',
    authorEmail: 'membership@kinapajira.com',
    category: 'Event',
    tags: ['orientation', 'new-members', 'welcome', 'networking'],
    featured: false,
    priority: 'Medium',
    status: 'Published',
    publishDate: new Date('2025-01-23'),
    eventDetails: {
      eventDate: new Date('2025-02-05'),
      location: 'Main Auditorium, University of the People',
      registrationLink: 'https://forms.gle/newmember2025',
      capacity: 200
    },
    images: []
  },

  {
    title: 'Club Leadership Elections 2025 - Nominations Open',
    excerpt: 'The time has come to elect new club leadership for 2025. Nominations are now open for all executive positions.',
    content: `The time has come to elect new club leadership for 2025. Nominations are now open for all executive positions.

Available Positions:
- Club President
- Vice President
- Secretary
- Treasurer
- Technical Lead
- Events Coordinator
- Partnerships Manager
- Social Media Manager

Eligibility Requirements:
- Active member for at least 6 months
- Attendance rate of 70% or higher
- Must not be in final semester
- Clean disciplinary record
- Endorsement from 2 current members

Nomination Process:
1. Submit nomination form by February 10th
2. Include statement of purpose (500 words max)
3. Provide endorsements from 2 members
4. Attend mandatory candidates meeting (Feb 12th)

Election Timeline:
- Nominations close: February 10th
- Candidate presentations: February 15th
- Voting period: February 17-19th
- Results announcement: February 20th
- Transition period: February 21-28th

Ready to lead? The club needs passionate, committed leaders to take us to the next level in 2025!`,
    author: 'Election Committee',
    authorEmail: 'elections@kinapajira.com',
    category: 'Announcement',
    tags: ['elections', 'leadership', 'nominations', '2025', 'governance'],
    featured: false,
    priority: 'High',
    status: 'Published',
    publishDate: new Date('2025-01-21'),
    expiryDate: new Date('2025-02-20'),
    images: []
  }
];

module.exports = sampleUpdates; 