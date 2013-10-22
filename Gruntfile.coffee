module.exports = (grunt) ->
	pkg = grunt.file.readJSON('package.json')

	# Project configuration.
	grunt.initConfig

		clean:
			main:
				["tmp-deploy"]

		vtex_deploy:
      main:
        cwd: "dist"
        upload:
          root:
            "/": "**"

      walmart:
        cwd: "dist/"
        bucket: 'vtex-io-walmart'
        requireEnvironmentType: 'stable'
        upload:
          root:
            "/": "**"

	grunt.loadNpmTasks name for name of pkg.dependencies when name[0..5] is 'grunt-'

	grunt.registerTask 'default', ['clean', 'vtex_deploy']
