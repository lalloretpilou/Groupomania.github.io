const express = require('express');
const router = express.Router();
const auth = require('../api/auth');
const multer = require('../api/multer-config');
const postCtrl = require('../controllers/post.controller');

router.get('/', auth, postCtrl.getAllPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id/like', auth, postCtrl.likePost);

module.exports = router;