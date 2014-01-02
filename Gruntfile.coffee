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
          "/": "**"

			walmart:
				cwd: "dist/"
				bucket: 'vtex-io-walmart'
				requireEnvironmentType: 'stable'
				upload:
          "/": "**"

	grunt.loadNpmTasks name for name of pkg.dependencies when name[0..5] is 'grunt-'

	grunt.registerTask 'default', ['clean', 'vtex_deploy']
	grunt.registerTask 'dist', []
	grunt.registerTask 'test', []
