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
// add to package.json: 
// ,
//   "browserslist": [
//     "> 1%",
//     "ie >= 8",
//     "edge >= 15",
//     "ie_mob >= 10",
//     "ff >= 45",
//     "chrome >= 45",
//     "safari >= 7",
//     "opera >= 23",
//     "ios >= 7",
//     "android >= 4",
//     "bb >= 10"
//   ]
var eslint = require('gulp-eslint');
// npm install gulp-concat
// var concat = require('gulp-concat');
// npm install --save-dev gulp-babel @babel/core @babel/preset-env
var babel = require('gulp-babel');
// npm install --save-dev gulp-uglify
var uglify = require('gulp-uglify');
// npm install --save gulp-uglifycss
var uglifycss = require('gulp-uglifycss');
// npm install --save-dev gulp-shell
// var shell = require('gulp-shell');
// gulp Start

gulp.task('default', function(done) {
    gulp.watch('sass/**/*.scss', gulp.series('styling'));
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch(['index.html', 'js/*.js', 'css/main.css']).on('change', browserSync.reload);
    browserSync.init({
        server: './'
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
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer({}))
        .pipe(gulp.dest('./css/'));
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

// gulp.task('Start', 
//     shell.task([
//         'touch index.html', 
//         'mkdir sass', 
//         'touch sass/main.scss', 
//         'mkdir js', 
//         'touch js/main.js',
//         'mkdir images'
//     ])
// );

gulp.task('Done', function(done) {
    gulp.src('./*.html')
        .pipe((gulp.dest('distribution')));
    gulp.src('css/main.css')
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('distribution/css'));
    gulp.src('js/**/*.js')
        // compile all es6 to es5 before minifying
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(uglify())
        .pipe(gulp.dest('distribution/js'));
    gulp.src('images/*')
        .pipe((gulp.dest('distribution/images')));
    done();
});