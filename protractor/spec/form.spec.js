/*
  TO RUN TESTS
  tab 1: webdriver-manager start
  tab 2: ./scripts/web-server.js
  tab 3: protractor path-to/protractor.conf.js
*/

var AddOns = function() {
  var street = element(by.model('street'));
  var city = element(by.model('city'));
  var state = element(by.model('state'));
  var zip = element(by.model('zip'));

  this.getStreet = function() {
    return street.getAttribute('value');
  };

  this.getCity = function() {
    return city.getAttribute('value');
  };

  this.getState = function() {
    return state.getAttribute('value');
  };

  this.getZip = function() {
    return zip.getAttribute('value');
  };
};

describe('ngPersist', function() {
  'use strict';
  var addOns = new AddOns();
 
  beforeEach(function () {
    // Load new window, and wait for angular rendering.
    browser.get('/index.html');
    browser.waitForAngular();
  });
 
  it('should fill out form', function () {
    element(by.model('street')).sendKeys('100 N University Ave.');
    element(by.model('city')).sendKeys('Provo');
    element(by.model('state')).sendKeys('UT');
    element(by.model('zip')).sendKeys('84604');

    // Clear focus so zip input fires onchange event
    element(by.tagName('body')).click();
  });

  it('should prepopulate input fields', function() {
    expect(addOns.getStreet()).toBe('100 N University Ave.');
    expect(addOns.getCity()).toBe('Provo');
    expect(addOns.getState()).toBe('UT');
    expect(addOns.getZip()).toBe('84604');

    // Trigger clearing of localstorage
    element(by.id('form-submit')).submit();
  });

  it('should have cleared local storage, and thus have empty inputs', function() {
    expect(addOns.getStreet()).toBe('');
    expect(addOns.getCity()).toBe('');
    expect(addOns.getState()).toBe('');
    expect(addOns.getZip()).toBe('');
  });

});