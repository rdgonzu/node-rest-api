'use strict'

const validator = require('validator');
const Article = require('../models/article');

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
    getArticle: (req, res) => {

        var id = req.params.id;

        if (!id) {
            return res.status(400).send({
                status: 'success',
                message: 'Faltan parámetros.'
            }); 
        }

        Article.findById(id, (error, article) => {

            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al intentar obtener el artículo.'
                });
            }

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo.'
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

    }

};

module.exports = controller;