// PATHS для SVG Sprites
var basePaths = {
  src: '%sprite/'
};
var paths = {
  images: {
    src: basePaths.src + 'img/'
  },
  sprite: {
    src: basePaths.src + 'img/*',
    svg: 'sprite.svg',
    css:  basePaths.src + 'sass/src/_sprite.scss'
  },
  templates: {
    src: basePaths.src + 'tpl/'
  }
};

//  Создание переменых
var gulp = require("gulp"),          
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    del= require('del'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    ftp = require('vinyl-ftp'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    autoprefixer = require('gulp-autoprefixer');
    reload = browserSync.reload;

// ==========================================================
// ==============  Локальная разработка  ============
// ==========================================================


// Cоздает SVG Sprite
gulp.task('svgSprite', function () {
    return gulp.src(paths.sprite.src)
        .pipe(svgmin())
        .pipe(svgSprite({
            shape: {
              spacing: {
                padding: 5
              }
            },
            mode: {
              css: {
                dest: "./",
                layout: "diagonal",
                sprite: paths.sprite.svg,
                bust: false,
                render: {
                  scss: {
                    dest: "src/_sprite.scss",
                    template: "%sprite/tpl/sprite-template.scss"
                  }
                }
              }
            },
            variables: {
              mapname: "icons"
            }
          }))
          .pipe(gulp.dest('app/img/icons'));
});

// Компилируем Jade в html
gulp.task('jade', function() {
    gulp.src('app/jade/_pages/*.jade')
    .pipe(plumber())
    .pipe(jade({
       pretty: '\t'
      }))
    .on('error', log)
    .pipe(gulp.dest('app/'))
    .pipe(reload({stream: true}));
});

// Компилируем Sccs в css
gulp.task('compass', function() {
  gulp.src('app/sass/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb', 
      css: 'app/css',
      sass: 'app/sass'
    }))
    .pipe(gulp.dest('app/css'));
});

// Проставляем префиксы для 7 последних версий
gulp.task('autoprefixer', function () {
  return gulp.src('app/sass/main.css')
    .pipe(autoprefixer({
      browsers: ['last 7 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css/'));
});


// Запускаем локальный сервер (только после компиляции jade)
gulp.task('server', function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: 'app'
    }
  });
});

// Подключаем ссылки на bower для jade
gulp.task('wiredep', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
        exclude: ['modernizr'],
        ignorePath: /^(\.\.\/)*\.\./
      }))
      .pipe(gulp.dest('app/'));
});

// Слежка и запуск задач
gulp.task('watch', function () {
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.scss', ['compass']);
  // gulp.watch('bower.json', ['wiredep']);
  gulp.watch('%sprite/img/*', ['svgSprite']);
  gulp.watch([
    'app/*.html',
    'app/js/**/*.js',
    'app/css/**/*.css',
    '%sprite/img/*'
  ]).on('change', reload);
});

// Задача по-умолчанию
gulp.task('default', ['jade', 'compass', 'watch', 'server']);

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

// ====================================================
// =============== Важные моменты  ====================
// ====================================================
// gulp.task(name, deps, fn)
// deps - массив задач, которые будут выполнены ДО запуска задачи name
// внимательно следите за порядком выполнения задач!


// ====================================================
// ================= Сборка DIST ======================
// ====================================================

// Очистка папки
gulp.task("clean", function () {
    return del(["./dist/**", "!./dist/"]);
});

// Переносим HTML, CSS, JS в папку dist
gulp.task('useref', function () {
  var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
  gulp.src('app/fonts/*')
    .pipe(filter(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2']))
    .pipe(gulp.dest('dist/fonts/'));
});

// Картинки
gulp.task('images', function () {
  return gulp.src('app/img/**/*')
    .pipe(filter(['*.png', '*.svg', '*.jpg', '*.gif']))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Перенос остальных файлов, таких как favicon.ico и пр.
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ]).pipe(gulp.dest('dist'));
});

// Вывод размера папки APP
gulp.task('size-app', function () {
    return gulp.src("app/**/*").pipe(size({title: "APP size: "}));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras', 'size-app'], function () {
  return gulp.src('dist/**/*').pipe(size({title: 'DIST size'}));
});

// Собираем папку DIST (только после компиляции Jade)
gulp.task('build', ['clean', 'jade'], function () {
  gulp.start('dist');
});

// Проверка сборки
gulp.task('server-dist', function () {
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: 'dist'
    }
  });
});


// ====================================================
// ===== Отправка проекта на сервер ===================
// ====================================================

gulp.task( 'deploy', function() {

  var conn = ftp.create( {
      host:     '',
      user:     '',
      password: '',
      parallel: 10,
      log: gutil.log
  } );

  var globs = [
      'dist/**/*'
  ];

  return gulp.src(globs, { base: 'dist/', buffer: false })
    .pipe(conn.dest( '/public_html/'));

});