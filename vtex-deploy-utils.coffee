fs = require 'fs'
path = require 'path'
knox = require 'knox'
S3Deployer = require 'deploy-s3'
glob = require 'glob'

transform = { replace: {} }
replaceIn = (files) ->
  transform.files = files
replace = (key, value) ->
  transform.replace[key] = value

module.exports = (pkg, options) ->
  options.dryRun or= false

  # Deploys this project to the S3 vtex-io bucket, accessible from io.vtex.com.br/{package.name}/{package.version}/
  deployFunction = ->
    done = @async()
    if options.dryRun
      credentials = {key: 1, secret: 2}
    else
      credentials = JSON.parse fs.readFileSync '/credentials.json'
    credentials.bucket = 'vtex-io'
    client = knox.createClient credentials
    deployer = new S3Deployer(pkg, client, {dryrun: options.dryRun, fileTimeout: 3000*60})
    deployer.deploy().then done, done, console.log
    
  return  {
    deployFunction: deployFunction
  }
