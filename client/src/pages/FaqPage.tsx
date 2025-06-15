import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
  category: string
}

const FaqPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqs: FaqItem[] = [
    {
      category: "General",
      question: "What is Ajira Digital KiNaP Club?",
      answer: "Ajira Digital KiNaP Club is a student organization at Kiambu National Polytechnic that focuses on empowering youth through digital skills and online work opportunities. We provide training, resources, and a supportive community for students interested in digital careers."
    },
    {
      category: "General",
      question: "How can I join the club?",
      answer: "To join the club, you need to be a current student at Kiambu National Polytechnic. You can sign up through our website or visit our office during club hours. Membership is free and open to all students interested in digital skills."
    },
    {
      category: "Training",
      question: "What kind of training programs do you offer?",
      answer: "We offer various training programs including digital marketing, web development, graphic design, content writing, and freelancing basics. Our programs are designed to be practical and industry-relevant."
    },
    {
      category: "Training",
      question: "Are the training sessions free?",
      answer: "Most of our basic training sessions are free for club members. However, some specialized workshops or certification programs may have a nominal fee to cover resources and external trainers."
    },
    {
      category: "Marketplace",
      question: "How does the marketplace work?",
      answer: "Our marketplace is a platform where club members can showcase their skills and services to potential clients. Members can create gigs, receive job opportunities, and build their portfolio through real projects."
    },
    {
      category: "Marketplace",
      question: "Can I post jobs on the marketplace?",
      answer: "Yes, verified employers and clients can post job opportunities on our marketplace. All postings are reviewed to ensure they meet our quality and safety standards."
    },
    {
      category: "Support",
      question: "What kind of support do you provide to members?",
      answer: "We provide mentorship, technical support, access to learning resources, networking opportunities, and guidance on building a successful digital career. Members also get access to our computer labs and internet facilities."
    },
    {
      category: "Support",
      question: "How can I get help if I'm stuck on a project?",
      answer: "You can reach out to our support team through the chat feature, visit our physical office, or post your question in the community forum. We also have regular peer support sessions where members help each other."
    }
  ]

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold text-ajira-primary mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold text-ajira-primary">{category}</h2>
            
            <div className="space-y-4">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, index) => {
                  const isOpen = openItems.includes(index)
                  
                  return (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FaqPage 