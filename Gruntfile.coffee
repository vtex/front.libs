DeployUtils = require './vtex-deploy-utils'

module.exports = (grunt) ->
  pkg = grunt.file.readJSON('package.json')

  utils = DeployUtils pkg,
    dryRun: grunt.option("dry-run")
    
  config =      
    shell:
      index:
        command: './index.sh'
      
  tasks =
  # Building block tasks
  # Deploy tasks
    dist: ['shell'] # Dist - minifies files
    test: []
    vtex_deploy: utils.deployFunction
  # Development tasks
    default: ['dist']

  # Project configuration.
  grunt.initConfig config
  grunt.loadNpmTasks name for name of pkg.devDependencies when name[0..5] is 'grunt-'
  grunt.registerTask taskName, taskArray for taskName, taskArray of tasks    
