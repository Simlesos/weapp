const path = require('path')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const gutil = require('gulp-util')
const cssnext = require('postcss-cssnext')
const stylelint = require('stylelint')
const reporter = require('postcss-reporter')
const cssnano = require('cssnano')
const del = require('del')
const paths = require('./config/paths')

function log (...args) {
  gutil.log.apply(false, args)
}

function swallowError (error) {
  console.error(error.toString())
  this.emit('end')
}

/**
 * task：复制基础文件
 */
function copyBasicFiles () {
  return gulp.src(paths.src.baseFiles)
    .pipe(gulp.dest(paths.dist.baseDir))
}

/**
 * task: 复制 *.wxml 文件
 */
function copyWXML () {
  return gulp.src(paths.src.wxmlFiles)
    .pipe(gulp.dest(paths.dist.baseDir))
}

/**
 * task: 清理 dist 目录
 */
function clearDist () {
  return del(paths.dist.baseDir)
}

/**
 * 编译 css 到 wxss
 */
function cssCompile () {
  const plugins = [
    require('postcss-import')({
      plugins: [
        stylelint
      ]
    }),
    cssnext({
      features: {
        autoprefixer: false
      }
    }),
    cssnano({ preset: 'default' }),
    reporter({ clearReportedMessage: true })
  ]
  return gulp.src(paths.src.cssFiles)
    .pipe(postcss(plugins))
    .on('error', swallowError)
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(paths.dist.baseDir))
}

function watchHandler (state, file) {
  const extname = path.extname(file)
  if (extname === '.css') {
    if (state === 'removed') {
      const tmp = file.replace('src/', 'dist/')
        .replace('extname', '.wxss')
      del([tmp])
    } else {
      cssCompile()
    }
  } else if (
    ['.png', '.jpg', '.jpeg', '.svg', '.gif'].indexOf(extname) > -1
  ) {
    if (state === 'removed') {
      // TODO: 图片压缩 上传七牛
    }
  } else if (extname === '.wxml') {
    if (state === 'removed') {
      const tmp = file.replace('src/', 'dist/')
      del([tmp])
    } else {
      copyWXML()
    }
  } else {
    if (state === 'removed') {
      const tmp = file.replace('src/', 'dist/')
      del([tmp])
    } else {
      copyBasicFiles()
    }
  }
}

function watch (callback) {
  const watcher = gulp.watch([
    paths.src.baseDir
  ], { ignored: /[/\\]\./ })

  watcher
    .on('change', function (file) {
      log(gutil.colors.yellow(file) + 'is changed')
      watchHandler('changed', file)
    })
    .on('add', function (file) {
      log(gutil.colors.yellow(file) + 'is add')
      watchHandler('add', file)
    })
    .on('unlink', function (file) {
      log(gutil.colors.yellow(file) + 'is deleted')
      watchHandler('removed', file)
    })
  callback && callback()
}

/**
 * 清理任务
 */
gulp.task('clean', gulp.parallel(
  clearDist
))

/**
 * tast: build
 */
gulp.task('build', gulp.series(
  clearDist,
  copyBasicFiles,
  gulp.parallel(
    cssCompile,
    copyWXML,
    copyBasicFiles
  )
))

gulp.task('default', gulp.series(
  clearDist,
  copyBasicFiles,
  gulp.parallel(
    cssCompile,
    copyWXML,
    copyBasicFiles
  ),
  watch
))

gulp.task('watch', function () {

})
