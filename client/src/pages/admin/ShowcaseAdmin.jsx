import React, { useEffect, useState } from 'react';

const ShowcaseAdmin = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/showcase/profiles')
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch profiles');
        setLoading(false);
      });
  }, []);

  const approveProfile = async (userId) => {
    await fetch(`/showcase/profiles/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    setProfiles((profiles) =>
      profiles.map((p) => (p.userId === userId ? { ...p, approved: true } : p))
    );
  };

  const rejectProfile = async (userId) => {
    await fetch(`/showcase/profiles/${userId}`, { method: 'DELETE' });
    setProfiles((profiles) => profiles.filter((p) => p.userId !== userId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='max-w-4xl mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Showcase Profile Approvals</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {profiles.map((profile) => (
          <div
            key={profile.userId}
            className='bg-white rounded-lg shadow p-6 flex flex-col items-center'
          >
            <img
              src={profile.avatar || '/default-avatar.png'}
              className='w-20 h-20 rounded-full object-cover mb-2'
            />
            <h2 className='text-lg font-bold mb-1'>{profile.name}</h2>
            <p className='text-gray-600 mb-2'>{profile.bio}</p>
            <div className='flex flex-wrap gap-1 mb-2'>
              {profile.skills?.map((skill) => (
                <span
                  key={skill}
                  className='bg-ajira-accent/10 text-ajira-accent px-2 py-0.5 rounded-full text-xs'
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className='flex gap-2 mt-2'>
              {!profile.approved && (
                <button
                  onClick={() => approveProfile(profile.userId)}
                  className='bg-green-600 text-white px-4 py-1 rounded'
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => rejectProfile(profile.userId)}
                className='bg-red-600 text-white px-4 py-1 rounded'
              >
                Reject
              </button>
            </div>
            {profile.approved && (
              <div className='mt-2 text-green-600 font-semibold'>Approved</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowcaseAdmin;
