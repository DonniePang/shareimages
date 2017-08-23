var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

var config = require('./config/config');

gulp.task('server', function () {
    var started = false;
    nodemon({
        script: 'app.js',
        ignore: 'node_modules/',
        ext: 'js html hbs',
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start', function () {
        if (!started) {
            browserSync.init({
                proxy: 'http://localhost:3000',
                port: 8000
            });
            started = true;
            console.log('start')
        } else {
            browserSync.reload();
            console.log('reload')
        }
    })
})