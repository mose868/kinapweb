import { useState } from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

const videoList = [
  {
    id: '1',
    title: 'How to Create an Upwork Account (Step by Step)',
    channel: 'Freelance Success',
    views: '120K views',
    date: 'Jan 2024',
    youtubeId: '1vRto-2MM5g',
    thumbnail: 'https://img.youtube.com/vi/1vRto-2MM5g/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=1vRto-2MM5g'
  },
  {
    id: '2',
    title: 'How to Register on TimeBucks and Earn Online',
    channel: 'Earn Online Now',
    views: '85K views',
    date: 'Feb 2024',
    youtubeId: 'QwZT7T-TXT0',
    thumbnail: 'https://img.youtube.com/vi/QwZT7T-TXT0/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=QwZT7T-TXT0'
  },
  {
    id: '3',
    title: 'How to Create a Freelancer.com Account (2024)',
    channel: 'Digital Hustle',
    views: '60K views',
    date: 'Mar 2024',
    youtubeId: 'wzQ2hRk8r6A',
    thumbnail: 'https://img.youtube.com/vi/wzQ2hRk8r6A/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=wzQ2hRk8r6A'
  },
  {
    id: '4',
    title: 'Mastering Forex Trading for Beginners (2024)',
    channel: 'Forex Academy',
    views: '200K views',
    date: 'Apr 2024',
    youtubeId: 'p7HKvqRI_Bo',
    thumbnail: 'https://img.youtube.com/vi/p7HKvqRI_Bo/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo'
  },
  {
    id: '5',
    title: 'Learn Skills for Free on Alison (2024 Guide)',
    channel: 'SkillUp',
    views: '30K views',
    date: 'May 2024',
    youtubeId: '0QRO3gKj3qw',
    thumbnail: 'https://img.youtube.com/vi/0QRO3gKj3qw/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=0QRO3gKj3qw'
  },
];

const comments = [
  {
    user: 'Jane Doe',
    avatar: 'https://via.placeholder.com/40',
    text: 'This was super helpful, thanks!',
    time: '2 hours ago',
  },
  {
    user: 'John Smith',
    avatar: 'https://via.placeholder.com/40',
    text: 'Great video, learned a lot.',
    time: '1 hour ago',
  },
];

const VideoPage = () => {
  const [mainVideo] = useState(videoList[0]);

  const recommendedVideos = videoList.filter((v) => v.id !== mainVideo.id);

  const handleVideoClick = (video: typeof videoList[0]) => {
    window.open(video.youtubeUrl, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-ajira-primary text-white p-4 hidden md:block">
        <div className="flex items-center space-x-3 font-bold text-2xl mb-8">
          <img src="/logo.jpeg" alt="Club Logo" className="h-8 w-auto rounded-lg" />
          <span>AjiraTube</span>
        </div>
        <nav className="space-y-4">
          <a href="#" className="block hover:text-ajira-accent">Home</a>
          <a href="#" className="block hover:text-ajira-accent">Trending</a>
          <a href="#" className="block hover:text-ajira-accent">Subscriptions</a>
          <a href="#" className="block hover:text-ajira-accent">Library</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-ajira-primary text-white p-4 shadow">
          <div className="font-bold text-xl">AjiraTube</div>
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-4 py-2 w-1/2 text-black"
          />
          <div className="w-10 h-10 bg-ajira-accent rounded-full flex items-center justify-center font-bold">
            U
          </div>
        </header>

        {/* Video and Recommendations */}
        <div className="flex flex-1 overflow-auto">
          {/* Video Section */}
          <section className="flex-1 p-6">
            <div className="relative aspect-w-16 aspect-h-9 bg-black mb-4 rounded-lg overflow-hidden group cursor-pointer" onClick={() => handleVideoClick(mainVideo)}>
              <img 
                src={mainVideo.thumbnail} 
                alt={mainVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center space-x-2 text-white">
                  <Youtube className="w-12 h-12" />
                  <ExternalLink className="w-6 h-6" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{mainVideo.title}</h1>
            <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <span>{mainVideo.views} • {mainVideo.date}</span>
                <span className="mx-2">|</span>
                <span>{mainVideo.channel}</span>
              </div>
              <button 
                onClick={() => handleVideoClick(mainVideo)}
                className="flex items-center space-x-2 text-ajira-primary hover:text-ajira-accent"
              >
                <Youtube className="w-5 h-5" />
                <span>Watch on YouTube</span>
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-2" />
              <span className="font-semibold mr-4">{mainVideo.channel}</span>
              <button className="bg-ajira-accent text-white px-4 py-2 rounded hover:bg-ajira-accent/90 transition">Subscribe</button>
              <div className="ml-auto flex space-x-2">
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">👍 Like</button>
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">👎 Dislike</button>
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">🔗 Share</button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p>
                {mainVideo.title} - Watch this video to learn more about {mainVideo.channel} and how to get started!
              </p>
            </div>
            <div>
              <h2 className="font-bold mb-2">Comments</h2>
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-semibold">{c.user} <span className="text-xs text-gray-400">{c.time}</span></div>
                      <div>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Videos */}
          <aside className="w-80 bg-white border-l p-4 hidden lg:block">
            <h2 className="font-bold mb-4">Up next</h2>
            <div className="space-y-4">
              {recommendedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative w-24 h-16">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold line-clamp-2">{video.title}</div>
                    <div className="text-xs text-gray-500">{video.channel}</div>
                    <div className="text-xs text-gray-400">{video.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default VideoPage; 