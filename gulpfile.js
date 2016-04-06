var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var merge = require('merge2');
var tslint = require("gulp-tslint");
var mocha = require("gulp-mocha");
var gutil = require('gulp-util');
var tsNodeRegister = require("ts-node/register");
var tsconfig = require('./tsconfig.json');
var tsd = require('gulp-tsd');

gulp.task('dist', function () {
    var tsProject = ts.createProject(Object.assign({
        declaration: true,
        noExternalResolve: true
    }, tsconfig.compilerOptions));

    var tsStream = gulp.src('src/*.ts')
        .pipe(ts(tsProject));

    return merge([
        tsStream.dts.pipe(gulp.dest('dist')),
        tsStream.js.pipe(gulp.dest('dist'))
    ])
});

gulp.task('clean', function () {
    del('dist/**');
});

gulp.task('lint', function () {
    return gulp.src(['src/*.ts', 'test/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            // emitError: false,
            reportLimit: 2
        }));
});

gulp.task('test', function () {
    return gulp.src('test/*.spec.ts')
        .pipe(mocha({
            require: tsNodeRegister,
            watch: true
        }));
});

gulp.task('watch-test', function() {
    gulp.watch(['test/*.ts', 'src/*.ts'], ['test']);
});

gulp.task('watch-lint', function() {
    gulp.watch(['test/*.ts', 'src/*.ts'], ['lint']);
});

gulp.task('tsd-reinstall', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});
