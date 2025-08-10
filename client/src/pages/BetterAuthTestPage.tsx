import React from 'react';
import BetterAuthTest from '../components/auth/BetterAuthTest';

const BetterAuthTestPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Better Auth Integration Test
        </h1>
        <BetterAuthTest />
      </div>
    </div>
  );
};

export default BetterAuthTestPage;
