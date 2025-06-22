import { useState } from 'react'
import { Mail, Globe, Linkedin, Twitter } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  position: string
  image: string
  bio: string
  contact: {
    email?: string
    website?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
}

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<'leaders' | 'members'>('leaders')

  const leaders: TeamMember[] = [
    {
      name: "John Doe",
      role: "leader",
      position: "Club President",
      image: "https://ui-avatars.com/api/?name=John+Doe&background=000000&color=fff",
      bio: "Final year student in Computer Science with a passion for digital innovation and community building.",
      contact: {
        email: "john.doe@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe"
      }
    },
    {
      name: "Jane Smith",
      role: "leader",
      position: "Vice President",
      image: "https://ui-avatars.com/api/?name=Jane+Smith&background=CE1126&color=fff",
      bio: "Digital marketing specialist and advocate for youth empowerment in technology.",
      contact: {
        email: "jane.smith@kinap.ac.ke",
        website: "https://janesmith.com",
        linkedin: "https://linkedin.com/in/janesmith"
      }
    },
    {
      name: "David Kamau",
      role: "leader",
      position: "Technical Lead",
      image: "https://ui-avatars.com/api/?name=David+Kamau&background=006B3F&color=fff",
      bio: "Full-stack developer with experience in building community platforms and mentoring students.",
      contact: {
        email: "david.kamau@kinap.ac.ke",
        github: "https://github.com/davidkamau"
      }
    },
    {
      name: "Grace Wanjiku",
      role: "leader",
      position: "Cyber Security Lead",
      image: "https://ui-avatars.com/api/?name=Grace+Wanjiku&background=000000&color=fff",
      bio: "Information security specialist focused on protecting digital infrastructure and educating students on cybersecurity best practices.",
      contact: {
        email: "grace.wanjiku@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/gracewanjiku"
      }
    },
    {
      name: "Michael Ochieng",
      role: "leader",
      position: "Website Administrator",
      image: "https://ui-avatars.com/api/?name=Michael+Ochieng&background=CE1126&color=fff",
      bio: "Website maintenance specialist ensuring platform reliability and implementing new features for enhanced user experience.",
      contact: {
        email: "michael.ochieng@kinap.ac.ke",
        github: "https://github.com/michaelochieng"
      }
    },
    {
      name: "Sarah Njeri",
      role: "leader",
      position: "Content Manager",
      image: "https://ui-avatars.com/api/?name=Sarah+Njeri&background=006B3F&color=fff",
      bio: "Creative content strategist managing digital assets and coordinating multimedia content across all platforms.",
      contact: {
        email: "sarah.njeri@kinap.ac.ke",
        twitter: "https://twitter.com/sarahnjeri"
      }
    },
    {
      name: "Peter Mwangi",
      role: "leader",
      position: "Data Analyst",
      image: "https://ui-avatars.com/api/?name=Peter+Mwangi&background=000000&color=fff",
      bio: "Data science specialist analyzing user engagement and platform performance to drive strategic decisions.",
      contact: {
        email: "peter.mwangi@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/petermwangi"
      }
    },
    {
      name: "Faith Akinyi",
      role: "leader",
      position: "UI/UX Designer",
      image: "https://ui-avatars.com/api/?name=Faith+Akinyi&background=CE1126&color=fff",
      bio: "User experience designer creating intuitive interfaces and improving platform usability for all members.",
      contact: {
        email: "faith.akinyi@kinap.ac.ke",
        website: "https://faithdesigns.com"
      }
    },
    {
      name: "James Kiprotich",
      role: "leader",
      position: "DevOps Engineer",
      image: "https://ui-avatars.com/api/?name=James+Kiprotich&background=006B3F&color=fff",
      bio: "Infrastructure specialist managing deployment pipelines and ensuring system scalability and reliability.",
      contact: {
        email: "james.kiprotich@kinap.ac.ke",
        github: "https://github.com/jameskiprotich"
      }
    },
    {
      name: "Mary Wanjiru",
      role: "leader",
      position: "Quality Assurance Lead",
      image: "https://ui-avatars.com/api/?name=Mary+Wanjiru&background=000000&color=fff",
      bio: "Software testing specialist ensuring platform quality and implementing automated testing frameworks.",
      contact: {
        email: "mary.wanjiru@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/marywanjiru"
      }
    },
    {
      name: "Daniel Mutua",
      role: "leader",
      position: "Mobile App Developer",
      image: "https://ui-avatars.com/api/?name=Daniel+Mutua&background=CE1126&color=fff",
      bio: "Mobile application developer creating cross-platform solutions for enhanced user accessibility.",
      contact: {
        email: "daniel.mutua@kinap.ac.ke",
        github: "https://github.com/danielmutua"
      }
    },
    {
      name: "Ruth Nyawira",
      role: "leader",
      position: "Database Administrator",
      image: "https://ui-avatars.com/api/?name=Ruth+Nyawira&background=006B3F&color=fff",
      bio: "Database specialist managing data integrity, performance optimization, and backup strategies.",
      contact: {
        email: "ruth.nyawira@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/ruthnyawira"
      }
    },
    {
      name: "Kevin Otieno",
      role: "leader",
      position: "API Developer",
      image: "https://ui-avatars.com/api/?name=Kevin+Otieno&background=000000&color=fff",
      bio: "Backend developer specializing in API design and microservices architecture for scalable solutions.",
      contact: {
        email: "kevin.otieno@kinap.ac.ke",
        github: "https://github.com/kevinotieno"
      }
    },
    {
      name: "Nancy Cherop",
      role: "leader",
      position: "System Administrator",
      image: "https://ui-avatars.com/api/?name=Nancy+Cherop&background=CE1126&color=fff",
      bio: "System administration expert managing server infrastructure and network security protocols.",
      contact: {
        email: "nancy.cherop@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/nancycherop"
      }
    },
    {
      name: "Anthony Karanja",
      role: "leader",
      position: "SEO Specialist",
      image: "https://ui-avatars.com/api/?name=Anthony+Karanja&background=006B3F&color=fff",
      bio: "Digital marketing expert optimizing platform visibility and driving organic growth through SEO strategies.",
      contact: {
        email: "anthony.karanja@kinap.ac.ke",
        website: "https://anthonyseo.com"
      }
    },
    {
      name: "Esther Muthoni",
      role: "leader",
      position: "Social Media Manager",
      image: "https://ui-avatars.com/api/?name=Esther+Muthoni&background=000000&color=fff",
      bio: "Social media strategist building community engagement and brand awareness across digital platforms.",
      contact: {
        email: "esther.muthoni@kinap.ac.ke",
        twitter: "https://twitter.com/esthermuthoni"
      }
    },
    {
      name: "Collins Kiplagat",
      role: "leader",
      position: "Cloud Architect",
      image: "https://ui-avatars.com/api/?name=Collins+Kiplagat&background=CE1126&color=fff",
      bio: "Cloud infrastructure specialist designing scalable and cost-effective cloud solutions for the platform.",
      contact: {
        email: "collins.kiplagat@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/collinskiplagat"
      }
    },
    {
      name: "Priscilla Wambui",
      role: "leader",
      position: "Blockchain Developer",
      image: "https://ui-avatars.com/api/?name=Priscilla+Wambui&background=006B3F&color=fff",
      bio: "Blockchain technology expert exploring decentralized solutions and cryptocurrency integration opportunities.",
      contact: {
        email: "priscilla.wambui@kinap.ac.ke",
        github: "https://github.com/priscillawambui"
      }
    },
    {
      name: "Felix Mbugua",
      role: "leader",
      position: "AI/ML Engineer",
      image: "https://ui-avatars.com/api/?name=Felix+Mbugua&background=000000&color=fff",
      bio: "Machine learning specialist developing intelligent features and automation solutions for platform enhancement.",
      contact: {
        email: "felix.mbugua@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/felixmbugua"
      }
    },
    {
      name: "Mercy Wairimu",
      role: "leader",
      position: "Product Manager",
      image: "https://ui-avatars.com/api/?name=Mercy+Wairimu&background=CE1126&color=fff",
      bio: "Product strategy expert coordinating feature development and ensuring alignment with user needs and business goals.",
      contact: {
        email: "mercy.wairimu@kinap.ac.ke",
        website: "https://mercypm.com"
      }
    },
    {
      name: "Victor Chege",
      role: "leader",
      position: "Network Security Analyst",
      image: "https://ui-avatars.com/api/?name=Victor+Chege&background=006B3F&color=fff",
      bio: "Network security specialist monitoring threats and implementing security measures to protect platform infrastructure.",
      contact: {
        email: "victor.chege@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/victorchege"
      }
    },
    {
      name: "Lydia Auma",
      role: "leader",
      position: "Frontend Developer",
      image: "https://ui-avatars.com/api/?name=Lydia+Auma&background=000000&color=fff",
      bio: "Frontend development specialist creating responsive and interactive user interfaces with modern web technologies.",
      contact: {
        email: "lydia.auma@kinap.ac.ke",
        github: "https://github.com/lydiaauma"
      }
    },
    {
      name: "Steve Macharia",
      role: "leader",
      position: "Business Analyst",
      image: "https://ui-avatars.com/api/?name=Steve+Macharia&background=CE1126&color=fff",
      bio: "Business analysis expert identifying opportunities for platform improvement and strategic growth initiatives.",
      contact: {
        email: "steve.macharia@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/stevemacharia"
      }
    },
    {
      name: "Agnes Wangari",
      role: "leader",
      position: "Digital Marketing Specialist",
      image: "https://ui-avatars.com/api/?name=Agnes+Wangari&background=006B3F&color=fff",
      bio: "Digital marketing expert developing comprehensive campaigns to promote platform features and community engagement.",
      contact: {
        email: "agnes.wangari@kinap.ac.ke",
        twitter: "https://twitter.com/agneswangari"
      }
    },
    {
      name: "Brian Kiprotich",
      role: "leader",
      position: "Technical Writer",
      image: "https://ui-avatars.com/api/?name=Brian+Kiprotich&background=000000&color=fff",
      bio: "Technical documentation specialist creating comprehensive guides and tutorials for platform users and developers.",
      contact: {
        email: "brian.kiprotich@kinap.ac.ke",
        website: "https://briantechwriter.com"
      }
    },
    {
      name: "Caroline Njoroge",
      role: "leader",
      position: "Data Privacy Officer",
      image: "https://ui-avatars.com/api/?name=Caroline+Njoroge&background=CE1126&color=fff",
      bio: "Data protection specialist ensuring compliance with privacy regulations and implementing data governance policies.",
      contact: {
        email: "caroline.njoroge@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/carolinenjoroge"
      }
    },
    {
      name: "Dennis Kimani",
      role: "leader",
      position: "Performance Engineer",
      image: "https://ui-avatars.com/api/?name=Dennis+Kimani&background=006B3F&color=fff",
      bio: "Performance optimization specialist ensuring platform speed and efficiency through advanced monitoring and tuning techniques.",
      contact: {
        email: "dennis.kimani@kinap.ac.ke",
        github: "https://github.com/denniskimani"
      }
    },
    {
      name: "Jackline Mutindi",
      role: "leader",
      position: "Community Manager",
      image: "https://ui-avatars.com/api/?name=Jackline+Mutindi&background=000000&color=fff",
      bio: "Community engagement specialist fostering relationships and facilitating communication between platform users and stakeholders.",
      contact: {
        email: "jackline.mutindi@kinap.ac.ke",
        twitter: "https://twitter.com/jacklinemutindi"
      }
    },
    {
      name: "Samuel Kipruto",
      role: "leader",
      position: "Integration Specialist",
      image: "https://ui-avatars.com/api/?name=Samuel+Kipruto&background=CE1126&color=fff",
      bio: "Systems integration expert connecting various platforms and services to create seamless user experiences.",
      contact: {
        email: "samuel.kipruto@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/samuelkipruto"
      }
    },
    {
      name: "Winnie Wairimu",
      role: "leader",
      position: "Accessibility Coordinator",
      image: "https://ui-avatars.com/api/?name=Winnie+Wairimu&background=006B3F&color=fff",
      bio: "Accessibility specialist ensuring platform usability for users with diverse abilities and implementing inclusive design principles.",
      contact: {
        email: "winnie.wairimu@kinap.ac.ke",
        website: "https://accessibledesign.com"
      }
    },
    {
      name: "Moses Omondi",
      role: "leader",
      position: "Backup & Recovery Specialist",
      image: "https://ui-avatars.com/api/?name=Moses+Omondi&background=000000&color=fff",
      bio: "Data backup and disaster recovery expert implementing robust systems to ensure business continuity and data protection.",
      contact: {
        email: "moses.omondi@kinap.ac.ke",
        linkedin: "https://linkedin.com/in/mosesomondi"
      }
    }
  ]

  const members: TeamMember[] = [
    // Active Contributors (100 members)
    {
      name: "Alice Wanjiku",
      role: "member",
      position: "Web Development Specialist",
      image: "https://ui-avatars.com/api/?name=Alice+Wanjiku&background=000000&color=fff",
      bio: "Passionate about creating beautiful and functional web experiences.",
      contact: {
        email: "alice.wanjiku@kinap.ac.ke"
      }
    },
    {
      name: "Bob Maina",
      role: "member",
      position: "Content Creator",
      image: "https://ui-avatars.com/api/?name=Bob+Maina&background=CE1126&color=fff",
      bio: "Creative writer and digital content specialist.",
      contact: {
        email: "bob.maina@kinap.ac.ke"
      }
    },
    {
      name: "Carol Njeri",
      role: "member",
      position: "Graphic Designer",
      image: "https://ui-avatars.com/api/?name=Carol+Njeri&background=006B3F&color=fff",
      bio: "Visual designer creating compelling graphics for digital platforms.",
      contact: {
        email: "carol.njeri@kinap.ac.ke"
      }
    },
    {
      name: "Emmanuel Kiplagat",
      role: "member",
      position: "Python Developer",
      image: "https://ui-avatars.com/api/?name=Emmanuel+Kiplagat&background=000000&color=fff",
      bio: "Backend developer specializing in Python and Django frameworks.",
      contact: {
        email: "emmanuel.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Florence Wanjira",
      role: "member",
      position: "Digital Marketer",
      image: "https://ui-avatars.com/api/?name=Florence+Wanjira&background=CE1126&color=fff",
      bio: "Marketing enthusiast focused on social media and online campaigns.",
      contact: {
        email: "florence.wanjira@kinap.ac.ke"
      }
    },
    {
      name: "George Mutua",
      role: "member",
      position: "Video Editor",
      image: "https://ui-avatars.com/api/?name=George+Mutua&background=006B3F&color=fff",
      bio: "Creative video editor producing engaging multimedia content.",
      contact: {
        email: "george.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Hannah Achieng",
      role: "member",
      position: "Data Entry Specialist",
      image: "https://ui-avatars.com/api/?name=Hannah+Achieng&background=000000&color=fff",
      bio: "Detail-oriented professional ensuring accurate data management.",
      contact: {
        email: "hannah.achieng@kinap.ac.ke"
      }
    },
    {
      name: "Isaac Korir",
      role: "member",
      position: "Mobile App Tester",
      image: "https://ui-avatars.com/api/?name=Isaac+Korir&background=CE1126&color=fff",
      bio: "Quality assurance specialist for mobile applications.",
      contact: {
        email: "isaac.korir@kinap.ac.ke"
      }
    },
    {
      name: "Janet Wambui",
      role: "member",
      position: "Customer Support",
      image: "https://ui-avatars.com/api/?name=Janet+Wambui&background=006B3F&color=fff",
      bio: "Dedicated to providing excellent user support and assistance.",
      contact: {
        email: "janet.wambui@kinap.ac.ke"
      }
    },
    {
      name: "Kennedy Otieno",
      role: "member",
      position: "JavaScript Developer",
      image: "https://ui-avatars.com/api/?name=Kennedy+Otieno&background=000000&color=fff",
      bio: "Frontend developer with expertise in modern JavaScript frameworks.",
      contact: {
        email: "kennedy.otieno@kinap.ac.ke"
      }
    },
    {
      name: "Lucy Muthoni",
      role: "member",
      position: "Social Media Coordinator",
      image: "https://ui-avatars.com/api/?name=Lucy+Muthoni&background=CE1126&color=fff",
      bio: "Managing social media presence and community engagement.",
      contact: {
        email: "lucy.muthoni@kinap.ac.ke"
      }
    },
    {
      name: "Martin Kiprotich",
      role: "member",
      position: "WordPress Developer",
      image: "https://ui-avatars.com/api/?name=Martin+Kiprotich&background=006B3F&color=fff",
      bio: "WordPress specialist creating custom themes and plugins.",
      contact: {
        email: "martin.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Nancy Wairimu",
      role: "member",
      position: "SEO Assistant",
      image: "https://ui-avatars.com/api/?name=Nancy+Wairimu&background=000000&color=fff",
      bio: "Supporting SEO efforts to improve online visibility.",
      contact: {
        email: "nancy.wairimu@kinap.ac.ke"
      }
    },
    {
      name: "Oscar Macharia",
      role: "member",
      position: "Network Technician",
      image: "https://ui-avatars.com/api/?name=Oscar+Macharia&background=CE1126&color=fff",
      bio: "Network maintenance and troubleshooting specialist.",
      contact: {
        email: "oscar.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Patricia Njoroge",
      role: "member",
      position: "Content Writer",
      image: "https://ui-avatars.com/api/?name=Patricia+Njoroge&background=006B3F&color=fff",
      bio: "Creative writer producing engaging content for various platforms.",
      contact: {
        email: "patricia.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "Quincy Ochieng",
      role: "member",
      position: "PHP Developer",
      image: "https://ui-avatars.com/api/?name=Quincy+Ochieng&background=000000&color=fff",
      bio: "Backend developer with strong PHP and MySQL skills.",
      contact: {
        email: "quincy.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Rebecca Kimani",
      role: "member",
      position: "UI Designer",
      image: "https://ui-avatars.com/api/?name=Rebecca+Kimani&background=CE1126&color=fff",
      bio: "User interface designer creating intuitive and beautiful designs.",
      contact: {
        email: "rebecca.kimani@kinap.ac.ke"
      }
    },
    {
      name: "Samuel Wanyama",
      role: "member",
      position: "Database Assistant",
      image: "https://ui-avatars.com/api/?name=Samuel+Wanyama&background=006B3F&color=fff",
      bio: "Supporting database operations and data management tasks.",
      contact: {
        email: "samuel.wanyama@kinap.ac.ke"
      }
    },
    {
      name: "Teresa Akinyi",
      role: "member",
      position: "Digital Artist",
      image: "https://ui-avatars.com/api/?name=Teresa+Akinyi&background=000000&color=fff",
      bio: "Creating digital art and illustrations for various projects.",
      contact: {
        email: "teresa.akinyi@kinap.ac.ke"
      }
    },
    {
      name: "Vincent Mbugua",
      role: "member",
      position: "React Developer",
      image: "https://ui-avatars.com/api/?name=Vincent+Mbugua&background=CE1126&color=fff",
      bio: "Frontend developer specializing in React and modern web technologies.",
      contact: {
        email: "vincent.mbugua@kinap.ac.ke"
      }
    },
    {
      name: "Winfred Cherop",
      role: "member",
      position: "Email Marketing Specialist",
      image: "https://ui-avatars.com/api/?name=Winfred+Cherop&background=006B3F&color=fff",
      bio: "Managing email campaigns and automated marketing workflows.",
      contact: {
        email: "winfred.cherop@kinap.ac.ke"
      }
    },
    {
      name: "Xavier Mutua",
      role: "member",
      position: "API Tester",
      image: "https://ui-avatars.com/api/?name=Xavier+Mutua&background=000000&color=fff",
      bio: "Testing and validating API endpoints for functionality and performance.",
      contact: {
        email: "xavier.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Yvonne Wanjiku",
      role: "member",
      position: "Brand Designer",
      image: "https://ui-avatars.com/api/?name=Yvonne+Wanjiku&background=CE1126&color=fff",
      bio: "Creating brand assets and maintaining visual identity consistency.",
      contact: {
        email: "yvonne.wanjiku@kinap.ac.ke"
      }
    },
    {
      name: "Zachary Kipkorir",
      role: "member",
      position: "Technical Support",
      image: "https://ui-avatars.com/api/?name=Zachary+Kipkorir&background=006B3F&color=fff",
      bio: "Providing technical assistance and troubleshooting support.",
      contact: {
        email: "zachary.kipkorir@kinap.ac.ke"
      }
    },
    {
      name: "Agnes Mwangi",
      role: "member",
      position: "E-commerce Specialist",
      image: "https://ui-avatars.com/api/?name=Agnes+Mwangi&background=000000&color=fff",
      bio: "Managing online store functionality and e-commerce integrations.",
      contact: {
        email: "agnes.mwangi@kinap.ac.ke"
      }
    },
    {
      name: "Bernard Karanja",
      role: "member",
      position: "Angular Developer",
      image: "https://ui-avatars.com/api/?name=Bernard+Karanja&background=CE1126&color=fff",
      bio: "Frontend developer with expertise in Angular framework.",
      contact: {
        email: "bernard.karanja@kinap.ac.ke"
      }
    },
    {
      name: "Catherine Njeri",
      role: "member",
      position: "Podcast Producer",
      image: "https://ui-avatars.com/api/?name=Catherine+Njeri&background=006B3F&color=fff",
      bio: "Audio content creator producing educational and entertaining podcasts.",
      contact: {
        email: "catherine.njeri@kinap.ac.ke"
      }
    },
    {
      name: "Daniel Kiprono",
      role: "member",
      position: "IoT Developer",
      image: "https://ui-avatars.com/api/?name=Daniel+Kiprono&background=000000&color=fff",
      bio: "Internet of Things developer creating connected device solutions.",
      contact: {
        email: "daniel.kiprono@kinap.ac.ke"
      }
    },
    {
      name: "Elizabeth Wafula",
      role: "member",
      position: "Photography Specialist",
      image: "https://ui-avatars.com/api/?name=Elizabeth+Wafula&background=CE1126&color=fff",
      bio: "Professional photographer capturing events and creating visual content.",
      contact: {
        email: "elizabeth.wafula@kinap.ac.ke"
      }
    },
    {
      name: "Francis Omondi",
      role: "member",
      position: "Game Developer",
      image: "https://ui-avatars.com/api/?name=Francis+Omondi&background=006B3F&color=fff",
      bio: "Creating interactive games and educational gaming experiences.",
      contact: {
        email: "francis.omondi@kinap.ac.ke"
      }
    },
    {
      name: "Gloria Wanjiru",
      role: "member",
      position: "Animation Specialist",
      image: "https://ui-avatars.com/api/?name=Gloria+Wanjiru&background=000000&color=fff",
      bio: "2D/3D animator creating engaging visual content and motion graphics.",
      contact: {
        email: "gloria.wanjiru@kinap.ac.ke"
      }
    },
    {
      name: "Henry Kiprotich",
      role: "member",
      position: "Blockchain Enthusiast",
      image: "https://ui-avatars.com/api/?name=Henry+Kiprotich&background=CE1126&color=fff",
      bio: "Exploring blockchain applications and cryptocurrency technologies.",
      contact: {
        email: "henry.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Irene Mutindi",
      role: "member",
      position: "UX Researcher",
      image: "https://ui-avatars.com/api/?name=Irene+Mutindi&background=006B3F&color=fff",
      bio: "Conducting user research to improve platform usability and experience.",
      contact: {
        email: "irene.mutindi@kinap.ac.ke"
      }
    },
    {
      name: "Joseph Kiplagat",
      role: "member",
      position: "Cloud Support",
      image: "https://ui-avatars.com/api/?name=Joseph+Kiplagat&background=000000&color=fff",
      bio: "Supporting cloud infrastructure and deployment processes.",
      contact: {
        email: "joseph.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Kelly Wangari",
      role: "member",
      position: "Cybersecurity Analyst",
      image: "https://ui-avatars.com/api/?name=Kelly+Wangari&background=CE1126&color=fff",
      bio: "Monitoring security threats and implementing protective measures.",
      contact: {
        email: "kelly.wangari@kinap.ac.ke"
      }
    },
    {
      name: "Leonard Macharia",
      role: "member",
      position: "DevOps Assistant",
      image: "https://ui-avatars.com/api/?name=Leonard+Macharia&background=006B3F&color=fff",
      bio: "Supporting deployment automation and infrastructure management.",
      contact: {
        email: "leonard.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Miriam Nyawira",
      role: "member",
      position: "AR/VR Developer",
      image: "https://ui-avatars.com/api/?name=Miriam+Nyawira&background=000000&color=fff",
      bio: "Creating immersive augmented and virtual reality experiences.",
      contact: {
        email: "miriam.nyawira@kinap.ac.ke"
      }
    },
    {
      name: "Nicholas Kipruto",
      role: "member",
      position: "Machine Learning Enthusiast",
      image: "https://ui-avatars.com/api/?name=Nicholas+Kipruto&background=CE1126&color=fff",
      bio: "Exploring AI and machine learning applications for education.",
      contact: {
        email: "nicholas.kipruto@kinap.ac.ke"
      }
    },
    {
      name: "Olivia Auma",
      role: "member",
      position: "Technical Writer",
      image: "https://ui-avatars.com/api/?name=Olivia+Auma&background=006B3F&color=fff",
      bio: "Creating technical documentation and user guides.",
      contact: {
        email: "olivia.auma@kinap.ac.ke"
      }
    },
    {
      name: "Paul Chege",
      role: "member",
      position: "System Analyst",
      image: "https://ui-avatars.com/api/?name=Paul+Chege&background=000000&color=fff",
      bio: "Analyzing system requirements and proposing technical solutions.",
      contact: {
        email: "paul.chege@kinap.ac.ke"
      }
    },
    {
      name: "Queen Wanjiku",
      role: "member",
      position: "Product Support",
      image: "https://ui-avatars.com/api/?name=Queen+Wanjiku&background=CE1126&color=fff",
      bio: "Providing product support and gathering user feedback.",
      contact: {
        email: "queen.wanjiku@kinap.ac.ke"
      }
    },
    {
      name: "Robert Kimani",
      role: "member",
      position: "Flutter Developer",
      image: "https://ui-avatars.com/api/?name=Robert+Kimani&background=006B3F&color=fff",
      bio: "Mobile app developer specializing in Flutter framework.",
      contact: {
        email: "robert.kimani@kinap.ac.ke"
      }
    },
    {
      name: "Stella Njoroge",
      role: "member",
      position: "Event Coordinator",
      image: "https://ui-avatars.com/api/?name=Stella+Njoroge&background=000000&color=fff",
      bio: "Organizing digital events and community meetups.",
      contact: {
        email: "stella.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "Thomas Ochieng",
      role: "member",
      position: "Web Security Specialist",
      image: "https://ui-avatars.com/api/?name=Thomas+Ochieng&background=CE1126&color=fff",
      bio: "Ensuring web application security and vulnerability testing.",
      contact: {
        email: "thomas.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Vivian Mutua",
      role: "member",
      position: "Data Visualization Specialist",
      image: "https://ui-avatars.com/api/?name=Vivian+Mutua&background=006B3F&color=fff",
      bio: "Creating interactive charts and data visualization tools.",
      contact: {
        email: "vivian.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Wesley Kiplagat",
      role: "member",
      position: "API Developer",
      image: "https://ui-avatars.com/api/?name=Wesley+Kiplagat&background=000000&color=fff",
      bio: "Building and maintaining RESTful APIs and web services.",
      contact: {
        email: "wesley.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Ximena Wanjira",
      role: "member",
      position: "Quality Control Specialist",
      image: "https://ui-avatars.com/api/?name=Ximena+Wanjira&background=CE1126&color=fff",
      bio: "Ensuring quality standards across all digital products and services.",
      contact: {
        email: "ximena.wanjira@kinap.ac.ke"
      }
    },
    {
      name: "Yusuf Macharia",
      role: "member",
      position: "Linux Administrator",
      image: "https://ui-avatars.com/api/?name=Yusuf+Macharia&background=006B3F&color=fff",
      bio: "Managing Linux servers and open-source infrastructure.",
      contact: {
        email: "yusuf.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Zipporah Kiprotich",
      role: "member",
      position: "Frontend Designer",
      image: "https://ui-avatars.com/api/?name=Zipporah+Kiprotich&background=000000&color=fff",
      bio: "Creating beautiful and responsive frontend designs.",
      contact: {
        email: "zipporah.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Alex Mwangi",
      role: "member",
      position: "Business Intelligence Analyst",
      image: "https://ui-avatars.com/api/?name=Alex+Mwangi&background=CE1126&color=fff",
      bio: "Analyzing business data to drive strategic decisions.",
      contact: {
        email: "alex.mwangi@kinap.ac.ke"
      }
    },
    {
      name: "Beatrice Njeri",
      role: "member",
      position: "Automation Specialist",
      image: "https://ui-avatars.com/api/?name=Beatrice+Njeri&background=006B3F&color=fff",
      bio: "Implementing automation solutions to improve efficiency.",
      contact: {
        email: "beatrice.njeri@kinap.ac.ke"
      }
    },
    {
      name: "Calvin Kiprono",
      role: "member",
      position: "Network Administrator",
      image: "https://ui-avatars.com/api/?name=Calvin+Kiprono&background=000000&color=fff",
      bio: "Managing network infrastructure and connectivity solutions.",
      contact: {
        email: "calvin.kiprono@kinap.ac.ke"
      }
    },
    {
      name: "Diana Wafula",
      role: "member",
      position: "Content Strategist",
      image: "https://ui-avatars.com/api/?name=Diana+Wafula&background=CE1126&color=fff",
      bio: "Developing content strategies for digital platforms.",
      contact: {
        email: "diana.wafula@kinap.ac.ke"
      }
    },
    {
      name: "Edwin Omondi",
      role: "member",
      position: "Mobile UI Designer",
      image: "https://ui-avatars.com/api/?name=Edwin+Omondi&background=006B3F&color=fff",
      bio: "Designing user interfaces specifically for mobile applications.",
      contact: {
        email: "edwin.omondi@kinap.ac.ke"
      }
    },
    {
      name: "Felicia Wanjiru",
      role: "member",
      position: "Digital Asset Manager",
      image: "https://ui-avatars.com/api/?name=Felicia+Wanjiru&background=000000&color=fff",
      bio: "Managing and organizing digital assets and media libraries.",
      contact: {
        email: "felicia.wanjiru@kinap.ac.ke"
      }
    },
    {
      name: "Gabriel Kiprotich",
      role: "member",
      position: "Performance Analyst",
      image: "https://ui-avatars.com/api/?name=Gabriel+Kiprotich&background=CE1126&color=fff",
      bio: "Monitoring and optimizing system performance metrics.",
      contact: {
        email: "gabriel.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Helena Mutindi",
      role: "member",
      position: "Accessibility Specialist",
      image: "https://ui-avatars.com/api/?name=Helena+Mutindi&background=006B3F&color=fff",
      bio: "Ensuring digital accessibility for users with disabilities.",
      contact: {
        email: "helena.mutindi@kinap.ac.ke"
      }
    },
    {
      name: "Ian Kiplagat",
      role: "member",
      position: "Backup Specialist",
      image: "https://ui-avatars.com/api/?name=Ian+Kiplagat&background=000000&color=fff",
      bio: "Managing data backup and recovery procedures.",
      contact: {
        email: "ian.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Jacinta Wangari",
      role: "member",
      position: "Integration Specialist",
      image: "https://ui-avatars.com/api/?name=Jacinta+Wangari&background=CE1126&color=fff",
      bio: "Integrating various software systems and platforms.",
      contact: {
        email: "jacinta.wangari@kinap.ac.ke"
      }
    },
    {
      name: "Kenneth Macharia",
      role: "member",
      position: "Documentation Specialist",
      image: "https://ui-avatars.com/api/?name=Kenneth+Macharia&background=006B3F&color=fff",
      bio: "Creating and maintaining comprehensive project documentation.",
      contact: {
        email: "kenneth.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Lilian Njoroge",
      role: "member",
      position: "User Training Coordinator",
      image: "https://ui-avatars.com/api/?name=Lilian+Njoroge&background=000000&color=fff",
      bio: "Developing and delivering user training programs.",
      contact: {
        email: "lilian.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "Mark Ochieng",
      role: "member",
      position: "Compliance Officer",
      image: "https://ui-avatars.com/api/?name=Mark+Ochieng&background=CE1126&color=fff",
      bio: "Ensuring regulatory compliance and policy adherence.",
      contact: {
        email: "mark.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Naomi Mutua",
      role: "member",
      position: "Process Improvement Specialist",
      image: "https://ui-avatars.com/api/?name=Naomi+Mutua&background=006B3F&color=fff",
      bio: "Identifying and implementing process optimization strategies.",
      contact: {
        email: "naomi.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Oliver Kiplagat",
      role: "member",
      position: "Software Configuration Manager",
      image: "https://ui-avatars.com/api/?name=Oliver+Kiplagat&background=000000&color=fff",
      bio: "Managing software versions and configuration control.",
      contact: {
        email: "oliver.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Peris Wanjira",
      role: "member",
      position: "Digital Learning Coordinator",
      image: "https://ui-avatars.com/api/?name=Peris+Wanjira&background=CE1126&color=fff",
      bio: "Coordinating online learning initiatives and educational content.",
      contact: {
        email: "peris.wanjira@kinap.ac.ke"
      }
    },
    {
      name: "Quinter Kiprotich",
      role: "member",
      position: "Change Management Specialist",
      image: "https://ui-avatars.com/api/?name=Quinter+Kiprotich&background=006B3F&color=fff",
      bio: "Managing organizational change and technology adoption.",
      contact: {
        email: "quinter.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Rita Mutindi",
      role: "member",
      position: "Vendor Relations Manager",
      image: "https://ui-avatars.com/api/?name=Rita+Mutindi&background=000000&color=fff",
      bio: "Managing relationships with technology vendors and suppliers.",
      contact: {
        email: "rita.mutindi@kinap.ac.ke"
      }
    },
    {
      name: "Simon Kiplagat",
      role: "member",
      position: "Crisis Communication Specialist",
      image: "https://ui-avatars.com/api/?name=Simon+Kiplagat&background=CE1126&color=fff",
      bio: "Managing communication during technical incidents and crises.",
      contact: {
        email: "simon.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Tabitha Wangari",
      role: "member",
      position: "Digital Transformation Coordinator",
      image: "https://ui-avatars.com/api/?name=Tabitha+Wangari&background=006B3F&color=fff",
      bio: "Leading digital transformation initiatives across the organization.",
      contact: {
        email: "tabitha.wangari@kinap.ac.ke"
      }
    },
    {
      name: "Urbanus Macharia",
      role: "member",
      position: "Technology Evangelist",
      image: "https://ui-avatars.com/api/?name=Urbanus+Macharia&background=000000&color=fff",
      bio: "Promoting technology adoption and innovation within the community.",
      contact: {
        email: "urbanus.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Veronica Njoroge",
      role: "member",
      position: "Digital Rights Advocate",
      image: "https://ui-avatars.com/api/?name=Veronica+Njoroge&background=CE1126&color=fff",
      bio: "Advocating for digital rights and ethical technology use.",
      contact: {
        email: "veronica.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "William Ochieng",
      role: "member",
      position: "Innovation Lab Coordinator",
      image: "https://ui-avatars.com/api/?name=William+Ochieng&background=006B3F&color=fff",
      bio: "Coordinating innovation projects and emerging technology experiments.",
      contact: {
        email: "william.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Yvette Mutua",
      role: "member",
      position: "Sustainability Coordinator",
      image: "https://ui-avatars.com/api/?name=Yvette+Mutua&background=000000&color=fff",
      bio: "Promoting sustainable technology practices and green computing.",
      contact: {
        email: "yvette.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Zechariah Kiplagat",
      role: "member",
      position: "Future Technologies Researcher",
      image: "https://ui-avatars.com/api/?name=Zechariah+Kiplagat&background=CE1126&color=fff",
      bio: "Researching emerging technologies and their potential applications.",
      contact: {
        email: "zechariah.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Anastasia Wanjira",
      role: "member",
      position: "Community Outreach Coordinator",
      image: "https://ui-avatars.com/api/?name=Anastasia+Wanjira&background=006B3F&color=fff",
      bio: "Building partnerships with external communities and organizations.",
      contact: {
        email: "anastasia.wanjira@kinap.ac.ke"
      }
    },
    {
      name: "Bramwel Kiprotich",
      role: "member",
      position: "Student Liaison Officer",
      image: "https://ui-avatars.com/api/?name=Bramwel+Kiprotich&background=000000&color=fff",
      bio: "Facilitating communication between student body and club leadership.",
      contact: {
        email: "bramwel.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Charity Mutindi",
      role: "member",
      position: "Mentorship Program Coordinator",
      image: "https://ui-avatars.com/api/?name=Charity+Mutindi&background=CE1126&color=fff",
      bio: "Coordinating mentorship programs connecting students with industry professionals.",
      contact: {
        email: "charity.mutindi@kinap.ac.ke"
      }
    },
    {
      name: "Douglas Kiplagat",
      role: "member",
      position: "Alumni Relations Manager",
      image: "https://ui-avatars.com/api/?name=Douglas+Kiplagat&background=006B3F&color=fff",
      bio: "Maintaining connections with club alumni and facilitating networking opportunities.",
      contact: {
        email: "douglas.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Eunice Wangari",
      role: "member",
      position: "Workshop Coordinator",
      image: "https://ui-avatars.com/api/?name=Eunice+Wangari&background=000000&color=fff",
      bio: "Organizing technical workshops and skill-building sessions for members.",
      contact: {
        email: "eunice.wangari@kinap.ac.ke"
      }
    },
    {
      name: "Franklin Macharia",
      role: "member",
      position: "Industry Partnership Coordinator",
      image: "https://ui-avatars.com/api/?name=Franklin+Macharia&background=CE1126&color=fff",
      bio: "Building strategic partnerships with technology companies and startups.",
      contact: {
        email: "franklin.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Gladys Njoroge",
      role: "member",
      position: "Scholarship Program Manager",
      image: "https://ui-avatars.com/api/?name=Gladys+Njoroge&background=006B3F&color=fff",
      bio: "Managing scholarship opportunities and financial assistance programs for members.",
      contact: {
        email: "gladys.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "Harrison Ochieng",
      role: "member",
      position: "Competition Coordinator",
      image: "https://ui-avatars.com/api/?name=Harrison+Ochieng&background=000000&color=fff",
      bio: "Organizing coding competitions, hackathons, and technical challenges.",
      contact: {
        email: "harrison.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Irene Mutua",
      role: "member",
      position: "Diversity & Inclusion Advocate",
      image: "https://ui-avatars.com/api/?name=Irene+Mutua&background=CE1126&color=fff",
      bio: "Promoting diversity and inclusion within the technology community.",
      contact: {
        email: "irene.mutua@kinap.ac.ke"
      }
    },
    {
      name: "Justus Kiplagat",
      role: "member",
      position: "Project Management Specialist",
      image: "https://ui-avatars.com/api/?name=Justus+Kiplagat&background=006B3F&color=fff",
      bio: "Overseeing project timelines and ensuring successful delivery of club initiatives.",
      contact: {
        email: "justus.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Khadija Wanjira",
      role: "member",
      position: "Resource Management Coordinator",
      image: "https://ui-avatars.com/api/?name=Khadija+Wanjira&background=000000&color=fff",
      bio: "Managing club resources, equipment, and facilities for optimal utilization.",
      contact: {
        email: "khadija.wanjira@kinap.ac.ke"
      }
    },
    {
      name: "Lawson Kiprotich",
      role: "member",
      position: "Strategic Planning Coordinator",
      image: "https://ui-avatars.com/api/?name=Lawson+Kiprotich&background=CE1126&color=fff",
      bio: "Contributing to long-term strategic planning and goal setting for the club.",
      contact: {
        email: "lawson.kiprotich@kinap.ac.ke"
      }
    },
    {
      name: "Maureen Mutindi",
      role: "member",
      position: "Communication Specialist",
      image: "https://ui-avatars.com/api/?name=Maureen+Mutindi&background=006B3F&color=fff",
      bio: "Managing internal and external communications to enhance club visibility.",
      contact: {
        email: "maureen.mutindi@kinap.ac.ke"
      }
    },
    {
      name: "Noah Kiplagat",
      role: "member",
      position: "Innovation Catalyst",
      image: "https://ui-avatars.com/api/?name=Noah+Kiplagat&background=000000&color=fff",
      bio: "Driving innovation initiatives and fostering creative problem-solving within the club.",
      contact: {
        email: "noah.kiplagat@kinap.ac.ke"
      }
    },
    {
      name: "Oprah Wangari",
      role: "member",
      position: "Career Development Advisor",
      image: "https://ui-avatars.com/api/?name=Oprah+Wangari&background=CE1126&color=fff",
      bio: "Providing career guidance and professional development support to club members.",
      contact: {
        email: "oprah.wangari@kinap.ac.ke"
      }
    },
    {
      name: "Philip Macharia",
      role: "member",
      position: "Research Coordinator",
      image: "https://ui-avatars.com/api/?name=Philip+Macharia&background=006B3F&color=fff",
      bio: "Coordinating research projects and academic collaborations within the club.",
      contact: {
        email: "philip.macharia@kinap.ac.ke"
      }
    },
    {
      name: "Queenie Njoroge",
      role: "member",
      position: "Public Relations Officer",
      image: "https://ui-avatars.com/api/?name=Queenie+Njoroge&background=000000&color=fff",
      bio: "Managing public relations and media interactions for the club.",
      contact: {
        email: "queenie.njoroge@kinap.ac.ke"
      }
    },
    {
      name: "Raymond Ochieng",
      role: "member",
      position: "Technology Transfer Specialist",
      image: "https://ui-avatars.com/api/?name=Raymond+Ochieng&background=CE1126&color=fff",
      bio: "Facilitating knowledge transfer and technology adoption across different sectors.",
      contact: {
        email: "raymond.ochieng@kinap.ac.ke"
      }
    },
    {
      name: "Salome Mutua",
      role: "member",
      position: "Impact Assessment Coordinator",
      image: "https://ui-avatars.com/api/?name=Salome+Mutua&background=006B3F&color=fff",
      bio: "Measuring and reporting on the social and economic impact of club activities.",
      contact: {
        email: "salome.mutua@kinap.ac.ke"
      }
    }
  ]

  const renderSocialLinks = (contact: TeamMember['contact']) => (
    <div className="flex space-x-3">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-ajira-primary">
          <Mail size={18} />
        </a>
      )}
      {contact.website && (
        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Globe size={18} />
        </a>
      )}
      {contact.linkedin && (
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Linkedin size={18} />
        </a>
      )}
      {contact.twitter && (
        <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-ajira-primary">
          <Twitter size={18} />
        </a>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the passionate individuals who lead and contribute to the Ajira Digital KiNaP Club community.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('leaders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'leaders'
                  ? 'bg-ajira-primary text-white'
                  : 'text-gray-500 hover:text-ajira-primary'
              }`}
            >
              Club Leaders
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'members'
                  ? 'bg-ajira-primary text-white'
                  : 'text-gray-500 hover:text-ajira-primary'
              }`}
            >
              Active Members
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'leaders' ? leaders : members).map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-ajira-primary font-medium">{member.position}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{member.bio}</p>
              {renderSocialLinks(member.contact)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamPage 