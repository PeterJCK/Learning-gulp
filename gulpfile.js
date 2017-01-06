// 载入外挂
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  webserver = require('gulp-webserver'),
  htmlmin = require('gulp-htmlmin');
csscomb = require('gulp-csscomb');
// HTML
gulp.task('html', function() {
  var options = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
  };
  gulp.src('src/**/*.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload())
    .pipe(notify({
      message: 'HTML task complete'
    }));;
});
// 样式
gulp.task('styles', function() {
  return sass('./src/styles/global.scss', {
      style: 'expanded',
    })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(csscomb())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(livereload())
    .pipe(notify({
      message: 'Styles task complete'
    }));
});
// 脚本
gulp.task('scripts', function() {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('global.js'))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(livereload())
    .pipe(notify({
      message: 'Scripts task complete'
    }));
});
// 图片
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(livereload())
    .pipe(notify({
      message: 'Images task complete'
    }));
});
// 清理
gulp.task('clean', function() {
  return gulp.src(['./dist/*'], {
      read: false
    })
    .pipe(clean())
    .pipe(notify({
      message: 'Clearn task complete'
    }));
});
// Web Server
gulp.task('webserver', function() {
  gulp.src('./dist') // 服务器目录（./代表根目录）
    .pipe(webserver({ // 运行gulp-webserver
      livereload: true, // 启用LiveReload
      open: true // 服务器启动时自动打开网页
    }));
});
// 看守
gulp.task('watch', function() {
  livereload.listen();
  // 看守所有.html档
  gulp.watch('./src/**/*.html', ['html']);
  // 看守所有.scss档
  gulp.watch('./src/styles/**/*.scss', ['styles']);
  // 看守所有.js档
  gulp.watch('./src/scripts/**/*.js', ['scripts']);
  // 看守所有图片档
  gulp.watch('./src/images/**/*', ['images']);
});
// 预设任务
gulp.task('default', ['clean'], function() {
  gulp.start('html', 'styles', 'scripts', 'images', 'webserver', 'watch');
});