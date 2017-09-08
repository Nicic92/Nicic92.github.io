/* 
intall Node.js
move package.json gulpfile.js
npm init
npm install

file structure :
src/css   -----\
src/js 			---> goes to root 
src/img   -----/
src/.html ----/


-------------------- TODO --------------------

Lazyload CSS to lazy to include it: 
Critical CSS 	 --- https://github.com/addyosmani/Critical 	- minimal css to make page apear normal
loadcss 		 --- https://github.com/filamentgroup/loadCSS 	- asynchronosly load css
gulp-rev 		 --- https://github.com/sindresorhus/gulp-rev 	- Static asset revisioning by appending content hash to filenames: unicorn.css → unicorn-d41d8cd98f.css
hash file names 

Commands:

			----------- Single tasks ------------
No concats here
npm run update  --- Updates Dependacies
gulp htmlmin 	--- Minimise html
gulp html 		--- Copy html from dev to prod
gulp fonts  	--- Copies Fonts from dev to prod
gulp sass 		--- Compile Sass and place it into same CSS folder 
gulp css 		--- Remove unused, autoprefix, minimize
					Note: update gulp.task css: html[] ignore dynamic properies
gulp js 		--- Babel, minimize
gulp images 	--- Compress images Wont repeat if image is compresed
gulp panda 		--- Best Image compresion 500/mo/key, Wont repet


gulp clean		--- Remove JS and CSS files from build folder
gulp devserver	--- Runs live server, resourses from src folder, Does not reload
gulp prodserver --- Runs live server, resourses from prod folder, Does not reload
gulp ngrok 		--- Live website NOTE: run ngrok program, type: ngrok http 8001

			----------- Multi tasks ------------

gulp run 		--- Runs gulp html css js fonts images
gulp watch 		--- Uses browserSync server Watches for changes reloads page, compiles SASS changes on save to CSS

gulp concat		--- Runs LAZYPIPE: css, js WITH concatination and Hashing
					Note: in HTML:
					<!-- build:css css/main.css -->
					<!-- endbuild -->
					<!-- build:js  js/main.css -->
					<!-- endbuild -->

*/

