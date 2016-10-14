var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var gp_uglify = require('gulp-uglify');
var systemjsBuilder = require('gulp-systemjs-builder')
var  concat = require('gulp-concat');

var embedTemplates = require('gulp-angular-embed-templates');
var flatten = require('gulp-flatten');
var inlineNg2Styles = require('gulp-inline-ng2-styles');
var ng2RelativePath = require('gulp-ng2-relative-path');
var rename = require("gulp-rename");
var del = require('del');


gulp.task('build-sjs', ['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts'],function () {
    var builder = systemjsBuilder()
    builder.loadConfigSync('./systemjs.config.release.js');
 
    return builder.buildStatic('dist/main.release.js', {
        minify: false,
        mangle: false
    })
    .pipe(rename("portfolio.umd.js"))
    .pipe(gulp.dest('dist'));
})

gulp.task('clean',['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts', 'build-sjs'], function(cb) {
    return del(['dist/**/*.js','dist/**/*.html', '!dist/portfolio.umd.js'], cb);
});

gulp.task("dupplicate_css_structure", function () {
	return gulp.src('app/**/*.css')
	    .pipe(gulp.dest('dist'));
});

gulp.task("dupplicate_tpl_structure", function () {
	gulp.src('app/**/*.html')
	    .pipe(gulp.dest('dist'));
});

gulp.task("compile_ts",['dupplicate_css_structure', 'dupplicate_tpl_structure'], function () {
	return tsProject.src()
    	.pipe(ng2RelativePath({
			  base: '/',                   // Source base folder 
			  appBase: '/',                 // Angular app base folder 
			  templateExtension: '.html',   // Template file extension 
			  processTemplatePaths: false,   // Enable or disable template paths processing 
			  processStylePaths: true,      // Enable or disable style paths processing 
			  modifyPath: false,            // Function to additionally modify all file paths 
			  modifyTemplatePath: false,    // Function to modify only template paths 
			  modifyStylePath: function (path) { // Function to modify only style paths 
			      return path.replace('../app', './dist');
			    }        
			}))
    	.pipe(embedTemplates({sourceType:'ts'}))
    	//.pipe(inlineNg2Styles({ base: './' }))
        .pipe(tsProject())
        .js
        //.pipe(gp_concat('main.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task('default', ['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts', 'build-sjs', 'clean']);
