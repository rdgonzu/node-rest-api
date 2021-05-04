'use strict'

const express = require('express');
const article = require('../controllers/article');

const router = express.Router();

router.post('/save', article.save);
router.get('/articles/:limit?', article.getArticles);
router.get('/article/:id', article.getArticle);

module.exports = router;