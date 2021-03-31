import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sync from 'browser-sync';
import del from 'del';

// HTML
import pug from 'gulp-pug';

// Styles
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemap from 'gulp-sourcemaps';
import sass from 'gulp-sass';

// Scripts
import rigger from 'gulp-rigger';
import babel from 'gulp-babel';

// SVG-sprite
import svgstore from 'gulp-svgstore';



// HTML
export const html = () => {
  return gulp.src('src/pug/*.pug')
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest('build'))
      .pipe(sync.stream());
};

// Styles
export const styles = () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

// Scripts
export const scripts = () => {
  return gulp.src('src/js/index.js')
      .pipe(plumber())
      .pipe(rigger())
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(gulp.dest('build/js'))
      .pipe(sync.stream());
};

// SVG-sprite
export const sprite = () => {
  return gulp.src('src/img/sprite/*.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(gulp.dest('build/img'));
};

// Copy
export const copy = () => {
    return gulp.src([
            'src/font/**/*',
            'src/img/*{png,jpg,svg,gif}',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('build'))
        .pipe(sync.stream({
            once: true
        }));
};

// Delete
export const clean = () => {
  return del('build');
}

// Server
export const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'build'
        }
    });
};

// Watch
export const watch = () => {
    gulp.watch('src/pug/*.pug', gulp.series(html));
    gulp.watch('src/sass/**/*.scss', gulp.series(styles));
    gulp.watch('src/js/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/font/**/*',
        'src/img/**/*',
    ], gulp.series(copy));
};

// Default
export default gulp.series(
    clean,
    gulp.parallel(
        html,
        styles,
        scripts,
        copy,
        sprite,
    ),
    gulp.parallel(
        watch,
        server,
    ),
);
