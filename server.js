/**
 * Created by eliasmj on 24/11/2016.
 *
 * *** npm run dev >>> runs nodemon to reload the file without restart the server
 */
require('./config/config');

const log = require('./utils/log.message');

var app = require('express')();

const db  = require('./db/mongoose');

const bodyParser = require('body-parser');

const port = process.env.PORT;

//TODO security change this later
const whiteList = ['localhost:8100', 'localhost:3000', 'localhost:3002'];

const logger = function(request, response, next) {
    log.logExceptOnTest("Request body: ", request.body);
    log.logExceptOnTest("Request METHOD: ", request.method);
    log.logExceptOnTest("Request resource: ", request.path);

    next();
}

const recipeRouter = require('./routes/recipe.route');
const ingredientRouter = require('./routes/ingredient.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');

app.use(bodyParser.json());
// Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// //allow cross-origin to a whilelist
// app.all('*', function(req, res, next) {
//
//     console.log("Request Header", req.header('host'))
//
//     let hostAllowed = whiteList.indexOf(req.header('host')) !== -1 ? req.header('host') : null;
//
//    console.log("Request hostAllowed", hostAllowed)
//
//     if(!hostAllowed) {
//         //default router
//         hostAllowed = whiteList[0];
//     }
//
//     if ('OPTIONS' === req.method) {
//         console.log("PRE_FLIGHT")
//         res.send(200);
//     }
//
//     res.header('Access-Control-Allow-Origin', 'http://'+hostAllowed);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//
// });


app.use(function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }

})

app.use(logger);

app.use('/', recipeRouter);
app.use('/', ingredientRouter);
app.use('/', categoryRouter);
app.use('/', productRouter);

app.use(errorHandle);

app.get('/', (req, res) => {
    res.send("Root api")
});

db.connection.on('error', () => {
    log.errorExceptOnTest('Oops Something went wrong, connection error:');
});

db.connection.once('open', () => {
    log.logExceptOnTest("MongoDB successful connected");
});

app.listen(port, () => {
    log.logExceptOnTest("Application started. Listening on port:" + port);
});

function errorHandle(err, req, res, next){
    log.errorExceptOnTest(err.stack);

    const errorResponse = {
        message : err.message,
        name: "Main error",
        errors: []
    };

    res
        .status(500) //bad format
        .send(errorResponse)
        .end();
}

module.exports = { app : app};