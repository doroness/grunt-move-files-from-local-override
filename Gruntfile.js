const fs = require('fs');

const path = require('path');

const basePath = __dirname; 

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // Define a function to generate the banner comment
        banner: '/* Edited ' + new Date().toISOString() + ' */',
      },
		dist: {
			expand: true,
			cwd:  basePath,
			src: ['**/*.css'], // Target all CSS files in the source directory
			dest:  basePath,
		 },
	 },
	 stripCssComments: {
      dist: {
        expand: true,
        cwd: basePath,
        src: ['**/*.css'],
        dest: basePath,
        ext: '.css'
      },
    },
    clean: {
      yourTarget: {
        src: [
          basePath + '\\**\\*.js', 
          basePath + '\\**/*.css', 
          basePath + '\\**/*.map',
          basePath + '\\**/*.min.js',
          basePath + '\\**/*.min.css',
          basePath + '\\**/*.min.map',
          basePath + '\\**/*.css*',
          basePath + '\\**/*.js*',
          '!' + basePath + '\\node_modules/**',
          '!' + basePath + '\\Gruntfile.js',
          '!' + basePath + '\\package.json',
        ]
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: basePath,
        src: ['**/*.css', '**/*.js', '!**/node_modules/**', '!Gruntfile.js'], // Include CSS and JS files, exclude specific files
        dest: 'C:\\localz\\playsmart.loc',
        options: {
          process: function(content, srcpath, destpath) {
            grunt.log.writeln('Copying ' + srcpath + ' ➡ ' + destpath) + '.../n';
            return content;
          }
        }
      }
    },
    removeQueryStrings: {
      files: [], // Add your array of file names
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ overrideBrowserslist: ['last 2 versions'] }) // Autoprefixer configuration
        ]
      },
      dist: {
        expand: true,
        cwd:basePath, // Replace with the root directory containing your CSS files
        src: ['**/*.css', '!**/node_modules/**'], // Pattern to match all CSS files recursively within the directory
        dest: basePath, // Replace with the directory to save modified files
       
      }
    },
    cssmin: {
      options: {
        sourceMap: true // Enable source maps if needed
      },
      target: {
        files: [{
          expand: true,
          cwd: basePath, // Replace with the directory containing your CSS files
          src: ['**/*.css', '!**/node_modules/**'], // Pattern to match all CSS files recursively within the directory
          dest: 'C:\\localz\\Overidez\\multismart.loc', // Replace with the directory to save minified files
          ext: '.min.css' // Extension for minified files
        }]
      }
    }
  });

  /**
   * Load Grunt plugins
   */
  grunt.loadNpmTasks('grunt-postcss');  

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-strip-css-comments');

  /**
   * Register Grunt tasks
   */

  grunt.registerTask('minifycss', ['cssmin']);

  grunt.registerTask('potsthecss', ['postcss']);

  grunt.registerTask('cleanFiles', ['clean']);

  grunt.registerTask('timestamp', ['stripCssComments','concat']);

  grunt.registerTask('removeQueryStrings', 'Remove query strings from file names', function() {
    
    const files = grunt.config.get('removeQueryStrings.files');

    files.forEach(function(file) {

      const filePath = path.resolve(file);
      //if file not exist, then skip
      if (!fs.existsSync(filePath)) {
        grunt.log.writeln('File not found: ' + filePath);
        return;
      }

      const fileNameWithoutQuery = filePath.split('%3')[0]; // Remove query strings after '?'

      grunt.log.writeln('Processed file: ' + fileNameWithoutQuery);

      // Check if the file exists before renaming
      if (fs.existsSync(filePath)) {

        fs.renameSync(filePath, fileNameWithoutQuery);

      } else {
        
        grunt.log.writeln('File not found: ' + filePath);
        
      }
    });
  });

  // Register the default task to run the 'copy' task
  grunt.registerTask('default', ['stripCssComments','postcss','concat','copy']);
};