const CommunityPost = require('../models/CommunityPost');
const logger = require('../utils/logger');

// Get posts with optional filters
exports.getPosts = async (req, res) => {
  try {
    const {
      category = 'All',
      filter = 'latest',
      search = '',
    } = req.query;

    const query = {};
    if (category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (filter === 'popular') sort = { likesCount: -1 };

    const posts = await CommunityPost.aggregate([
      { $match: query },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
        },
      },
      { $sort: sort },
    ]);

    res.status(200).json({ status: 'success', data: { posts } });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch posts' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, category = 'General Discussion' } = req.body;
    if (!content) {
      return res.status(400).json({ status: 'error', message: 'Content is required' });
    }

    const post = await CommunityPost.create({
      userId: req.user._id,
      userName: req.user.name || req.user.email,
      userAvatar: req.user.avatar || '',
      content,
      category,
    });

    res.status(201).json({ status: 'success', data: { post } });
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create post' });
  }
};

// Toggle like
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });

    const index = post.likes.findIndex((id) => id.equals(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();

    res.status(200).json({ status: 'success', data: { likes: post.likes.length } });
  } catch (error) {
    logger.error('Error toggling like:', error);
    res.status(500).json({ status: 'error', message: 'Failed to like post' });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ status: 'error', message: 'Content is required' });

    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ status: 'error', message: 'Post not found' });

    post.comments.push({
      userId: req.user._id,
      userName: req.user.name || req.user.email,
      userAvatar: req.user.avatar || '',
      content,
    });

    await post.save();
    res.status(201).json({ status: 'success', data: { comments: post.comments } });
  } catch (error) {
    logger.error('Error adding comment:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add comment' });
  }
}; 