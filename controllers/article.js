'use strict'

const validator = require('validator');
const Article = require('../models/article');
const fs = require('fs');
const path = require('path');

var controller = {

    //----------------------------------------------------------------------------------------------------
    save: (req, res) => {

        //Get params.
        var params = req.body;

        //Validates params (using "validator" library).
        try {
            var validTitle = !validator.isEmpty(params.title);
            var validContent = !validator.isEmpty(params.content);
        }
        catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error validating params.'
            });
        }

        if (validTitle & validContent) {

            //Creates object to save.
            var article = new Article();

            //Set values.
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Saves new article.
            article.save((error, articleStored) => {

                if (error || !articleStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error saveing new article.'
                    });
                }

                //Return success status, including stored article.
                return res.status(201).send({
                    status: 'success',
                    articleStored
                });

            });
            
        }

        else {
            return res.status(400).send({
                status: 'error',
                message: 'Params are missing.'
            });
        }
        
    },

    //----------------------------------------------------------------------------------------------------
    getArticles: (req, res) => {

        var query = Article.find({});

        //Optional.
        var limit = req.params.limit;

        if (limit || limit != undefined) {
            query.limit(parseInt(limit));
        }

        query.sort('-_id').exec((error, articles) => {

            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error getting articles.'
                }); 
            }

            if (!articles) {
                return res.status(204).send({
                    status: 'error',
                    message: 'Articles collection is empty.'
                }); 
            }

            return res.status(200).send({
                status: 'success',
                articles
            }); 

        });

    },

    //----------------------------------------------------------------------------------------------------
    getArticle: (req, res) => {

        var id = req.params.id;

        if (!id) {
            return res.status(400).send({
                status: 'success',
                message: 'Params are missing.'
            }); 
        }

        Article.findById(id, (error, article) => {

            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error getting article.'
                });
            }

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Article not found.'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });

        });

    },

    //----------------------------------------------------------------------------------------------------
    update: (req, res) => {

        var id = req.params.id;

        var params = req.body;

        try {
            var validTitle = !validator.isEmpty(params.title);
            var validContent = !validator.isEmpty(params.content);
        }
        
        catch (error) {
            return res.status(400).send({
                status: 'error',
                message: 'Params are missing.'
            });
        }

        if (validTitle && validContent) {

            //NOTE: Param "new: true" indicates findOneAndUpdate method to return updated object.
            Article.findOneAndUpdate({_id: id}, params, {new: true}, (error, articleUpdated) => {

                if (error) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error updating article.'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Article not found.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });

            });

        }

        else {
            return res.status(400).send({
                status: 'error',
                message: 'Params are not valid.'
            });
        }

    },

    //----------------------------------------------------------------------------------------------------
    delete: (req, res) => {

        var id = req.params.id;

        Article.findOneAndDelete({_id: id}, (error, articleDeleted) => {

            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error deleting article.'
                });
            }

            if (!articleDeleted) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Article not found.'
                });
            }

            return res.status(200).send({
                status: 'success',
                articleDeleted
            });

        });

    },

    //----------------------------------------------------------------------------------------------------
    upload: (req, res) => {

        //Multiparty module is configured in router/article.js.

        //Gets file.
        var fileName = 'Image not uploaded...';

        if (!req.files) {
            return res.status(400).send({
                status: 'error',
                message: fileName
            });
        }

        //Gets file's name and extension.
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\'); //This line works on Windows. For Linux or Mac should be: .split('/');

        var fileName = fileSplit[2];
        var extensionSplit = fileName.split('.');
        var fileExtension = extensionSplit[1];

        //Validates file extension. If not valid, then deletes the file.
        if (fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'png') {
            fs.unlink(filePath, (error) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'File extension is not valid.'
                });
            });
        }

        else {

            //Finds article, sets file's name and updates it.

            var id = req.params.id;

            Article.findOneAndUpdate({_id: id}, {image: fileName}, {new: true}, (error, articleUpdated) => {

                if (error) {
                    return res.status(500).send({
                        status: 'error',
                        status: 'Image loaded.'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        status: 'Article not found.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });

            });

        }

    },

    //----------------------------------------------------------------------------------------------------
    getImage: (req, res) => {

        var file = req.params.image;
        var pathFile = './uploads/articles/' + file;

        fs.exists(pathFile, (exists) => {

            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            }

            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'Image not found.'
                });
            }

        });

    },

    //----------------------------------------------------------------------------------------------------
    search: (req, res) => {

        var searchStr = req.params.search;

        Article.find({
            '$or': [
                {
                    'title': {
                        '$regex': searchStr,
                        '$options': 'i'
                    }
                },
                {
                    'content': {
                        '$regex': searchStr,
                        '$options': 'i'
                    }
                }
            ]
        })
        .sort([['date', 'descending']])
        .exec((error, articles) => {

            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error getting articles.'
                });
            }

            if (!articles || !articles.length) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Articles collection is empty.'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    }

};

module.exports = controller;