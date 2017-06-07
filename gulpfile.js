var
	gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),  //gulp-concat if this fucks up (must manualy add files) (good for constant gulp runs js/css (prod))
	gulpif = require('gulp-if');
	uglify = require('gulp-uglify');
	csso = require('gulp-csso');
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


	folder = {
		src: 'src/',
		build: './'
	}

	// development mode?
	devBuild = (process.env.NODE_ENV !== 'production'),


	//HTML
	gulp.task('htmlmin', function() {
	  	return gulp.src(folder.build +'./*.html')
	  	.pipe(plumber())
	    .pipe(htmlmin({collapseWhitespace: true}))
	    .pipe(gulp.dest(folder.build));
	});


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
            html: [folder.build + 'index.html'],
            ignore: ['.fadeIn', '.fadeInDown','.fadeInRight','.fadeInLeft',
            		 '.fadeInUp','.animated','.zoomIn']
        }))
	.pipe(postcss([ autoprefixer() ]))
	// .pipe(csso())
	.pipe(gulp.dest(out));
	});


	//JS
	gulp.task('js', function () {
	    gulp.src(folder.src + 'js/*.js')
	    .pipe(plumber())
	    .pipe(babel({presets: ['es2015']}))
	    // .pipe(uglify())
	    gulp.dest(folder.build + 'js/')
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
	})


	// Lazypipe TASKS
	var cssTasks = lazypipe()
		.pipe(plumber)
		.pipe(uncss,{ html: [folder.build + 'index.html'],//,'http://localhost:8080/portfolioG/dist/ (for runtime css added through js)
					  ignore:['.fadeIn', '.fadeInDown','.fadeInRight','.fadeInLeft',			// 	 (for added css through user interaction)
            		 '.fadeInUp','.animated','.zoomIn'] 
            		})
		.pipe(postcss,[autoprefixer])
		.pipe(csso)
    ;

    var jsTasks = lazypipe()
		.pipe(plumber)
		.pipe(uglify)
		
    ;

    //FOR DIST, HARD TO DEBUG
	//HTML CSS JS

	//		useref
	//		<!-- build:css css/main.css -->		(build:js)
	//		<!-- endbuild -->

	//		lazypipe
	//.pipe(foo(param1)) 		 -> .pipe(foo, param1)
	//.pipe(foo(param1, param2)) -> .pipe(foo, param1, param2)

	gulp.task('all', function () {
	return gulp.src(folder.src +'./*.html')
		//handle errors
		.pipe(plumber())
		// handle file concatenation 
		.pipe(useref())
		//handle minification (Conditionally run a task)
		.pipe(gulpif('*.js', jsTasks()))
		.pipe(gulpif('*.css', cssTasks()))

		.pipe(gulp.dest(folder.build));
	});



	gulp.task('run', ['html', 'css', 'js', 'fonts']);

	//WATCH DEV
	gulp.task('watch', ['browserSync', 'sass'], function () {
	gulp.watch(folder.src +'./css/**/*.scss', ['sass']);
	gulp.watch(folder.src +'./css/**/*.css', browserSync.reload);
	gulp.watch(folder.src +'./js/**/*.js', browserSync.reload);
	gulp.watch(folder.src +'./*.html', browserSync.reload); 
	});


	gulp.task('browserSync', function() {
	browserSync.init({
	server: {
	baseDir: folder.src
	},})
	})

	gulp.task('ngrok', function () {  //run ngrok, type: ngrok http 8001
	connect.server({
	root: folder.build,
	port: 8001,
	livereload: false
	});
	});


;