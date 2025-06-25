import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, MessageCircle, Bot, User, Clock, CheckCircle, Loader2, Mic, Paperclip, Download, Copy, ThumbsUp, ThumbsDown, Sparkles, Zap, Brain, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
  attachments?: string[];
  quickReplies?: string[];
  rating?: 'positive' | 'negative' | null;
}

interface AgentInfo {
  name: string;
  title: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  expertise: string[];
}

const IntegratedChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [currentAgent, setCurrentAgent] = useState<AgentInfo>({
    name: 'Sarah Wanjiku',
    title: 'Digital Skills Advisor',
    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
    status: 'online',
    expertise: ['Digital Skills', 'Career Guidance', 'Freelancing', 'Technical Support']
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample quick replies for different contexts
  const quickReplies = [
    "How do I start freelancing?",
    "What digital skills should I learn?",
    "Tell me about KiNaP programs",
    "How can I earn money online?",
    "I need career guidance",
    "Technical support needed"
  ];

  // Sample agent responses with realistic context
  const agentResponses = {
    greeting: [
      "Hi there! 👋 I'm Sarah, your Digital Skills Advisor at KiNaP Ajira Club. I'm here to help you navigate your digital journey and unlock new opportunities. How can I assist you today?",
      "Welcome to KiNaP Ajira Digital! 🚀 I'm Sarah, and I specialize in helping students like you build successful digital careers. What would you like to know about?",
      "Hello! Great to see you here. I'm Sarah from the KiNaP Digital Skills team. Whether you're just starting out or looking to advance your skills, I'm here to guide you. What's on your mind?"
    ],
    
    // DIGITAL SKILLS & TRAINING
    freelancing: [
      "Freelancing is a fantastic way to earn income while studying! 💼 Here's what I recommend:\n\n1. **Start with your existing skills** - Even basic skills like data entry, content writing, or social media management can earn you KSh 20,000+ monthly\n\n2. **Build a portfolio** - Create samples of your work on platforms like GitHub, Behance, or LinkedIn\n\n3. **Choose the right platforms** - Upwork, Fiverr, and local platforms like Ajira Digital are great starting points\n\n4. **Set competitive rates** - Start at KSh 500-1000 per hour and increase as you gain experience\n\nWould you like specific guidance on any of these areas?",
      
      "Starting your freelancing journey? Excellent choice! 🎯 Many of our KiNaP students are now earning $500-2000 monthly through freelancing.\n\n**Quick Start Guide:**\n• **Week 1:** Set up profiles on 2-3 platforms\n• **Week 2:** Create 3-5 portfolio pieces\n• **Week 3:** Apply for your first 10 jobs\n• **Week 4:** Deliver your first project excellently\n\n**Success tip:** Focus on one skill initially - whether it's web development, graphic design, or digital marketing. Master it, then expand!\n\nWhat skill are you most interested in monetizing?"
    ],
    
    digitalSkills: [
      "Great question! The digital skills landscape is vast, but here are the most in-demand skills for 2025 that can earn you serious income: 💰\n\n**High-Paying Skills (KSh 100K+ monthly):**\n• Web Development (React, Node.js)\n• Mobile App Development\n• Digital Marketing & SEO\n• Data Analysis & Visualization\n• UI/UX Design\n\n**Quick-Start Skills (KSh 20-50K monthly):**\n• Social Media Management\n• Content Creation\n• Virtual Assistant services\n• Graphic Design\n• Data Entry & Research\n\nI can help you create a personalized learning path. What interests you most?",
      
      "Digital skills are your gateway to financial freedom! 🔓 Based on current market trends and our students' success stories:\n\n**Most Profitable Skills:**\n1. **Programming** - Python, JavaScript (Avg: KSh 150K/month)\n2. **Digital Marketing** - SEO, Social Media (Avg: KSh 80K/month)\n3. **Design** - UI/UX, Graphics (Avg: KSh 120K/month)\n4. **Content Creation** - Video, Writing (Avg: KSh 60K/month)\n\n**Learning Resources:**\n• KiNaP Digital Skills Bootcamp\n• Free YouTube tutorials\n• Coursera & Udemy courses\n• Hands-on projects\n\nShall I help you choose a skill that matches your interests and career goals?"
    ],
    
    // PROGRAMMING & DEVELOPMENT
    programming: [
      "Programming is one of the most lucrative digital skills! 💻 Here's my roadmap for getting started:\n\n**Beginner-Friendly Languages:**\n• **Python** - Great for beginners, used in data science, web development, AI\n• **JavaScript** - Essential for web development, high demand\n• **HTML/CSS** - Foundation of web development\n• **Scratch/App Inventor** - Visual programming for beginners\n\n**Learning Path:**\n1. **Fundamentals (2-3 months)** - Variables, loops, functions\n2. **Project Building (3-4 months)** - Build real applications\n3. **Specialization (6+ months)** - Choose web dev, mobile, data science\n4. **Portfolio Development** - Showcase your best work\n\n**Free Resources:**\n• freeCodeCamp.org\n• Python.org tutorial\n• Mozilla Developer Network (MDN)\n• KiNaP Programming Bootcamp\n\nWhat type of programming interests you most?"
    ],
    
    webDevelopment: [
      "Web development is booming in Kenya! 🌐 With the digital transformation, companies are paying top dollar for skilled developers.\n\n**Complete Web Development Path:**\n\n**Frontend (3-4 months):**\n• HTML, CSS, JavaScript fundamentals\n• React.js or Vue.js framework\n• Responsive design principles\n• Git version control\n\n**Backend (4-5 months):**\n• Node.js with Express\n• Database design (MongoDB/PostgreSQL)\n• API development\n• Authentication & security\n\n**Full-Stack Projects:**\n• E-commerce website\n• Social media app\n• Business management system\n• Portfolio website\n\n**Earning Potential:**\n• Junior Developer: KSh 80K-150K/month\n• Mid-level: KSh 200K-400K/month\n• Senior/Freelance: KSh 500K+ per project\n\nWould you like a detailed learning schedule?"
    ],
    
    // BUSINESS & ENTREPRENEURSHIP
    business: [
      "Starting a business in the digital age offers incredible opportunities! 🚀 Here's how to leverage technology for business success:\n\n**Low-Cost Business Ideas:**\n• **Digital Agency** - Offer web design, social media management\n• **Online Tutoring** - Teach skills you've mastered\n• **E-commerce Store** - Sell products online\n• **Content Creation** - Blogs, YouTube, podcasts\n• **App Development** - Solve local problems with apps\n\n**Business Fundamentals:**\n1. **Market Research** - Understand your customers\n2. **MVP Development** - Start with minimum viable product\n3. **Digital Marketing** - Social media, SEO, content marketing\n4. **Financial Management** - Track income, expenses, taxes\n5. **Legal Compliance** - Business registration, contracts\n\n**Funding Options:**\n• Personal savings\n• Family and friends\n• Government grants (Youth Fund, Women Fund)\n• Angel investors\n• Crowdfunding\n\nWhat type of business are you considering?"
    ],
    
    // ACADEMIC & EDUCATIONAL
    education: [
      "Education and continuous learning are crucial in the digital economy! 📚 Here's how to maximize your educational journey:\n\n**Formal Education:**\n• Choose courses with practical, industry-relevant skills\n• Focus on STEM fields with high job prospects\n• Consider online degrees for flexibility\n• Join study groups and academic clubs\n\n**Self-Learning Strategies:**\n• Set specific learning goals\n• Practice daily (even 30 minutes helps)\n• Build projects to apply knowledge\n• Join learning communities\n• Teach others to reinforce your learning\n\n**Best Learning Platforms:**\n• **Free:** Khan Academy, freeCodeCamp, YouTube\n• **Paid:** Coursera, Udemy, Pluralsight\n• **Interactive:** Codecademy, DataCamp\n• **Academic:** edX, MIT OpenCourseWare\n\n**Study Tips:**\n• Use the Pomodoro Technique\n• Take notes by hand for better retention\n• Practice active recall\n• Form study groups\n• Apply knowledge immediately\n\nWhat subject or skill are you trying to learn?"
    ],
    
    // PERSONAL DEVELOPMENT
    career: [
      "Career development in 2025 requires strategic thinking and adaptability! 🗺️ Let me help you build a successful career path:\n\n**Career Planning Process:**\n1. **Self-Assessment** - Identify strengths, interests, values\n2. **Market Research** - Study industry trends and opportunities\n3. **Skill Gap Analysis** - What skills do you need to develop?\n4. **Goal Setting** - Short-term (1 year) and long-term (5 years)\n5. **Action Plan** - Specific steps to achieve your goals\n\n**High-Growth Career Fields:**\n• **Technology:** Software development, cybersecurity, data science\n• **Digital Marketing:** SEO, social media, content marketing\n• **Healthcare:** Telemedicine, health informatics\n• **Finance:** FinTech, digital banking\n• **Education:** Online tutoring, e-learning development\n\n**Career Development Tips:**\n• Build a strong online presence\n• Network actively (online and offline)\n• Seek mentorship\n• Continuously update your skills\n• Document your achievements\n\nWhat career field interests you most?"
    ],
    
    // TECHNOLOGY & INNOVATION
    technology: [
      "Technology is transforming every industry! 🔬 Here's what you need to know about current tech trends:\n\n**Emerging Technologies:**\n• **Artificial Intelligence (AI)** - Machine learning, automation\n• **Blockchain** - Cryptocurrency, smart contracts\n• **Internet of Things (IoT)** - Connected devices\n• **Cloud Computing** - AWS, Azure, Google Cloud\n• **Cybersecurity** - Protecting digital assets\n\n**Kenya-Specific Tech Opportunities:**\n• **FinTech:** M-Pesa integrations, mobile banking\n• **AgriTech:** Smart farming solutions\n• **HealthTech:** Telemedicine platforms\n• **EdTech:** Online learning platforms\n• **E-Government:** Digital government services\n\n**Getting Started in Tech:**\n1. Choose a specialization\n2. Learn fundamental concepts\n3. Build practical projects\n4. Join tech communities\n5. Stay updated with trends\n\n**Tech Communities in Kenya:**\n• Nairobi Java User Group\n• Women in Tech Kenya\n• DevCongress Kenya\n• Python Kenya\n\nWhich technology area excites you most?"
    ],
    
    // FINANCIAL LITERACY
    finance: [
      "Financial literacy is crucial for long-term success! 💰 Let me share some essential financial knowledge:\n\n**Personal Finance Basics:**\n• **Budgeting:** Track income and expenses\n• **Emergency Fund:** Save 3-6 months of expenses\n• **Debt Management:** Pay off high-interest debt first\n• **Investing:** Start early, even with small amounts\n• **Insurance:** Protect against unexpected events\n\n**Investment Options in Kenya:**\n• **Stocks:** Nairobi Securities Exchange (NSE)\n• **Bonds:** Government and corporate bonds\n• **Mutual Funds:** Diversified investment portfolios\n• **Real Estate:** Property investment\n• **Business:** Start your own venture\n\n**Side Hustles for Extra Income:**\n• Freelance writing/design\n• Online tutoring\n• Social media management\n• Delivery services\n• Selling products online\n\n**Financial Planning Tips:**\n• Pay yourself first (save before spending)\n• Automate your savings\n• Diversify your income sources\n• Invest in your education\n• Plan for retirement early\n\nWhat aspect of personal finance would you like to explore?"
    ],
    
    // HEALTH & WELLNESS
    health: [
      "Your health is your greatest asset! 🌟 Maintaining good physical and mental health is essential for success:\n\n**Physical Health Tips:**\n• **Exercise Regularly:** 30 minutes daily minimum\n• **Eat Nutritiously:** Balanced diet with local foods\n• **Stay Hydrated:** 8+ glasses of water daily\n• **Get Enough Sleep:** 7-9 hours per night\n• **Regular Checkups:** Preventive healthcare\n\n**Mental Health & Stress Management:**\n• Practice mindfulness and meditation\n• Maintain work-life balance\n• Build strong relationships\n• Seek help when needed\n• Engage in hobbies you enjoy\n\n**Healthy Habits for Students:**\n• Take regular study breaks\n• Exercise between study sessions\n• Eat brain-healthy foods (fish, nuts, fruits)\n• Limit screen time before bed\n• Stay connected with friends and family\n\n**Free Health Resources:**\n• Ministry of Health Kenya guidelines\n• Free meditation apps\n• Community health centers\n• University counseling services\n\nIs there a specific health topic you'd like to discuss?"
    ],
    
    kinapPrograms: [
      "KiNaP Ajira Digital Club offers comprehensive programs designed to transform students into digital professionals! 🎓\n\n**Current Programs:**\n\n🚀 **Digital Skills Bootcamp** (Starting Feb 15th)\n• Duration: 12 weeks\n• Skills: Web Dev, Digital Marketing, Design\n• Cost: KSh 15,000 (Early bird: KSh 10,000)\n• Placement assistance included\n\n💼 **Freelancer Accelerator Program**\n• 8-week intensive course\n• Portfolio development\n• Client acquisition strategies\n• Mentorship from successful freelancers\n\n🎯 **Career Transition Program**\n• For graduates seeking digital careers\n• Interview preparation\n• Industry certifications\n• Job placement support\n\n**Success Rate:** 85% of our graduates find employment or freelance work within 3 months!\n\nWhich program interests you most?",
      
      "I'm excited to tell you about our programs! KiNaP is transforming lives through digital education. 🌟\n\n**Flagship Programs:**\n\n📚 **Comprehensive Digital Literacy** - Perfect for beginners\n🔧 **Technical Skills Development** - Advanced programming & development\n📈 **Entrepreneurship & Business Skills** - Start your own digital business\n🤝 **Mentorship Program** - One-on-one guidance from industry experts\n\n**What makes us special:**\n• Small class sizes (max 20 students)\n• Hands-on projects with real clients\n• Industry-relevant curriculum\n• Job placement assistance\n• Flexible payment plans\n• Community support network\n\n**Alumni Success:** Our graduates work at Safaricom, KCB, Equity Bank, and many have successful freelance businesses!\n\nWould you like to know about enrollment for any specific program?"
    ],
    
    onlineIncome: [
      "There are numerous legitimate ways to earn money online from Kenya! 💰 Here are proven methods our students use:\n\n**Immediate Income (Start today):**\n• **Data Entry** - KSh 500-1500/day\n• **Content Writing** - KSh 1000-3000/article\n• **Social Media Management** - KSh 15,000-40,000/month per client\n• **Virtual Assistant** - KSh 30,000-80,000/month\n\n**Medium-term Income (2-6 months learning):**\n• **Web Development** - KSh 50,000-200,000/project\n• **Graphic Design** - KSh 5,000-25,000/project\n• **Digital Marketing** - KSh 20,000-100,000/month per client\n\n**Long-term Income (6+ months):**\n• **App Development** - KSh 100,000-500,000/project\n• **Online Coaching** - KSh 50,000-300,000/month\n• **E-commerce Business** - Unlimited potential\n\nWhat's your timeline and current skill level? I can suggest the best path for you!",
      
      "Making money online is very achievable! 🎯 Our students are earning between KSh 20,000 to KSh 500,000 monthly. Here's the reality:\n\n**Beginner-Friendly Options:**\n• **Surveys & Micro-tasks** - KSh 5,000-15,000/month\n• **Content Creation** - KSh 20,000-80,000/month\n• **Online Tutoring** - KSh 1,500-3,000/hour\n• **Affiliate Marketing** - KSh 10,000-100,000/month\n\n**Professional Services:**\n• **Freelance Writing** - KSh 50-500/word\n• **Web Development** - KSh 80,000-300,000/project\n• **Consulting** - KSh 2,000-10,000/hour\n• **Online Courses** - KSh 100,000-1M/month potential\n\n**Success Requirements:**\n✓ Dedicated learning time (2-4 hours daily)\n✓ Consistent practice and improvement\n✓ Professional online presence\n✓ Excellent communication skills\n\nI can help you create a realistic income plan. What's your target monthly income?"
    ],
    
    careerGuidance: [
      "I'd love to help guide your career journey! 🗺️ Career planning in the digital age requires strategic thinking. Let me ask a few questions to give you personalized advice:\n\n**Quick Assessment:**\n• What's your current field of study?\n• What are your natural strengths?\n• Do you prefer technical or creative work?\n• What's your ideal work environment?\n• What's your target income level?\n\n**Popular Career Paths for KiNaP Students:**\n🔧 **Technical Track:** Software Developer, Data Analyst, Cybersecurity Specialist\n🎨 **Creative Track:** UI/UX Designer, Content Creator, Digital Marketer\n💼 **Business Track:** Digital Consultant, Project Manager, Entrepreneur\n🎓 **Education Track:** Online Instructor, Corporate Trainer, Course Creator\n\n**Next Steps:**\n1. Skills assessment and gap analysis\n2. Create a 6-month learning plan\n3. Build a professional portfolio\n4. Network with industry professionals\n5. Apply for internships or entry-level positions\n\nTell me about your interests and I'll suggest a specific career roadmap!",
      
      "Career guidance is one of my favorite topics! 🌟 The digital economy has created amazing opportunities for young Kenyans.\n\n**Current Market Reality:**\n• Remote work has increased by 300% post-COVID\n• Digital skills can increase your salary by 200-500%\n• Freelancing market in Kenya is worth $2.5B annually\n• 78% of employers prefer candidates with digital skills\n\n**Career Success Framework:**\n\n**Phase 1: Foundation (Months 1-3)**\n• Identify your passion and strengths\n• Learn fundamental digital skills\n• Build basic online presence\n\n**Phase 2: Specialization (Months 4-9)**\n• Deep dive into chosen field\n• Create impressive portfolio\n• Start building professional network\n\n**Phase 3: Professional Growth (Months 10-18)**\n• Land first major role/clients\n• Continuous skill advancement\n• Consider leadership opportunities\n\n**Long-term Vision:**\n• Industry expertise and thought leadership\n• Multiple income streams\n• Mentor others and give back\n\nWhat stage are you currently at? I can provide specific guidance for your next steps!"
    ],
    
    technicalSupport: [
      "I'm here to help with any technical challenges you're facing! 🔧 Technical issues can be frustrating, but most have simple solutions.\n\n**Common Issues I Can Help With:**\n\n🖥️ **Computer & Software:**\n• Slow performance optimization\n• Software installation and setup\n• File management and organization\n• Browser and internet issues\n\n📱 **Mobile & Apps:**\n• App troubleshooting\n• Account setup and recovery\n• Privacy and security settings\n• Performance optimization\n\n🌐 **Online Platforms:**\n• Profile setup on freelance platforms\n• Payment and withdrawal issues\n• Portfolio creation and optimization\n• Communication tools setup\n\n💻 **Development Tools:**\n• Code editor setup (VS Code, etc.)\n• Git and GitHub configuration\n• Database connections\n• Deployment issues\n\n**Support Process:**\n1. Describe your issue in detail\n2. Share error messages (if any)\n3. Mention what you've already tried\n4. I'll provide step-by-step solutions\n5. Follow-up to ensure resolution\n\nWhat technical challenge are you facing today?"
    ],
    
    // GENERAL KNOWLEDGE & FALLBACK
    generalQuestions: [
      "That's a great question! 🤔 While I specialize in digital skills and career development, I believe in providing helpful information on various topics.\n\n**Here's what I can help you with:**\n• **Academic subjects** - Study tips, research methods\n• **General knowledge** - Current events, basic science, history\n• **Life skills** - Time management, communication, problem-solving\n• **Personal development** - Goal setting, motivation, productivity\n• **Kenya-specific information** - Local opportunities, resources, culture\n\n**If you need specialized information, I can:**\n1. Research the topic and provide accurate information\n2. Direct you to reliable sources and experts\n3. Break down complex topics into understandable parts\n4. Suggest related areas where I can provide immediate help\n\nCould you tell me more about what you're looking for? I'll do my best to provide valuable insights or guide you to the right resources!"
    ],
    
    fallback: [
      "That's an interesting question! 🤔 While I specialize in digital skills and career guidance, I'm always learning. Let me either:\n\n1. **Connect you with the right resource** - I can direct you to the appropriate KiNaP department or external resource\n\n2. **Research and follow up** - I can look into this and provide you with comprehensive information\n\n3. **Suggest alternatives** - Perhaps there's a related topic I can help with immediately\n\nCould you provide a bit more context about what you're looking for? I want to make sure you get the best possible assistance.\n\nAlternatively, here are some popular topics I can definitely help with right now:",
      
      "I appreciate your question! 💭 While that's not directly in my area of expertise, I believe in providing value however I can.\n\n**What I can do right now:**\n• Research this topic and get back to you within 24 hours\n• Connect you with a specialist who can help immediately\n• Suggest related resources or approaches\n• Help you frame the question for better results\n\n**My core expertise areas:**\n✓ Digital skills development\n✓ Career planning and guidance\n✓ Freelancing and remote work\n✓ Online income strategies\n✓ KiNaP programs and services\n✓ Technical support for common issues\n✓ Educational guidance and study tips\n✓ Basic business and financial advice\n✓ Personal development and productivity\n✓ General knowledge and research assistance\n\nWould you like me to research your question, or is there something in my expertise areas I can help with instead?"
    ]
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const greeting = agentResponses.greeting[Math.floor(Math.random() * agentResponses.greeting.length)];
        addAgentMessage(greeting, quickReplies.slice(0, 4));
      }, 1000);
    }
  }, [isOpen]);

  // Add agent message with typing simulation
  const addAgentMessage = (message: string, quickRepliesData?: string[]) => {
    setIsAgentTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(message.length * 30, 3000);
    
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'agent',
        message,
        timestamp: new Date(),
        quickReplies: quickRepliesData
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsAgentTyping(false);
      
      if (quickRepliesData) {
        setShowQuickReplies(true);
      }
    }, typingDelay);
  };

  // Add user message
  const addUserMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setShowQuickReplies(false);
  };

  // Get agent response based on user input
  const getAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // DIGITAL SKILLS & TRAINING
    if (message.includes('freelanc')) {
      return agentResponses.freelancing[Math.floor(Math.random() * agentResponses.freelancing.length)];
    }
    
    if (message.includes('digital skill') || message.includes('skill') || message.includes('learn')) {
      return agentResponses.digitalSkills[Math.floor(Math.random() * agentResponses.digitalSkills.length)];
    }
    
    // PROGRAMMING & DEVELOPMENT
    if (message.includes('programm') || message.includes('coding') || message.includes('code') || 
        message.includes('python') || message.includes('javascript') || message.includes('html') || 
        message.includes('css') || message.includes('react') || message.includes('node') || 
        message.includes('java') || message.includes('software development')) {
      return agentResponses.programming[Math.floor(Math.random() * agentResponses.programming.length)];
    }
    
    if (message.includes('web dev') || message.includes('website') || message.includes('frontend') || 
        message.includes('backend') || message.includes('full stack') || message.includes('web application')) {
      return agentResponses.webDevelopment[Math.floor(Math.random() * agentResponses.webDevelopment.length)];
    }
    
    // BUSINESS & ENTREPRENEURSHIP
    if (message.includes('business') || message.includes('startup') || message.includes('entrepreneur') || 
        message.includes('company') || message.includes('enterprise') || message.includes('venture')) {
      return agentResponses.business[Math.floor(Math.random() * agentResponses.business.length)];
    }
    
    // EDUCATION & LEARNING
    if (message.includes('education') || message.includes('study') || message.includes('school') || 
        message.includes('university') || message.includes('college') || message.includes('course') || 
        message.includes('exam') || message.includes('homework') || message.includes('assignment')) {
      return agentResponses.education[Math.floor(Math.random() * agentResponses.education.length)];
    }
    
    // CAREER & PROFESSIONAL DEVELOPMENT
    if (message.includes('career') || message.includes('job') || message.includes('guidance') || 
        message.includes('advice') || message.includes('professional') || message.includes('work') || 
        message.includes('employment') || message.includes('interview')) {
      return agentResponses.career[Math.floor(Math.random() * agentResponses.career.length)];
    }
    
    // TECHNOLOGY & INNOVATION
    if (message.includes('technology') || message.includes('tech') || message.includes('ai') || 
        message.includes('artificial intelligence') || message.includes('machine learning') || 
        message.includes('blockchain') || message.includes('cloud') || message.includes('iot') || 
        message.includes('cybersecurity') || message.includes('innovation')) {
      return agentResponses.technology[Math.floor(Math.random() * agentResponses.technology.length)];
    }
    
    // FINANCIAL LITERACY
    if (message.includes('finance') || message.includes('money') || message.includes('budget') || 
        message.includes('investment') || message.includes('saving') || message.includes('financial') || 
        message.includes('income') || message.includes('economy') || message.includes('salary')) {
      return agentResponses.finance[Math.floor(Math.random() * agentResponses.finance.length)];
    }
    
    // HEALTH & WELLNESS
    if (message.includes('health') || message.includes('wellness') || message.includes('fitness') || 
        message.includes('exercise') || message.includes('mental health') || message.includes('stress') || 
        message.includes('wellbeing') || message.includes('meditation') || message.includes('nutrition')) {
      return agentResponses.health[Math.floor(Math.random() * agentResponses.health.length)];
    }
    
    // KINAP PROGRAMS
    if (message.includes('kinap') || message.includes('program') || message.includes('bootcamp') || 
        message.includes('training') || message.includes('certification') || message.includes('enrollment')) {
      return agentResponses.kinapPrograms[Math.floor(Math.random() * agentResponses.kinapPrograms.length)];
    }
    
    // ONLINE INCOME
    if (message.includes('earn') || message.includes('pay') || message.includes('online income') || 
        message.includes('make money') || message.includes('side hustle') || message.includes('passive income')) {
      return agentResponses.onlineIncome[Math.floor(Math.random() * agentResponses.onlineIncome.length)];
    }
    
    // TECHNICAL SUPPORT
    if (message.includes('technical') || message.includes('support') || message.includes('help') || 
        message.includes('problem') || message.includes('issue') || message.includes('error') || 
        message.includes('bug') || message.includes('fix') || message.includes('troubleshoot')) {
      return agentResponses.technicalSupport[Math.floor(Math.random() * agentResponses.technicalSupport.length)];
    }
    
    // GENERAL QUESTIONS (catch more topics)
    if (message.includes('what') || message.includes('how') || message.includes('why') || 
        message.includes('when') || message.includes('where') || message.includes('which') || 
        message.includes('explain') || message.includes('tell me') || message.includes('information') || 
        message.includes('about') || message.includes('guide') || message.includes('tutorial')) {
      return agentResponses.generalQuestions[Math.floor(Math.random() * agentResponses.generalQuestions.length)];
    }
    
    // DEFAULT FALLBACK
    return agentResponses.fallback[Math.floor(Math.random() * agentResponses.fallback.length)];
  };

  // Handle sending message
  const handleSendMessage = (message: string = inputValue) => {
    if (!message.trim()) return;
    
    addUserMessage(message);
    setInputValue('');
    
    // Generate agent response
    setTimeout(() => {
      const response = getAgentResponse(message);
      addAgentMessage(response, quickReplies.slice(0, 3));
    }, 500);
  };

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  // Handle rating
  const handleRating = (messageId: string, rating: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  // Render agent status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-kenya-red to-kenya-green text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with our AI Assistant
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-kenya-red to-kenya-green text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentAgent.avatar}
              alt={currentAgent.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(currentAgent.status)} rounded-full border-2 border-white`}></div>
          </div>
          {!isMinimized && (
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{currentAgent.name}</h3>
                <Bot className="w-4 h-4" />
              </div>
              <p className="text-sm opacity-90">{currentAgent.title}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Agent Info */}
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-kenya-red" />
              <span>AI-powered • Specialized in {currentAgent.expertise[0]}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Usually responds in under 30 seconds</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'agent' && (
                  <img
                    src={currentAgent.avatar}
                    alt={currentAgent.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                
                <div className={`max-w-xs ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-kenya-red text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1 ${message.type === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {message.type === 'agent' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRating(message.id, 'positive')}
                          className={`p-1 hover:bg-gray-200 rounded transition-colors ${
                            message.rating === 'positive' ? 'text-green-500' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRating(message.id, 'negative')}
                          className={`p-1 hover:bg-gray-200 rounded transition-colors ${
                            message.rating === 'negative' ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Replies */}
                  {message.type === 'agent' && message.quickReplies && showQuickReplies && (
                    <div className="mt-3 space-y-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="block w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-kenya-red to-kenya-green rounded-full flex items-center justify-center flex-shrink-0 order-2">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isAgentTyping && (
              <div className="flex gap-3 justify-start">
                <img
                  src={currentAgent.avatar}
                  alt={currentAgent.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-kenya-red border-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="p-2 bg-kenya-red text-white rounded-full hover:bg-kenya-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Powered by */}
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
              <Brain className="w-3 h-3" />
              <span>Powered by KiNaP AI • Always learning, always helping</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IntegratedChatbot; 