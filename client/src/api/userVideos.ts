import axios from 'axios';

const API_URL = '/api/user-videos';
const userId = 'demo-user'; // Replace with real user ID when auth is ready

export async function getWatchLater() {
  const res = await axios.get(`${API_URL}/watch-later`, { params: { userId } });
  return res.data;
}
export async function addWatchLater(video) {
  const res = await axios.post(`${API_URL}/watch-later`, { userId, video, action: 'add' });
  return res.data;
}
export async function removeWatchLater(video) {
  const res = await axios.post(`${API_URL}/watch-later`, { userId, video, action: 'remove' });
  return res.data;
}

export async function getLikedVideos() {
  const res = await axios.get(`${API_URL}/liked`, { params: { userId } });
  return res.data;
}
export async function addLikedVideo(video) {
  const res = await axios.post(`${API_URL}/liked`, { userId, video, action: 'add' });
  return res.data;
}
export async function removeLikedVideo(video) {
  const res = await axios.post(`${API_URL}/liked`, { userId, video, action: 'remove' });
  return res.data;
}

export async function getHistory() {
  const res = await axios.get(`${API_URL}/history`, { params: { userId } });
  return res.data;
}
export async function addToHistory(video) {
  const res = await axios.post(`${API_URL}/history`, { userId, video });
  return res.data;
}

export async function getPlaylists() {
  const res = await axios.get(`${API_URL}/playlists`, { params: { userId } });
  return res.data;
}
export async function addPlaylist(playlist) {
  const res = await axios.post(`${API_URL}/playlists`, { userId, playlist, action: 'add' });
  return res.data;
}
export async function updatePlaylist(playlist) {
  const res = await axios.post(`${API_URL}/playlists`, { userId, playlist, action: 'update' });
  return res.data;
}
export async function deletePlaylist(playlist) {
  const res = await axios.post(`${API_URL}/playlists`, { userId, playlist, action: 'delete' });
  return res.data;
}

export async function getSubscriptions() {
  const res = await axios.get(`${API_URL}/subscriptions`, { params: { userId } });
  return res.data;
}
export async function addSubscription(channel) {
  const res = await axios.post(`${API_URL}/subscriptions`, { userId, channel, action: 'add' });
  return res.data;
}
export async function removeSubscription(channel) {
  const res = await axios.post(`${API_URL}/subscriptions`, { userId, channel, action: 'remove' });
  return res.data;
} 