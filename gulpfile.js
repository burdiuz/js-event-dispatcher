/**
 * Created by Oleg Galaburda on 26.12.15.
 */
var gulp = require("gulp"),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename"),
  include = require("gulp-include");

gulp.task('build', function() {
  gulp.src('source/event-dispatcher-umd.js')
    // create concatenated file
    .pipe(include())
    .on('error', console.log)
    .pipe(rename('event-dispatcher.js'))
    .pipe(gulp.dest('dist'))
    // create minified version
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
