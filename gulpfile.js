import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from"gulp-sourcemaps";
// import dartSass from 'sass';
// import gulpSass from 'gulp-sass';
// const sass = gulpSass( dartSass );
import htmlmin from 'gulp-htmlmin'
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso'
import rename from 'gulp-rename'
import terser from 'gulp-terser'
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import sass from "gulp-dart-sass";
import {deleteAsync} from 'del';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import sync from "browser-sync";

// Styles
export const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream())
}

// HTML
export const html = () => {
  return gulp.src('source/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('build'));
}

// JS
export const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(sourcemap.init())
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(sourcemap.write('./'))
  .pipe(gulp.dest('build/js'));
}

// Images
export const optimizeImages = async () => {
  return gulp.src('source/img/**/*.{jpg,jpeg,png,svg}')
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 85, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,jpeg,png,svg}')
    .pipe(gulp.dest('build/img'))
}

// WebP
export const createWebP = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img'))
}

// Sprite
export const sprite = () => {
  return gulp.src('source/img/images/*.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}

// Copy
export const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/**/*.svg',
    'source/manifest.webmanifest'
], {
  base: 'source'
})
    .pipe(gulp.dest('build'))
    done()
}

// Clean
export const clean = () => {
  return deleteAsync('build')
}

// Server
export const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

export const reload = (done) => {
  sync.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebP
  )
)




export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebP
  ),
  gulp.series(
    server,
    watcher
  )
 );
