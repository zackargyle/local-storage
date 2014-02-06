var AddOns = function() {
  this.street = element(by.model('street'));
  this.city = element(by.model('city'));
  this.state = element(by.model('state'));
  this.zip = element(by.model('zip'));
  this.submit = element(by.id("submitter"));

  this.get = function() {
    browser.get('http://localhost:8000/index.html');
  };

  this.setStreet = function(street) {
    this.street.sendKeys(street);
  };

  this.setCity = function(city) {
    this.city.sendKeys(city);
  };

  this.setState = function(state) {
    this.state.sendKeys(state);
  };

  this.setZip = function(zip) {
    this.zip.sendKeys(zip);
  };
};

describe('Form', function() {
  it('should fill out the form', function() {
    var addOns = new AddOns();
    addOns.get();

    addOns.setStreet('100 N University Ave.');
    addOns.setCity('Provo');
    addOns.setState('UT');
    addOns.setZip('84604');

    expect(addOns.street.getAttribute('value')).toEqual('100 N University Ave.');
    expect(addOns.city.getAttribute('value')).toEqual('Provo');
    expect(addOns.state.getAttribute('value')).toEqual('UT');
    expect(addOns.zip.getAttribute('value')).toEqual('84604');

    // test local storage: correct data

    addOns.submit.click();

    // test local storage: isEmpty

  });
});