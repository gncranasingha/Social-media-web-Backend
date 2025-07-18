const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { createPost, getUserPosts, deletePost,updatePost  } = require('../controllers/post.Controller');

router.post('/', auth, upload.single('image'), createPost);
router.get('/user/:userId', auth, getUserPosts);
router.delete('/:id', auth, deletePost);
router.put('/:id', auth, upload.single('image'), updatePost);

module.exports = router;

