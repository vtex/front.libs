module.exports = (grunt) ->
  pkg = grunt.file.readJSON('package.json')
  
  throw new Error("package.name is required!") unless pkg.name
  throw new Error("package.deploy directory is required! e.g. 'deploy/'") unless pkg.deploy

  config =      
    shell:
      index:
        command: './index.sh'
      deploy:
        command: "AWS_CONFIG_FILE=/.aws-config-front aws s3 sync #{pkg.deploy} s3://vtex-io/#{pkg.name}/"
      
  tasks =
  # Building block tasks
  # Deploy tasks
    dist: ['shell:index']
    test: []
    vtex_deploy: ['shell:deploy']
  # Development tasks
    default: ['dist']

  # Project configuration.
  grunt.initConfig config
  grunt.loadNpmTasks name for name of pkg.devDependencies when name[0..5] is 'grunt-'
  grunt.registerTask taskName, taskArray for taskName, taskArray of tasks    
