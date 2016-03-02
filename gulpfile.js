var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var stylus = require('gulp-stylus');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');

var src = {
    styl: './public/styl/*.styl',
    coffee: './public/coffee/*.coffee',
    entry: './public/entry/*.js',
    js: './public/js/*.js',
    jade: './views/part/*.jade'
};

var dir = {
    css: './public/css/',
    img: './public/img/',
    bundle: './public/bundle/',
};

gulp.task('stylus', function () {
    gulp.src(src.styl)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest(dir.css))
        .pipe(livereload());
});

gulp.task('webpack', function () {
    return gulp.src(src.entry)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpack({
            module: {
                loaders: [
                    { test: /\.coffee$/, loader: 'coffee-loader' },
                    { test: /\.jade$/, loader: "jade" },
                ]
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dir.bundle));
        
});

gulp.task('watch', function () {
    gulp.watch(src.styl, ['stylus']);
    gulp.watch([src.coffee, src.entry, src.jade], ['webpack']);
});

gulp.task('develop', function () {
    livereload.listen();
    nodemon({
        script: 'bin/www',
        ext: 'js jade coffee',
        stdout: false
    }).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

gulp.task('default', [
    'stylus',
    'webpack',
    'develop',
    'watch'
]);