var
	gulp = require('gulp'),
	rename = require("gulp-rename"),
	imagemin = require('gulp-imagemin'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),  //use gulp-concat if this fucks up (must manualy add files) (good for constant gulp runs js/css (prod))
	gulpif = require('gulp-if');
	uglify = require('gulp-uglify'); //ES5 minifier
	uglify6 = require('gulp-uglify-es').default; //ES6
	csso = require('gulp-csso'); //minify
	babel = require('gulp-babel');
	plumber = require('gulp-plumber');
	uncss = require('gulp-uncss');
	lazypipe = require('lazypipe');
	postcss = require('gulp-postcss');
	autoprefixer = require('autoprefixer');
	htmlmin = require('gulp-htmlmin');
	tinypng = require('gulp-tinypng');
	changed = require('gulp-changed');
	connect = require('gulp-connect'); //for ngrok server (build)
	rev = require('gulp-rev'); //hash plugin
	revReplace = require('gulp-rev-replace'); //hash plugin
	del = require('del');



	folder = {
		src: 'src/',
		build: './'
	}

	// development mode?
	devBuild = (process.env.NODE_ENV !== 'production'),


	//HTML
	gulp.task('htmlmin', function() {
	  	return gulp.src(folder.src +'./*.html')
	  	.pipe(plumber())
	    .pipe(htmlmin({collapseWhitespace: true}))
	    .pipe(gulp.dest(folder.build));
	});

	gulp.task('html', function() {
		return gulp.src(folder.src + './*.html')
		.pipe(gulp.dest(folder.build))
	})

	//SASS
	gulp.task('sass', function () {
	return gulp.src(folder.src +'./css/**/*.scss')
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(folder.src +'/css'))
	.pipe(browserSync.reload({
	stream: true
	}))
	});


	//CSS
	gulp.task('css', function() {
	var out = folder.build + 'css/';
	return gulp.src(folder.src + 'css/**/*.css')
	.pipe(plumber())
	.pipe(uncss({				
            html: [folder.src + 'index.html'],
            // html: [folder.build + '*.html'],
            ignore: ['.fadeIn', '.fadeInDown','.fadeInRight','.fadeInLeft',
            		 '.fadeInUp','.animated','.zoomIn']
        }))
	.pipe(postcss([ autoprefixer() ]))
	.pipe(csso())
	// .pipe(rev()) hashing file
	.pipe(gulp.dest(out));
	});


	//JS
	gulp.task('js', function () {
		var out = folder.build + 'js/';
	    return gulp.src(folder.src + 'js/**/*.js')
	    .pipe(plumber())
	    .pipe(babel({presets: ['es2016']}))
	    .pipe(uglify6())
	    // .pipe(rev()) hashing file
	    .pipe(gulp.dest(out));
	});

	//IMAGES
		gulp.task('images', function() {
		var out = folder.build + 'img/';
		return gulp.src(folder.src + 'img/**/*')
		.pipe(plumber())
		.pipe(changed(out))
		.pipe(imagemin())
		.pipe(gulp.dest(out));
		});

	//TinyPNG plugin (500/mo/key)
		gulp.task('panda', function() {
		var out = folder.build + 'img/';
		return gulp.src(folder.src + 'img/**/*')
		.pipe(plumber())
		.pipe(changed(out))
		.pipe(tinypng('ap_vKI1MfdhlXqw40Yc5qsRZpv3GCbbe'))
		.pipe(gulp.dest(out));
		});


	//FONTS
	gulp.task('fonts', function() {
		return gulp.src(folder.src + './fonts/**/*')
		.pipe(gulp.dest(folder.build + 'fonts/'))
	});

	gulp.task('clean', function () {
    	del([folder.build + './js/**/*', 
    		 folder.build + './css/**/*' ])
    	
	});


	// Lazypipe TASKS

	//		lazypipe
	//.pipe(foo(param1)) 		 -> .pipe(foo, param1)
	//.pipe(foo(param1, param2)) -> .pipe(foo, param1, param2)

	var cssTasks = lazypipe()
		.pipe(plumber)
		.pipe(uncss,{ html: [folder.src + 'index.html'],//,'http://localhost:8080/portfolioG/dist/ (for runtime css added through js)
					  ignore:['.fadeIn', '.fadeInDown','.fadeInRight','.fadeInLeft',			// 	 (for added css through user interaction)
            		 '.fadeInUp','.animated','.zoomIn'] 
            		})
		.pipe(postcss,[autoprefixer])
		.pipe(csso)
		.pipe(rev)
    ;

    var jsTasks = lazypipe()
		.pipe(plumber)
		.pipe(babel,{presets: ['es2016']})
		.pipe(uglify6)
		.pipe(rev)
    ;


	gulp.task('concat', function () {
	return gulp.src(folder.src +'./*.html')
		//handle errors
		.pipe(plumber())
		// handle file concatenation 
		.pipe(useref())
		//handle tasks
		.pipe(gulpif('*.js', jsTasks()))
		.pipe(gulpif('*.css', cssTasks()))
		.pipe(revReplace())
		.pipe(gulp.dest(folder.build));
	});



	gulp.task('run', ['html', 'css', 'js', 'fonts', 'images']);

	//WATCH DEV CANT WAIT TO COMPILE
	gulp.task('watch', ['devserver', 'sass'], function () {
	gulp.watch(folder.src +'./css/**/*.scss', ['sass']);
	gulp.watch(folder.src +'./css/**/*.css', browserSync.reload);
	gulp.watch(folder.src +'./js/**/*.js', browserSync.reload);
	gulp.watch(folder.src +'./*.html', browserSync.reload); 
	});


	gulp.task('devserver', function() {
	browserSync.init({
	server: {
	baseDir: folder.src
	},})
	});

	gulp.task('prodserver', function() {
	browserSync.init({
	server: {
	baseDir: folder.build
	},})
	})

	gulp.task('ngrok', function () {
	connect.server({
	root: folder.build,
	port: 8001,
	livereload: false
	});
	});


;