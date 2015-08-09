var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('watch', function(gulpCallback) {
  browserSync.init({
    server: './build/',
    open: true
  }, function callback() {
    gulp.watch('build/*.html', browserSync.reload);
    gulp.watch('build/*.css', browserSync.reload);
    gulp.watch('build/*.js', browserSync.reload);
    gulp.watch('src/*.scss', ['sass']);
    gulp.watch('src/*.jade',['jade']);
    gulp.watch('src/*.js',['scripts']);
    gulpCallback();
  });
});

gulp.task('sass', function() {
  return gulp.src('src/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
            cascade: false
     }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('jade', function() {
     return gulp.src('src/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
     return gulp.src('src/*.js')
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['watch']);
