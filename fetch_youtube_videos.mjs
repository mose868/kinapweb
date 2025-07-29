import fs from 'fs';

const API_KEY = process.env.YOUTUBE_API_KEY || 'your_youtube_api_key';
const SEARCH_TERMS = ['online work', 'remote jobs', 'freelancing', 'work from home', 'digital skills', 'online jobs', 'remote work', 'online income', 'freelance jobs', 'make money online'];
const MAX_RESULTS = 50; // per search term

async function fetchVideos(query, pageToken = '') {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(query)}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

(async () => {
  let allVideos = [];
  let seenIds = new Set();
  for (const term of SEARCH_TERMS) {
    let pageToken = '';
    for (let i = 0; i < 2; i++) { // 2 pages per term (up to 100 per term)
      const data = await fetchVideos(term, pageToken);
      if (!data.items) continue;
      for (const item of data.items) {
        const id = item.id.videoId;
        if (!id || seenIds.has(id)) continue;
        seenIds.add(id);
        allVideos.push({
          id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          videoUrl: `https://www.youtube.com/watch?v=${id}`,
          duration: '', // Can be filled with another API call if needed
          views: '', // Can be filled with another API call if needed
          uploadDate: item.snippet.publishedAt,
          channel: {
            name: item.snippet.channelTitle,
            avatar: '', // Can be filled with another API call if needed
            subscribers: '',
            verified: false,
            verificationBadge: null
          },
          description: item.snippet.description,
          category: 'Online Work',
          tags: [term],
          likes: 0,
          dislikes: 0,
          isLive: false,
          quality: 'HD',
          isPremium: false,
          isSponsored: false
        });
      }
      pageToken = data.nextPageToken || '';
      if (!pageToken) break;
    }
  }
  fs.writeFileSync('online_work_videos.json', JSON.stringify(allVideos, null, 2));
  console.log(`Saved ${allVideos.length} videos to online_work_videos.json`);
})(); 