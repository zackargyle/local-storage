exports.config = {
 
  seleniumAddress: 'http://localhost:4444/wd/hub',
 
  specs: [
    'spec/*.spec.js'
  ],

  capabilities: {
    browserName: 'chrome',
    version: '',
    platform: 'ANY'
  },
 
  baseUrl: 'http://localhost:8000/index.html',
 
  rootElement: 'body',

  allScriptsTimeout: 11000,

  onPrepare: function() {},
 
  // ----- Options to be passed to minijasminenode -----
  jasmineNodeOpts: {
    /**
     * onComplete will be called just before the driver quits.
     */
    onComplete: function () {},
    // If true, display spec names.
    isVerbose: true,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000
  }
};