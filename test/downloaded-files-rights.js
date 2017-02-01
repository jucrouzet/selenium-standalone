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
    var logger = function(message) {
      log += message;
    };
    var options = assign({ logger: logger }, defaultConfig);

    selenium.install(options, function(err) {
      if (err) {
        done(err);
        return;
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
      if (['chromedriver', 'geckodriver'].indexOf(key) === -1) {
        return;
      }
      fs.access(paths[key].installPath, fs.R_OK | fs.X_OK, function(err) {
        assert.ok(!err, err);
      });
    });
  });

});
