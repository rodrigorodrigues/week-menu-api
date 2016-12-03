/**
 * Created by eliasmj on 24/11/2016.
 *
 * *** npm run dev >>> runs nodemon to reload the file without restart the server
 */
require('./config/config');

const log = require('./utils/log.message');

var app = require('express')();

var db  = require('./db/mongoose');

var bodyParser = require('body-parser');

const recipeRouter = require('./routes/recipe.route');
const ingredientRouter = require('./routes/ingredient.route');

app.use(bodyParser.json());
// Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', recipeRouter);
app.use('/', ingredientRouter);

app.get('/', (req, res) => {
    res.send("Root api")
});

db.connection.on('error', () => {
    log.errorExceptOnTest('Oops Something went wrong, connection error:');
});

db.connection.once('open', () => {
    log.logExceptOnTest("MongoDB successful connected");
});

const port = process.env.PORT;

app.listen(port, () => {
    log.logExceptOnTest("Application started. Listening on port:" + port);
});

// if(!module.parent){
//     app.listen(port, () => {
//         console.log("Application started. Listening on port:" + port);
//     });
// }

app.use('/', recipeRouter);

module.exports = { app : app};