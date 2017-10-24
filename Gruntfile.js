grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.js',
    },
  }
});