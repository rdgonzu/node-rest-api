'use strict'

const express = require('express');
const article = require('../controllers/article');
const multiparty = require('connect-multiparty');
const mdUploads = multiparty({uploadDir: './uploads/articles'});

const router = express.Router();

router.post('/save', article.save);
router.get('/articles/:limit?', article.getArticles);
router.get('/article/:id', article.getArticle);
router.put('/article/:id', article.update);
router.delete('/article/:id', article.delete);
router.post('/upload-image/:id', mdUploads, article.upload);
router.get('/get-image/:image', article.getImage);
router.get('/search/:search', article.search);

module.exports = router;