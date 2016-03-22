import gulp from 'gulp'
import browserify from 'browserify'
import babelify from 'babelify'
import del from 'del'
import source from 'vinyl-source-stream'
import glob from 'glob'
import sass from 'gulp-sass'
import browserSyncModule from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import gutil from 'gulp-util'

let browserSync = browserSyncModule.create()

const config = {
  inFiles: {
    html: 'src/examples/*.html',
    js:   'src/examples/*.js',
    css:  'src/examples/*.{sass,scss,css}',
  },
  outDir: 'build/',
}

gutil.log('Starting!')

function logError(err) {
  gutil.log(
    `[${gutil.colors.blue(err.plugin)}] ${gutil.colors.red('Error:')}`,
    `${gutil.colors.red(err.messageFormatted || err.message)}`
  )
  // gutil.log(err)
}

gulp.task('js', function (done) {
  let browserify_opts = {
    paths: ['./node_modules', './src'],
    debug: true,
  }

  glob(config.inFiles.js, (err, files) => {
    if (err) throw err
    files.forEach(filename => {
      browserify(filename, browserify_opts).transform(babelify).bundle()
        .on('error', logError)
        .pipe(source(filename.replace('src/examples/', '')))
        .pipe(gulp.dest(config.outDir))
        .pipe(browserSync.stream())
    })
    done(null)
  })
})

gulp.task('sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(sass()).on('error', logError)
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(config.outDir))
    .pipe(browserSync.stream())
})

gulp.task('html', function () {
  return gulp.src(config.inFiles.html)
    .pipe(gulp.dest(config.outDir)) // Just copy.
    .pipe(browserSync.stream())
})

gulp.task('build', ['js', 'sass', 'html'])

gulp.task('rebuild', function () {
  return del(config.outDir)
    .then(() => console.log('Deleted build/'))
    .then(() => gulp.start('build'))
})

gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: config.outDir},
    ui: false,
  })
})

gulp.task('watch', ['rebuild'], function () {
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch(config.inFiles.css, ['sass'])
  gulp.watch(config.inFiles.html, ['html'])
})

gulp.task('default', ['watch', 'server'])
