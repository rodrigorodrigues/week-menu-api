/**
 * Created by eliasmj on 26/11/2016.
 */
var express = require('express');
var router = express.Router();

const log = require('../utils/log.message');

var {Recipe} = require('../models/recipe.model');

router.get("/recipe", (req, res, next) => {

    Recipe.find().then((doc) => {
        handleResponse(res, doc, 200);
    }, (reason) => {
        wmHandleError(res, reason);
    });
});

router.get("/recipe/:id", (req, res, next) => {

    log.logExceptOnTest("Recipe name", req.params.id);

    Recipe.findOne({_id: req.params.id})
        .then((doc) => {
            handleResponse(res, doc, 200);
        }, (reason) => {
            wmHandleError(res, reason);
        });

});

router.post('/recipe', (req, res, next) => {

    var recipe = new Recipe({
        name : req.body.name,
        weekDay: req.body.weekDay
    });
    recipe.save()
        .then((doc) => {
            handleResponse(res, doc, 201);
        }, (reason) => {
            wmHandleError(res, reason);
        });
});

router.put('/recipe', (req, res, next) => {
    // ** Concept status ** use 204 No Content to indicate to the client that
    //... it doesn't need to change its current "document view".
    Recipe.findOneAndUpdate({_id: req.body._id}, req.body)
        .then((doc) => {
            handleResponse(res, doc, 204);
        }, (reason) => {
            wmHandleError(res, reason);
        });
});

router.delete('/recipe', (req, res, next) => {

    Recipe.findByIdAndRemove(req.body._id)
        .then((doc) => {
            handleResponse(res, doc, 204);
        }, (reason) => {
            wmHandleError(res, reason);
        });
});

function handleResponse(res, doc, status) {
    res
        .status(status)
        .json(doc)
        .end();
}

function wmHandleError(res, reason) {
    log.errorExceptOnTest("handle error", reason.essage);
    var errorResponse = {
        message : reason.message,
        name: reason.name,
        errors: reason.errors
    };

    res
        .status(400) //bad format
        .send(errorResponse)
        .end();
}


module.exports = router;