const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPost, getUserPosts, deletePost } = require('../controllers/postController');

router.post('/', auth, upload.single('image'), createPost);
router.get('/user/:userId', auth, getUserPosts);
router.delete('/:id', auth, deletePost);

module.exports = router;

