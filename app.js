var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var routes = require('./routes/router');
var config = require('./config/config');

var app = express();

app.engine('.hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function (name, options) {
            if (!this._section) {
                this._section = {}
            }
            this._section[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

app.use(bodyParser.urlencoded({
    'extended': false
}));
app.use(bodyParser.json());

app.use(session({
    secret: config.session.secret,
    store: new mongoStore({
        url: config.mongodb
    }),
    cookie: {
        maxAge: config.session.maxAge
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
});

routes(app);

app.listen(config.port, function () {
    console.log('listening on port:' + config.port);
});