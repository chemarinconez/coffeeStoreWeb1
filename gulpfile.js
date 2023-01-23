const { src, dest, watch, series, parallel } = require("gulp");

// CSS and SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  //compiling sass
  //Steps: 1-Indentify file, 2-compile it, 3-save the css file in the 'build' folder
  src("src/scss/app.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(dest("build/css"));

  done();
}

// processing images
function images() {
  //Steps: 1-Indentify file, 2-save the file in the 'build' folder
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

function versionWebp() {
  const options = {
    quality: 50,
  };
  //Steps: 1-Indentify file, 2-convert to webp,  3-save the file in the 'build' folder
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(options))
    .pipe(dest("build/img"));
}

function versionAvif() {
  const options = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif(options))
    .pipe(dest("build/img"));
}

//my function for watching the changes
function dev() {
  //(first argument source , second the function to evoke)
  watch("src/scss/**/*.scss", css);
  watch("src/scss/**/*", images);
}

function defaultTask() {
  console.log("Default task");
}

exports.css = css;
exports.dev = dev;
exports.images = images;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(images, versionWebp, versionAvif, css, dev);

// series - starts the first task and the next one begins when the first one finishes
// paralell - starts all the tasks at the same time
