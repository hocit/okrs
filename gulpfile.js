var gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	rename = require("gulp-rename"),
	ejs = require("gulp-ejs"),
	sass = require("gulp-sass"),
	uglify = require('gulp-uglify'),
	sourcemaps = require("gulp-sourcemaps"),
	minifyCss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	log = require('fancy-log'),
	fs = require("fs");

gulp.task("ejs", function (e) {
	var tmp_file = "./ejs/template.ejs",
		json_file = "./ejs/data/pages.json",
		json = JSON.parse(fs.readFileSync(json_file)),
		page_data = json.pages;
	for (var i = 0; i < page_data.length; i++) {
		var bread1 = page_data[i].bread1;
		var bread2 = page_data[i].bread2;
		var bread3 = page_data[i].bread3;
		var bread4 = page_data[i].bread4;
		var bread1_url = page_data[i].bread1_url;
		var bread2_url = page_data[i].bread2_url;
		var bread3_url = page_data[i].bread3_url;
		var BREADCRUMBS = "";
		var id = page_data[i].id,
			parentId1 = page_data[i].parentId1,
			parentId2 = page_data[i].parentId2,
			parentId3 = page_data[i].parentId3,
			parentId4 = page_data[i].parentId4,
			depth = page_data[i].depth,
			RELATIVE_PATH = ""
		if (depth == 0) {
			RELATIVE_PATH = "./"
		}
		else if (depth == 1) {
			RELATIVE_PATH = "../"
		}
		else if (depth == 2) {
			RELATIVE_PATH = "../../"
		}
		else if (depth == 3) {
			RELATIVE_PATH = "../../../"
		}
		else if (depth == 4) {
			RELATIVE_PATH = "../../../../"
		}
		if (bread1 != "") {
			BREADCRUMBS = "<li><a href='/'>TOP</a></li><li><span>" + bread1 + "</span></li>"
		}
		if (bread2 != "") {
			BREADCRUMBS = "<li><a href='/'>TOP</a></li><li><a href='" + bread1_url + "'>" + bread1 + "</a></li><li><span>" + bread2 + "</span></li>"
		}
		if (bread3 != "") {
			BREADCRUMBS = "<li><a href='/'>TOP</a></li><li><a href='" + bread1_url + "'>" + bread1 + "</a></li><li><a href='" + bread2_url + "'>" + bread2 + "</a></li><li><span>" + bread3 + "</span></li>"
		}
		if (bread4 != "") {
			BREADCRUMBS = "<li><a href='/'>TOP</a></li><li><a href='" + bread1_url + "'>" + bread1 + "</a></li><li><a href='" + bread2_url + "'>" + bread2 + "</a></li><li><a href='" + bread3_url + "'>" + bread3 + "</a></li><li><span>" + bread4 + "</span></li>"
		}
		if (parentId4 != "") {
			parentId1 = parentId1 + "/" + parentId2 + "/" + parentId3 + "/" + parentId4
		}
		else if (parentId3 != "") {
			parentId1 = parentId1 + "/" + parentId2 + "/" + parentId3
		}
		else if (parentId2 != "") {
			parentId1 = parentId1 + "/" + parentId2
		}
		gulp.src(tmp_file)
			.pipe(plumber())
			.pipe(ejs({
				pageData: page_data[i],
				RELATIVE_PATH: RELATIVE_PATH,
				BREADCRUMBS: BREADCRUMBS,
			})).on('error', log)
			.pipe(rename(id + ".html"))
			.pipe(gulp.dest("./" + parentId1))
	}
	e();
});

gulp.task("sass", function (e) {
	gulp.src("scss/**/*scss")
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: "expanded",
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: [
				"last 3 versions",
				"ie >= 10",
			],
		}))
		.pipe(minifyCss({advanced: false}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("./assets/css"))
	e()
});

// gulp.task('js', function() {
//     gulp.src(['js/**/*.js'])
//         //.pipe(concat('scripts.js'))
//         .pipe(uglify({preserveComments: 'some'})) // Keep some comments
//         .pipe(gulp.dest('./assets/js'))
//         .pipe(reload({stream:true}));
// });

gulp.task("watch", function () {
	gulp.watch("ejs/data/pages.json", gulp.series("ejs"));
	gulp.watch("ejs/**/*.ejs", gulp.series("ejs"));
	gulp.watch("scss/*.scss", gulp.series("sass"))
});

