fs = require('fs')
semver = require('semver')

module.exports = (grunt) ->
  lsDirs = (path) ->
    return grunt.file.expand(
      cwd: path
      filter: (src) ->
        return fs.lstatSync(src).isDirectory()
    ,'*')

  grunt.registerTask 'pack', ->
    console.log 'Creating package.json to all libs versions'
    packagesCreated = 0
    for lib in lsDirs('dist')
      for version in lsDirs('dist/' + lib)
        packagePath = 'dist/' + lib + '/' + version + '/package.json'
        if (semver.valid(version) && !grunt.file.exists(packagePath))
          content =
            'name': lib
            'version': version
          grunt.file.write(packagePath, JSON.stringify(content, null, '  '))
          ++packagesCreated
    console.log packagesCreated + " package.json files were created"