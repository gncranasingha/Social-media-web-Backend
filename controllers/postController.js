const Post = require('../models/Post');


const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const image_url = req.file 
      ? `../uploads/${req.file.filename}`
      : null;

    console.log('Image URL to save:', image_url);

    const postId = await Post.create({
      user_id: req.user.id,
      content,
      image_url
    });

    const newPost = await Post.findById(postId);
    
    if (!newPost) {
      return res.status(500).json({ error: 'Failed to retrieve created post' });
    }

    res.status(201).json(newPost);

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findByUserId(req.params.userId);
    
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.delete(req.params.id, req.user.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

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

