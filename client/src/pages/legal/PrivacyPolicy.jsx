import React from 'react';

const PrivacyPolicy = () => (
  <div className='container mx-auto px-4 py-8'>
    <h1 className='text-3xl font-bold mb-4'>Privacy Policy</h1>
    <p className='mb-2'>
      Your privacy is important to us. This Privacy Policy explains how we
      collect, use, and protect your information when you use our website.
    </p>
    <h2 className='text-xl font-semibold mt-6 mb-2'>Information We Collect</h2>
    <ul className='list-disc list-inside mb-4'>
      <li>Personal identification information (Name, email address, etc.)</li>
      <li>Usage data and cookies</li>
    </ul>
    <h2 className='text-xl font-semibold mt-6 mb-2'>How We Use Information</h2>
    <ul className='list-disc list-inside mb-4'>
      <li>To provide and maintain our service</li>
      <li>To improve our website</li>
      <li>To communicate with you</li>
    </ul>
    <h2 className='text-xl font-semibold mt-6 mb-2'>Contact Us</h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us.
    </p>
  </div>
);

export default PrivacyPolicy;
