const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { getUserProfile } = require('../controllers/user.Controller');

router.get('/profile', auth, getUserProfile);

module.exports = router;