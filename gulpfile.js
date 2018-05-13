// yum install epel-release.noarch
// yum install nodejs npm

// Gulp 4 uses an updated CLI which needs to be updated globally. This CLI is backwards compatible with any Gulp 3.X projects you may have locally.

// # first uninstall gulp globally
// npm uninstall gulp -g

// # uninstall from your project directory, or delete node_modules if you need a coffee break
// npm uninstall gulp

// # install the latest Gulp 4 CLI tools globally
// npm install gulpjs/gulp-cli -g

// Once done you can run npm install again from the edition-node-gulp repository and everything should be pulled down via npm

// You can confirm the right versions are installed using

// gulp -v
// [22:35:42] CLI version 1.4.0 (at time of writing)
// [22:35:42] Local version 4.0.0-alpha.2

// npm install --save-dev gulp
// npm install --save-dev gulp-util
// npm install - -save-dev jshint gulp-jshint jshint-stylish gulp-uglify 
// npm install -g browser-sync
// To use sync: navigate to project base dir and: 
// browser-sync start --server --files "*.html, css/*.css"

// npm init
var gulp = require('gulp');
// npm install gulp-sass
var sass = require('gulp-sass');
// npm install --save-dev gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');
// npm install browser-sync gulp --save-dev
var browserSync = require('browser-sync').create();
// npm install gulp-eslint
// ./node_modules/.bin/eslint --init
// add to top of js file: /*eslint-env jquery*/
var eslint = require('gulp-eslint');
// npm install gulp-concat
var concat = require('gulp-concat');
// npm install --save-dev gulp-uglify
var uglify = require('gulp-uglify');

gulp.task('default', function(done) {
    gulp.watch('sass/**/*.scss', gulp.series('styling'));
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch('js/**/*.js', gulp.series('scripts'));
    gulp.watch('./index.html', gulp.series('copy-html'));
    gulp.watch(['itsDone/index.html', 'itsDone/js/main.js', 'itsDone/css/style.css']).on('change', browserSync.reload);
    browserSync.init({
        server: 'itsDone'
    });
    done();
});

gulp.task('browserSync', function(done) {
    browserSync.stream();
    done();
});

gulp.task('styling', function(done) {
    gulp.src('sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('itsDone/css'));
    done();
});

gulp.task('lint', function() {
    return gulp.src(['js/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // alternatively us eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // to have the process exit when an error code (1) on
        // lint error, return the steam an pipe to fialOnError last.
        .pipe(eslint.failOnError());
});

gulp.task('copy-html', function(done) {
    gulp.src('./index.html')
        .pipe((gulp.dest('itsDone')));
    done();
});

gulp.task('copy-images', function(done) {
    gulp.src('img/*')
        .pipe((gulp.dest('itsDone/img')));
    done();
});

gulp.task('scripts', function(done) {
    gulp.src('js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('itsDone/js'));
    done();
});

gulp.task('imDone', function(done) {
    gulp.src('./index.html')
        .pipe((gulp.dest('itsDone')));
    gulp.src('sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('itsDone/css'));
    gulp.src('js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('itsDone/js'));
    gulp.src('img/*')
        .pipe((gulp.dest('itsDone/img')));
    
    done();
});