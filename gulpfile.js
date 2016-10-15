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
var util = require('gulp-util');

/////////////////////////////////////////////////////////////////////////////////////

"use strict";
var compile = require('es6-templates').compile;
var extend = require('extend');
var fs = require('fs');
var gutil = require('gulp-util');
var join = require('path').join;
var through = require('through2');

var inlineStyles = function (options) {
  var defaults = {
    base: '/',
    extension: '.css',
    target: 'es6'
  };

  options = extend({}, defaults, options || {});

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-ng2-inline-template', 'Streaming not supported'));
      return;
    }

    try {
      file.contents = new Buffer(inline(file.contents.toString(), options));
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-ng2-inline-template', err, {fileName: file.path}));
    }

    cb();
  });
};


var STYLE_URLS = 'styleUrls';
var STYLES = 'styles';

function inline(file, options) {
  var index1, index2, startLine, endLine, styleUrls;
  var lines = file.split('\n');
  var preffix = '';
  var suffix = '';

  lines.forEach(function (line, i) {
    index1 = line.indexOf(STYLE_URLS);
    index2 = line.indexOf(']');

    // Single line array definition
    if (index1 >= 0 && index2 > 0) {
      startLine = i;
      styleUrls = lines[i].slice(index1, index2 + 1);

      preffix = line.slice(0, index1);
      suffix = line.slice(index2 + 1);
      lines[i] = preffix + replace(styleUrls, options) + suffix;
    }
    /*
    // Multiple line array definition
    if (index1 >= 0 && index2) {
      startLine = i;
      preffix = line.slice(0, index1);
    }
    if (index2 >= 0 && index1 < 0 && startLine !== undefined) {
      endLine = i;
      var _lines = lines.splice(startLine, (i - startLine + 1));
      styleUrls = _lines.join('');

      lines.splice(startLine, 0, preffix + replace(styleUrls, options));
    }*/
  });

  return lines.join("\n");
}


// ----------------------
// Utils
function replace(styleUrls, options) {
  var styles = '';
  var urls = eval('({' + styleUrls + '}).styleUrls');

  urls.forEach(function (url, i) {
    var coma = i > 0 ? ', ' : '';
    styles += coma + getStylesString(url, options);
  });

  var newLines = STYLES + ': [' + styles + ']';
  newLines += hasTraillingComa(styleUrls) ? ',' : '';
  styles = styles.replace(/(?:\r\n|\r|\n)/g, '');
  
  return STYLES + ': [' + styles + ']';
}

function getStylesString(stylesPath, options) {
  var stylesAbsPath = join(process.cwd(), options.base, stylesPath);
  var styles = fs.readFileSync(stylesAbsPath, 'utf8');
  var string =  '`' +
                trimTrailingLineBreak(styles) +
                '`';

  return string;
}

function trimTrailingLineBreak(styles) {
  var lines = styles.split('\n');
  // var trim = lines.splice(-1, 1);
  return (lines.pop() === '' ? lines.join('\n') : styles);
}

function hasTraillingComa(styleUrls) {
  return styleUrls.slice(-1) === ',' ? true : false;
}


/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-sjs', ['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts'],function () {
    var builder = systemjsBuilder()
    builder.loadConfigSync('./systemjs.config.release.js');
 
    return builder.buildStatic('dist/main.release.js', {
        minify: true,
        mangle: true,
        globalName: 'PORTFOLIO' 
    })
    .pipe(rename("portfolio.umd.js"))
    .pipe(gulp.dest('dist'));
})

gulp.task('clean',['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts', 'build-sjs'], function(cb) {
    return del(['dist/**/*.js','dist/**/*.html','dist/**/*.css', '!dist/portfolio.umd.js'], cb);
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
    	.pipe(inlineStyles({ base: './', target: 'es6' }))
        .pipe(tsProject())
        .js
        //.pipe(gp_concat('main.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task('default', ['dupplicate_css_structure', 'dupplicate_tpl_structure', 'compile_ts', 'build-sjs', 'clean']);
