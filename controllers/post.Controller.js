const Post = require('../models/Post.model');

// @route   POST /api/v1/posts
// @desc    Create a new post with optional image
// @access  Private
const createPost = async (req, res) => {
  try {
    const imagePath = req.file 
      ? `/uploads/${req.file.filename}` 
      : null;

    const post = await Post.create({
      user_id: req.user.id,
      content: req.body.content,
      image_url: imagePath
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/v1/posts/user/:userId
// @desc    Get all posts created by a specific user
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findByUserId(req.params.userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   DELETE /api/v1/posts/:id
// @desc    Delete a post by ID if owned by the current user
// @access  Private
const deletePost = async (req, res) => {
  try {
    await Post.delete(req.params.id, req.user.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   PUT /api/v1/posts/:id
// @desc    Update a post’s content or image if owned by the current user
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    let image_url = existingPost.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await Post.update(id, { 
      content: content || existingPost.content,
      image_url
    });

    const updatedPost = await Post.findById(id);
    res.json(updatedPost);

  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

module.exports = { createPost, getUserPosts, deletePost, updatePost };
