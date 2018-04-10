module.exports = {
  src: {
    baseDir: 'src',
    baseFiles: [
      'src/**/*.{png,js,json}',
      '!src/assets/**/*',
      '!src/styles/**/*'
    ],
    imgDir: 'src/assets/image',
    imgFiles: 'src/assets/image/**/*',
    cssFiles: ['src/**/*.css', '!src/styles/**/*'],
    wxmlFiles: 'src/**/*.wxml',
    jsFiles: 'src/**/*.js'
  },
  dist: {
    baseDir: 'dist',
    imgDir: 'dist/image',
    wxssFiles: 'dist/**/*.wxss'
  }
}
