gulp      = require "gulp"
coffee    = require "gulp-coffee"
gutil     = require "gulp-util"
rm        = require "gulp-rm"
riot      = require "gulp-riot"
plumber   = require "gulp-plumber"

gulp.task "clean", ->
  gulp
    .src './app/**/*',
      read: false
    .pipe plumber()
    .pipe rm
      async: false

gulp.task "coffee-client", ->
  gulp
    .src "./client/coffee/**/*.coffee"
    .pipe plumber()
    .pipe coffee
      bare: true
    .pipe gulp.dest "./app/client/js"

gulp.task "coffee-server", ->
  gulp
    .src "./server/coffee/**/*.coffee"
    .pipe plumber()
    .pipe coffee
      bare: true
    .pipe gulp.dest "./app/server"

gulp.task "html-client", ->
  gulp
    .src "./client/pages/**/*.html"
    .pipe gulp.dest "./app/client"

gulp.task "riot", ->
  gulp
    .src "./client/templates/**/*.tag"
    .pipe plumber()
    .pipe riot
      compact: true
    .pipe gulp.dest "./app/client/js"

gulp.task "watch", ->
  gulp.watch "./client/coffee/**/*.coffee", ["coffee-client"]
  gulp.watch "./client/pages/**/*.html", ["html-client"]
  gulp.watch "./client/templates/**/*.tag", ["riot"]
  gulp.watch "./server/coffee/**/*.coffee", ["coffee-server"]

gulp.task "default", ["clean", "html-client", "coffee-client", "coffee-server", "riot", "watch"]
