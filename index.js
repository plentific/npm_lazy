#
# Dockerfile for langrisha/npm-lazy
#

# Based on the much regarded Google Node.js image.
FROM langrisha/npm-lazy

ADD index.js /app/

# Server is listening on 0.0.0.0:8080, by default.
EXPOSE 4873
jenkins@ip-172-31-34-95:/tmp/alessio$ cat index.js
// Require dependencies.
var config = require('npm_lazy/config');
var pkg = require('./package.json');
var program = require('commander');
var server = require('npm_lazy/server');
var utils = require('./lib/utils');

// Setup program.
program
  .version(pkg.version)
  .usage('[options]')
  .description('Starts a dynamically configured npm_lazy server instance')
  .option('--show-config', 'display the effective server configuration on startup');

// Populate and parse options.
config.proxy.http = config.proxy.https = undefined;
config.externalUrl = 'http://localhost:4873';
config.port = 4873;
utils.configureProgramOptions(config, program);
program.parse(process.argv);

// Update configuration.
utils.updateConfiguration(config, program);

// Show compiled configuration options, if requested.
if (program.showConfig) {
  console.log(config);
}

// Start server.
server(config);
