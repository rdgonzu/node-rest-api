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
        
    }

};

module.exports = controller;