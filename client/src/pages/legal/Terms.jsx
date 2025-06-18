import React from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-ajira-lightGray py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-ajira p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-ajira-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-ajira-blue" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-ajira-blue mb-4">
                Terms of Service
              </h1>
              <p className="text-ajira-gray">
                Last updated: March 2024
              </p>
            </div>

            <div className="space-y-8 text-ajira-gray">
              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                  By accessing and using the Ajira Digital - Kiambu National Polytechnic Hub website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  2. Description of Services
                </h2>
                <p className="mb-4">
                  Ajira Digital - Kiambu National Polytechnic Hub provides digital skills training, online work opportunities, and related services to empower youth in Kenya's digital economy.
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Digital skills training programs</li>
                  <li>Online work placement services</li>
                  <li>Mentorship and guidance</li>
                  <li>Community networking</li>
                  <li>Resource sharing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  3. User Accounts
                </h2>
                <div className="space-y-4">
                  <p>
                    To access certain features of our services, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly update any changes to your information</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  4. User Conduct
                </h2>
                <p className="mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the services</li>
                  <li>Upload or transmit malicious code</li>
                  <li>Collect user information without consent</li>
                  <li>Use the services for unauthorized commercial purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  5. Intellectual Property
                </h2>
                <p className="mb-4">
                  All content, features, and functionality of our services are owned by Ajira Digital, its licensors, or other providers and are protected by copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  6. Limitation of Liability
                </h2>
                <p className="mb-4">
                  Ajira Digital - Kiambu National Polytechnic Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  7. Changes to Terms
                </h2>
                <p className="mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  8. Termination
                </h2>
                <p className="mb-4">
                  We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ajira-blue mb-4">
                  9. Contact Information
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-2">
                  Email: legal@kiambuajira.ac.ke<br />
                  Phone: +254 700 000 000<br />
                  Address: Kiambu National Polytechnic, P.O. Box 414-00900, Kiambu, Kenya
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Terms 