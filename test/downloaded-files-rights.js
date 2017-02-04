var assert = require('assert');
var assign = require('lodash').assign;
var fs = require('fs');

var defaultConfig = require('../lib/default-config');
var computeFsPaths = require('../lib/compute-fs-paths');

/**
 * Tests to ensure that downloaded files are executable.
 */
describe('downloaded files rights', function() {

  this.timeout(120000);

  // Allow tests to mock `process.platform`
  before(function(done) {
    this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

    var selenium = require('../');
    // Capture the log output
    var log = '';
    var logger = function(message) { log += message };
    var options = assign({ logger: logger }, defaultConfig);

    selenium.install(options, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  after(function() {
    Object.defineProperty(process, 'platform', this.originalPlatform);
  });


  it('test', function () {
    var paths = computeFsPaths(defaultConfig);

    Object.keys(paths).forEach(function (key) {
      if (['chrome', 'firefox'].indexOf(key) === -1) {
        return;
      }
      var
        spawn = require('child_process').spawnSync,
        ls = spawn( 'ls', [ '-lh', paths[key].installPath] );
      console.log(ls.stdout.toString());
      fs.accessSync(paths[key].installPath, fs.R_OK | fs.X_OK);
    });
  });

});
