//  Подключаем модули
var gulp = require("gulp"),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    webpack = require('gulp-webpack'),
    reload = browserSync.reload;




gulp.task('js', function() {
  return gulp.src('app')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});


// Запускаем локальный сервер
gulp.task('server', function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: './'
    }
  });
});


// Слежка и запуск задач
gulp.task('watch', function () {
  gulp.watch('app/*.js', ['js']);
  gulp.watch([
    'app/*.html',
    'app/js/**/*.js',
  ]).on('change', reload);
});

// Задача по-умолчанию
gulp.task('default', ['js', 'watch', 'server']);

// Более наглядный вывод ошибок
var log = function (error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
};