module.exports = (grunt) ->
  pkg = grunt.file.readJSON('package.json')
  
  throw new Error("package.name is required!") unless pkg.name
  throw new Error("package.deploy directory is required! e.g. 'deploy/'") unless pkg.deploy

  dryrun = if grunt.option('dry-run') then '--dryrun' else ''
    
  config =      
    shell:
      index:
        command: './index.sh'
      deploy:
        command: "AWS_CONFIG_FILE=/.aws-config-front aws s3 sync --size-only #{dryrun} #{pkg.deploy} s3://vtex-io-us/#{pkg.name}/"
      deploy_br:
        command: "AWS_CONFIG_FILE=/.aws-config-front aws s3 sync --size-only #{dryrun} #{pkg.deploy} s3://vtex-io/#{pkg.name}/"

    concat:
      checkout:
        files:
          'dist/bundles/knockout-2.3.0-underscore-1.7.0-i18next-1.7.2-radio-0.2-json2.min.js': [
            'dist/knockout/2.3.0/knockout-2.3.0.js'
            'dist/underscore/1.7.0/underscore-min.js'
            'dist/i18next/1.7.2/i18next.min.js'
            'dist/radio/0.2/radio.min.js'
            'dist/json2/2011/json2.min.js'
          ]
      
  tasks =
  # Building block tasks
  # Deploy tasks
    dist: ['shell:index']
    test: []
    vtex_deploy: ['shell:deploy', 'shell:deploy_br']
  # Development tasks
    default: ['dist']

  # Project configuration.
  grunt.initConfig config
  grunt.loadNpmTasks name for name of pkg.devDependencies when name[0..5] is 'grunt-'
  grunt.registerTask taskName, taskArray for taskName, taskArray of tasks    
